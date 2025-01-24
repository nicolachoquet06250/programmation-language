import type {Expression, Program, Statement} from "./parser.ts";

export function interpret(ast: Program): void {
    const variables = new Map<string | number | Expression, number>();

    ast.body.forEach(evalStatement);

    function evalStatement(statement: Statement): void {
        switch (statement.type) {
            case 'print':
                if (typeof process !== 'object') {
                    document.write(evalExpression(statement.value));
                }
                else {
                    console.log(evalExpression(statement.value));
                }
                break;
            case 'expression':
                evalExpression(statement.value);
                break;
            default:
                throw new Error(`Unexpected statement type ${statement.type}`);
        }
    }

    function evalExpression(expr: Expression): any {
        switch (expr.type) {
            case 'literal':
                return expr.value;
            case 'assignment':
                if (expr.left?.type !== 'variable') {
                    throw new Error(`Expected variable or assignment : ${JSON.stringify(expr)}`);
                }
                return variables.set(expr.left!.value!, evalExpression(expr.right!))
            case 'binary':
                return evalBinary(expr);
            case 'unary':
                if (expr.operator?.type === 'subtraction') {
                    return evalExpression(expr.left!) * -1;
                }
                return evalExpression(expr.left!)
            case 'variable':
                return variables.get(expr.value!);
            default:
                throw new Error(`Unexpected expression type ${expr.type}`);
        }
    }

    function evalBinary<T>(expr: Expression): T|undefined {
        switch (expr.operator?.type) {
            case 'addition':
                return (evalExpression(expr.left!) as number) + (evalExpression(expr.right!) as number) as T;
            case 'subtraction':
                return (evalExpression(expr.left!) as number) - (evalExpression(expr.right!) as number) as T;
            case 'multiply':
                return (evalExpression(expr.left!) as number) * (evalExpression(expr.right!) as number) as T;
            case 'divide':
                return (evalExpression(expr.left!) as number) / (evalExpression(expr.right!) as number) as T;
            case 'pow':
                return Math.pow((evalExpression(expr.left!) as number), (evalExpression(expr.right!) as number)) as T;
        }
    }
}