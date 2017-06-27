
const PatternsRightPaneReducer = (state = {'currentVideo':{'id':'YxqXoSkVaJk','des':'Default video'}, 'videoSearch':'go pro', 'photoSearch':"tropical", 'loadPhotos':[],'videoItems':[],  'currentPage':'Pubsub Pattern'}, action) => {
  switch (action.type) {
    case 'loadPhotos':
        return Object.assign({}, state, {
      	  phtotoItems: action.items
        })
    case 'playVideo':
        return Object.assign({}, state, {
      	  currentVideo: action.item
        })
    case 'photoSearch':
        return Object.assign({}, state, {
        	photoSearch: action.search
        })
    case 'videoSearch':
        return Object.assign({}, state, {
        	videoSearch: action.search
        })
    case 'switchPatternPage':
  	  return Object.assign({}, state, {
  		currentPage: action.id
        })
    case 'pubsubTest':
    	  return Object.assign({}, state, {
    		test1: action.data
          })
    default:
      return state
  }
}

export default PatternsRightPaneReducer