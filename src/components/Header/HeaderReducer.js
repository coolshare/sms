const HeaderReducer = (state = {'path':[{"name":"home", "icon":"", "url":"/"}]}, action) => {
  switch (action.type) {
    case 'setPath':
      return Object.assign({}, state, {
    	  path: action.data
      })
    case 'addPath':
    	let p = Object.assign([], state.path);
    	p.push(action.action)
        return Object.assign({}, state, {
      	  path: p
        })
    default:
      return state
  }
}

export default HeaderReducer