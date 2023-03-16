/**
 * Moduuli sisältää funktioita, joilla voidaan muuttaa lausekemuotoja toisikseen.
 *
 * Funktioiden toParsetree, toRPN ja toString parametri expr voidaan antaa missä tahansa muodossa (ptree, rpn tai infix).
 * Ptree-muotoinen lauseke koostuu solmuista, kuten esim. { o: "+", l: "2", r: "3" }.
 * RPN-muotoinen lauseke on lista, esim. ["2", "3", "+"].
 * Infix-muotoinen lauseke on merkkijono esim. "2 + 3".
 **/
const symbols = {
    "+": {
        infix: "+/2",
        unary: "+/1"
    },
    "-": {
        infix: "-/2",
        unary: "-/1"
    },
    "–": {
        infix: "-/2",
        unary: "-/1"
    },
    "×": {
        infix: "×/2",
    },
    "·": {
        infix: "×/2",
    },
    ":": {
        infix: ":/2",
    },
    "/": {
        infix: ":/2",
    },
    "^": {
        infix: "^/2",
    },
    "√": {
        infix: "√/2",
    },
    "log": {
        infix: "log/2",
    },
    ".": {
        infix: "./2",
    },
    ",": {
        infix: ",/2",
    },
    "=": {
        infix: "=/2",
    },
    "is": {
        infix: "is/2",
    },
    "!=": {
        infix: "!=/2",
    },
    "<=>": {
        infix: "<=>/2",
    }
},
      operators = {
          "+/1"   : {
              precedence: 10,
              arity:      1
          },
          "-/1"   : {
              precedence: 10,
              arity:      1
          },
          "./2"   : {
              precedence: 8,
              arity:      2
          },
          "^/2"   : {
              precedence: 6,
              arity:      2
          },
          "√/2"   : {
              precedence: 6,
              arity:      2
          },
          "log/2"   : {
              precedence: 6,
              arity:      2
          },
          "×/2"   : {
              precedence: 4,
              arity:      2
          },
          "·/2"   : {
              precedence: 4,
              arity:      2
          },
          ":/2"   : {
              precedence: 4,
              arity:      2
          },
          "+/2"   : {
              precedence: 2,
              arity:      2
          },
          "-/2"   : {
              precedence: 2,
              arity:      2
          },
          ",/2"   : {
              precedence: 1,
              arity:      2
          },
          "=/2"   : {
              precedence: 0,
              arity:      2
          },
          "!=/2"  : {
              precedence: 0,
              arity:      2
          },
          "is/2"  : {
              precedence: 0,
              arity:      2
          },
          "<=>/2" : {
              precedence: -1,
              arity:      2
          }
      };



/**
 * Muuttaa RPN-muotoon muutetun lausekkeen (token-lista) parsetree-muotoon.
 * @param expr: RPN-muotoinen lista arvoista ja operaattoreista. Esim. [1,
 *              2, 3, '*', '+'].
 * @return:     Parse tree.
 **/
function rpnToPtree(rpn) {
    var stack = [],   //Pino arvoille. Arvot laitetaan pinoon ja kun vastaan
        //tulee operaattori, otetaan pinosta kaksi päällim-
        // mäistä.
        token,        // Nykyinen token.
        cur,          // Rakennettava olio.
        params;       // Operandit ja funktio parametrit.


    //console.log("PITUUS: " + rpn.length);
    for (let i = 0; i < rpn.length; i++) {
        token = rpn[i];
        //console.log("TOKEN: " + token);
        const arity = getArity(token);
        if ( arity > 0 ) {          // Operaattori tai funktio, ei arvo.
            cur = {};
            cur.oper = getSymbol(token);
            params = [];

            console.assert ( arity <= stack.length, "Ei tarpeeksi parametreja" );
            // Luetaan parametrit pinosta.
            for ( let j = 0; j < arity; j++ ) {
                params[arity-j-1] = stack.pop();
            }
            //cur.p = params;
            for ( let k = 0; k < params.length; k++ ) {
                cur[k] = params[k];
            }

            stack.push(cur);
        } else {
            stack.push(token);
        }
        //console.log("STACK: " + JSON.stringify(stack));
    }

    console.assert(stack.length === 1);
    return stack[0];
}

/**
 * Muuttaa lausekkeen parse treeksi.
 *
 * @param expr: Lauseke-, RPN- tai parse tree -muotoinen lauseke.
 * @throws:     ParameterException, jos expr ei ole mikään kelvollinen tyyppi.
 **/
function toParsetree(expr) {
    var rpn,
        ptree;

    if ( typeof expr === "string" ) {
        rpn   = infixToRPN(expr);
        ptree = rpnToPtree(rpn);
    } else if ( typeof expr === "object" &&
                expr.length ) {
        ptree = rpnToPtree(expr);
    } else if ( typeof expr === "object" &&
                expr.o ) {
        ptree = expr;
    } else {
        console.log("EX, type of", typeof expr);
        throw {
            name: "ParameterException",
            description: "Incorrect parameter."
        };
    }
    return ptree;
}


function isOperator(sym) {
    if ( operators[sym] ) {
        return true;
    }
    return false;
}


// TODO: ero +:ille ja -:ille.
function isUnary(name) {
    return symbols[name] && symbols[name].unary !== undefined;
}

