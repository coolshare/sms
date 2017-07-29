import cm from '../common/CommunicationManager'

const CommonReducer = (state = {'progress':false}, action) => {
  switch (action.type) {
  	case 'getMultiDone':
  		return state;  	
    default:
      return state
  }
  

}



export default CommonReducer