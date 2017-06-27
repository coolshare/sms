import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReducerManager from './components/ReducerManager'
import {logger, currentAction, asyncDispatchMiddleware, callbackMiddleware} from './components/CommonMiddleware'
import cs from './services/CommunicationService'



import { Router, Route, IndexRoute, useRouterHistory, browserHistory  } from 'react-router'
import { createHashHistory } from 'history'
const history = useRouterHistory(createHashHistory)({ queryKey: false });



let store = createStore(ReducerManager, applyMiddleware(logger, currentAction, asyncDispatchMiddleware, callbackMiddleware));
cs.init(store);
let routeData = cs.routeData;

render(
  <Provider store={store}>
	  <Router history={browserHistory }>
		<Route path='/' component={routeData["TopContainer"].component}>
			<IndexRoute component={routeData["Login"].component} />
			<Route path='main' component={routeData["MainRouteContainer"].component} />
			<Route path={routeData["MainRouteContainer"].link} component={routeData["MainRouteContainer"].component} />
			<Route path={routeData["ENGListDetails"].link} component={routeData["ENGListDetails"].component} />
			<Route path={routeData["ENGAlertsDetails"].link} component={routeData["ENGAlertsDetails"].component} />
			<Route path={routeData["ResouceUsageDetails"].link} component={routeData["ResouceUsageDetails"].component} />
			/*{
				Object.keys(cs.routeData).map(key => {
					let page = cs.routeData[key];
					return (
							<Route path={page.link} component={page.property} key={page.id}/>
					)
				})
			}*/
		</Route>
	</Router>
  </Provider>,
  document.getElementById('root')
)


