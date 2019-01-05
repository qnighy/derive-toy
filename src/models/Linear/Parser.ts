import { Proposition } from "./Propositions";

class ParseError implements Error {
    public readonly name = "";
    constructor(public readonly message: string) {}
}

type TokenKind = "eof" | "ident" | "(" | ")" | "¬" | "⊸" | "⊗" | "1" | "⅋" | "⊥" | "&" | "⊤" | "⊕" | "0" | "!" | "?";

class Token {
    constructor(
        public readonly kind: TokenKind,
        public readonly repr: string,
        public readonly span: Span,
    ) {}
}

class Span {
    constructor(
        public readonly start: Position,
        public readonly end: Position,
    ) {}
    toString(): string {
        if(this.start.line === this.end.line && (this.start.column + 1 === this.end.column || this.start.column === this.end.column)) {
            return `line ${this.start.line + 1}, column ${this.start.column + 1}`;
        } else if(this.start.line === this.end.line) {
            return `line ${this.start.line + 1}, column ${this.start.column + 1}-${this.end.column}`;
        } else {
            return `line ${this.start.line + 1}, column ${this.start.column + 1} - line ${this.end.line}, column ${this.end.column}`;
        }
    }
}

class Position {
    constructor(
        public readonly u16pos: number,
        public readonly upos: number,
        public readonly line: number,
        public readonly column: number,
    ) {}
    toString(): string {
        return `line ${this.line + 1}, column ${this.column + 1}`;
    }
}

class CharReader {
    public u16pos: number = 0;
    public upos: number = 0;
    public line: number = 0;
    public column: number = 0;
    constructor(public readonly s: string) {}
    position(): Position {
        return new Position(this.u16pos, this.upos, this.line, this.column);
    }
    from_span(start: Position, end: Position): string {
        return this.s.substring(start.u16pos, end.u16pos);
    }
    peek(): string | null {
        if(this.u16pos >= this.s.length) return null;
        const u16ch = this.s.charCodeAt(this.u16pos);
        if(0xD800 <= u16ch && u16ch < 0xDC00) {
            return this.s.substr(this.u16pos, 2);
        }
        return this.s.substr(this.u16pos, 1);
    }
    next(): string | null {
        if(this.u16pos >= this.s.length) return null;
        const u16ch = this.s.charCodeAt(this.u16pos);
        if(0xD800 <= u16ch && u16ch < 0xDC00) {
            this.u16pos += 2;
            this.upos++;
            this.column++;
            return this.s.substr(this.u16pos, 2);
        }
        this.u16pos++;
        this.upos++;
        this.column++;
        if(u16ch === 0x0A) {
            this.line++;
            this.column = 0;
        }
        return this.s.substr(this.u16pos, 1);
    }
}

export function tokenize(s: string): ReadonlyArray<Token> {
    const reader = new CharReader(s);
    const tokens: Token[] = [];
    while(true) {
        while(is_white_space(reader.peek())) reader.next();
        const ch = reader.peek();
        if(ch === null) {
            tokens.push(new Token("eof", "", new Span(reader.position(), reader.position())));
            return tokens;
        }
        const start = reader.position();
        if(is_xid_start(ch)) {
            while(is_xid_continue(reader.peek())) reader.next();
            const end = reader.position();
            tokens.push(new Token("ident", reader.from_span(start, end), new Span(start, end)));
        } else if(/^[()¬⊸⊗1⅋⊥&⊤⊕0!?]$/.test(ch)) {
            reader.next();
            const end = reader.position();
            tokens.push(new Token(ch as TokenKind, reader.from_span(start, end), new Span(start, end)));
        } else {
            throw new ParseError(`Parse Error at ${start}: invalid character: ${ch}`);
        }
    }
}

const WHITE_SPACE_REGEXP = function() {
    try {
        return new RegExp('^\\p{Pattern_White_Space}$', 'u');
    } catch(e) {
        return /^[\r\n \t]$/;
    }
}();

const XID_START_REGEXP = function() {
    try {
        return new RegExp('^\\p{XID_Start}$', 'u');
    } catch(e) {
        return /^[a-zA-Z]$/;
    }
}();

const XID_CONTINUE_REGEXP = function() {
    try {
        return new RegExp('^\\p{XID_Continue}$', 'u');
    } catch(e) {
        return /^[a-zA-Z0-9]$/;
    }
}();

function is_white_space(ch: string | null): boolean {
    return ch !== null && WHITE_SPACE_REGEXP.test(ch);
}

