import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';

export default createStore(
  combineReducers({
    prop1: prop1Reducer,
  })
)

export type ReduxState = {
  prop1: Linear.Proposition,
}

export type ReduxAction = Action // | SomeAction

function prop1Reducer(state: Linear.Proposition = Linear.newTensor([Linear.newAtomic("A"), Linear.newAtomic("B")]), action: any): Linear.Proposition {
  return state;
}