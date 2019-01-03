import * as Propositions from './Linear/Propositions';

export { Propositions };
export type Atomic = Propositions.Atomic;
export type Negation = Propositions.Negation;
export type Lollipop = Propositions.Lollipop;
export type Tensor = Propositions.Tensor;
export type Par = Propositions.Par;
export type With = Propositions.With;
export type Plus = Propositions.Plus;
export type OfCourse = Propositions.OfCourse;
export type WhyNot = Propositions.WhyNot;
export type Proposition = Propositions.Proposition;

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

export interface Axiom {
    readonly kind: "axiom";
    readonly left_index: string;
    readonly right_index: string;
}

export interface NegationLeft {
    readonly kind: "negation_left";
    readonly index: string;
    readonly child: Proof;
}

export interface NegationRight {
    readonly kind: "negation_right";
    readonly index: string;
    readonly child: Proof;
}

export interface LollipopLeft {
    readonly kind: "lollipop_left";
    readonly index: string;
    readonly child_left: Proof;
    readonly child_right: Proof;
}

export interface LollipopRight {
    readonly kind: "lollipop_right";
    readonly index: string;
    readonly child: Proof;
}

export interface TensorLeft {
    readonly kind: "tensor_left";
    readonly index: string;
    readonly child: Proof;
}

export interface TensorRight {
    readonly kind: "tensor_right";
    readonly index: string;
    readonly children: ReadonlyArray<Proof>;
}

export interface ParLeft {
    readonly kind: "par_left";
    readonly index: string;
    readonly children: ReadonlyArray<Proof>;
}

export interface ParRight {
    readonly kind: "par_right";
    readonly index: string;
    readonly child: Proof;
}

export interface WithLeft {
    readonly kind: "with_left";
    readonly index: string;
    readonly option_index: number;
    readonly child: Proof;
}

export interface WithRight {
    readonly kind: "with_right";
    readonly index: string;
    readonly children: ReadonlyArray<Proof>;
}

export interface PlusLeft {
    readonly kind: "plus_left";
    readonly index: string;
    readonly children: ReadonlyArray<Proof>;
}

export interface PlusRight {
    readonly kind: "plus_right";
    readonly index: string;
    readonly option_index: number;
    readonly child: Proof;
}

export interface OfCourseLeftMultiplex {
    readonly kind: "ofcourse_left_multiplex";
    readonly index: string;
    readonly factor: number;
    readonly child: Proof;
}

export interface OfCourseLeftDereliction {
    readonly kind: "ofcourse_left_dereliction";
    readonly index: string;
    readonly child: Proof;
}

export interface OfCourseRight {
    readonly kind: "ofcourse_right";
    readonly index: string;
    readonly child: Proof;
}

export interface WhyNotLeft {
    readonly kind: "whynot_left";
    readonly index: string;
    readonly child: Proof;
}

export interface WhyNotRightMultiplex {
    readonly kind: "whynot_right_multiplex";
    readonly index: string;
    readonly factor: number;
    readonly child: Proof;
}

export interface WhyNotRightDereliction {
    readonly kind: "whynot_right_dereliction";
    readonly index: string;
    readonly child: Proof;
}

export interface Pending {
    readonly kind: "pending";
}

export type Proof =
    Axiom | NegationLeft | NegationRight
    | LollipopLeft | LollipopRight | TensorLeft | TensorRight | ParLeft | ParRight
    | WithLeft | WithRight | PlusLeft | PlusRight
    | OfCourseLeftMultiplex | OfCourseLeftDereliction | OfCourseRight
    | WhyNotLeft | WhyNotRightMultiplex | WhyNotRightDereliction
    | Pending

