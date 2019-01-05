import {createStore, combineReducers, Action} from 'redux'
import * as Linear from './models/Linear';
import { UiState, updateUiStateFromProof, reduceExpanded } from './components/DeriveTree/DeriveTree';
import { PropositionPath } from './components/Sequent/Sequent';

export type ReduxState = {
    readonly cproof: Linear.CheckedProof,
    readonly ui: UiState,
}

export type ReduxAction = DummyActionType | ExpandAction | CloseAction | HoverAction | PropositionAction

interface DummyActionType {
    readonly type: '__DUMMY_ACTION__';
}

interface ExpandAction {
    readonly type: 'EXPAND_TREE';
    readonly path: ReadonlyArray<number>;
    readonly new_expanded: boolean;
}

interface CloseAction {
    readonly type: 'CLOSE_TREE';
    readonly path: ReadonlyArray<number>;
}

interface HoverAction {
    readonly type: 'HOVER';
    readonly path: PropositionPath | null;
}

interface PropositionAction {
    readonly type: 'PROPOSITION';
    readonly paired: boolean;
    readonly path: PropositionPath;
    readonly option?: number;
}

const initialState: ReduxState = function() {
    // const proposition = Linear.Parser.parse("A ⊗ B ⊸ B ⊗ A");
    const proposition = Linear.Parser.parse("A ⊗ (B ⅋ C) ⊸ (A ⊗ B) ⅋ C");
    // const proposition = Linear.Parser.parse("A & B ⊸ B & A");
    const cproof = new Linear.CheckedProof(Linear.Environment.toplevel(proposition), { kind: "pending" }, []);
    return {
        cproof,
        ui: updateUiStateFromProof(cproof),
    };
}();

function reduce(state: ReduxState = initialState, action: ReduxAction): ReduxState {
    switch(action.type) {
        case 'EXPAND_TREE': {
            return {
                ...state,
                ui: reduceExpanded(state.ui, action.path, action.new_expanded),
            };
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
            return {
                ...state,
                ui: {
                    ...state.ui,
                    hover_on: action.path,
                }
            };
        }
        case 'PROPOSITION': {
            let pairing_index: string | null = null;
            if(action.paired) {
                if(state.ui.pairing_with === null) {
                    return {
                        ...state,
                        ui: {
                            ...state.ui,
                            pairing_with: action.path,
                        }
                    }
                }
                if(!action.path.equal_path(state.ui.pairing_with.path)) {
                    return {
                        ...state,
                        ui: {
                            ...state.ui,
                            pairing_with: null,
                        }
                    }
                }
                pairing_index = state.ui.pairing_with.index;
            }
            // TODO: paired case
            const new_tree = Linear.actOnProposition(state.cproof, action.path.path, action.path.index, pairing_index, action.option);
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
