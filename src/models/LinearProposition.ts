import { func } from "prop-types";

export interface Atomic {
    kind: "atomic";
    name: string;
}

export interface Negation {
    kind: "negation";
    child: Proposition;
}

export interface Lollipop {
    kind: "lollipop";
    assumption: Proposition;
    consequence: Proposition;
}

export interface Tensor {
    kind: "tensor";
    children: Proposition[];
}

export interface Par {
    kind: "par";
    children: Proposition[];
}

export interface With {
    kind: "with";
    children: Proposition[];
}

export interface Plus {
    kind: "plus";
    children: Proposition[];
}

export interface OfCourse {
    kind: "ofcourse";
    child: Proposition;
}

export interface WhyNot {
    kind: "whynot";
    child: Proposition;
}

export type Proposition = Atomic | Negation | Lollipop | Tensor | Par | With | Plus | OfCourse | WhyNot;

export function newAtomic(name: string): Atomic {
    return { kind: "atomic", name }
}

export function newNegation(child: Proposition): Negation {
    return { kind: "negation", child }
}

export function newLollipo(assumption: Proposition, consequence: Proposition): Lollipop {
    return { kind: "lollipop", assumption, consequence }
}

export function newTensor(children: Proposition[]): Tensor {
    return { kind: "tensor", children }
}

export function newPar(children: Proposition[]): Par {
    return { kind: "par", children }
}

export function newWith(children: Proposition[]): With {
    return { kind: "with", children }
}

export function newPlus(children: Proposition[]): Plus {
    return { kind: "plus", children }
}

export function newOfCourse(child: Proposition): OfCourse {
    return { kind: "ofcourse", child }
}

export function newWhyNot(child: Proposition): WhyNot {
    return { kind: "whynot", child }
}

export function pp_prop(p: Proposition): string {
    const lv = prop_level(p);
    switch(p.kind) {
        case "atomic": return p.name;
        case "negation": return `¬${pp_prop_level(p.child, lv)}`;
        case "lollipop": return `${pp_prop_level(p.assumption, lv - 1)} ⊸ ${pp_prop_level(p.consequence, lv)}`;
        case "tensor":
        case "par":
        case "with":
        case "plus":
            if(p.children.length == 0) {
                return zeroary_op(p);
            } else if(p.children.length == 1) {
                return `${p.kind}1(${pp_prop(p.children[0])})`;
            } else {
                return p.children.map((child) => pp_prop_level(child, lv)).join(` ${binary_op(p)} `);
            }
        case "ofcourse": return `!${pp_prop_level(p.child, lv)}`;
        case "whynot": return `?${pp_prop_level(p.child, lv)}`;
    }
}

function pp_prop_level(p: Proposition, level: number): string {
    const pp = pp_prop(p);
    if(prop_level(p) > level) {
        return `(${pp})`;
    } else {
        return pp;
    }
}

function zeroary_op(p: Tensor | Par | With | Plus): string {
    switch(p.kind) {
        case "tensor": return "1";
        case "par": return "⊥";
        case "with": return "⊤";
        case "plus": return "0";
    }
}

function binary_op(p: Tensor | Par | With | Plus): string {
    switch(p.kind) {
        case "tensor": return "⊗";
        case "par": return "⅋";
        case "with": return "&";
        case "plus": return "⊕";
    }
}

function prop_level(p: Proposition): number {
    switch(p.kind) {
        case "atomic": return 0;
        case "negation": return 1;
        case "lollipop": return 5;
        case "tensor":
        case "par":
            if(p.children.length <= 1) {
                return 0;
            } else {
                return 3;
            }
        case "with":
        case "plus":
            if(p.children.length <= 1) {
                return 0;
            } else {
                return 4;
            }
        case "ofcourse": return 2;
        case "whynot": return 2;
    }
}