export class Environment {
    constructor(public readonly props: ReadonlyMap<string, PropositionEntry>) {}
    get_prop(index: string, direction: Direction): Proposition {
        const prop = this.props.get(index);
        if(prop === undefined) {
            throw new ProofCheckException(`proposition not found: ${index}`);
        }
        if(prop.direction !== direction) {
            throw new ProofCheckException(`expected direction ${direction}, got ${prop.direction}`);
        }
        return prop.prop;
    }
    get_usage(index: string): Usage {
        const prop = this.props.get(index);
        if(prop === undefined) {
            throw new ProofCheckException(`proposition not found: ${index}`);
        }
        return prop.usage;
    }
    replace_prop(old_index: string, branches: ReadonlyArray<Readonly<[number, Proposition, boolean]>>, partialize: boolean): Environment {
        const old_prop = this.props.get(old_index);
        if(old_prop === undefined) {
            throw new ProofCheckException(`proposition not found: ${old_index}`);
        }

        let new_props = new Map(this.props);
        new_props.delete(old_index);
        if(partialize) {
            // for(let [index, entry] of new_props) {
            for(let [index, entry] of Array.from(new_props)) {
                if(entry.usage === "full") {
                    new_props.set(index, {
                        prop: entry.prop,
                        usage: "partial",
                        direction: entry.direction,
                    });
                }
            }
        }
        for(let [node, new_prop, reverse] of branches) {
            const new_dir = reverse ? old_prop.direction === "left" ? "right" : "left" : old_prop.direction;
            new_props.set(`${old_index}.${node}`, {
                prop: new_prop,
                usage: "full",
                direction: new_dir,
            });
        }

        return new Environment(new_props);
    }
    update_usage(f: (index: string) => Usage): Environment {
        let new_props = new Map();
        // for(let [index, entry] of this.props) {
        for(let [index, entry] of Array.from(this.props)) {
            new_props.set(index, {
                prop: entry.prop,
                usage: unify_usage(entry.usage, f(index)),
                direction: entry.direction,
            })
        }
        return new Environment(new_props);
    }
    update_usage_from(parent: Environment): Environment {
        return this.update_usage((index) => {
            let prop = parent.props.get(index);
            if(prop === undefined) {
                return "partial";
            } else {
                return prop.usage;
            }
        });
    }
    cleanup(): Environment {
        let props = new Map(this.props);
        for(let [index, entry] of Array.from(props)) {
            if(entry.usage === "none") {
                props.delete(index);
            }
        }
        return new Environment(props);
    }
    static toplevel(prop: Proposition): Environment {
        const entry: PropositionEntry = {
            prop,
            direction: "right",
            usage: "full",
        };
        return new Environment(new Map([['0', entry]]));
    }
}

export class PropositionEntry {
    constructor(
        public readonly prop: Proposition,
        public readonly direction: Direction,
        public readonly usage: Usage = "partial",
    ) {}
}

export type Direction = "left" | "right";

export type Usage = "full" | "partial" | "none";

function unify_usage(usage1: Usage, usage2: Usage): Usage {
    if(usage1 === "partial") return usage2;
    if(usage2 === "partial") return usage1;
    if(usage1 !== usage2) throw new ProofCheckException(`excepted ${usage1}, got ${usage2}`);
    return usage1;
}

function usage_sum(usages: ReadonlyArray<Usage>): Usage {
    let full_found = false;
    let partial_found = false;
    for(let usage of usages) {
        switch(usage) {
            case "full":
                if(full_found) {
                    throw new ProofCheckException("used multiple times");
                }
                full_found = true;
                break;
            case "partial":
                partial_found = true;
                break;
            case "none": break;
            default: exhaustive(usage);
        }
    }
    if(full_found) {
        return "full";
    } else if(partial_found) {
        return "partial";
    } else {
        return "none";
    }
}

export class ProofCheckException implements Error {
    public name = 'ProofCheckException';
    constructor(public message: string) {}
}

export class CheckedProof {
    constructor(
        public readonly env: Environment,
        public readonly proof: Proof,
        public readonly children: ReadonlyArray<CheckedProof>,
    ) { }

    actionable_on(index: string): Actionability {
        if(this.proof.kind !== "pending") return "inactionable";
        const entry = this.env.props.get(index);
        if(entry === undefined) return "inactionable"; // NOTE: just an extra confirmation
        switch(entry.prop.kind) {
            case "atomic": return "paired";
            case "negation":
            case "lollipop":
            case "tensor":
            case "par": {
                return "actionable";
            }
            case "with":
            case "plus": {
                const with_left = entry.prop.kind === "with" && entry.direction === "left";
                const plus_right = entry.prop.kind === "plus" && entry.direction === "right";
                if(with_left || plus_right) {
                    if(entry.prop.children.length === 0) {
                        return "inactionable";
                    } else if(entry.prop.children.length === 1) {
                        return "actionable";
                    } else {
                        return "piecewise";
                    }
                }
                return "actionable";
            }
            case "ofcourse":
            case "whynot": {
                return "inactionable"; // TODO
            }
        }
    }
}

export type Actionability = "actionable" | "paired" | "piecewise" | "inactionable";

