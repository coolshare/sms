import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReducerManager from './components/ReducerManager'
import {asyncDispatchMiddleware} from './components/CommonMiddleware'

import cm from './common/CommunicationManager'


import { Router, Route, IndexRoute, useRouterHistory, browserHistory  } from 'react-router'
import { createHashHistory } from 'history'
const history = useRouterHistory(createHashHistory)({ queryKey: false });



let store = createStore(ReducerManager, applyMiddleware(asyncDispatchMiddleware));
cm.init(store);

let sm = require("./common/ServiceManager").default
sm.init();


render(
  <Provider store={store}>
	  <Router history={browserHistory }>	  	
		<Route path='/' component={cm.routeData["TopContainer"].component}>
			<IndexRoute component={cm.routeData["Login"].component} />
			{
				Object.keys(cm.routeData).map((key, idx) => {
					let r = cm.routeData[key]
					return (<Route key={idx} path={r.path} component={r.component} />)
				})
			}			
		</Route>
	</Router>
  </Provider>,
  document.getElementById('root')
)


