import * as React from "react";
import * as Linear from "../../models/Linear";
import './DeriveTree.css';
import { DeriveTreeNode } from "../DeriveTreeNode/DeriveTreeNode";

interface Props {
    cproof: Linear.CheckedProof,
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof } = this.props;
        return <div className="DeriveTree-root">
            <DeriveTreeNode cproof={cproof} />
        </div>;
    }
}
