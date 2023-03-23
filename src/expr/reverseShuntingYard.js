import { operators } from './data.js';

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

function isFunction(token) {
    return operators[token] && operators[token].display === "func";
}

function getText(operator, params) {
    if ( operator.display === "func" ) {
        return operator.symbol + '(' + params.join(', ') + ')'
    }

    if ( operator.arity === 1 ) {
        return operator.symbol + params[0];
    }

    return operator.symbol === ','
         ? params.join(', ')
         : params.join(' ' + operator.symbol + ' ');
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
        if ( isOperator(token) || isFunction(token) ) {
            const operatorId = token;
            const operator = getOperator(operatorId);
            const arity = operator.arity;
            const precedence = operator.precedence;
            const associative = operator.associative || false;
            const params = [];

            console.assert ( arity <= stack.length, "Not enough parameters" );

            // Parameters are in the stack in reverse order.
            for ( let j = 0; j < arity - 1; j++ ) {
                const enclosed = stack.pop();
                if ( enclosed.operator ) {
                    const encOper = getOperator(enclosed.operator);
                    if ( enclosed.operator === "−/2" && operatorId === "+/2" ) {
                        params[arity - j - 1] = enclosed.text;
                    } else if ( encOper.precedence === precedence && associative && encOper.associative ) {
                        params[arity - j - 1] = enclosed.text;
                    } else if ( encOper.precedence > precedence ) {
                        params[arity - j - 1] = enclosed.text;
                    } else if ( isFunction(enclosed.operator) ) {
                        params[arity - j - 1] = enclosed.text;
                    } else {
                        params[arity - j - 1] = "(" + enclosed.text + ")";
                    }
                } else {
                    params[arity - j - 1] = enclosed.text;
                }
            }

            const firstParam = stack.pop();
            if ( firstParam.operator ) {
                const encOper = getOperator(firstParam.operator);
                if ( encOper.precedence < precedence ) {
                    params[0] = "(" + firstParam.text + ")";
                } else {
                    params[0] = firstParam.text;
                }
            } else {
                params[0] = firstParam.text;
            }


            stack.push({
                operator: operatorId,
                text: getText(operator, params)
            });
        } else {
            stack.push({ text: token });
        }
    }

    console.assert(stack.length === 1, `stack left: ${JSON.stringify(stack)}`);
    return stack[0].text;
}
