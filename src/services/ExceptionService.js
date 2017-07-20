import axios from 'axios'
import Service from '../common/Service'
import cm from '../common/CommunicationManager'

class _ExceptionService extends Service {
	
	constructor(name) {
		super(name, ["handle"]);
	}
	handle = (error) => {
		console.log("Error:"+error)
	}
	
  }
const ExceptionService = new _ExceptionService("ExceptionService");
export default ExceptionService;