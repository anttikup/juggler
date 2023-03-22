export const operatorColors = {
    '+/2': { nodeColor: '#0abf57', textColor: 'white' },
    '·/2': { nodeColor: '#0a57bf', textColor: 'white' },
    '^/2': { nodeColor: '#bf0a57', textColor: 'white' },
    'sin/1': { nodeColor: '#570abf', textColor: 'white' },
    'cos/1': { nodeColor: '#570abf', textColor: 'white' },
    'tan/1': { nodeColor: '#570abf', textColor: 'white' },
};

export const numberColors = { nodeColor: '#97c2fc', textColor: 'black' };
export const equalityColors = { nodeColor: '#97c2fc', textColor: 'black' };
export const namedVariableColors = { nodeColor: 'black', textColor: 'white' };

export const namedVariableDisabledColors = equalityColors;


export function getOperatorColors(op) {
    const colors = operatorColors[op];
    if ( colors ) {
        return colors;
    }

    return { nodeColor: null, textColor: null };
};
