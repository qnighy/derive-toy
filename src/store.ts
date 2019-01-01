import {createStore, combineReducers, Action} from 'redux'
import { Proposition, newTensor, newAtomic } from './models/LinearProposition';

export default createStore(
  combineReducers({
    prop1: prop1Reducer,
  })
)

export type ReduxState = {
  prop1: Proposition,
}

export type ReduxAction = Action // | SomeAction

function prop1Reducer(state: Proposition = newTensor([newAtomic("A"), newAtomic("B")]), action: any): Proposition {
  return state;
}