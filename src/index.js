import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReducerManager from './components/ReducerManager'
import {logger, currentAction, asyncDispatchMiddleware, callbackMiddleware} from './components/CommonMiddleware'
import cs from './common/CommunicationManager'



import { Router, Route, IndexRoute, useRouterHistory, browserHistory  } from 'react-router'
import { createHashHistory } from 'history'
const history = useRouterHistory(createHashHistory)({ queryKey: false });



let store = createStore(ReducerManager, applyMiddleware(logger, currentAction, asyncDispatchMiddleware, callbackMiddleware));
cs.init(store);

render(
  <Provider store={store}>
	  <Router history={browserHistory }>	  	
		<Route path='/' component={cs.routeData["TopContainer"].component}>
			<IndexRoute component={cs.routeData["Login"].component} />
			{
				Object.keys(cs.routeData).map((key, idx) => {
					let r = cs.routeData[key]
					return (<Route key={idx} path={r.path} component={r.component} />)
				})
			}			
		</Route>
	</Router>
  </Provider>,
  document.getElementById('root')
)


