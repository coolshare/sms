const MainContainerReducer = (state = {'currentTab':0}, action) => {
  switch (action.type) {
    case 'switchTab':
      return Object.assign({}, state, {
    	  currentTab: action.tabId
      })
    case 'loadAboutPatter':
        return Object.assign({}, state, {
      	  aboutPattern: action.data
        })
    default:
      return state
  }
}

export default MainContainerReducer