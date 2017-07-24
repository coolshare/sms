import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _EnterpriseGroupService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;
		
	}	
}
const EnterpriseGroupService = new _EnterpriseGroupService("EnterpriseGroupService", "group");
export default EnterpriseGroupService;