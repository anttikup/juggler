import { isNumber } from './util.js';
import * as config from './config.js';

// Note: All the functionality should be static methods, that return new objects,
// because DataSet.update works on plain objects.
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
        const { nodeColor, textColor } = config.getOperatorColors(value);
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
        const { nodeColor, textColor } = config.getOperatorColors(value);
        this.color = nodeColor;
        this.font.color = textColor;
    }
};

function getValueColors(val) {
    if ( isNumber(val) ) {
        return config.numberColors;
    } else if ( val === null ) {
        return config.equalityColors;
    } else {
        return config.namedVariableColors;
    }

    return { nodeColor: null, textColor: null };
}

export class ValueNode extends Node {
    name;

    constructor(id, value = null, name = null) {
        super(id, value, String(value ?? ' '));
        this.label = name ?? this.label;
        this.type = 'value';
        const { nodeColor, textColor } = getValueColors(value);
        this.color = nodeColor;
        this.font.color = textColor;
        this.name = name ? name : (isNumber(value) ? null : value);
    }

    static getBridgeDisabled(node) {
        if ( !node.name ) {
            throw new Error("Not a named node");
        }
        return new ValueNode(node.id, node.name, node.name);
    }

    static getBridgeEnabled(node) {
        if ( !node.name ) {
            throw new Error("Not a named node");
        }
        return new ValueNode(node.id, null, node.name);
    }
};
