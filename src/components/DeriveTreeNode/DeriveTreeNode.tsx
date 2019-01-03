import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Linear from "../../models/Linear";
import { Sequent } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    cproof: Linear.CheckedProof,
    ui: UiState,
    path: RevPath | null,
    expand: (path: number[], new_expanded: boolean) => void,
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

export function reduceExpanded(ui: UiState, path: number[], path_index: number, new_expanded: boolean): UiState {
    let new_ui: UiState = Object.assign({}, ui);
    if(path_index >= path.length) {
        new_ui.expanded = new_expanded;
        return new_ui;
    }
    let path_comp = path[path_index];
    if(path_comp < new_ui.children.length) {
        new_ui.children = Array.from(new_ui.children);
        new_ui.children[path_comp] = reduceExpanded(new_ui.children[path_comp], path, path_index + 1, new_expanded);
    }
    return new_ui;
}

interface RevPath {
    index: number;
    parent: RevPath | null;
};

function pathFromRevPath(path: RevPath | null): number[] {
    let ret: number[] = [];
    while(path !== null) {
        ret.unshift(path.index);
        path = path.parent;
    }
    return ret;
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    handleToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { ui, path, expand } = this.props;
        expand(pathFromRevPath(path), !ui.expanded);
    }
    render() {
        const { cproof, ui, path, expand } = this.props;
        const expandClass = ui.expanded ? "DeriveTreeNode-expanded" : "DeriveTreeNode-folded";
        return <div className="DeriveTreeNode-subtree">
            <div className="DeriveTreeNode-node">
                <div className="DeriveTreeNode-sequent">
                    <Sequent env={ cproof.env } />
                </div>
                <span className="DeriveTreeNode-menu-left">
                    <button className="DeriveTreeNode-button DeriveTreeNode-expand-button" onClick={this.handleToggle}>
                        <FontAwesomeIcon icon={ ui.expanded ? "minus-square" : "plus-square" } />
                    </button>
                </span>
                <span className="DeriveTreeNode-menu-right">
                    <button className="DeriveTreeNode-button DeriveTreeNode-close-button">
                        <FontAwesomeIcon icon="times-circle" />
                    </button>
                </span>
            </div>
            <div className={`DeriveTreeNode-children ${expandClass}`}>
                {
                    cproof.children.map((child, i) => {
                        const subpath = {
                            index: i,
                            parent: path,
                        };
                        return <div key={ `childproof${i}` } className="DeriveTreeNode-child">
                            <DeriveTreeNode cproof={child} ui={ui.children[i]} path={subpath} expand={expand} />
                        </div>;
                    })
                }
            </div>
        </div>;
    }
}
