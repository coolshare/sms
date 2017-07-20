import Service from '../common/Service'
import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _BranchService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key, ["getAll"]);
		
	}
	getAll = (action) => {	
		var id1, options;
		[id1, options] = action.params;
		options.action = action;
		this._get(cm.baseUrl+id1 + "/"+this.key, options);
	};
	
  }
const BranchService = new _BranchService("BranchService", "branch");
export default BranchService;