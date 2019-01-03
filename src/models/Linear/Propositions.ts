export interface Atomic {
    readonly kind: "atomic";
    readonly name: string;
}

export interface Negation {
    readonly kind: "negation";
    readonly child: Proposition;
}

export interface Lollipop {
    readonly kind: "lollipop";
    readonly assumption: Proposition;
    readonly consequence: Proposition;
}

export interface Tensor {
    readonly kind: "tensor";
    readonly children: ReadonlyArray<Proposition>;
}

export interface Par {
    readonly kind: "par";
    readonly children: ReadonlyArray<Proposition>;
}

export interface With {
    readonly kind: "with";
    readonly children: ReadonlyArray<Proposition>;
}

export interface Plus {
    readonly kind: "plus";
    readonly children: ReadonlyArray<Proposition>;
}

export interface OfCourse {
    readonly kind: "ofcourse";
    readonly child: Proposition;
}

export interface WhyNot {
    readonly kind: "whynot";
    readonly child: Proposition;
}

export type Proposition = Atomic | Negation | Lollipop | Tensor | Par | With | Plus | OfCourse | WhyNot;

export function newAtomic(name: string): Atomic {
    return { kind: "atomic", name }
}

export function newNegation(child: Proposition): Negation {
    return { kind: "negation", child }
}

export function newLollipop(assumption: Proposition, consequence: Proposition): Lollipop {
    return { kind: "lollipop", assumption, consequence }
}

export function newTensor(children: ReadonlyArray<Proposition>): Tensor {
    return { kind: "tensor", children }
}

export function newPar(children: ReadonlyArray<Proposition>): Par {
    return { kind: "par", children }
}

export function newWith(children: ReadonlyArray<Proposition>): With {
    return { kind: "with", children }
}

export function newPlus(children: ReadonlyArray<Proposition>): Plus {
    return { kind: "plus", children }
}

export function newOfCourse(child: Proposition): OfCourse {
    return { kind: "ofcourse", child }
}

export function newWhyNot(child: Proposition): WhyNot {
    return { kind: "whynot", child }
}