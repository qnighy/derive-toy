import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeNodeContainer";
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    cproof: Linear.CheckedProof,
    actions: ActionDispatcher;
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    render() {
        const { cproof, actions } = this.props;
        return <div className="DeriveTree-tree">
            <div className="DeriveTree-sequent">
                <Sequent env={ cproof.env } />
            </div>
            <div className="DeriveTree-children">
                {
                    cproof.children.map((child) =>
                        <div className="DeriveTree-child">
                            <DeriveTreeNode cproof={child} actions={actions} />
                        </div>
                    )
                }
            </div>
        </div>;
    }
}
