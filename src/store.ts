import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiState, updateUiStateFromProof } from './components/DeriveTree/DeriveTree';

export type ReduxState = {
    cproof: Linear.CheckedProof,
    ui: UiState,
}

export type ReduxAction = Action // | SomeAction

const initialState: ReduxState = {
    cproof: Linear.example(),
    ui: updateUiStateFromProof(Linear.example()),
};

function reduce(state: ReduxState = initialState, action: any): ReduxState {
    return state;
}

export default createStore(reduce, initialState);
