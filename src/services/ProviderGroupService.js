import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _ProviderGroupService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);		
	}
}
const ProviderGroupService = new _ProviderGroupService("ProviderGroupService", "group");
export default ProviderGroupService;