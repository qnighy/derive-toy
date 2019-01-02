import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';

export default createStore(
  combineReducers({
    cproof: cproofReducer,
  })
)

export type ReduxState = {
  cproof: Linear.CheckedProof,
}

export type ReduxAction = Action // | SomeAction

function cproofReducer(state: Linear.CheckedProof = Linear.example(), action: any): Linear.CheckedProof {
  return state;
}
