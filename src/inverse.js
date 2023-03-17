import { operators, functions } from './expr/data.js';


export function isMain(op_or_func) {
    try {
        return !!getInverse(op_or_func);
    } catch ( err ) {
        return false;
    }
}

export function getInverse(op_or_func) {
    switch ( op_or_func ) {
        case '+/1':
            return '-/1';
        case 'sin/1':
            return 'arcsin/1';
        case 'cos/1':
            return 'arccos/1';
        case 'tan/1':
            return 'arctan/1';

        case '+/2':
            return '-/2';
        case '·/2':
            return ':/2';
        case '^/2':
            return '√/2';
    }

    throw new Error(`Unknown function ${op_or_func} or not the main function`);
}

export function getReverse(op_or_func) {
    switch ( op_or_func ) {
        case '^/2':
            return 'log/2';
    }

    const inv = getInverse(op_or_func);
    if ( inv ) {
        return inv;
    }

    throw new Error(`Unknown function ${op_or_func} or not the main function`);
}