export function check_proof(env: Environment, proof: Proof): CheckedProof {
    let p1proof = check_proof_phase1(env, proof);
    return check_proof_phase2(p1proof, p1proof.env);
}

function check_proof_phase1(env: Environment, proof: Proof): CheckedProof {
    switch(proof.kind) {
        case "axiom": {
            const left = env.get_prop(proof.left_index, "left");
            const right = env.get_prop(proof.right_index, "right");
            unify(left, right);
            let new_props = new Map<string, PropositionEntry>();
            // for(let [index, entry] of env.props) {
            for(let [index, entry] of Array.from(env.props)) {
                let new_usage: Usage;
                if(index === proof.left_index || index === proof.right_index) {
                    new_usage = "full";
                } else {
                    new_usage = "none";
                }
                new_usage = unify_usage(entry.usage, new_usage);
                new_props.set(index, {
                    prop: entry.prop,
                    direction: entry.direction,
                    usage: new_usage,
                })
            }
            return new CheckedProof(new Environment(new_props), proof, []);
        }
        case "negation_left":
        case "negation_right": {
            const dir: Direction = proof.kind === "negation_left" ? "left" : "right";
            const target = env.get_prop(proof.index, dir);
            if(target.kind !== "negation") throw new ProofCheckException(`expected negation, got ${target.kind}`);

            const subenv = env.replace_prop(proof.index, [[0, target.child, true]], false);
            const subproof = check_proof_phase1(subenv, proof.child);

            const new_env = env.update_usage((index) => {
                if(index === proof.index) {
                    return "full";
                } else {
                    return subproof.env.get_usage(index);
                }
            });
            return new CheckedProof(new_env, proof, [subproof]);
        }
        case "lollipop_left": {
            const target = env.get_prop(proof.index, "left");
            if(target.kind !== "lollipop") throw new ProofCheckException(`expected lollipop, got ${target.kind}`);

            const subenv0 = env.replace_prop(proof.index, [[0, target.assumption, true]], true);
            const subenv1 = env.replace_prop(proof.index, [[1, target.consequence, false]], true);
            const subproof0 = check_proof_phase1(subenv0, proof.child_left);
            const subproof1 = check_proof_phase1(subenv1, proof.child_right);

            const new_env = env.update_usage((index) => {
                if(index === proof.index) {
                    return "full";
                } else {
                    return usage_sum([subproof0.env.get_usage(index), subproof1.env.get_usage(index)]);
                }
            });
            return new CheckedProof(new_env, proof, [subproof0, subproof1]);
        }
        case "lollipop_right": {
            const target = env.get_prop(proof.index, "right");
            if(target.kind !== "lollipop") throw new ProofCheckException(`expected lollipop, got ${target.kind}`);

            const subenv = env.replace_prop(proof.index, [[0, target.assumption, true], [1, target.consequence, false]], false);
            const subproof = check_proof_phase1(subenv, proof.child);

            const new_env = env.update_usage((index) => {
                if(index === proof.index) {
                    return "full";
                } else {
                    return subproof.env.get_usage(index);
                }
            });
            return new CheckedProof(new_env, proof, [subproof]);
        }
        case "tensor_left":
        case "par_right": {
            let target: Tensor | Par;
            if(proof.kind === "tensor_left") {
                const target_tmp = env.get_prop(proof.index, "left");
                if(target_tmp.kind !== "tensor") throw new ProofCheckException(`expected tensor, got ${target_tmp.kind}`);
                target = target_tmp;
            } else {
                const target_tmp = env.get_prop(proof.index, "right");
                if(target_tmp.kind !== "par") throw new ProofCheckException(`expected par, got ${target_tmp.kind}`);
                target = target_tmp;
            }

            const branches = target.children.map((child, i): [number, Proposition, boolean] => [i, child, false]);
            const subenv = env.replace_prop(proof.index, branches, false);
            const subproof = check_proof_phase1(subenv, proof.child);

            const new_env = env.update_usage((index) => {
                if(index === proof.index) {
                    return "full";
                } else {
                    return subproof.env.get_usage(index);
                }
            });
            return new CheckedProof(new_env, proof, [subproof]);
        }
        case "tensor_right":
        case "par_left": {
            let target: Tensor | Par;
            if(proof.kind === "tensor_right") {
                const target_tmp = env.get_prop(proof.index, "right");
                if(target_tmp.kind !== "tensor") throw new ProofCheckException(`expected tensor, got ${target_tmp.kind}`);
                target = target_tmp;
            } else {
                const target_tmp = env.get_prop(proof.index, "left");
                if(target_tmp.kind !== "par") throw new ProofCheckException(`expected par, got ${target_tmp.kind}`);
                target = target_tmp;
            }

            if(target.children.length != proof.children.length) {
                throw new ProofCheckException(`expected ${target.children.length} branches, got ${proof.children.length}`);
            }

            const subenvs = target.children.map((target_child, i) => {
                return env.replace_prop(proof.index, [[i, target_child, false]], true);
            });
            const subproofs = subenvs.map((subenv, i) => check_proof_phase1(subenv, proof.children[i]));

            const new_env = env.update_usage((index) => {
                if(index === proof.index) {
                    return "full";
                } else {
                    return usage_sum(subproofs.map((subproof) => subproof.env.get_usage(index)));
                }
            });
            return new CheckedProof(new_env, proof, subproofs);
        }
        case "with_left":
        case "plus_right": {
            // TODO
            throw new ProofCheckException("unimplemented: with_left");
        }
        case "with_right":
        case "plus_left": {
            // TODO
            throw new ProofCheckException("unimplemented: with_right");
        }
        case "ofcourse_left_multiplex":
        case "whynot_right_multiplex": {
            // TODO
            throw new ProofCheckException("unimplemented: ofcourse_left_multiplex");
        }
        case "ofcourse_left_dereliction":
        case "whynot_right_dereliction": {
            // TODO
            throw new ProofCheckException("unimplemented: ofcourse_left_dereliction");
        }
        case "ofcourse_right":
        case "whynot_left": {
            // TODO
            throw new ProofCheckException("unimplemented: ofcourse_right");
        }
        case "pending": {
            return new CheckedProof(env, proof, []);
        }
    }
}

