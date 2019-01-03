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