function isInfix(name) {
    return symbols[name] && symbols[name].infix !== undefined;
}

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

    if ( typeof oper !== "string" ) {
        return 0;
    }
    if ( !oper.split ) {
        //debugger;
    }
    return parseInt(oper.match(/\/[0-9]+$/), 10);
}

/**
 * Base operator from operator with arity.
 * @param oper: operator with arity, e. g. "+/2", "eval/1"
 * @returns:    operator name, e. g. "+", "eval"
 **/
function getSymbol(oper) {
    const m = oper.match(/^(.*)\/[0-9]+$/);
    if ( m && m.length > 0 ) {
        return m[1];
    }

    return null;
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

/**
 * Shunting yard -algoritmi.
 **/
export function infixToRPN(expr) {
    var token,
        st_token,      // stack token
        output = [ ],
        stack = [ ],
        exp = 1, VALUE = 1, OPERATOR = 2,
        tokens,
        n_params = 0;

    // TODO: luotava automaattisest operaattoreista
    tokens = expr.split(/(\)|\(|\+|-|\*|\/|^|√|<=>|=|,| )/).
                  filter(function (a) { return a !== " " && a !== ""; });

    for (let i = 0; i < tokens.length; i++) {
        token = tokens[i];
        //console.log("TOKEN:", token);
        //console.log(" EXPE:", exp);

        if ( symbols[token] ) {        // Operaattori.
            if ( exp === OPERATOR ) {
                assert ( isInfix(token) );

                token = token + "/2";
                let max = 100;
                while (stack.length > 0 &&
                       getPrecedenceOrder(token,
                                          stack[stack.length - 1]) >= 0) {
                    output.push(stack.pop());
                    max--;
                    if ( max === 0 ) {
                        throw Error("Maksimi ylitetty");
                    }
                }
                stack.push(token);
            } else if ( exp == VALUE ) {
                assert ( isUnary(token) );

                stack.push(token + "/1");
            }
            exp = VALUE;
        } else if (token === "(") {
            assert ( exp === VALUE );
            stack.push(token);
            exp = VALUE;
        } else if (token === ")") {
            assert ( exp === OPERATOR );
            n_params = 1;
            let max = 100;
            while (stack[stack.length - 1] !== "(") {
                st_token = stack.pop();
                if ( st_token === ",/2" ) {
                    n_params += 1;
                } else {
                    output.push(st_token);
                }
                max--;
                if ( max === 0 ) {
                    throw Error("Maksimi ylitetty");
                }

            }
            stack.pop(); // '('

            // Jos edellinen toiminto ennen sulkuja ei ollut operaattori,
            // sulut kuuluivat funktiokutsuun. Outputataan myös
            // funktion nimi.
            console.log("STACK:", JSON.stringify(stack));
            if ( stack.length > 0
              && operators[stack[stack.length-1]] === undefined ) {
                output.push(stack.pop() + "/" + n_params);
            }
            exp = OPERATOR;
        } else if ( tokens[i+1] == "(" ) {  // funktiokutsu
            assert ( exp === VALUE );
            stack.push(token);
            exp = VALUE;
        } else {                       // Muu symboli.
            assert ( exp === VALUE, "Odotettiin muuta" );
            if ( "" + parseInt(token, 10) === token ) {
                output.push({ item: "(val)", 0: token });
            } else {
                output.push({ item: "(sym)", 0: token });
            }
            exp = OPERATOR;
        }
        //console.log(" STAC:", JSON.stringify(stack));
        //console.log(" OUTP:", JSON.stringify(output));
    }

    assert(exp === OPERATOR, "Ennenaikainen loppu");
    console.log("stack:", stack.length, JSON.stringify(stack));
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output;
}





/**
 * Muuttaa lausekkeen tekstiksi.
 *
 * Lauseke voi olla infix-, RPN- tai parse tree -muotoinen.
 * Esim. {
 *         o = "+",
 *         l = 2,           =>  "( 2 + 3 )"
 *         r = 3
 *       }
 **/
export function rpnToString(expr) {
    var arr = [],
        ptree,
        traverse = function (node) {
            //console.log("NODE:", JSON.stringify(node), "type:", typeof node);
            if ( typeof node === "object" ) {
                arr.push("(");
                if ( node.p.length == 1 ) {
                    arr.push(node.oper);
                    traverse(node.p[0]);
                } else if ( node.p.length == 2 ) {
                    traverse(node.p[0]);
                    arr.push(node.oper);
                    traverse(node.p[1]);
                } else {
                    arr.push(node.oper);
                    for ( let i = 0; i < node.p.length; i++ ) {
                        traverse(node.p[i]);
                    }
                }
                arr.push(")");
            } else {
                arr.push(node);
            }
        };

    ptree = toParsetree(expr);
    traverse(ptree);
    return arr.join(" ");
}

/* export default {
 *     rpnToString:    rpnToString,
 *     infixToRPN:     infixToRPN,
 *     getSymbol:      getSymbol,
 *     getArity:       getArity,
 *     isOperator:     isOperator,
 *     isUnary:        isUnary,
 *     isInfix:        isInfix,
 *     toParsetree:    toParsetree
 * }; */
