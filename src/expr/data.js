export const operators = {
    /** prefix **/
    "+/1"   : {
        symbol: "+",
        precedence: 10,
        arity:      1
    },
    "-/1"   : {
        symbol: "-",
        precedence: 10,
        arity:      1
    },
    "–/1"   : {
        symbol: "–",
        precedence: 10,
        arity:      1
    },
    "√/1"   : {
        symbol: "√",
        precedence: 10,
        arity:      1
    },

    /** infix **/
    "./2"   : {
        symbol: ".",
        precedence: 8,
        arity:      2
    },
    "^/2"   : {
        symbol: "^",
        precedence: 6,
        arity:      2
    },
    "√/2"   : {
        symbol: "√",
        precedence: 6,
        arity:      2
    },
    "root/2"   : {
        symbol: "root",
        precedence: 6,
        arity:      2
    },
    "log/2"   : {
        symbol: "log",
        precedence: 6,
        arity:      2
    },
    "*/2"   : {
        symbol: "*",
        precedence: 4,
        arity:      2
    },
    "×/2"   : {
        symbol: "×",
        precedence: 4,
        arity:      2
    },
    "·/2"   : {
        symbol: "·",
        precedence: 4,
        arity:      2
    },
    ":/2"   : {
        symbol: ":",
        precedence: 4,
        arity:      2
    },
    "//2"   : {
        symbol: "/",
        precedence: 4,
        arity:      2
    },
    "+/2"   : {
        symbol: "+",
        precedence: 2,
        arity:      2
    },
    "-/2"   : {
        symbol: "-",
        precedence: 2,
        arity:      2
    },
    "–/2"   : {
        symbol: "–",
        precedence: 2,
        arity:      2
    },
    ",/2"   : {
        symbol: ",",
        precedence: 1,
        arity:      2
    },
    "=/2"   : {
        symbol: "=",
        precedence: 0,
        arity:      2
    },
    "!=/2"  : {
        symbol: "!=",
        precedence: 0,
        arity:      2
    },
    "is/2"  : {
        symbol: "is",
        precedence: 0,
        arity:      2
    },
    "<=>/2" : {
        symbol: "<=>",
        precedence: -1,
        arity:      2
    }
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
