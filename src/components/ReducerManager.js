import { combineReducers } from 'redux'
import MainContainerReducer from './MainPage/MainContainerReducer'
import HeaderReducer from './Header/HeaderReducer'
import CommonReducer from './CommonReducer'
import DashboardReducer from './MainPage/Dashboard/DashboardReducer'
import OrchestrationReducer from './MainPage/Orchestration/OrchestrationReducer'
import AdminReducer from './MainPage/Admin/AdminReducer'
const ReducerManager = combineReducers({
  MainContainerReducer,
  CommonReducer,
  HeaderReducer,
  DashboardReducer,
  OrchestrationReducer,
  AdminReducer
})

export default ReducerManager