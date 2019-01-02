import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTree.css';

interface Props {
    cproof: Linear.CheckedProof,
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
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
                            <DeriveTree cproof={child} actions={actions} />
                        </div>
                    )
                }
            </div>
        </div>;
    }
}
