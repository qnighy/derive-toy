import * as React from "react";
import * as Linear from "../../models/Linear";
import { PrettyProposition } from "../PrettyProposition/PrettyProposition";

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
        const left_props = props.filter(([index, entry]) => entry.direction === "left").map(([index, entry]): [string, Linear.Proposition] => [index, entry.prop]);
        const right_props = props.filter(([index, entry]) => entry.direction === "right").map(([index, entry]): [string, Linear.Proposition] => [index, entry.prop]);
        return (
            <span>
                {
                    join_elements(
                        left_props.map(([index, prop]) => <PrettyProposition key={index} proposition={prop} />),
                        ", "
                    )
                }
                ⊢
                {
                    join_elements(
                        right_props.map(([index, prop]) => <PrettyProposition key={index} proposition={prop} />),
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