function check_proof_phase2(cproof: CheckedProof, parent_env: Environment | null): CheckedProof {
    let { env, proof } = cproof;
    if(parent_env !== null) {
        env = env.update_usage_from(parent_env);
    }
    switch(proof.kind) {
        case "lollipop_left":
        case "tensor_right":
        case "par_left": {
            let subprops: Map<string, PropositionEntry>[] = cproof.children.map((child) => new Map(child.env.props));
            // for(let [index, entry] of env.props) {
            for(const [index, entry] of Array.from(env.props)) {
                if(entry.usage === "none") {
                    for(const subprops_ of subprops) {
                        const subprop = subprops_.get(index);
                        if(subprop === undefined) continue;
                        if(subprop.usage === "partial") {
                            subprops_.set(index, {
                                prop: subprop.prop,
                                direction: subprop.direction,
                                usage: "none",
                            });
                        }
                    }
                    continue;
                }
                const contains_full = subprops.some((subprops_) => {
                    const subprop = subprops_.get(index);
                    if(subprop === undefined) return false;
                    return subprop.usage === "full";
                })
                if(contains_full) {
                    for(const subprops_ of subprops) {
                        const subprop = subprops_.get(index);
                        if(subprop === undefined) continue;
                        if(subprop.usage === "partial") {
                            subprops_.set(index, {
                                prop: subprop.prop,
                                direction: subprop.direction,
                                usage: "none",
                            });
                        }
                    }
                }
            }
            const subproofs = cproof.children.map((child, i) => check_proof_phase2(child, new Environment(subprops[i])));
            return new CheckedProof(env.cleanup(), proof, subproofs);
        }
        case "axiom":
        case "negation_left":
        case "negation_right":
        case "lollipop_right":
        case "tensor_left":
        case "par_right":
        case "with_left":
        case "plus_right":
        case "with_right":
        case "plus_left":
        case "ofcourse_left_multiplex":
        case "whynot_right_multiplex":
        case "ofcourse_left_dereliction":
        case "whynot_right_dereliction":
        case "ofcourse_right":
        case "whynot_left":
        case "pending": {
            const subproofs = cproof.children.map((child) => check_proof_phase2(child, env));
            return new CheckedProof(env.cleanup(), proof, subproofs);
        }
    }
}

