import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiProps | null,
}

export interface UiProps {
    expanded: boolean;
    children: UiProps[];
}

function ui_default(): UiProps {
    return {
        expanded: true,
        children: [],
    }
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    render() {
        const { cproof, ui: ui_ } = this.props;
        const ui = ui_ || ui_default();
        return <div className="DeriveTreeNode-subtree">
            <div className="DeriveTreeNode-node">
                <div className="DeriveTreeNode-sequent">
                    <Sequent env={ cproof.env } />
                </div>
                <span className="DeriveTreeNode-menu">
                    <FontAwesomeIcon icon="minus-square" />
                </span>
            </div>
            <div className="DeriveTreeNode-children">
                {
                    cproof.children.map((child, i) =>
                        <div key={ `childproof${i}` } className="DeriveTreeNode-child">
                            <DeriveTreeNode cproof={child} ui={ui.children[i] || null} />
                        </div>
                    )
                }
            </div>
        </div>;
    }
}
