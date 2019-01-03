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
    cproof: Linear.CheckedProof,
    ui: UiState,
    expand: (path: number[], new_expanded: boolean) => void,
    close_tree: (path: number[]) => void,
    hover: (path: PropositionPath | null) => void,
}

export interface UiState {
    node: NodeUiState;
    hover_on: PropositionPath | null,
}

export function updateUiStateFromProof(cproof: Linear.CheckedProof, state?: UiState | undefined): UiState {
    if(state === undefined) {
        return {
            node: updateNodeUiStateFromProof(cproof),
            hover_on: null,
        };
    } else {
        return {
            node: updateNodeUiStateFromProof(cproof, state.node),
            hover_on: null, // TODO
        };
    }
}

export function reduceExpanded(ui: UiState, path: number[], new_expanded: boolean): UiState {
    const new_node = reduceNodeExpanded(ui.node, path, 0, new_expanded);
    return {
        node: new_node,
        hover_on: ui.hover_on,
    };
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, ui, expand, close_tree, hover } = this.props;
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} ui={ui.node} path={[]} hover_on={ui.hover_on} expand={expand} close_tree={close_tree} hover={hover} />
        </div>;
    }
}
