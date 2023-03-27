import { DataSet } from "vis-data";

import { exprToRPN, operators } from '../expr/index.js';
import {
    OperandEdge,
    OrderedEdge,
    TrunkEdge,
} from './edges.js';
import { makeId } from '../id.js';

import {
    ValueNode,
    OperatorNode,
    FunctionNode,
} from './nodes.js';

import { isNumber } from './util.js';
import { isAssociative, isBinary, isMainForm, isUnary } from './operators.js';
import { getInverse, getReverse } from './inverse.js';



function combineNodes(edges, from, to) {
    const edges_to_move = edges.get({
        filter: function (item) {
            return (item.from === from || item.to === from);
        }
    });

    edges_to_move.forEach(edge => {
        if ( edge.from === from ) {
            edge.from = to;
        }
        if ( edge.to === from ) {
            edge.to = to;
        }
    });

    return to;
}



export function rpnToGraph(rpn) {
    console.log("loadFormula: RPN:", rpn);

    const nodes = new DataSet();
    const edges = new DataSet();

    const stack = [];
    for ( let item of rpn ) {
        if ( operators[item] ) {
            const operatorId = item;
            const operatorInfo = operators[operatorId] ?? functions[operatorId];
            const arity = operatorInfo.arity;
            const symbol = operatorInfo.graphSymbol ?? operatorInfo.symbol;
            const opId = makeId();

            if ( isMainForm(operatorId) ) {
                if ( operatorId === "=/2" ) {
                    const op2 = stack.pop();
                    const op1 = stack.pop();
                    if ( nodes.get(op1).data !== null ) {
                        stack.push(combineNodes(edges, op2, op1));
                        nodes.remove(op2);
                    } else if ( nodes.get(op2).data !== null ) {
                        stack.push(combineNodes(edges, op1, op2));
                        nodes.remove(op1);
                    } else {
                        stack.push(combineNodes(edges, op1, op2));
                        nodes.remove(op1);
                    }
                    nodes.remove(opId);

                } else if ( operatorId === ';/2' ) {
                    stack.push(opId);
                    console.assert(item === rpn[rpn.length - 1], "Semicolon (;) should be last operator")

                } else if ( isBinary(operatorId) ) {
                    nodes.add(new OperatorNode(opId, symbol, operatorId));
                    const op1 = stack.pop();
                    const op2 = stack.pop();
                    edges.add(new OperandEdge(op2, opId));
                    edges.add(new OperandEdge(op1, opId));
                    const valId = makeId();
                    nodes.add(new ValueNode(valId));
                    edges.add(new TrunkEdge(valId, opId, symbol));
                    stack.push(valId);

                } else if ( isUnary(operatorId) ) {
                    nodes.add(new OperatorNode(opId, symbol, operatorId));
                    const op1 = stack.pop();
                    edges.add(new OperandEdge(op1, opId));
                    const valId = makeId();
                    nodes.add(new ValueNode(valId));
                    edges.add(new TrunkEdge(valId, opId, operatorId));
                    stack.push(valId);

                } else {
                    throw new Error(`Unknown operatorId: ${operatorId}`);
                }
            } else {
                const mainFormId = operatorInfo.inverseOf;
                const mainFormInfo = operators[mainFormId];
                const symbol = mainFormInfo.graphSymbol ?? mainFormInfo.symbol;

                if ( isBinary(mainFormId) && isAssociative(mainFormId) ) {
                    nodes.add(new OperatorNode(opId, symbol, mainFormId));
                    const op1 = stack.pop();
                    const trunk = stack.pop();
                    const op2 = makeId();
                    nodes.add(new ValueNode(op2));
                    edges.add(new OperandEdge(op1, opId));
                    edges.add(new OperandEdge(op2, opId));
                    edges.add(new TrunkEdge(trunk, opId, mainFormId));
                    stack.push(op2);

                } else if ( isUnary(operatorId) ) {
                    nodes.add(new OperatorNode(opId, symbol, mainFormId));
                    const op1 = stack.pop();
                    const op2 = makeId();
                    nodes.add(new ValueNode(op2));
                    edges.add(new OperandEdge(op1, opId));
                    edges.add(new OperandEdge(op2, opId));
                    stack.push(op2);

                } else if ( operatorId === getInverse(mainFormId) ) {
                    nodes.add(new OperatorNode(opId, symbol, mainFormId));
                    const trunk = stack.pop();
                    const op1 = stack.pop();
                    const op2 = makeId();
                    nodes.add(new ValueNode(op2));
                    edges.add(new OrderedEdge(op2, opId, 1));
                    edges.add(new OrderedEdge(op1, opId, 2));
                    edges.add(new TrunkEdge(trunk, opId, mainFormId));
                    stack.push(op2);

                } else if ( operatorId === getReverse(mainFormId) ) {
                    nodes.add(new OperatorNode(opId, symbol, mainFormId));
                    const trunk = stack.pop();
                    const op1 = stack.pop();
                    const op2 = makeId();
                    nodes.add(new ValueNode(op2));
                    edges.add(new OrderedEdge(op1, opId, 1));
                    edges.add(new OrderedEdge(op2, opId, 2));
                    edges.add(new TrunkEdge(trunk, opId, mainFormId));
                    stack.push(op2);
                } else {
                    throw new Error("Unknown function");
                }
            }
        } else if ( isNumber(item) ) {
            const valId = makeId();
            nodes.add(new ValueNode(valId, item));
            stack.push(valId);
        } else {
            const symId = item;
            if ( !nodes.get(symId) ) {
                nodes.add(new ValueNode(item, item));
            }
            stack.push(symId);
        }
    }

    return {
        nodes: nodes,
        edges: edges
    };
};
