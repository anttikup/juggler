import { isNumber } from './util.js';
import * as config from './config.js';

function getOperatorColors(op) {
    const colors = config.operatorColors[op];
    if ( colors ) {
        return colors;
    }

    return { nodeColor: null, textColor: null };
}

function getValueColors(op) {
    if ( isNumber(op) ) {
        return config.numberColors;
    } else if ( op === null ) {
        return config.numberColors;
    } else {
        return config.namedVariableColors;
    }

    return { nodeColor: null, textColor: null };
}

class Node {
    id;
    label;
    type;
    data;
    color;
    font = {};

    constructor(id, value, label) {
        this.id = id;
        this.data = value;
        this.label = label;
    }

}


export class OperatorNode extends Node {
    font = {
        size: 20,
    };

    constructor(id, text, value) {
        super(id, value, text);
        this.type = 'function';
        const { nodeColor, textColor } = getOperatorColors(value);
        this.color = nodeColor;
        this.font.color = textColor;
    }
};

export class FunctionNode extends Node {
    font = {
        size: 17,
    };

    constructor(id, text, value) {
        super(id, value, text);
        this.type = 'operator';
        const { nodeColor, textColor } = getOperatorColors(value);
        this.color = nodeColor;
        this.font.color = textColor;
    }
};

export class ValueNode extends Node {
    name;

    constructor(id, value = null) {
        super(id, value, String(value ?? ' '));
        this.type = 'value';
        const { nodeColor, textColor } = getValueColors(value);
        this.color = nodeColor;
        this.font.color = textColor;
        this.name = isNumber(value) ? null : value;
    }
};
