import cm from '../../common/CommunicationManager'

const MainContainerReducer = (state = {"mainContainerSize":{"w":600, "h":500}}, action) => {
  switch (action.type) {
	  case 'updateMainContainerSize':
		  cm.mainContainerSize = action.data;
	      return Object.assign({}, state, {
	    	  mainContainerSize: action.data
	      })
	  default:
	      return state
	  }
}

export default MainContainerReducer