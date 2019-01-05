import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Linear from "../../models/Linear";
import { Sequent, PropositionPath } from "../Sequent/Sequent";
import './DeriveTreeNode.css';

interface Props {
    readonly cproof: Linear.CheckedProof,
    readonly ui: UiState,
    readonly path: ReadonlyArray<number>,
    readonly hover_on: PropositionPath | null,
    readonly pairing_with: PropositionPath | null;
    readonly expand: (path: ReadonlyArray<number>, new_expanded: boolean) => void,
    readonly close_tree: (path: ReadonlyArray<number>) => void,
    readonly hover: (path: PropositionPath | null) => void,
    readonly act_on_proposition: (path: PropositionPath, paired: boolean, option: number | undefined) => void,
}

export interface UiState {
    readonly expanded: boolean;
    readonly children: ReadonlyArray<UiState>;
}

export function updateUiStateFromProof(cproof: Linear.CheckedProof, state?: UiState | undefined): UiState {
    if(state === undefined) {
        return {
            expanded: true,
            children: cproof.children.map((child) => updateUiStateFromProof(child)),
        };
    } else {
        return {
            expanded: cproof.children.length === 0 || state.expanded,
            children: cproof.children.map((child, i) => updateUiStateFromProof(child, state.children[i])),
        };
    }
}

export function reduceExpanded(ui: UiState, path: ReadonlyArray<number>, path_index: number, new_expanded: boolean): UiState {
    if(path_index >= path.length) {
        return {
            ...ui,
            expanded: new_expanded,
        };
    }
    let path_comp = path[path_index];
    if(path_comp < ui.children.length) {
        const new_children = Array.from(ui.children);
        new_children[path_comp] = reduceExpanded(new_children[path_comp], path, path_index + 1, new_expanded);
        return {
            ...ui,
            children: new_children,
        };
    }
    return ui;
}

export class DeriveTreeNode extends React.Component<Props, {}> {
    handleToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { ui, path, expand } = this.props;
        expand(path, !ui.expanded);
    }
    handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { path, close_tree } = this.props;
        close_tree(path);
    }
    foldable(): boolean {
        const { cproof } = this.props;
        return cproof.children.length > 0;
    }
    expanded(): boolean {
        const { ui } = this.props;
        return !this.foldable() || ui.expanded;
    }
    render() {
        const { cproof, ui, path, hover_on, pairing_with, expand, close_tree, hover, act_on_proposition } = this.props;
        const foldableClass = this.foldable() ? "DeriveTreeNode-foldable" : "DeriveTreeNode-nonfoldable";
        const expandClass = this.expanded() ? "DeriveTreeNode-expanded" : "DeriveTreeNode-folded";
        const localPendingClass = cproof.proof.kind === "pending" ? "DeriveTreeNode-local-pending" : "DeriveTreeNode-local-done";
        return <div className="DeriveTreeNode-subtree">
            <div className={`DeriveTreeNode-node ${localPendingClass}`}>
                <div className="DeriveTreeNode-sequent">
                    <Sequent cproof={cproof} path={path} hover_on={hover_on} pairing_with={pairing_with} hover={hover} act_on_proposition={act_on_proposition} />
                </div>
                <span className="DeriveTreeNode-menu-left">
                    <button className={`DeriveTreeNode-button DeriveTreeNode-expand-button ${foldableClass}`} onClick={this.handleToggle}>
                        <FontAwesomeIcon icon={ ui.expanded ? "minus-square" : "plus-square" } />
                    </button>
                </span>
                <span className="DeriveTreeNode-menu-right">
                    <button className={`DeriveTreeNode-button DeriveTreeNode-close-button ${localPendingClass}`} onClick={this.handleClose}>
                        <FontAwesomeIcon icon="times-circle" />
                    </button>
                </span>
            </div>
            <div className={`DeriveTreeNode-children ${expandClass}`}>
                {
                    cproof.children.map((child, i) => {
                        let subpath = Array.from(path);
                        subpath.push(i);
                        return <div key={ `childproof${i}` } className="DeriveTreeNode-child">
                            <DeriveTreeNode cproof={child} ui={ui.children[i]} path={subpath} hover_on={hover_on} pairing_with={pairing_with} expand={expand} close_tree={close_tree} hover={hover} act_on_proposition={act_on_proposition} />
                        </div>;
                    })
                }
            </div>
            <div className={`DeriveTreeNode-fold-placeholder ${expandClass}`}>
                ⋮
            </div>
        </div>;
    }
}
