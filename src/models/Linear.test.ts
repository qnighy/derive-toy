import { pp_prop, newTensor, newAtomic, newLollipop, Proof, check_proof, Environment } from "./Linear";

it('pretty prints tensor', () => {
    expect(pp_prop(newTensor([newAtomic("A"), newAtomic("B")]))).toBe("A ⊗ B")
})

it('pretty prints one', () => {
    expect(pp_prop(newTensor([]))).toBe("1")
})

it('checks proof', () => {
    const prop = newLollipop(newTensor([newAtomic("A"), newAtomic("B")]), newTensor([newAtomic("B"), newAtomic("A")]));
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
