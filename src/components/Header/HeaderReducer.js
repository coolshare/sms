import cm from '../../common/CommunicationManager'
import { browserHistory } from 'react-router';

const HeaderReducer = (state = {'loginState':undefined, 'currentLink':'ProviderDiagram', 'user':{}, 'userList':undefined, 'path':[]}, action) => {
  switch (action.type) {
  	case 'setLoginState':
  		cm.loginState = action.data;
    	return Object.assign({}, state, {
    		loginState: cm.loginState
        })
  
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
      case 'setUserList':
      	cm.userList = action.data;
      	return Object.assign({}, state, {
      		userList: cm.userList
          })
    case 'setPath':
      cm.path = Object.assign([], action.data);
      return Object.assign({}, state, {
    	  path: cm.path
      })
    case 'pushPath':
    	cm.setPath(action.data, action);
    	return state;
    case 'popPath':
    	var p = Object.assign([], state.path);
    	p.pop()
    	//action.asyncDispatch({'type':'pophBrowserHistory'}); 
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