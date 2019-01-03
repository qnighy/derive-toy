import * as React from "react";
import * as Linear from "../../models/Linear";

interface Props {
    readonly proposition: Linear.Proposition,
    readonly level?: Level,
    readonly strict?: boolean,
    readonly each_action?: (i: number) => void,
}

type Level = "atomic" | "negation" | "modal" | "multiplicative" | "additive" | "implicational";

let level_max: Level = "implicational";

export class PrettyProposition extends React.Component<Props, {}> {
    render() {
        const { proposition: p, level = level_max, strict = false, each_action } = this.props;

        const actionableClass = each_action !== undefined ? "PrettyProposition-actionable" : "PrettyProposition-inactionable";

        const level_of_p = level_of(p);
        const parenless = level_le(level_of_p, level) && (!strict || level_of_p != level);
        const opener = parenless ? "" : "(";
        const closer = parenless ? "" : ")";
        switch(p.kind) {
            case "atomic": return <span>{opener}{p.name}{closer}</span>;
            case "negation": {
                return <span>{opener}
                    <PrettyProposition proposition={p.child} level={level_of_p} /><sup>⊥</sup>
                {closer}</span>;
            }
            case "lollipop": {
                return <span>{opener}
                    <PrettyProposition proposition={p.assumption} level={level_of_p} strict={true} />
                    { " ⊸ " }
                    <PrettyProposition proposition={p.consequence} level={level_of_p} />
                {closer}</span>;
            }
            case "tensor":
            case "par":
            case "with":
            case "plus": {
                if(p.children.length == 0) {
                    return <span>{opener}{zeroary_op(p)}{closer}</span>;
                } else if(p.children.length == 1) {
                    return <span>{opener}
                        {p.kind}1(<PrettyProposition proposition={p.children[0]} />)
                    {closer}</span>;
                } else {
                    const op = ` ${binary_op(p)} `;
                    return <span>{opener}
                        {
                            join_elements(p.children.map((child, i) => {
                                let action = undefined;
                                if(each_action !== undefined) {
                                    action = () => each_action(i);
                                }
                                return <span key={ `child${i}` } className={ `${actionableClass}` } onClick={action}>
                                    <PrettyProposition proposition={child} level={level_of_p} strict={true} />
                                </span>;
                            }), op)
                        }
                    {closer}</span>;
                }
            }
            case "ofcourse":
            case "whynot": {
                return <span>{opener}
                    {unary_op(p)}<PrettyProposition proposition={p.child} level={level_of_p} />
                {closer}</span>;
            }
        }
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

function zeroary_op(p: Linear.Tensor | Linear.Par | Linear.With | Linear.Plus): string {
    switch(p.kind) {
        case "tensor": return "1";
        case "par": return "⊥";
        case "with": return "⊤";
        case "plus": return "0";
    }
}

function unary_op(p: Linear.OfCourse | Linear.WhyNot): string {
    switch(p.kind) {
        case "ofcourse": return "!";
        case "whynot": return "?";
    }
}

function binary_op(p: Linear.Tensor | Linear.Par | Linear.With | Linear.Plus): string {
    switch(p.kind) {
        case "tensor": return "⊗";
        case "par": return "⅋";
        case "with": return "&";
        case "plus": return "⊕";
    }
}

function level_le(lv1: Level, lv2: Level): boolean {
    switch(lv1) {
        case "atomic": return true;
        case "negation": return lv2 === "negation" || lv2 === "multiplicative" || lv2 === "additive" || lv2 === "implicational";
        case "modal": return lv2 === "modal" || lv2 === "multiplicative" || lv2 === "additive" || lv2 === "implicational";
        case "multiplicative": return lv2 === "multiplicative" || lv2 === "additive" || lv2 === "implicational";
        case "additive": return lv2 === "additive" || lv2 === "implicational";
        case "implicational": return lv2 === "implicational";
    }
}

function level_of(p: Linear.Proposition): Level {
    switch(p.kind) {
        case "atomic": return "atomic";
        case "negation": return "negation";
        case "lollipop": return "implicational";
        case "tensor":
        case "par":
            if(p.children.length <= 1) {
                return "atomic";
            } else {
                return "multiplicative";
            }
        case "with":
        case "plus":
            if(p.children.length <= 1) {
                return "atomic";
            } else {
                return "additive";
            }
        case "ofcourse": return "modal";
        case "whynot": return "modal";
    }
}
