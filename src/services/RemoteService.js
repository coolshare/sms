import axios from 'axios'
import Service from '../common/Service'
import cm from '../common/CommunicationManager'
import ExceptionService from './ExceptionService'
import $ from 'jquery';

export class _RemoteService extends Service {
	
	constructor(name, key, APIs) {
		super(name, ["get", "getAll", "getThroughProxy", "getSequencially", "getMulti",
			"create", "edit", "remove"].concat(APIs||[]));
		this.key = key;
	}
	getThroughProxy = (url, options, key, result, requests, len) => {
		if (url.data) {
			this.action = url;
			url = this.action.data.url;
		}
		this._get("http://73.71.159.185:8888?url="+url, options, key, result, requests, len)
	};
	_get = (url, options, result, requests, len) => {
		options = options||{};
		let self = this;
		if (url.data) {
			this.action = url;
			url = this.action.data.url;
		}
		url += "?d="+new Date().valueOf();
		$.ajax({
			  url:url,
			  type:"GET",
			  contentType:"application/json; charset=utf-8",
			  dataType:"json",
			  success: function(res){
				  if (result!==undefined) {
					  let kk = key.split("/");
					  if (kk.length===1) {
						  result.dataMap[key] = res;			    	  
					  } else if (kk.length===2) {
						  if (result.dataMap[kk[0]]===undefined) {
							  result.dataMap[kk[0]] = {}
						  }
						  result.dataMap[kk[0]][kk[1]] = res;		
					  }
					  if (result.multiType==="multi") {					  
						  if (--result.countDown==0) {
							  cm.dispatch({"type":"getMultiDone", "key":result.type, "result":result})
							  if (options.response) {
				    			  options.response(result);
				    		  }
						  }
					  } else if (result.multiType==="seq") {
						  self._getEach(result, requests, options);
				    	  if (len===0) {
				    		  if (options.response) {
				    			  options.response(result);
				    		  }
				    	  }  
					  }
					   
			      } else {
			    	  self._noticeDone(options, res);
			      } 
			  }
			})
			
		
	}
	_get2 = (url, options, result, requests, len) => {
		options = options||{};
		let self = this;
		if (url.data) {
			this.action = url;
			url = this.action.data.url;
		}
		url += "?d="+new Date().valueOf();
		return axios.get(url).then(res=>{
			  if (res.status >= 400) {
		          throw new Error("Bad response from server");
		      }
			  if (result!==undefined) {
				  let kk = key.split("/");
				  if (kk.length===1) {
					  result.dataMap[key] = res.data;			    	  
				  } else if (kk.length===2) {
					  if (result.dataMap[kk[0]]===undefined) {
						  result.dataMap[kk[0]] = {}
					  }
					  result.dataMap[kk[0]][kk[1]] = res.data;		
				  }
				  if (result.multiType==="multi") {					  
					  if (--result.countDown==0) {
						  cm.dispatch({"type":"getMultiDone", "key":result.type, "result":result})
						  if (options.response) {
			    			  options.response(result);
			    		  }
					  }
				  } else if (result.multiType==="seq") {
					  self._getEach(result, requests, options);
			    	  if (len===0) {
			    		  if (options.response) {
			    			  options.response(result);
			    		  }
			    	  }  
				  }
				   
		      } else {
		    	  self._noticeDone(options, res.data);
		      } 
			  return res;
		  })/*.catch(function (error) {
			  if (options.error) {
				  options.error(error)
			  }
			    console.log(error);
		  });*/
	}
	getSequencially = (type, requests, options) => {
		let result = {"type":type, "dataMap":{}, "multiType":"seq"};
		this.getEach(result, requests, options)
	}
	
	getEach = (result, requests, options) => {
		if (requests.length===0) {
			cm.dispatch({"type":result.type, "data":result.dataList});
			return
		}
		let request = requests.shift();
		this._get(request.url, options, request.key, result, requests, requests.length);
	}
	
	getMulti = (type, requests, options) => {
		let result = {"type":type, "dataMap":{}, "multiType":"multi", "countDown":requests.length};
		for (let i=0; i<requests.length; i++) {
			let request = requests[i];
			this._get(request.url, options, request.key, result, requests, requests.length);
		}
	}
	_post2 = (url, data, options) => {
		let self = this;
		return axios.post(url, {
            headers: {
                accept: 'application/json',
                'accept-language': 'en_US',
                'content-type': 'application/x-www-form-urlencoded'
            }, body: data}).then(res=>{
			  if (res.status >= 400) {
		          throw new Error("Bad response from server");
		      }
			  if (options.response) {
				  options.response(res.data);
			  }
			  
			  cm.dispatch({"type":options.action.type+"/done", "data":res.data})
            });
	}
	_post = (url, data, options) => {
		let self = this;
		console.log("===="+url+"===>")
		console.log(JSON.stringify(data))
		var ttt = {
				  url:url,
				  type:"POST",			  
				  contentType:"application/json; charset=utf-8",
				  data:JSON.stringify(data),
				  dataType:"json",
				  success: function(res){
					  self._noticeDone(options, res);
				  }}
		$.ajax(ttt
			).fail(function(response) {
			    alert('Error: ' + response.responseText);
			});

	}
	_put = (url, id, data, options) => {
		let self = this;
		$.ajax({
			  url:url+id,
			  type:"PUT",
			  data:data,
			  contentType:"application/json; charset=utf-8",
			  dataType:"json",
			  success: function(res){
				  self._noticeDone(options, res);
			  }
			})
	}
	_remove = (url, id, options) => {
		let self = this;
		$.ajax({
			  url:url+id,
			  type:"DELETE",
			  contentType:"application/json; charset=utf-8",
			  dataType:"json",
			  success: function(res){
				  self._noticeDone(options, res);
			  }
			})
	}
	
	_noticeDone = (options, res) => {
		if (options.forwardType!=undefined) {
			  cm.dispatch({"type":"__FORWARD__", "action":{"type": options.forwardType, "data":res}});
		  }
		if (options.response) {
			  options.response(res);
		}
		cm.dispatch({"type":options.action.type+"/done", "data":res})
		cm.setProgress(false)
	}
	get = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId +"/"
		}
		this._get(url +this.key+ "/"+action.params[0], options);
	}
	create = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.key==="branch") {
			url = "http://192.168.7.231:5000/mano/"
		}
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId +"/"
		}
		

		this._post(url +this.key, action.params[0], options);	
	}
	edit =(action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId +"/"
		}
		this._put(url +this.key+ "/", action.params[0], action.params[1], options);	
	}
	remove = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId+"/"
		}
		this._remove(url + this.key+ "/", action.params[0], options);			
	}
	getAll = (action) => {
		var options  = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {			
			url += cm.selectedEnterpriseId +"/"
		}
		this._get(url + this.key+"/", options);	
	}
	
  }
const RemoteService = new _RemoteService("RemoteService");
export default RemoteService;