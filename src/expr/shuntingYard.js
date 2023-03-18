import { symbols, operators, isOperator } from './data.js';


function isInfix(name) {
    return symbols[name] && symbols[name].infix !== undefined;
}

function isUnary(name) {
    return symbols[name] && symbols[name].unary !== undefined;
}

/**
 * Returns a positive number if op2 has higher precedence than op1,
 * negative is op1 has higher than op2, zero if the same.
 **/
function  getPrecedenceOrder(op1, op2) {
    //console.log("getPrecedenceOrder?", op1, op2, ":", (precedes[op2] - precedes[op1]));
    if ( op2 === "(" ) {
        return -1;
    }
    return (operators[op2].precedence - operators[op1].precedence);
}


function assert(ehto, viesti) {
    if ( !ehto ) {
        throw new Error(viesti);
    }
}


export function exprToRPN(expr) {
    const VALUE = 1, OPERATOR = 2;
    var token,
        st_token,      // stack token
        output = [],
        stack = [],
        expected = VALUE,
        tokens,
        n_params = 0;

    // TODO: luotava automaattisest operaattoreista
    tokens = expr.split(/(\)|\(|\+|-|–|\*|\/|^|√|<=>|=|,|;| )/).
                  filter(function (a) { return a !== " " && a !== ""; });

    for (let i = 0; i < tokens.length; i++) {
        //console.log(" EXPE:", expected);
        token = tokens[i];
        //console.log("TOKEN:", token);


        if ( isOperator(token) ) {        // Operaattori.
            if ( expected === OPERATOR ) {
                assert ( isInfix(token), "expected infix operator" );
                const operator = symbols[token].infix;

                let max = 100;
                while (stack.length > 0 &&
                       getPrecedenceOrder(operator,
                                          stack[stack.length - 1]) >= 0) {
                    output.push(stack.pop());
                }
                stack.push(operator);
            } else if ( expected == VALUE ) {
                assert ( isUnary(token), `Unexpected infix operator: ${token}` );
                const operator = symbols[token].unary;

                stack.push(operator);
            }
            expected = VALUE;
        } else if (token === "(") {
            assert ( expected === VALUE, "Unexpected ’(’" );
            stack.push(token);
            expected = VALUE;
        } else if (token === ")") {
            assert ( expected === OPERATOR, "Unexpected ’)’" );
            n_params = 1;
            while (stack[stack.length - 1] !== "(") {
                st_token = stack.pop();
                if ( st_token === ",/2" ) {
                    n_params += 1;
                } else {
                    output.push(st_token);
                }

                if ( stack.length === 0 ) {
                    throw new Error("Missing (");
                }
            }
            stack.pop(); // '('

            // Jos edellinen toiminto ennen sulkuja ei ollut operaattori,
            // sulut kuuluivat funktiokutsuun. Outputataan myös
            // funktion nimi.
            //console.log("STACK:", JSON.stringify(stack));
            if ( stack.length > 0
              && operators[stack[stack.length-1]] === undefined ) {
                output.push(stack.pop() + "/" + n_params);
            }
            expected = OPERATOR;
        } else if ( tokens[i+1] == "(" ) {  // funktiokutsu
            assert ( expected === VALUE, `Unexpected token: ${token}` );
            assert ( Number(token).toString() !== token, `Unexpected token: ${token}` );
            stack.push(token);
            expected = VALUE;
        } else {                       // Muu symboli.
            assert ( expected === VALUE, `Unexpected token: ${token}` );
            assert ( !isOperator(token), `Unexpected operator: ${token}` );
            if ( Number(token).toString() === token ) {
                output.push(Number(token));
            } else {
                output.push(token);
            }
            expected = OPERATOR;
        }
        //console.log(" STAC:", JSON.stringify(stack));
        //console.log(" OUTP:", JSON.stringify(output));
    }

    assert(expected === OPERATOR, "Unexpected end");
    //console.log("stack:", stack.length, JSON.stringify(stack));
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output;
}
