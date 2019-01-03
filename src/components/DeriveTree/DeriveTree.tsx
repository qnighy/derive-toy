import * as React from "react";
import * as Linear from "../../models/Linear";
import './DeriveTree.css';
import {
    DeriveTreeNode,
    UiState as NodeUiState,
    updateUiStateFromProof as updateNodeUiStateFromProof,
    reduceExpanded as reduceNodeExpanded,
} from "../DeriveTreeNode/DeriveTreeNode";

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiState,
    expand: (path: number[], new_expanded: boolean) => void,
    close_tree: (path: number[]) => void,
}

export interface UiState {
    node: NodeUiState;
}

export function updateUiStateFromProof(cproof: Linear.CheckedProof, state?: UiState | undefined): UiState {
    if(state === undefined) {
        return {
            node: updateNodeUiStateFromProof(cproof),
        };
    } else {
        return {
            node: updateNodeUiStateFromProof(cproof, state.node),
        };
    }
}

export function reduceExpanded(ui: UiState, path: number[], new_expanded: boolean): UiState {
    const new_node = reduceNodeExpanded(ui.node, path, 0, new_expanded);
    return {
        node: new_node,
    };
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, ui, expand, close_tree } = this.props;
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} ui={ui.node} path={null} expand={expand} close_tree={close_tree} />
        </div>;
    }
}