function unify(prop1: Proposition, prop2: Proposition) {
    if(prop1.kind != prop2.kind) {
        throw new ProofCheckException(`unify failed: expected kind of ${prop1.kind}, got ${prop2.kind}`);
    }
    switch(prop1.kind) {
        case "atomic":
            prop2 = prop2 as Atomic;
            if(prop1.name != prop2.name) {
                throw new ProofCheckException(`unify failed: expected name of ${prop1.name}, got ${prop2.name}`);
            }
            break;
        case "negation":
            prop2 = prop2 as Negation;
            unify(prop1.child, prop2.child);
            break;
        case "lollipop":
            prop2 = prop2 as Lollipop;
            unify(prop1.assumption, prop2.assumption);
            unify(prop1.consequence, prop2.consequence);
            break;
        case "tensor":
        case "par":
        case "with":
        case "plus":
            prop2 = prop2 as Tensor | Par | With | Plus;
            if(prop1.children.length != prop2.children.length) {
                throw new ProofCheckException(`unify failed: expected arity of ${prop1.children.length}, got ${prop2.children.length}`);
            }
            for(let i = 0; i < prop1.children.length; i++) {
                unify(prop1.children[i], prop2.children[i]);
            }
            break;
        case "ofcourse":
        case "whynot":
            prop2 = prop2 as OfCourse | WhyNot;
            unify(prop1.child, prop2.child);
            break;
        default:
            exhaustive(prop1);
    }
}

function exhaustive(x: never): never {
    return x;
}

export function example(): CheckedProof {
    const prop = Propositions.newLollipop(
        Propositions.newTensor([
            Propositions.newAtomic("A"),
            Propositions.newAtomic("B"),
        ]),
        Propositions.newTensor([
            Propositions.newAtomic("B"),
            Propositions.newAtomic("A"),
        ]),
    );
    const proof: Proof = {
        kind: "lollipop_right",
        index: '0',
        child: {
            kind: "tensor_left",
            index: '0.0',
            child: {
                kind: "tensor_right",
                index: '0.1',
                children: [
                    {
                        kind: "axiom",
                        left_index: '0.0.1',
                        right_index: '0.1.0',
                    },
                    {
                        kind: "axiom",
                        left_index: '0.0.0',
                        right_index: '0.1.1',
                    },
                ],
            },
        },
    };
    const env: Environment = Environment.toplevel(prop);
    return check_proof(env, proof);
}

export function closeTree(tree: Proof, path: ReadonlyArray<number>, path_index: number = 0): Proof {
    if(path_index >= path.length) {
        return {
            kind: "pending",
        };
    }
    const path_comp = path[path_index];
    switch(tree.kind) {
        case "axiom":
        case "pending": {
            return tree;
        }
        case "negation_left":
        case "negation_right":
        case "lollipop_right":
        case "tensor_left":
        case "par_right":
        case "with_left":
        case "plus_right":
        case "ofcourse_left_multiplex":
        case "whynot_right_multiplex":
        case "ofcourse_left_dereliction":
        case "whynot_right_dereliction":
        case "ofcourse_right":
        case "whynot_left": {
            if(path_comp >= 1) {
                return tree;
            }
            return {
                ...tree,
                child: closeTree(tree.child, path, path_index + 1),
            };
        }
        case "lollipop_left": {
            if(path_comp >= 2) {
                return tree;
            }
            let new_tree = Object.assign({}, tree);
            if(path_comp === 0) {
                return {
                    ...tree,
                    child_left: closeTree(new_tree.child_left, path, path_index + 1),
                }
            } else {
                return {
                    ...tree,
                    child_right: closeTree(new_tree.child_right, path, path_index + 1),
                }
            }
        }
        case "tensor_right":
        case "par_left":
        case "with_right":
        case "plus_left": {
            if(path_comp >= tree.children.length) {
                return tree;
            }
            const new_children = Array.from(tree.children);
            new_children[path_comp] = closeTree(tree.children[path_comp], path, path_index + 1);
            return {
                ...tree,
                children: new_children,
            }
        }
    }
}

