import * as React from "react";
import * as Linear from "../../models/Linear";
import './DeriveTree.css';
import {
    DeriveTreeNode,
    UiState as NodeUiState,
    updateUiStateFromProof as updateNodeUiStateFromProof,
    reduceExpanded as reduceNodeExpanded,
} from "../DeriveTreeNode/DeriveTreeNode";
import { PropositionPath } from "../Sequent/Sequent";

interface Props {
    readonly cproof: Linear.CheckedProof,
    readonly ui: UiState,
    readonly expand: (path: ReadonlyArray<number>, new_expanded: boolean) => void,
    readonly close_tree: (path: ReadonlyArray<number>) => void,
    readonly hover: (path: PropositionPath | null) => void,
    readonly act_on_proposition: (path: PropositionPath, paired: boolean, option: number | undefined) => void,
}

export interface UiState {
    readonly node: NodeUiState;
    readonly hover_on: PropositionPath | null,
    readonly pairing_with: PropositionPath | null;
}

export function updateUiStateFromProof(cproof: Linear.CheckedProof, state?: UiState | undefined): UiState {
    if(state === undefined) {
        return {
            node: updateNodeUiStateFromProof(cproof),
            hover_on: null,
            pairing_with: null,
        };
    } else {
        return {
            node: updateNodeUiStateFromProof(cproof, state.node),
            hover_on: null, // TODO
            pairing_with: null, // TODO
        };
    }
}

export function reduceExpanded(ui: UiState, path: ReadonlyArray<number>, new_expanded: boolean): UiState {
    const new_node = reduceNodeExpanded(ui.node, path, 0, new_expanded);
    return {
        node: new_node,
        hover_on: ui.hover_on,
        pairing_with: ui.pairing_with,
    };
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, ui, expand, close_tree, hover, act_on_proposition } = this.props;
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} ui={ui.node} path={[]} hover_on={ui.hover_on} pairing_with={ui.pairing_with} expand={expand} close_tree={close_tree} hover={hover} act_on_proposition={act_on_proposition} />
        </div>;
    }
}
