import cs from '../services/CommunicationService'

export const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

export const asyncDispatchMiddleware = store => next => action => {
	  let syncActivityFinished = false;
	  let actionQueue = [];

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

	  next(actionWithAsyncDispatch);
	  syncActivityFinished = true;
	  flushQueue();
	};
	
export const callbackMiddleware = store => next => action => {
	    if (action.options && action.options.type === "CALLBACK") {
	    	action.options.action = action;
	    	action.asyncDispatch({"type":"_CALLBACK_", "options": action.options});
	    }
	    if (action._type === "setState") {
	    	let list = action._data.split(".");
    		action.asyncDispatch({"type":list[0], "data": action.data});
    		
    	}
	    return next(action);
	}
export const currentAction = store => next => action => {
    	cs.currentAction = action;
    	
    return next(action);
}