// associative: (a ∗ b) ∗ c = a ∗ (b ∗ c)
// commutative: a ∗ b = b ∗ a

// MainForm here means it is used as the basic operation that the inverse(s) are inverse of. TODO: maybe a better term exists.

export const operators = {
    /** prefix **/
    "+/1" : {
        symbol: "+",
        precedence: 10,
        arity: 1,
        mainForm: true,
    },
    "−/1" : {
        symbol: "-",
        precedence: 10,
        arity: 1,
        inverseOf: "+/1",
    },
    "√/1" : {
        symbol: "sqrt",
        precedence: 10,
        arity: 1,
        spacing: 'sqrt ',
    },

    /** infix **/
    "./2" : {
        symbol: ".",
        precedence: 8,
        arity: 2,
    },
    "^/2" : {
        symbol: "^",
        graphSymbol: '◌ⁿ',
        precedence: 6,
        arity: 2,
        mainForm: true,
    },
    "√/2" : {
        symbol: "root",
        precedence: 6,
        arity: 2,
        inverseOf: "^/2",
    },
    "log/2" : {
        symbol: "log",
        precedence: 6,
        arity: 2,
        inverseOf: "^/2",
    },
    "·/2" : {
        symbol: "*",
        graphSymbol: '·',
        precedence: 4,
        arity: 2,
        mainForm: true,
        commutative: true,
        associative: true,
    },
    "//2" : {
        symbol: "/",
        precedence: 4,
        arity: 2,
        inverseOf: "·/2",
    },
    "+/2" : {
        symbol: "+",
        precedence: 2,
        arity: 2,
        mainForm: true,
        commutative: true,
        associative: true,
    },
    "−/2" : {
        symbol: "-",
        precedence: 2,
        arity: 2,
        inverseOf: "+/2",
    },
    ",/2" : {
        symbol: ",",
        precedence: 1,
        arity: 2,
        spacing: ', ',
    },
    "=/2" : {
        symbol: "=",
        precedence: 0,
        arity: 2,
        commutative: true,
        associative: true,
    },
    "≠/2"  : {
        symbol: "!=",
        precedence: 0,
        arity: 2,
        commutative: true,
        associative: true,
    },
    "</2"  : {
        symbol: "<",
        precedence: 0,
        arity: 2,
        associative: true,
    },
    ">/2"  : {
        symbol: ">",
        precedence: 0,
        arity: 2,
        associative: true,
    },
    "≤/2"  : {
        symbol: "<=",
        precedence: 0,
        arity: 2,
        associative: true,
    },
    "≥/2"  : {
        symbol: ">=",
        precedence: 0,
        arity: 2,
        associative: true,
    },
    "⇔/2" : {
        symbol: "<=>",
        precedence: -1,
        arity: 2,
        commutative: true,
        associative: true,
    },
    ";/2" : {
        symbol: ";",
        precedence: -1,
        arity: 2,
        commutative: true,
        associative: true,
        spacing: '; ',
    },
    "sin/1" : {
        symbol: "sin",
        arity: 1,
        display: "func",
    },
    "arcsin/1" : {
        symbol: "arcsin",
        arity: 1,
        display: "func",
    },
    "cos/1" : {
        symbol: "cos",
        arity: 1,
        display: "func",
    },
    "arccos/1" : {
        symbol: "arccos",
        arity: 1,
        display: "func",
    },
    "tan/1" : {
        symbol: "tan",
        arity: 1,
        display: "func",
    },
    "arctan/1" : {
        symbol: "arctan",
        arity: 1,
        display: "func",
    },

    // For testing; TODO needs a way to insert functions
    "f/2" : {
        symbol: "f",
        arity: 2,
        display: "func",
    },
    "f/3" : {
        symbol: "f",
        arity: 3,
        display: "func",
    },
    "invf/2" : {
        symbol: "invf",
        arity: 2,
        display: "func",
    },
    "revf/2" : {
        symbol: "revf",
        arity: 2,
        display: "func",
    },
};


export const symbols = (() => {
    const symbols = {};
    for ( let [key, value] of Object.entries(operators) ) {
        if ( !symbols[value.symbol] ) {
            symbols[value.symbol] = {};
        }
        if ( value.arity === 1 ) {
            symbols[value.symbol].unary = key;
        } else if ( value.arity === 2 ) {
            symbols[value.symbol].infix = key;
        } else if ( value.display === "func" ) {
            symbols[value.symbol].func = key;
        } else {
            throw new Error(`Not implemented: arity = ${value.arity}`);
        }
    }

    return symbols;
})();

export function isOperator(symbol) {
    return symbols[symbol] && !symbols[symbol].func;
}
