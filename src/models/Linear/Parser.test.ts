import { tokenize, parse } from "./Parser";

it('tokenizes idents', () => {
    const tokens = tokenize("A Bar \r\n Closure");
    expect(tokens.length).toBe(4)
})

it('tokenizes symbols', () => {
    const tokens = tokenize("A )(B \r\n C⊗");
    expect(tokens.length).toBe(7)
})

it('parses (1)', () => {
    parse("Foo");
    parse("0");
    parse("1");
    parse("⊥");
    parse("⊤");
})

it('parses (2)', () => {
    parse("!?¬Foo");
    parse("¬Foo");
})

it('parses (3)', () => {
    parse("!(?¬Foo)");
    parse("(¬Foo)");
})

it('parses', () => {
    parse("(A ⊸ B)⊗ !A ⊗ ¬!¬Foo");
})
