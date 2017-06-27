import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReducerManager from './components/ReducerManager'
import {logger, currentAction, asyncDispatchMiddleware, callbackMiddleware} from './components/CommonMiddleware'
import cs from './services/CommunicationService'
import TopContainer from './components/TopContainer'
import MainRouteContainer from './components/MainRouteContainer'
import Login from './components/Login'
import StackViewContainer from './components/StackViewContainer'


import { Router, Route, IndexRoute, useRouterHistory, browserHistory  } from 'react-router'
import { createHashHistory } from 'history'
const history = useRouterHistory(createHashHistory)({ queryKey: false });

let store = createStore(ReducerManager, applyMiddleware(logger, currentAction, asyncDispatchMiddleware, callbackMiddleware));
cs.init(store);

render(
  <Provider store={store}>
	  <Router history={browserHistory }>
		<Route path='/' component={TopContainer}>
			<IndexRoute component={Login} />
			<Route path='main' component={MainRouteContainer} />		
			<Route path='popup' component={StackViewContainer} />	
		</Route>
		<Route path='/ReactReduxPattern/' component={TopContainer}>
			<IndexRoute component={Login} />
			<Route path='main' component={MainRouteContainer} />		
			<Route path='popup' component={StackViewContainer} />	
		</Route>
	</Router>
  </Provider>,
  document.getElementById('root')
)


