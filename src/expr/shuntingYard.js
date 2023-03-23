import { symbols, operators, isOperator } from './data.js';
import { tokenize } from './tokenizer.js';


function isInfix(id) {
    return !!symbols[id] && symbols[id].infix;
}

function isUnary(id) {
    return !!symbols[id] && symbols[id].unary;
}

function isFunction(id) {
    return !!symbols[id] && symbols[id].func;
}

/**
 * Returns a positive number if op2 has higher precedence than op1,
 * negative is op1 has higher than op2, zero if the same.
 **/
function  getPrecedenceOrder(op1, op2) {
    if ( op2 === "(" ) {
        return -1;
    }


    return ((operators[op2]?.precedence ?? -99) - (operators[op1]?.precedence ?? -99));
}


function check(condition, errorMessage) {
    if ( !condition ) {
        throw new Error(errorMessage);
    }
}


export function exprToRPN(expr) {
    const VALUE = 1, OPERATOR = 2;
    var st_token,      // stack token
        output = [],
        stack = [],
        expected = VALUE,
        n_params = 0;


    for ( const token of tokenize(expr) ) {
        console.log("TOKEN:", token);
        if ( isOperator(token) ) {        // Operaattori.
            if ( expected === OPERATOR ) {
                check( isInfix(token), "expected infix operator" );
                const operator = symbols[token].infix;

                let max = 100;
                while (stack.length > 0 &&
                       getPrecedenceOrder(operator,
                                          stack[stack.length - 1]) >= 0) {
                    output.push(stack.pop());
                }
                stack.push(operator);
            } else if ( expected == VALUE ) {
                check( isUnary(token), `Unexpected infix operator: ${token}` );
                const operator = symbols[token].unary;

                stack.push(operator);
            } else {
                throw new Error(`Unexpected token: ${token}`);
            }
            expected = VALUE;
        } else if (token === "(") {
            check( expected === VALUE, "Unexpected ’(’" );
            stack.push(token);
            expected = VALUE;
        } else if (token === ")") {
            check( expected === OPERATOR, "Unexpected ’)’" );
            let n_params = 1;
            while (stack[stack.length - 1] !== "(") {
                st_token = stack.pop();
                if ( st_token === ",/2" ) {
                    n_params += 1;
                } else {
                    output.push(st_token);
                }

                if ( stack.length === 0 ) {
                    throw new Error("Missing ’(’");
                }
            }

            stack.pop(); // '('

            // Jos edellinen toiminto ennen sulkuja ei ollut operaattori,
            // sulut kuuluivat funktiokutsuun. Outputataan myös
            // funktion nimi.
            if ( stack.length > 0
              && stack[stack.length-1] !== '('
              && operators[stack[stack.length-1]] === undefined ) {
                output.push(stack.pop() + "/" + n_params);
            }
            expected = OPERATOR;
        } else if ( isFunction(token) ) {  // funktiokutsu
            check( expected === VALUE, `Unexpected token: ${token}` );
            check( Number(token).toString() !== token, `Unexpected token: ${token}` );
            stack.push(token);
            expected = VALUE;
        } else {                       // Muu symboli.
            check( expected === VALUE, `Unexpected token: ${token}` );
            check( !isOperator(token), `Unexpected operator: ${token}` );
            if ( Number(token).toString() === token ) {
                output.push(Number(token));
            } else {
                output.push(token);
            }
            expected = OPERATOR;
        }
    }

    check(expected === OPERATOR, "Unexpected end");
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output;
}
