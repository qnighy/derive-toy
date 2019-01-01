import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";
import { Proposition, pp_prop } from "../../models/LinearProposition";

interface Props {
    prop1: Proposition,
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        const { prop1 } = this.props;
        return (
            <div>
                <p>{pp_prop(prop1)} ⊢ A</p>
            </div>
        )
    }
}