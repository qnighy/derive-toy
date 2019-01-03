import * as React from "react";
import * as Linear from "../../models/Linear";
import { PrettyProposition } from "../PrettyProposition/PrettyProposition";
import './Sequent.css'

interface Props {
    cproof: Linear.CheckedProof;
    path: number[];
    hover_on: PropositionPath | null;
    hover: (path: PropositionPath | null) => void,
}

export class PropositionPath {
    constructor(public readonly path: number[], public readonly index: string) {}
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
        const { cproof, path, hover_on, hover } = this.props;
        const actionability = cproof.actionable_on(index);
        const actionableClass = actionability === "actionable" || actionability === "paired" ? "Sequent-actionable" : "Sequent-inactionable";
        const each_action = actionability === "piecewise" ? (i: number) => {} : undefined; // TODO
        const usageClass = `Sequent-usage-${prop.usage}`;
        const hoverClass =
            hover_on === null ? "Sequent-no-hover" :
            hover_on.is_exact(path, index) ? "Sequent-hover" :
            hover_on.is_parent(path, index) ? "Sequent-parent-hover" : "Sequent-no-hover";
        const handleHover = () => {
            hover(new PropositionPath(path, index));
        };
        const handleUnhover = () => {
            hover(null);
        };
        return <span key={index} className={`${actionableClass} ${usageClass} ${hoverClass}`} onMouseOver={handleHover} onMouseOut={handleUnhover}><PrettyProposition proposition={prop.prop} each_action={each_action} /></span>;
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
