import * as React from "react";
import * as Linear from "../../models/Linear";
import './DeriveTree.css';
import {
    DeriveTreeNode,
    UiState as NodeUiState,
    updateUiStateFromProof as updateNodeUiStateFromProof,
} from "../DeriveTreeNode/DeriveTreeNode";

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiState,
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

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, ui } = this.props;
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} ui={ui.node} />
        </div>;
    }
}
