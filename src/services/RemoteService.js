import axios from 'axios'
import cs from './CommunicationService'

function _RemoteService(){
	this.fatchThroughProxy = (url, options, key, result, requests, len) => {
		this.fetch("http://73.71.159.185:8888?url="+url, options, key, result, requests, len)
	};
	this.fetch = (url, options, key, result, requests, len) => {
		let self = this;
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
						  cs.dispatch({"type":"fetchMultiDone", "key":result.type, "result":result})
						  if (options.callback) {
			    			  options.callback(result);
			    		  }
					  }
				  } else if (result.multiType==="seq") {
					  self.fetchEach(result, requests, options);
			    	  if (len===0) {
			    		  if (options.callback) {
			    			  options.callback(result);
			    		  }
			    	  }  
				  }
				   
		      } else {
		    	  if (options.actionType!=undefined||options.stateField!==undefined) {
					  cs.dispatch({"type":"RemoteService", "options":{"options":options, "data":res.data}});
				  }
				  if (options.callback) {
					  options.callback(res.data);
				  }
		      }
			  
		      
			  return res;
		  })/*.catch(function (error) {
			  debugger
			    console.log(error);
		  });*/
	}
	this.fetchSequencially = (type, requests, options) => {
		let result = {"type":type, "dataMap":{}, "multiType":"seq"};
		this.fetchEach(result, requests, options)
	}
	
	this.fetchEach = (result, requests, options) => {
		if (requests.length===0) {
			cs.dispatch({"type":result.type, "data":result.dataList});
			return
		}
		let request = requests.shift();
		this.fetch(request.url, options, request.key, result, requests, requests.length);
	}
	
	this.fetchMulti = (type, requests, options) => {
		let result = {"type":type, "dataMap":{}, "multiType":"multi", "countDown":requests.length};
		for (let i=0; i<requests.length; i++) {
			let request = requests[i];
			this.fetch(request.url, options, request.key, result, requests, requests.length);
		}
	}
	
  }
const RemoteService = new _RemoteService();
export default RemoteService;