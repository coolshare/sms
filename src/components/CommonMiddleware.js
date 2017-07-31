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

	  let result = next(actionWithAsyncDispatch);
	  
	  if (result.type==="__FORWARD__") {
		  result.asyncDispatch(action.action);
	  }
	  if (result.options && action.options.callback !== undefined) {
		  result.asyncDispatch({"type":result.type, "data":action});
	  }
	  if (result._type === "__setState__") {
		  let list = action._data.split(".");
		  result.asyncDispatch({"type":list[0], "data": result.data}); 		
  	  }
	  
	  
	  syncActivityFinished = true;
	  flushQueue();
	  console.log('next state', store.getState())
	  return result;
	};
	