function is_xid_start(ch: string | null): boolean {
    return ch !== null && XID_START_REGEXP.test(ch);
}

function is_xid_continue(ch: string | null): boolean {
    return ch !== null && XID_CONTINUE_REGEXP.test(ch);
}

export function parse(s: string): Proposition {
    const tokens = tokenize(s);
    const parser = new Parser(tokens);
    return parser.parse_toplevel();
}

class Parser {
    public index: number = 0;
    public expectations: Set<TokenKind> = new Set();
    constructor(public readonly tokens: ReadonlyArray<Token>) {}
    next(): Token {
        const token = this.tokens[this.index] as Token;
        if(token.kind !== "eof") {
            this.index++;
            this.expectations.clear();
        }
        return token;
    }
    peek_kind(): TokenKind {
        const token = this.tokens[this.index] as Token;
        return token.kind;
    }
    expect(kind: TokenKind): boolean {
        if(this.peek_kind() === kind) {
            return true;
        } else {
            this.expectations.add(kind);
            return false;
        }
    }
    error(): never {
        const token = this.tokens[this.index] as Token;
        const expectations = Array.from(this.expectations.values());
        let expectation = "";
        if(expectations.length == 0) {
            expectation = "nothing";
        } else if(expectations.length == 1) {
            expectation = expectations[0];
        } else {
            const last_expectation = expectations.pop();
            expectation = `[${expectations.join(", ")} or ${last_expectation}]`;
        }
        throw new ParseError(`Parse Error at ${token.span}: expected ${expectation}, got ${token.kind}`);
    }
    parse_toplevel(): Proposition {
        const prop = this.parse_implicational();
        this.parse_eof();
        return prop;
    }
    parse_eof() {
        if(!this.expect("eof")) this.error();
    }

    parse_implicational(): Proposition {
        const prop = this.parse_additive();
        if(this.expect("⊸")) {
            this.next();
            return {
                kind: "lollipop",
                assumption: prop,
                consequence: this.parse_implicational(),
            }
        } else {
            return prop;
        }
    }

    parse_additive(): Proposition {
        const prop = this.parse_multiplicative();
        if(this.expect("&")) {
            const children: Proposition[] = [prop];
            while(this.expect("&")) {
                this.next();
                children.push(this.parse_multiplicative());
            }
            return { kind: "with", children };
        } else if(this.expect("⊕")) {
            const children: Proposition[] = [prop];
            while(this.expect("⊕")) {
                this.next();
                children.push(this.parse_multiplicative());
            }
            return { kind: "plus", children };
        } else {
            return prop;
        }
    }

    parse_multiplicative(): Proposition {
        const prop = this.parse_exponential();
        if(this.expect("⊗")) {
            const children: Proposition[] = [prop];
            while(this.expect("⊗")) {
                this.next();
                children.push(this.parse_exponential());
            }
            return { kind: "tensor", children };
        } else if(this.expect("⅋")) {
            const children: Proposition[] = [prop];
            while(this.expect("⅋")) {
                this.next();
                children.push(this.parse_exponential());
            }
            return { kind: "par", children };
        } else {
            return prop;
        }
    }

    parse_exponential(): Proposition {
        if(this.expect("!")) {
            this.next();
            return {
                kind: "ofcourse",
                child: this.parse_exponential(),
            };
        } else if(this.expect("?")) {
            this.next();
            return {
                kind: "whynot",
                child: this.parse_exponential(),
            };
        } else if(this.expect("¬")) {
            this.next();
            return {
                kind: "negation",
                child: this.parse_exponential(),
            };
        } else {
            return this.parse_atomic();
        }
    }

    parse_atomic(): Proposition {
        if(this.expect("ident")) {
            return {
                kind: "atomic",
                name: (this.next() as Token).repr,
            };
        } else if(this.expect("(")) {
            this.next();
            const prop = this.parse_implicational();
            if(!this.expect(")")) {
                return this.error();
            }
            this.next();
            return prop;
        } else if(this.expect("1")) {
            this.next();
            return { kind: "tensor", children: [] };
        } else if(this.expect("⊥")) {
            this.next();
            return { kind: "par", children: [] };
        } else if(this.expect("⊤")) {
            this.next();
            return { kind: "with", children: [] };
        } else if(this.expect("0")) {
            this.next();
            return { kind: "plus", children: [] };
        } else {
            return this.error();
        }
    }
}
