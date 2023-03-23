import { DataSet } from "vis-data";

import { exprToRPN, operators, functions } from '../expr/index.js';
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



function combineNodes(edges, from, to) {
    console.log("MOVE EDGES:", from, to);

    const edges_to_move = edges.get({
        filter: function (item) {
            return (item.from === from || item.to === from);
        }
    });

    edges_to_move.forEach(edge => {
        if ( edge.from === from ) {
            edge.from = to;
            console.log("moved", from);
        }
        if ( edge.to === from ) {
            edge.to = to;
            console.log("moved", from);
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
            const operator = item;
            const operatorInfo = operators[item];
            const arity = operatorInfo.arity;
            const symbol = operatorInfo.symbol;
            const opId = makeId();

            if ( operator === "=/2" ) {
                const op2 = stack.pop();
                const op1 = stack.pop();
                console.log("= (1) [", op1, "]:", nodes.get(op1));
                console.log("= (2) [", op2, "]:", nodes.get(op2));
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

            } else if ( operator === '+/1' ) {
                nodes.add(new OperatorNode(opId, '+', '+/1'));
                const op1 = stack.pop();
                edges.add(new OperandEdge(op1, opId));
                const valId = makeId();
                nodes.add(new ValueNode(valId));
                edges.add(new TrunkEdge(valId, opId, '+/1'));
                stack.push(valId);

            } else if ( operator === '−/1' ) {
                nodes.add(new OperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                //const trunk = makeId();
                const op2 = makeId();
                //nodes.add(new ValueNode(trunk, '0'));
                nodes.add(new ValueNode(op2));
                edges.add(new OperandEdge(op1, opId));
                edges.add(new OperandEdge(op2, opId));
                //edges.add(new TrunkEdge(trunk, opId, '+/2'));
                stack.push(op2);

            } else if ( operator === '+/2' ) {
                nodes.add(new OperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(new OperandEdge(op2, opId));
                edges.add(new OperandEdge(op1, opId));
                const valId = makeId();
                nodes.add(new ValueNode(valId));
                edges.add(new TrunkEdge(valId, opId, '+/2'));
                stack.push(valId);

            } else if ( operator === '·/2' ) {
                nodes.add(new OperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(new OperandEdge(op2, opId));
                edges.add(new OperandEdge(op1, opId));
                const valId = makeId();
                nodes.add(new ValueNode(valId));
                edges.add(new TrunkEdge(valId, opId, '·/2'));
                stack.push(valId);

            } else if ( operator === '^/2' ) {
                nodes.add(new OperatorNode(opId, '◌ⁿ', '^/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(new OrderedEdge(op2, opId, 1));
                edges.add(new OrderedEdge(op1, opId, 2));
                const valId = makeId();
                nodes.add(new ValueNode(valId));
                edges.add(new TrunkEdge(valId, opId, '^/2'));
                stack.push(valId);
            } else if ( operator === "−/2" ) {
                nodes.add(new OperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(new ValueNode(op2));
                edges.add(new OperandEdge(op1, opId));
                edges.add(new OperandEdge(op2, opId));
                edges.add(new TrunkEdge(trunk, opId, '+/2'));
                stack.push(op2);

            } else if ( operator === '//2' ) {
                nodes.add(new OperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(new ValueNode(op2));
                edges.add(new OperandEdge(op1, opId));
                edges.add(new OperandEdge(op2, opId));
                edges.add(new TrunkEdge(trunk, opId, '·/2'));
                stack.push(op2);

            } else if ( operator === '√/2' ) {
                nodes.add(new OperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(new ValueNode(op2));
                edges.add(new OrderedEdge(op2, opId, 1));
                edges.add(new OrderedEdge(op1, opId, 2));
                edges.add(new TrunkEdge(trunk, opId, '^/2'));
                stack.push(op2);

            } else if ( operator === 'log/2' ) {
                nodes.add(new OperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(new ValueNode(op2));
                edges.add(new OrderedEdge(op1, opId, 1));
                edges.add(new OrderedEdge(op2, opId, 2));
                edges.add(new TrunkEdge(trunk, opId, '^/2'));
                stack.push(op2);

            } else if ( operator === ';/2' ) {
                stack.push(opId);
                console.assert(item === rpn[rpn.length - 1], "Semicolon (;) should be last operator")
            } else {
                throw new Error(`Unknown operator: ${operator}`);
            }
        } else if ( functions[item] ) {
            const func = item;
            const funcInfo = functions[item];
            const arity = funcInfo.arity;
            const symbol = funcInfo.symbol;
            const funcId = makeId();

            if ( arity === 1 ) {
                nodes.add(new FunctionNode(funcId, symbol, func));
                const op1 = stack.pop();
                edges.add(new OrderedEdge(op1, funcId, 1));
                const valId = makeId();
                nodes.add(new ValueNode(valId));
                edges.add(new TrunkEdge(valId, funcId, func));
                stack.push(valId);
            } else {
                throw new Error("Not implemented");
            }
        } else if ( isNumber(item) ) {
            const valId = makeId();
            nodes.add(new ValueNode(valId, item));
            stack.push(valId);
            //console.log("create val", valId);
        } else {
            const symId = item;
            if ( !nodes.get(symId) ) {
                nodes.add(new ValueNode(item, item));
                //console.log("create sym", symId);
            }
            stack.push(symId);
        }
        //console.log("stack:", stack);
    }

    return {
        nodes: nodes,
        edges: edges
    };
};
