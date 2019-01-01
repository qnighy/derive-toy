import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";
import * as Linear from "../../models/Linear";

interface Props {
    prop1: Linear.Proposition,
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { prop1 } = this.props;
        return (
            <div>
                <p>{Linear.pp_prop(prop1)} ⊢ A</p>
            </div>
        )
    }
}