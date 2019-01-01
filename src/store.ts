import {createStore, combineReducers, Action} from 'redux'
import * as LinearProposition from './models/LinearProposition';

export default createStore(
  combineReducers({
    prop1: prop1Reducer,
  })
)

export type ReduxState = {
  prop1: LinearProposition.Proposition,
}

export type ReduxAction = Action // | SomeAction

function prop1Reducer(state: LinearProposition.Proposition = LinearProposition.newTensor([LinearProposition.newAtomic("A"), LinearProposition.newAtomic("B")]), action: any): LinearProposition.Proposition {
  return state;
}