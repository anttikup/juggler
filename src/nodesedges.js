function getOperatorColor(op) {
    switch ( op ) {
        case '+':
            return '#0abf57';
        case '·':
            return '#0a57bf';
        case '◌ⁿ':
        case '^':
            return '#bf0a57';
    }

    return '#2b7ce9';
}


export function makePartEdge(from, to) {
    return {
        from,
        to,
        color: '#2b7ce978',
        label: '⊙',
        type: 'operand'
    };
}

export function makeAEdge(from, to) {
    return {
        from,
        to,
        color: '#2bc7e978',
        label: 'R',
        type: 'r-operand'
    };
}

export function makeBEdge(from, to) {
    return {
        from,
        to,
        color: '#b27ce978',
        label: 'L',
        type: 'l-operand'
    };
}

export function makeWholeEdge(from, to, parentOp) {
    const color = getOperatorColor(parentOp);
    console.log("whole:", parentOp);
    return {
        from,
        to,
        color,
        length: 3,
        width: 5,
        label: '=',
        type: 'trunk'
    };
}

export function makeValueNode(id, label) {
    return {
        id,
        label,
        type: 'value'
    };
}

export function makeOperatorNode(id, label) {
    const color = getOperatorColor(label);

    return {
        id,
        label,
        color,
        font: {
            color: 'white',
            //strokeWidth: 1
            size: 20,
        },
        type: 'operator'
    };
}
