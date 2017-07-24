import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _EnterpriseUserService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;
		
	}
}
const EnterpriseUserService = new _EnterpriseUserService("EnterpriseUserService", "branch");
export default EnterpriseUserService;