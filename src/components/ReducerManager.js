import { combineReducers } from 'redux'
import MainContainerReducer from './MainPage/MainContainerReducer'
import HeaderReducer from './Header/HeaderReducer'
import CommonReducer from './CommonReducer'
import DashboardReducer from './MainPage/Dashboard/DashboardReducer'
const ReducerManager = combineReducers({
  MainContainerReducer,
  CommonReducer,
  HeaderReducer,
  DashboardReducer
})

export default ReducerManager