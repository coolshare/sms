import { combineReducers } from 'redux'
import MainContainerReducer from './MainPage/MainContainerReducer'
import HeaderReducer from './Header/HeaderReducer'
import CommonReducer from './CommonReducer'
const ReducerManager = combineReducers({
  MainContainerReducer,
  CommonReducer,
  HeaderReducer
})

export default ReducerManager