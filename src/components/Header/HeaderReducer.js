import cm from '../../common/CommunicationManager'
import { browserHistory } from 'react-router';

const HeaderReducer = (state = {'currentLink':'Orchestration', 'user':{}, 'path':[]}, action) => {
  switch (action.type) {
  	case 'switchTopLink':
  	  cm.currentLink = action.id
      return Object.assign({}, state, {
    	  currentLink: cm.currentLink,
    	  path:[cm.routeData[cm.currentLink]]
      })
  
    case 'setUser':
    	cm.user = action.data;
    	return Object.assign({}, state, {
    		user: cm.user
        })
    case 'setPath':
      cm.path = action.path
      return Object.assign({}, state, {
    	  path: cm.path
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
    case 'clearBrowserHistory':
    	window.location.href = "/"
    	return state;
    default:
      return state
  }
}

export default HeaderReducer