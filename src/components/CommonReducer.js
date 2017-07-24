import cm from '../common/CommunicationManager'

const CommonReducer = (state = {'appLoaded':false}, action) => {
  switch (action.type) {
  	case 'AppLoaded':
  		return Object.assign({}, state, {
  			appLoaded: true
        })
  	case 'getMultiDone':
  		return state;  	
    default:
      return state
  }
  

}



export default CommonReducer