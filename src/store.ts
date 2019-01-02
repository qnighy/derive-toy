import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiProps } from './components/DeriveTree/DeriveTree';

export default createStore(
  combineReducers({
    cproof: cproofReducer,
    ui: uiStateReducer,
  })
)

export type ReduxState = {
  cproof: Linear.CheckedProof,
  ui: UiProps,
}

export type ReduxAction = Action // | SomeAction

function cproofReducer(state: Linear.CheckedProof = Linear.example(), action: any): Linear.CheckedProof {
  return state;
}

function uiStateReducer(state: UiProps | null = null, action: any): UiProps | null {
  return state;
}
