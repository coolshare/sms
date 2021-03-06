import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _BranchLinkService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;
		
	}
	create = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId +"/"
		}
		this._post(url +this.key+"/"+action.params[0]+"/"+ action.params[1], {}, options);	
	}
	get = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId +"/"
		}
		this._get(url + this.key+"/"+action.params[0]+"/"+ action.params[1], options);
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
	remove = (action) => {
		var options = action.options||{};
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {
			
			url += cm.selectedEnterpriseId+"/"
		}
		this._remove(url + this.key+ "/", action.params[0] +"/"+ action.params[1], options);			
	}
}
const BranchLinkService = new _BranchLinkService("BranchLinkService", "link");
export default BranchLinkService;