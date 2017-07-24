import axios from 'axios'
import Service from '../common/Service'
import cm from '../common/CommunicationManager'
import ExceptionService from './ExceptionService'

export class _RemoteService extends Service {
	
	constructor(name, key, APIs) {
		super(name, ["get", "getThroughProxy", "getSequencially", "getMulti",
			"create", "edit", "remove"].concat(APIs));
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
						  if (options.callback) {
			    			  options.callback(result);
			    		  }
					  }
				  } else if (result.multiType==="seq") {
					  self._getEach(result, requests, options);
			    	  if (len===0) {
			    		  if (options.callback) {
			    			  options.callback(result);
			    		  }
			    	  }  
				  }
				   
		      } else {
	    		  if (options.actionType!=undefined||options.stateField!==undefined) {
					  cm.dispatch({"type":"RemoteService", "options":{"action":{"type":options.actionType, "stateField":options.stateField}, "data":res.data}});
				  }
				  if (options.callback) {
					  options.callback(res.data);
				  }
		      
			  
				  cm.dispatch({"type":options.action.type+"/done", "data":res.data})
		      } 
			  return res;
		  }).catch(function (error) {
			  if (options.error) {
				  options.error(error)
			  }
			    console.log(error);
		  });
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
	
	_post = (url, data, options) => {
		let self = this;
		axios.post(url, data)
		  .then(function (response) {
			  if (response.status >= 400) {
		          throw new Error("Bad response from server");
		      }

			  if (options.callback) {
				  options.callback(res.data);
			  }
			  
			  cm.dispatch({"type":options.action.type+"/done", "data":res.data})

		  })
		  .catch(function (error) {
		    ExceptionService.handle(error);
		  });
	}
	_put = (url, data, options) => {
		let self = this;
		axios.put(url, data)
		  .then(function (response) {
			  if (response.status >= 400) {
		          throw new Error("Bad response from server");
		      }
			  
			  if (options.callback) {
				  options.callback(res.data);
			  }
			  
			  cm.dispatch({"type":options.action.type+"/done", "data":res.data})
		  })
		  .catch(function (error) {
		    ExceptionService.handle(error);
		  });
	}
	_remove = (url, id, options) => {
		let self = this;
		axios.delete(url+id+"/")
		  .then(function (response) {
			  if (response.status >= 400) {
		          throw new Error("Bad response from server");
		      }
			  
			  if (options.callback) {
				  options.callback(res.data);
			  }

			  
			  cm.dispatch({"type":options.action.type+"/done", "data":res.data})
		  })
		  .catch(function (error) {
		    ExceptionService.handle(error);
		  });
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
		this._put(url +this.key+ "/", action.params[0], options);	
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
	
  }
const RemoteService = new _RemoteService("RemoteService");
export default RemoteService;