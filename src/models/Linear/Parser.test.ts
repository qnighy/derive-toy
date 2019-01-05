import { tokenize } from "./Parser";

it('tokenizes idents', () => {
    const tokens = tokenize("A Bar \r\n Closure");
    expect(tokens.length).toBe(3)
})

it('tokenizes symbols', () => {
    const tokens = tokenize("A )(B \r\n C⊗");
    expect(tokens.length).toBe(6)
})
