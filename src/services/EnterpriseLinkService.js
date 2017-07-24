import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _EnterpriseLinkService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key);
		this.enterpriceId = null;
		
	}

}
const EnterpriseLinkService = new _EnterpriseLinkService("EnterpriseLinkService", "link");
export default EnterpriseLinkService;