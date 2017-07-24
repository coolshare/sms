import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _BranchService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;
		
	}
	
  }
const BranchService = new _BranchService("BranchService", "branch");
export default BranchService;