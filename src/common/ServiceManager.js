

class ServiceManager {
	init=()=>{
		this.services = [
			require("../services/RemoteService").default,
			require("../services/BranchService").default,
			require("../services/EnterpriseService").default,
			require("../services/EnterpriseGroupService").default,
			require("../services/BranchLinkService").default,
			require("../services/EnterpriseUserService").default,
			require("../services/ProviderGroupService").default,
			require("../services/ProviderUserService").default
			];
	}
	
}

let sm = new ServiceManager();
export default sm;