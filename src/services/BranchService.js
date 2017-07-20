import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _BranchService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key, ["getAll"]);
		this.enterpriceId = null;
		
	}
	getAll = (action) => {	
		var id1, options;
		[options] = action.params;
		options.action = action;
		var url = cm.baseUrl
		if (this.hasOwnProperty("enterpriceId")) {			
			url += cm.selectedEnterprise 
		}
		this._get(url + "/"+this.key, options);
	};
	
  }
const BranchService = new _BranchService("BranchService", "branch");
export default BranchService;