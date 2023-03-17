export const operators = {
    /** prefix **/
    "+/1" : {
        symbol: "+",
        precedence: 10,
        arity: 1
    },
    "−/1" : {
        symbol: "-",
        precedence: 10,
        arity: 1
    },
    "√/1" : {
        symbol: "sqrt",
        precedence: 10,
        arity: 1
    },

    /** infix **/
    "./2" : {
        symbol: ".",
        precedence: 8,
        arity: 2
    },
    "^/2" : {
        symbol: "^",
        precedence: 6,
        arity: 2
    },
    "√/2" : {
        symbol: "root",
        precedence: 6,
        arity: 2
    },
    "log/2" : {
        symbol: "log",
        precedence: 6,
        arity: 2
    },
    "·/2" : {
        symbol: "*",
        precedence: 4,
        arity: 2
    },
    "//2" : {
        symbol: "/",
        precedence: 4,
        arity: 2
    },
    "+/2" : {
        symbol: "+",
        precedence: 2,
        arity: 2
    },
    "−/2" : {
        symbol: "-",
        precedence: 2,
        arity: 2
    },
    ",/2" : {
        symbol: ",",
        precedence: 1,
        arity: 2
    },
    "=/2" : {
        symbol: "=",
        precedence: 0,
        arity: 2
    },
    "≠/2"  : {
        symbol: "!=",
        precedence: 0,
        arity: 2
    },
    "</2"  : {
        symbol: "<",
        precedence: 0,
        arity: 2
    },
    ">/2"  : {
        symbol: ">",
        precedence: 0,
        arity: 2
    },
    "≤/2"  : {
        symbol: "<=",
        precedence: 0,
        arity: 2
    },
    "≥/2"  : {
        symbol: ">=",
        precedence: 0,
        arity: 2
    },
    "⇔/2" : {
        symbol: "<=>",
        precedence: -1,
        arity: 2
    }
};

export const functions = {
    "sin/1" : {
        symbol: "sin",
        arity: 1
    },
    "arcsin/1" : {
        symbol: "arcsin",
        arity: 1
    },
    "cos/1" : {
        symbol: "cos",
        arity: 1
    },
    "arccos/1" : {
        symbol: "arccos",
        arity: 1
    },
    "tan/1" : {
        symbol: "tan",
        arity: 1
    },
    "arctan/1" : {
        symbol: "arctan",
        arity: 1
    },

    // For testing; TODO needs a way to insert functions
    "f/2" : {
        symbol: "f",
        arity: 2
    },
    "f/3" : {
        symbol: "f",
        arity: 3
    },
    "invf/2" : {
        symbol: "invf",
        arity: 2
    },
    "revf/2" : {
        symbol: "revf",
        arity: 2
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
        } else {
            throw new Error(`Not implemented: arity = ${value.arity}`);
        }
    }

    return symbols;
})();

export function isOperator(symbol) {
    return !!symbols[symbol];
}
