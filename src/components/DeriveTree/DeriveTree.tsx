import * as React from "react";
import * as Linear from "../../models/Linear";
import './DeriveTree.css';
import { DeriveTreeNode, UiProps as NodeUiProps } from "../DeriveTreeNode/DeriveTreeNode";

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiProps | null,
}

export interface UiProps {
    node: NodeUiProps | null;
}

function ui_default(): UiProps {
    return {
        node: null,
    };
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, ui: ui_ } = this.props;
        const ui = ui_ || ui_default();
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} ui={ui.node} />
        </div>;
    }
}
