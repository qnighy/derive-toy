import { pp_prop, Propositions, Proof, check_proof, Environment } from "./Linear";

it('pretty prints tensor', () => {
    expect(pp_prop(Propositions.newTensor([Propositions.newAtomic("A"), Propositions.newAtomic("B")]))).toBe("A ⊗ B")
})

it('pretty prints one', () => {
    expect(pp_prop(Propositions.newTensor([]))).toBe("1")
})

it('checks proof', () => {
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
    const cproof = check_proof(env, proof);
})
