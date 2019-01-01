import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";
import * as LinearProposition from "../../models/LinearProposition";

interface Props {
    prop1: LinearProposition.Proposition,
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { prop1 } = this.props;
        return (
            <div>
                <p>{LinearProposition.pp_prop(prop1)} ⊢ A</p>
            </div>
        )
    }
}