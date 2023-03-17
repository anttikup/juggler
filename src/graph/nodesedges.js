function getOperatorColor(op) {
    switch ( op ) {
        case '+/2':
            return '#0abf57';
        case '·/2':
            return '#0a57bf';
        case '^/2':
            return '#bf0a57';
        case 'sin/1':
        case 'cos/1':
        case 'tan/1':
            return '#570abf';
    }

    return '#2b7ce9';
}


export function makePartEdge(from, to) {
    return {
        from,
        to,
        color: '#2b7ce978',
        label: '⊙',
        role: 'operand'
    };
}

export function makeAEdge(from, to) {
    return {
        from,
        to,
        color: '#2bc7e978',
        label: 'R',
        role: 'r-operand'
    };
}

export function makeBEdge(from, to) {
    return {
        from,
        to,
        color: '#b27ce978',
        label: 'L',
        role: 'l-operand'
    };
}

export function makeNEdge(from, to, n) {
    return {
        from,
        to,
        color: '#b27ce978',
        label: String(n),
        role: 'n-operand'
    };
}

export function makeWholeEdge(from, to, parentOp) {
    const color = getOperatorColor(parentOp);
    return {
        from,
        to,
        color,
        length: 3,
        width: 5,
        label: '=',
        role: 'trunk'
    };
}

export function makeValueNode(id, value = null) {
    return {
        id,
        label: String(value ?? ' '),
        type: 'value',
        data: value
    };
}

export function makeOperatorNode(id, text, value) {
    const color = getOperatorColor(value);

    value = value ?? text;

    if ( value === NaN ) {
        throw new Error(`NAN: ${id}, ${text}, ${value}`);
    }
    console.assert(value !== NaN, `value on NaN: ${id}, ${text}, ${value}`);

    return {
        id,
        label: text,
        color,
        font: {
            color: 'white',
            size: 20,
        },
        type: 'operator',
        data: value
    };
}

export function makeFunctionNode(id, text, value) {
    const color = getOperatorColor(value);
    return {
        id,
        label: text,
        color,
        font: {
            color: 'white',
            size: 17,
        },
        type: 'function',
        data: value
    };
}
