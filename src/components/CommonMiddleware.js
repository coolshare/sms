import cm from '../common/CommunicationManager'

export const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

export const asyncDispatchMiddleware = store => next => action => {
	  //Save current action
	  cm.currentAction = action;
	  
	  //Logging
	  console.log('dispatching', action)
	  let syncActivityFinished = false;
	  let actionQueue = [];

	  //asyncDispatch
	  function flushQueue() {
	    actionQueue.forEach(a => store.dispatch(a)); 
	    actionQueue = [];
	  }

	  function asyncDispatch(asyncAction) {
	    actionQueue = actionQueue.concat([asyncAction]);

	    if (syncActivityFinished) {
	      flushQueue();
	    }
	  }

	  const actionWithAsyncDispatch =
	    Object.assign({}, action, { asyncDispatch });

	  if (action.type==="__FORWARD__") {
		  action.asyncDispatch(action.action);
	  }
	  if (action.options && action.options.callback !== undefined) {
	    	action.asyncDispatch({"type":action.type, "data":action});
	  }
	  if (action._type === "__setState__") {
	    	let list = action._data.split(".");
	    	action.asyncDispatch({"type":list[0], "data": action.data}); 		
  	  }
	  
	  let result = next(actionWithAsyncDispatch);
	  syncActivityFinished = true;
	  flushQueue();
	  console.log('next state', store.getState())
	  return result;
	};
	
