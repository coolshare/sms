

class ServiceManager {
	init=()=>{
		this.services = [
			require("../services/RemoteService").default,
			require("../services/BranchService").default,
			require("../services/EnterpriseService").default
			];
	}
	
}

let sm = new ServiceManager();
export default sm;