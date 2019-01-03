import {
    Tensor, Par, With, Plus,
    Proposition,
} from './Propositions';

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
                return p.children.map((child) => pp_prop_level(child, lv - 1)).join(` ${binary_op(p)} `);
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