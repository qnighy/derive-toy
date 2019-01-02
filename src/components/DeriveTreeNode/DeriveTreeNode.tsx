import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiState,
}

export interface UiState {
    expanded: boolean;
    children: UiState[];
}

export function updateUiStateFromProof(cproof: Linear.CheckedProof, state?: UiState | undefined): UiState {
    if(state === undefined) {
        return {
            expanded: true,
            children: cproof.children.map((child) => updateUiStateFromProof(child)),
        };
    } else {
        return {
            expanded: state.expanded,
            children: cproof.children.map((child, i) => updateUiStateFromProof(child, state.children[i])),
        };
    }
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    render() {
        const { cproof, ui } = this.props;
        const expandClass = ui.expanded ? "DeriveTreeNode-expanded" : "DeriveTreeNode-folded";
        return <div className="DeriveTreeNode-subtree">
            <div className="DeriveTreeNode-node">
                <div className="DeriveTreeNode-sequent">
                    <Sequent env={ cproof.env } />
                </div>
                <span className="DeriveTreeNode-menu">
                    <FontAwesomeIcon icon={ ui.expanded ? "minus-square" : "plus-square" } />
                </span>
            </div>
            <div className={`DeriveTreeNode-children ${expandClass}`}>
                {
                    cproof.children.map((child, i) =>
                        <div key={ `childproof${i}` } className="DeriveTreeNode-child">
                            <DeriveTreeNode cproof={child} ui={ui.children[i]} />
                        </div>
                    )
                }
            </div>
        </div>;
    }
}
