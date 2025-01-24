export type Token = {
    type: 'addition' | 'subtraction' | 'multiply' |
        'divide' | 'pow' | 'number' | 'parenthesis' |
        'equal' | 'identifier' | 'print'
    value: string | number
    line: number
    column: number
}

export function lex(program: string|TemplateStringsArray): Token[] {
    let cmp = 0;
    let line = 1;
    let column = 1;
    const tokens: Token[] = [];

    const p = typeof program === 'string' ? program : program[0];

    function number() {
        const start = cmp - 1;
        while (isDigit(p[cmp])) {
            cmp++;
            column++;
        }

        if (p[cmp] === '.' && isDigit(p[cmp + 1])) {
            cmp++;
            column++;
            while (isDigit(p[cmp])) {
                cmp++;
                column++;
            }
        }

        tokens.push({
            type: 'number',
            value: parseFloat(p.slice(start, cmp)),
            line,
            column
        })
    }

    function letter() {
        const start = cmp - 1;
        while (isLetter(p[cmp]) || isDigit(p[cmp])) {
            cmp++;
            column++;
        }

        const identifier = p.slice(start, cmp);

        if (identifier === 'print') {
            tokens.push({
                type: 'print',
                value: identifier,
                line, column
            });
            return;
        }

        tokens.push({
            type: 'identifier',
            value: identifier,
            line, column
        });
    }

    while (cmp < p.length) {
        if (p[cmp] === '\n') {
            line++;
            column = 1;
        }
        else column++;

        const c = p[cmp++];

        switch (c) {
            case ' ':
            case '\o':
            case '\n':
            case '\r':
            case '\t':
                break;
            case '+':
                tokens.push({
                    type: 'addition',
                    value: c,
                    line,
                    column
                });
                break;
            case '-':
                tokens.push({
                    type: 'subtraction',
                    value: c,
                    line,
                    column
                });
                break;
            case '*':
                tokens.push({
                    type: 'multiply',
                    value: c,
                    line,
                    column
                });
                break;
            case '/':
                tokens.push({
                    type: 'divide',
                    value: c,
                    line,
                    column
                });
                break;
            case '^':
                tokens.push({
                    type: 'pow',
                    value: c,
                    line,
                    column
                });
                break;
            case ')':
            case '(':
                tokens.push({
                    type: 'parenthesis',
                    value: c,
                    line,
                    column
                });
                break;
            case '=':
                tokens.push({
                    type: 'equal',
                    value: c,
                    line,
                    column
                });
                break;
            default:
                if (isDigit(c)) {
                    number();
                    break;
                }
                if (isLetter(c)) {
                    letter();
                    break;
                }
                throw new Error('unexpected token ' + c);
        }
    }

    return tokens;
}

const isDigit = (c: string)=> c >= '0' && c <= '9';

const isLetter = (c: string)=> c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '_';