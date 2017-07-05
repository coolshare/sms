const DashboardReducer = (state = {'gadgets':{}}, action) => {
  switch (action.type) {
  	case 'registerGadget':
  	  var gadgets = Object.assign({}, state.gadgets)
  	  gadgets[action.data.name] = action.data;
      return Object.assign({}, state, {
    	  gadgets: gadgets
      })
  	case 'GadgetClose':
  		var gadgets = Object.assign({}, state.gadgets)
    	  gadgets[action.data].state = "close"
        return Object.assign({}, state, {
      	  gadgets: gadgets
        })
  	case 'GadgetMax':
  		var gadgets = Object.assign({}, state.gadgets)
  	  gadgets[action.data].state = "max"
      return Object.assign({}, state, {
    	  gadgets: gadgets
      })
  	case 'GadgetRestore':
  		var gadgets = Object.assign({}, state.gadgets)
	  	  gadgets[action.data].state = "normal"
	      return Object.assign({}, state, {
	    	  gadgets: gadgets
	      })
  	case 'GadgetMin':
  		var gadgets = Object.assign({}, state.gadgets)
    	  gadgets[action.data].state = "min"
        return Object.assign({}, state, {
      	  gadgets: gadgets
        })
    default:
      return state
  }
}

export default DashboardReducer