import { operators } from './data.js';

const sortedOperators = Object.values(operators).map(operator => operator.symbol)
                              .sort((a, b) => b.length - a.length);


function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}


export function* tokenize(expr) {
    // Split by the operators, so that everything can be used as a value.
    const regex = new RegExp('([()]| +|' + sortedOperators.map(escapeRegex).join('|') + ')', 'g');
    const tokens = expr.split(regex).map(token => token.trim());

    for ( const token of tokens ) {
        if ( token !== "" ) {
            yield token;
        }
    }
}
