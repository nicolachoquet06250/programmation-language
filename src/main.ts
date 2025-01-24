import {lex} from "./lib/lexer.ts";
import {parse} from "./lib/parser.ts";
import {interpret} from "./lib/interpreter.ts";
import fs from 'node:fs';

try {
    // @ts-ignore
    if (typeof process !== 'object') {
        fetch('/test.myl')
            .then(res => res.text())
            .then(code => {
                const tokens = lex(code);
                document.body.innerHTML = '';
                document.write('tokens', '<pre>' + JSON.stringify(tokens, null, 2) + '</pre>');
                document.write('ast', '<pre>' + JSON.stringify(tokens, null, 2) + '</pre>');
                document.write('Résultat: ');
                interpret(parse(tokens));
            });
    }
    else {
        (async () => {
            const {isSea} = await import('node:sea');
            const min = isSea() ? 3 : 4;

            if (process.argv.length >= min) {
                if (!fs.readFileSync(process.argv[process.argv.length - 1])) {
                    throw new Error(`File ${process.argv[process.argv.length - 1]} does not exist`);
                }
                const code = fs.readFileSync(process.argv[process.argv.length - 1], 'utf-8');

                const tokens = lex(code);
                console.log('tokens', tokens);
                console.log('ast', parse(tokens));
                interpret(parse(tokens));
            } else {
                throw new Error('No file specified');
            }
        })()
    }
}
catch (err: any) {
    console.log(err.message);
}