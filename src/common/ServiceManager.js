

export default class ServiceManager {
	constructor() {
		
	}
	init=()=>{
		this.services = [
			require("../services/RemoteService").default
			];
	}
	
}
