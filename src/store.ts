import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiState, updateUiStateFromProof, reduceExpanded } from './components/DeriveTree/DeriveTree';

export type ReduxState = {
    cproof: Linear.CheckedProof,
    ui: UiState,
}

export type ReduxAction = ExpandAction | CloseAction

interface ExpandAction {
    type: 'EXPAND_TREE';
    path: number[];
    new_expanded: boolean;
}

interface CloseAction {
    type: 'CLOSE_TREE';
    path: number[];
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
        case 'CLOSE_TREE': {
            const new_tree = Linear.closeTree(state.cproof.proof, action.path);
            const new_cproof = Linear.check_proof(state.cproof.env, new_tree);
            const new_ui = updateUiStateFromProof(new_cproof, state.ui);
            return {
                cproof: new_cproof,
                ui: new_ui,
            };
        }
    }
    return state;
}

export default createStore(reduce, initialState);
