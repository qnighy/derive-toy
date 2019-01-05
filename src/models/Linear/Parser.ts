import { Proposition } from "./Propositions";

class ParseError implements Error {
    public readonly name = "";
    constructor(public readonly message: string) {}
}

type TokenKind = "ident" | "(" | ")" | "¬" | "⊸" | "⊗" | "1" | "⅋" | "⊥" | "&" | "⊤" | "⊕" | "0" | "!" | "?";

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
        if(ch === null) return tokens;
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
    throw new ParseError("not implemented");
}
