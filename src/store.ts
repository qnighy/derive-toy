import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiState, updateUiStateFromProof, reduceExpanded } from './components/DeriveTree/DeriveTree';

export type ReduxState = {
    cproof: Linear.CheckedProof,
    ui: UiState,
}

export type ReduxAction = ExpandAction // | SomeAction

interface ExpandAction {
    type: 'EXPAND_TREE';
    path: number[];
    new_expanded: boolean;
}

const initialState: ReduxState = {
    cproof: Linear.example(),
    ui: updateUiStateFromProof(Linear.example()),
};

function reduce(state: ReduxState = initialState, action: ReduxAction): ReduxState {
    switch(action.type) {
        case 'EXPAND_TREE': {
            let new_state: ReduxState = Object.assign({}, state);
            new_state.ui = reduceExpanded(new_state.ui, action.path, action.new_expanded);
            return new_state;
        }
    }
    return state;
}

export default createStore(reduce, initialState);