export function actOnProposition(
    cproof: CheckedProof, path: ReadonlyArray<number>, index: string,
    pairing_index: string | null,
    option: number | undefined, path_index: number = 0): Proof {
    if(path_index >= path.length) {
        return actOnPropositionInner(cproof, index, pairing_index, option);
    }
    const path_comp = path[path_index];
    if(path_comp >= cproof.children.length) {
        return cproof.proof;
    }
    const subproof = cproof.children[path_comp];
    const { proof: tree } = cproof;
    switch(tree.kind) {
        case "axiom":
        case "pending": {
            return tree;
        }
        case "negation_left":
        case "negation_right":
        case "lollipop_right":
        case "tensor_left":
        case "par_right":
        case "with_left":
        case "plus_right":
        case "ofcourse_left_multiplex":
        case "whynot_right_multiplex":
        case "ofcourse_left_dereliction":
        case "whynot_right_dereliction":
        case "ofcourse_right":
        case "whynot_left": {
            if(path_comp >= 1) {
                return tree;
            }
            return {
                ...tree,
                child: actOnProposition(subproof, path, index, pairing_index, option, path_index + 1),
            }
        }
        case "lollipop_left": {
            if(path_comp >= 2) {
                return tree;
            }
            let new_tree = Object.assign({}, tree);
            if(path_comp === 0) {
                return {
                    ...tree,
                    child_left: actOnProposition(subproof, path, index, pairing_index, option, path_index + 1),
                }
            } else {
                return {
                    ...tree,
                    child_right: actOnProposition(subproof, path, index, pairing_index, option, path_index + 1),
                }
            }
        }
        case "tensor_right":
        case "par_left":
        case "with_right":
        case "plus_left": {
            if(path_comp >= tree.children.length) {
                return tree;
            }
            const new_children = Array.from(tree.children);
            new_children[path_comp] = actOnProposition(subproof, path, index, pairing_index, option, path_index + 1);
            return {
                ...tree,
                children: new_children,
            };
        }
    }
}

function actOnPropositionInner(
    cproof: CheckedProof, index: string, pairing_index: string | null, option: number | undefined): Proof {
    if(cproof.proof.kind !== "pending") return cproof.proof;
    const entry = cproof.env.props.get(index);
    if(entry === undefined) return cproof.proof; // NOTE: just an extra confirmation
    const pending: Pending = { kind: "pending" };
    switch(entry.prop.kind) {
        case "atomic": {
            if(pairing_index === null) return cproof.proof; // NOTE: just an extra confirmation
            const pairing_entry = cproof.env.props.get(pairing_index);
            if(pairing_entry === undefined) return cproof.proof; // NOTE: just an extra confirmation
            let unify_success: boolean = false;
            try {
                unify(entry.prop, pairing_entry.prop);
                unify_success = true;
            } catch(e) {
                if(e instanceof ProofCheckException) {}
                else throw e;
            }
            if(!unify_success) return cproof.proof;
            let has_full_usage: boolean = false;
            // for(let [index, entry] of cproof.env.props) {
            for(let [eindex, entry] of Array.from(cproof.env.props)) {
                if(eindex !== index && eindex !== pairing_index && entry.usage === "full") {
                    has_full_usage = true;
                }
            }
            if(has_full_usage) return cproof.proof;
            if(entry.direction === "left" && pairing_entry.direction === "right") {
                return { kind: "axiom", left_index: index, right_index: pairing_index };
            } else if(entry.direction === "right" && pairing_entry.direction === "left") {
                return { kind: "axiom", left_index: pairing_index, right_index: index };
            } else {
                return cproof.proof;
            }
        }
        case "negation": {
            if(entry.direction === "left") {
                return { kind: "negation_left", index, child: pending };
            } else {
                return { kind: "negation_left", index, child: pending };
            }
        }
        case "lollipop": {
            if(entry.direction === "left") {
                return { kind: "lollipop_left", index, child_left: pending, child_right: pending };
            } else {
                return { kind: "lollipop_right", index, child: pending };
            }
        }
        case "tensor": {
            if(entry.direction === "left") {
                return { kind: "tensor_left", index, child: pending };
            } else {
                return { kind: "tensor_right", index, children: entry.prop.children.map(() => pending) };
            }
        }
        case "par": {
            if(entry.direction === "left") {
                return { kind: "par_left", index, children: entry.prop.children.map(() => pending) };
            } else {
                return { kind: "par_right", index, child: pending };
            }
        }
        case "with": {
            if(entry.direction === "left") {
                const option_index = option === undefined ? 0 : option;
                return { kind: "with_left", index, child: pending, option_index };
            } else {
                return { kind: "with_right", index, children: entry.prop.children.map(() => pending) };
            }
        }
        case "plus": {
            if(entry.direction === "left") {
                return { kind: "plus_left", index, children: entry.prop.children.map(() => pending) };
            } else {
                const option_index = option === undefined ? 0 : option;
                return { kind: "plus_right", index, child: pending, option_index };
            }
        }
        case "ofcourse":
        case "whynot": {
            // TODO
            return cproof.proof;
        }
    }
}