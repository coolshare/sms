import cs from '../../services/CommunicationService'
import { browserHistory } from 'react-router';

const HeaderReducer = (state = {'path':[]}, action) => {
  switch (action.type) {
    case 'setPath':
      return Object.assign({}, state, {
    	  path: action.path
      })
    case 'pushPath':
    	var p = Object.assign([], state.path);
    	p.push(action.action)
    	action.asyncDispatch({'type':'pushBrowserHistory', 'url':action.action.path}); 
        return Object.assign({}, state, {
      	  path: p
        })
    case 'popPath':
    	var p = Object.assign([], state.path);
    	p.pop()
    	action.asyncDispatch({'type':'pophBrowserHistory'}); 
        return Object.assign({}, state, {
      	  path: p
        })
    case 'goPath':
    	if (action.target==state.path[state.path.length-1].label) {
    		return state;
    	}
    	var p = Object.assign([], state.path);
    	p.pop()
    	browserHistory.goBack()
    	action.asyncDispatch({'type':'goPath', 'target':action.target}); 
        return Object.assign({}, state, {
      	  path: p
        })
    case 'pushBrowserHistory':
    	browserHistory.push(action.url)
    	return state;
    case 'popBrowserHistory':
    	browserHistory.goBack()
    	return state;
    default:
      return state
  }
}

export default HeaderReducer