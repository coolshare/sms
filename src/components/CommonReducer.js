import cm from '../common/CommunicationManager'

const CommonReducer = (state = {'appLoaded':false}, action) => {
  switch (action.type) {
    case '_POPUP_':
    	cm.popup(action.c, action.name, action)
		return state;
  	case '_CALLBACK_':
  		action.options.callback(action.options.action);
  		return state;
  	case 'AppLoaded':
  		return Object.assign({}, state, {
  			appLoaded: true
        })
  	case 'fetchMultiDone':
  		return state;  	
  	case 'RemoteService':
  		let options = action.options;
  		
  		//In case of forward
  		if (options.options.actionType !==undefined) {
  			action.asyncDispatch({"type":options.options.actionType, "data": options.data});
  		}
  		//If stateField is specified, we set the field with the response data
  		if (options.options.stateField!==undefined) {
  			let modifiedFields = {};
  			modifiedFields[options.options.stateField] = options.data
  	  		let res = Object.assign({}, state, modifiedFields)
  	  		return res
  		}
  		return state;
    default:
      return state
  }
  

}



export default CommonReducer