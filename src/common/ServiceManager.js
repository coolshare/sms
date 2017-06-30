

class ServiceManager {
	init=()=>{
		this.services = [
			require("../services/RemoteService").default
			];
	}
	
}

let sm = new ServiceManager();
export default sm;