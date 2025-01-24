import type {Token} from "./lexer.ts";

export type Expression = {
    type: 'literal' | 'binary' | 'unary' | 'assignment' | 'variable',
    value?: string | number | Expression,
    left?: Expression,
    right?: Expression,
    operator?: Token,
};

export type Statement = {
    type: 'expression' | 'print',
    value: Expression,
};

export type Program = {
    type: 'program',
    body: Statement[],
};

export function parse(tokens: Token[]): Program {
    let cmp = 0;
    const statements: Statement[] = [];

    while (cmp < tokens.length) {
        const token = tokens[cmp];
        switch (token.type) {
            case 'print':
                cmp++;
                statements.push({
                    type: 'print',
                    value: expression(),
                });
                break;
            default:
                statements.push({
                    type: 'expression',
                    value: expression(),
                });
        }
    }

    return {
        type: 'program',
        body: statements
    };

    function expression(): Expression {
        return assignmentExpression();
    }

    function termExpression(): Expression {
        let left = factorExpression();
        while (['addition', 'subtraction'].includes(tokens[cmp]?.type)) {
            left = {
                type: 'binary',
                left: left,
                operator: tokens[cmp++],
                right: factorExpression(),
            }
        }
        return left;
    }

    function factorExpression(): Expression {
        let left = unaryExpression();
        while (['multiply', 'divide', 'pow'].includes(tokens[cmp]?.type)) {
            left = {
                type: 'binary',
                left: left,
                operator: tokens[cmp++],
                right: unaryExpression(),
            }
        }
        return left;
    }

    function unaryExpression(): Expression {
        const token = tokens[cmp];
        if (['addition', 'subtraction'].includes(token.type)) {
            return {
                type: 'unary',
                operator: tokens[cmp++],
                left: literalExpression(),
            }
        }
        return literalExpression();
    }

    function literalExpression(): Expression {
        const token = tokens[cmp++];
        if (token.type === 'number') {
            return {
                type: 'literal',
                value: token.value,
            }
        }

        if (token.type === 'identifier') {
            return {
                type: 'variable',
                value: token.value,
            }
        }

        if (token.type === 'parenthesis' && token.value === '(') {
            const expr = expression();
            if (tokens[cmp]?.type === 'parenthesis' && tokens[cmp]?.value !== ')') {
                throw new Error(`) expected`);
            }
            cmp++;
            return expr;
        }

        throw new Error(`Unexpected token ${token.type}`);
    }

    function assignmentExpression(): Expression {
        let left = termExpression();
        if  (tokens[cmp]?.type === 'equal') {
            cmp++;
            left = {
                type: 'assignment',
                left: left,
                right: termExpression(),
            }
        }
        return left;
    }
}