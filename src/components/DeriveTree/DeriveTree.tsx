import * as React from "react";
import { ActionDispatcher } from "./DeriveTreeContainer";

interface Props {
    // value: Something;
    actions: ActionDispatcher;
}

export class DeriveTree extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <p>A ⊢ A</p>
            </div>
        )
    }
}