import * as React from "react";
import * as Linear from "../../models/Linear";
import { PrettyProposition } from "../PrettyProposition/PrettyProposition";
import './Sequent.css'

interface Props {
    cproof: Linear.CheckedProof;
    path: number[];
    hover_on: PropositionPath | null;
    pairing_with: PropositionPath | null;
    hover: (path: PropositionPath | null) => void,
    act_on_proposition: (path: PropositionPath, paired: boolean, option: number | undefined) => void,
}

export class PropositionPath {
    constructor(public readonly path: number[], public readonly index: string) {}
    equal_path(path: number[]): boolean {
        if(path.length !== this.path.length) return false;
        for(let i = 0; i < path.length; i++) {
            if(path[i] !== this.path[i]) return false;
        }
        return true;
    }
    is_parent(path: number[], index: string): boolean {
        for(let i = 0; i < path.length; i++) {
            if(path[i] !== this.path[i]) return false;
        }
        return `${this.index}.`.startsWith(`${index}.`);
    }
    is_exact(path: number[], index: string): boolean {
        if(path.length !== this.path.length) return false;
        for(let i = 0; i < path.length; i++) {
            if(path[i] !== this.path[i]) return false;
        }
        return this.index === index;
    }
}

export class Sequent extends React.Component<Props, {}> {
    render() {
        const { cproof } = this.props;
        const { env } = cproof;
        let indices = Array.from(env.props.keys());
        indices.sort((index1, index2) => {
            const index1num = index1.split('.').map((s) => parseInt(s));
            const index2num = index2.split('.').map((s) => parseInt(s));
            const minlen = Math.min(index1num.length, index2num.length);
            for(let i = 0; i < minlen; i++) {
                if(index1num[i] < index2num[i]) return -1;
                if(index1num[i] > index2num[i]) return 1;
            }
            return index1num.length - index2num.length;
        });
        const props = indices.map((index): [string, Linear.PropositionEntry] =>
            [index, env.props.get(index) as Linear.PropositionEntry]);
        const left_props = props.filter(([index, entry]) => entry.direction === "left");
        const right_props = props.filter(([index, entry]) => entry.direction === "right");
        return (
            <span>
                {
                    join_elements(
                        left_props.map(([index, prop]) => this.render_proposition(index, prop)),
                        ", "
                    )
                }
                { " ⊢ " }
                {
                    join_elements(
                        right_props.map(([index, prop]) => this.render_proposition(index, prop)),
                        ", "
                    )
                }
            </span>
        )
    }
    render_proposition(index: string, prop: Linear.PropositionEntry): JSX.Element {
        const { cproof, path, hover_on, pairing_with, hover, act_on_proposition } = this.props;
        const actionability = cproof.actionable_on(index);
        const actionableClass = actionability === "actionable" || actionability === "paired" ? "Sequent-actionable" : "Sequent-inactionable";
        const each_action = actionability === "piecewise" ? (i: number) => {
            act_on_proposition(new PropositionPath(path, index), false, i);
        } : undefined;
        const usageClass = `Sequent-usage-${prop.usage}`;
        const hoverClass =
            hover_on === null ? "Sequent-no-hover" :
            hover_on.is_exact(path, index) ? "Sequent-hover" :
            hover_on.is_parent(path, index) ? "Sequent-parent-hover" : "Sequent-no-hover";
        const pairingClass =
            pairing_with === null ? "Sequent-no-pairing-state" :
            pairing_with.is_exact(path, index) ? "Sequent-pairing-state" : "Sequent-no-pairing-state";
        const handleClick = () => {
            if(actionability === "actionable" || actionability === "paired") {
                act_on_proposition(new PropositionPath(path, index), actionability === "paired", undefined);
            }
        };
        const handleHover = () => {
            hover(new PropositionPath(path, index));
        };
        const handleUnhover = () => {
            hover(null);
        };
        return <span key={index} className={`${actionableClass} ${usageClass} ${hoverClass} ${pairingClass}`} onClick={handleClick} onMouseOver={handleHover} onMouseOut={handleUnhover}><PrettyProposition proposition={prop.prop} each_action={each_action} /></span>;
    }
}

function join_elements(elements: (JSX.Element | string)[], joiner: string): (JSX.Element | string)[] {
    let interleaved: (JSX.Element | string)[] = [];
    for(let element of elements) {
        if(interleaved.length > 0) {
            interleaved.push(joiner);
        }
        interleaved.push(element);
    }
    return interleaved;
}
