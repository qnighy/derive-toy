import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";

interface Props {
    cproof: Linear.CheckedProof,
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { cproof, actions } = this.props;
        return <div>
            <Sequent env={ cproof.env } />
            <ul>
                {
                    cproof.children.map((child) => <li><DeriveTree cproof={child} actions={actions} /></li>)
                }
            </ul>
        </div>;
    }
}
