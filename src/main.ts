import {lex} from "./lib/lexer.ts";
import {parse} from "./lib/parser.ts";
import {interpret} from "./lib/interpreter.ts";
import fs from 'node:fs';

try {
    if (process.argv.length >= 2) {
        if (!fs.readFileSync(process.argv[process.argv.length - 1])) {
            throw new Error(`File ${process.argv[process.argv.length - 1]} does not exist`);
        }
        const code = fs.readFileSync(process.argv[process.argv.length - 1], 'utf-8');

        const tokens = lex(code);
        console.log('tokens', tokens);
        console.log('ast', parse(tokens));
        interpret(parse(tokens));
    }
    else {
        throw new Error('No file specified');
    }
}
catch (err: any) {
    console.log(err.message);
}