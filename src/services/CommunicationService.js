import { browserHistory } from 'react-router';
import {gm} from '../common/Common'

class CommunicationService {
	constructor() {
		this.stack = [];
		this.subscribeMap = {};
	}
	
	init(store) {	
		this.store = store;
	}
	
	dispatch(action, callback) {
		this.currentAction = action;
		action.options = action.options||{}
		if (callback!==undefined) {
			action.options.type = "CALLBACK";
			action.options.callback = callback;
		}
		
		this.store.dispatch(action);
	}
	subscribe(type, listener, owner) {
		var self = this;
		//tracking subscribed type		 		
		this.subscribeMap[type] = this.store.subscribe(()=>{
			//We filter by type so that we won't call the handle when type is not match
			if (cs.currentAction.type===type) {
				if (owner){
					listener.apply(owner, [cs.currentAction]);
				} else {
					listener(cs.currentAction);
				}
					
			}
		});
		return this.subscribeMap[type];
	}
	unsubscribe(type) {
		if (this.subscribeMap[type]===undefined) {
			return;
		}
		this.subscribeMap[type]();
		delete this.subscribeMap[type];
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
			this.go('popup');
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

const cs = new CommunicationService();
export default cs;