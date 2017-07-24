import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _ProviderUserService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;		
	}
}
const ProviderUserService = new _ProviderUserService("ProviderUserService", "user");
export default ProviderUserService;