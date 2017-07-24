import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _EnterpriseService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);	
	}

}
const EnterpriseService = new _EnterpriseService("EnterpriseService", "enterprise");
export default EnterpriseService;