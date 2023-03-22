import { getEdgeId } from './util.js';
import { getOperatorColors } from './config.js';

class Edge {
    id;
    from;
    to;
    role;
    color;
    label;

    constructor(from, to) {
        this.id = getEdgeId(from, to);
        this.from = from;
        this.to = to;
    }
}

export class TrunkEdge extends Edge {
    label = '=';
    role = 'trunk';
    length = 3;
    width = 5;

    constructor(from, to, parentOp) {
        super(from, to);
        const { nodeColor } = getOperatorColors(parentOp);
        this.color = nodeColor;
    }
};

export class OperandEdge extends Edge {
    label = '⊙';
    role = 'operand';

    constructor(from, to) {
        super(from, to);
        this.color = '#b27ce978';
    }
};

export class OrderedEdge extends Edge {
    role = 'orderedOperand';

    constructor(from, to, n) {
        super(from, to);
        this.color = '#b27ce978';
        this.label = String(n);
    }
};
