import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    cproof: Linear.CheckedProof,
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    render() {
        const { cproof } = this.props;
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
                            <DeriveTreeNode cproof={child} />
                        </div>
                    )
                }
            </div>
        </div>;
    }
}
