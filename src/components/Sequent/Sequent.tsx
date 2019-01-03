import * as React from "react";
import * as Linear from "../../models/Linear";
import { PrettyProposition } from "../PrettyProposition/PrettyProposition";
import './Sequent.css'

interface Props {
    env: Linear.Environment;
}

export class Sequent extends React.Component<Props, {}> {
    render() {
        const { env } = this.props;
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
                        left_props.map(([index, prop]) => {
                            const usageClass = `Sequent-usage-${prop.usage}`;
                            return <span key={index} className={`${usageClass}`}><PrettyProposition proposition={prop.prop} /></span>;
                        }),
                        ", "
                    )
                }
                { " ⊢ " }
                {
                    join_elements(
                        right_props.map(([index, prop]) => {
                            const usageClass = `Sequent-usage-${prop.usage}`;
                            return <span key={index} className={`${usageClass}`}><PrettyProposition proposition={prop.prop} /></span>;
                        }),
                        ", "
                    )
                }
            </span>
        )
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
