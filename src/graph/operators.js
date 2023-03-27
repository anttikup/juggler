import { operators } from '../expr/data.js';

export function isBinary(operatorId) {
    const info = operators[operatorId] ?? functions[operatorId];
    if ( !info ) {
        throw new Error(`No such operator ${operatorId}`);
    }
    return info.arity === 2;
};

export function isUnary(operatorId) {
    const info = operators[operatorId] ?? functions[operatorId];
    if ( !info ) {
        throw new Error(`No such operator ${operatorId}`);
    }
    return info.arity === 1;
};

export function isCommutative(operatorId) {
    const info = operators[operatorId] ?? functions[operatorId];
    if ( !info ) {
        throw new Error(`No such operator ${operatorId}`);
    }

    return info.commutative || false;
};

export function isAssociative(operatorId) {
    const info = operators[operatorId] ?? functions[operatorId];
    if ( !info ) {
        throw new Error(`No such operator ${operatorId}`);
    }

    return info.associative || false;
};

export function isMainForm(operatorId) {
    const info = operators[operatorId] ?? functions[operatorId];
    if ( !info ) {
        throw new Error(`No such operator ${operatorId}`);
    }

    return !info.inverseOf || false;
};

export function isFunction(operatorId) {
    return operators[operatorId] && operators[operatorId].display === "func";
};
