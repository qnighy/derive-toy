import { pp_prop, newTensor, newAtomic } from "./Linear";

it('pretty prints tensor', () => {
    expect(pp_prop(newTensor([newAtomic("A"), newAtomic("B")]))).toBe("A ⊗ B")
})

it('pretty prints one', () => {
    expect(pp_prop(newTensor([]))).toBe("1")
})