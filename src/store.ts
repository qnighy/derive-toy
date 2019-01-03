import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiState, updateUiStateFromProof, reduceExpanded } from './components/DeriveTree/DeriveTree';
import { PropositionPath } from './components/Sequent/Sequent';

export type ReduxState = {
    cproof: Linear.CheckedProof,
    ui: UiState,
}

export type ReduxAction = ExpandAction | CloseAction | HoverAction

interface ExpandAction {
    type: 'EXPAND_TREE';
    path: number[];
    new_expanded: boolean;
}

interface CloseAction {
    type: 'CLOSE_TREE';
    path: number[];
}

interface HoverAction {
    type: 'HOVER';
    path: PropositionPath | null;
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
        case 'HOVER': {
            let new_state: ReduxState = Object.assign({}, state);
            new_state.ui = Object.assign({}, new_state.ui);
            new_state.ui.hover_on = action.path;
            return new_state;
        }
    }
    return state;
}

export default createStore(reduce, initialState);
