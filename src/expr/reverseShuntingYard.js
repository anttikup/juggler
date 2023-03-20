import { operators, functions } from './data.js';

/**
 * Extracts arity from operator.
 * @param oper: operator with arity, e. g. "+/2", "eval/1"
 * @returns:    number extracted or 0
 **/
function getArity(oper) {

    console.assert ( oper !== undefined );

    if ( operators[oper] && operators[oper].arity ) {
        return operators[oper].arity;
    }

    return 0;
}

/**
 * Base operator from operator with arity.
 * @param oper: operator with arity, e. g. "+/2", "eval/1"
 * @returns:    operator name, e. g. "+", "eval"
 **/
function getSymbol(oper) {
    if ( operators[oper] && operators[oper].symbol ) {
        return operators[oper].symbol;
    }

    return null;
}

function getOperator(oper) {
    if ( operators[oper] ) {
        return operators[oper];
    }

    throw new Error(`No such operator: ${oper}`);
}

function isOperator(token) {
    return !!operators[token];
}

function getFunction(oper) {
    if ( functions[oper] ) {
        return functions[oper];
    }

    throw new Error(`No such function: ${oper}`);
}


function isFunction(token) {
    return !!functions[token];
}


/**
 * Muuttaa RPN-muotoon muutetun lausekkeen (token-lista) parsetree-muotoon.
 * @param expr: RPN-muotoinen lista arvoista ja operaattoreista. Esim. [1,
 *              2, 3, '*', '+'].
 * @return:     Parse tree.
 **/
export function rpnToExpr(rpn) {
    const stack = [];

    console.assert(rpn.length > 0, "Empty RPN");

    for (let i = 0; i < rpn.length; i++) {
        const token = rpn[i];
        //console.log('left:', rpn.slice(i));
        if ( isOperator(token) ) {
            const operator = getOperator(token);
            const arity = operator.arity;
            const precedence = operator.precedence;
            const params = [];

            console.assert ( arity <= stack.length, "Not enough parameters" );

            for ( let j = 0; j < arity - 1; j++ ) {
                const item = stack.pop();

                if ( item.precedence !== undefined ) {
                    if ( item.precedence <= precedence ) {
                        params[arity-j-1] = "(" + item.text + ")";
                    } else {
                        params[arity-j-1] = item.text;
                    }
                } else {
                    params[arity-j-1] = item.text;
                }
            }

            const lastParam = stack.pop();
            if ( lastParam.precedence !== undefined ) {
                if ( lastParam.precedence < precedence ) {
                    params[0] = "(" + lastParam.text + ")";
                } else {
                    params[0] = lastParam.text;
                }
            } else {
                params[0] = lastParam.text;
            }



            if ( arity === 1 ) {
                stack.push({
                    precedence,
                    text: operator.symbol + params[0]
                });
            } else {
                stack.push({
                    precedence,
                    text: operator.symbol === ','
                        ? params.join(', ')
                        : params.join(' ' + operator.symbol + ' ')
                });
            }
        } else if ( isFunction(token) ) {
            const func = getFunction(token);
            const arity = func.arity;
            const precedence = func.precedence;
            const params = [];

            console.assert ( arity <= stack.length, 'Not enough parameters' );

            for ( let j = 0; j < arity; j++ ) {
                const item = stack.pop();
                params[arity-j-1] = item.text;
            }

            stack.push({
                precedence,
                text: func.symbol + '(' + params.join(', ') + ')'
            });
        } else {
            stack.push({ text: token });
        }
        //console.log('STACK: ' + JSON.stringify(stack));
    }

    console.assert(stack.length === 1, `stack left: ${JSON.stringify(stack)}`);
    return stack[0].text;
}
