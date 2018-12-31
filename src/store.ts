import {createStore, combineReducers, Action} from 'redux'

export default createStore(
  combineReducers({})
)

export type ReduxState = {}

export type ReduxAction = Action // | SomeAction