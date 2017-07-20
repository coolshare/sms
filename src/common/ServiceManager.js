

class ServiceManager {
	init=()=>{
		this.services = [
			require("../services/RemoteService").default,
			require("../services/BranchService").default
			];
	}
	
}

let sm = new ServiceManager();
export default sm;