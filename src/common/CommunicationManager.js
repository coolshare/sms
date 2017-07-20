import { browserHistory } from 'react-router';
import {gm} from '../common/Common'
import Login from '../components/Login/Login'
import TopContainer from '../components/TopContainer'
import MainRouteContainer from '../components/MainRouteContainer'
import StackViewContainer from '../components/StackViewContainer'
import OrchestrationDetails from '../components/MainPage/Dashboard/Orchestration/OrchestrationDetails'
import ENGListDetails from '../components/MainPage/Dashboard/ENGList/ENGListDetails'
import ENGAlertsDetails from '../components/MainPage/Dashboard/ENGAlerts/ENGAlertsDetails'
import ResouceUsageDetails from '../components/MainPage/Dashboard/ResouceUsage/ResouceUsageDetails'
//import Orchestration from '../components/MainPage/Orchestration/Orchestration2'
import Orchestration from '../components/MainPage/Orchestration/Orchestration3'
import AddEnterprise from '../components/MainPage/Orchestration/AddEnterprise'
import AddBranch from '../components/MainPage/Orchestration/AddBranch'
import AddLink from '../components/MainPage/Orchestration/AddLink'
import Admin from '../components/MainPage/Admin/Admin'

const routeData = {
		"Login":{"label":"Login", "component":Login, "icon":"", "path":"Login"},
		"Home":{"label":"Home", "component":MainRouteContainer, "icon":"", "path":"Home"},
		"TopContainer":{"label":"TopContainer", "component":TopContainer, "icon":"", "path":"Home"},	
		"MainRouteContainer":{"label":"MainRouteContainer", "component":MainRouteContainer, "icon":"", "path":"MainRouteContainer"},	
		"StackViewContainer":{"label":"StackViewContainer", "component":StackViewContainer, "icon":"", "path":"StackViewContainer"},
		"OrchestrationDetails":{"label":"OrchestrationDetails", "component":OrchestrationDetails, "path":"OrchestrationDetails"},
		"ENGListDetails":{"label":"ENGListDetails", "component":ENGListDetails, "path":"ENGListDetails"},
		"ENGAlertsDetails":{"label":"ENGAlertsDetails", "component":ENGAlertsDetails, "icon":"", "path":"ENGAlertsDetails"},
		"ResouceUsageDetails":{"label":"ResouceUsageDetails", "component":ResouceUsageDetails, "icon":"", "path":"ResouceUsageDetails"},
		"Orchestration":{"label":"Orchestration", "component":Orchestration, "icon":"", "path":"Orchestration"},
		"AddEnterprise":{"label":"AddEnterprise", "component":AddEnterprise, "icon":"", "path":"AddEnterprise"},
		"AddBranch":{"label":"AddBranch", "component":AddBranch, "icon":"", "path":"AddBranch"},
		"AddLink":{"label":"AddLink", "component":AddLink, "icon":"", "path":"AddLink"},
		"Admin":{"label":"Admin", "component":Admin, "icon":"", "path":"Admin"}
}

class CommunicationManager {
	constructor() {
		this.stack = [];
		this.subscribeMap = {};
		this.routeData = routeData;
		this.baseUrl = "http://192.168.10.225:5000/mano/public/v1/"
	}
	
	init(store) {	
		this.store = store;
	}
	dispatch(action, callback) {
		var actions;
		if (action instanceof Array) {
			actions = action;
		} else {
			actions = [action];
		}
		for (var i=0; i<actions.length; i++) {
			var a = actions[i];
			this.currentAction = a;
			a.options = a.options||{}
			if (callback!==undefined) {
				a.options.type = "CALLBACK";
				a.options.callback = callback;
			}
			
			this.store.dispatch(a);
		}
		
	}
	subscribe(type, listener, owner) {
		var self = this;
		var types;
		if (type instanceof Array) {
			types = type;
		} else {
			types = [type];
		}
		var res = [];
		for (var i=0; i<types.length; i++) {
			var t = types[i];
			//tracking subscribed type		 		
			this.subscribeMap[t] = this.store.subscribe(((tt)=>{
				return ()=>{
					//We filter by type so that we won't call the handle when type is not match
					if (self.currentAction.type===tt) {
						if (owner){
							listener.apply(owner, [self.currentAction]);
						} else {
							listener(self.currentAction);
						}
							
					}
				}
				
			})(t));
			res.push(this.subscribeMap[t])
		}
		
		return res;
	}
	unsubscribe(type) {
		var types;
		if (type instanceof Array) {
			types = type;
		} else {
			types = [type];
		}

		for (var i=0; i<types.length; i++) {
			var t = types[i];
			if (this.subscribeMap[t]===undefined) {
				return;
			}
			this.subscribeMap[t]();
			delete this.subscribeMap[t];
		}
		
	}
	registerGlobal(key, obj) {
		window[key] = obj;
	}
	
	getState(key) {
		let state = this.store.getState();
		if (key===undefined) {
			return state;
		} else {
			return state[key];
		}
	}
	popup(c, id) {
		let isEmpty = this.isStackEmpty();
		this.stack.push(browserHistory.getCurrentLocation().pathname);
		this.selectedPopup = [c, id];
		if (this.stack.length===1) {
			this.popupBase = browserHistory.getCurrentLocation()
		}
		
		if (isEmpty) {
			this.go('StackViewContainer');
		} else {
			this.dispatch({"type":"pushPopup", "data":[c, id]})
		}
		
	}
	popStack() {
		this.stack.pop();
		if (this.stack.length===0) {
			this.selectedPopup = null;
		}
	}
	
	go(url) {
		browserHistory.push(url);
	}
	goBack() {
		browserHistory.goBack();
	}
	isStackEmpty() {
		return this.stack.length==0;
	}
	
	isStackContain(c) {
		for (let i=0; i<this.stack.length; i++) {
			if (c === this.stack[i]) {
				return true;
			}
		}
		return false;
	}

	getStoreValue(key, subKey) {
		if (key===undefined) {
			return this.store.getState();
		} else if (subKey===undefined) {
			return this.store.getState()[key] 
		}
		return this.store.getState()[key][subKey];
	}
	setStoreValue(key, subKey, value) {
		this.store.getState()[key][subKey] = value;
	}
}

const cm = new CommunicationManager();
export default cm;