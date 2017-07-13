import { combineReducers } from 'redux'
import MainContainerReducer from './MainPage/MainContainerReducer'
import HeaderReducer from './Header/HeaderReducer'
import CommonReducer from './CommonReducer'
import DashboardReducer from './MainPage/Dashboard/DashboardReducer'
import OrchestrationReducer from './MainPage/Orchestration/OrchestrationReducer'

const ReducerManager = combineReducers({
  MainContainerReducer,
  CommonReducer,
  HeaderReducer,
  DashboardReducer,
  OrchestrationReducer
})

export default ReducerManager