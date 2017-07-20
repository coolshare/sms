import cm from '../common/CommunicationManager'
import {_RemoteService} from './RemoteService'

class _EnterpriseService extends _RemoteService {
	
	constructor(name, key) {
		super(name, key, ["getAll"]);
		
	}
	getAll = (action) => {	
		var options;
		[options] = action.params;
		options.action = action;
		this._get(cm.baseUrl+ this.key, options);
	};
  }
const EnterpriseService = new _EnterpriseService("EnterpriseService", "enterprise");
export default EnterpriseService;