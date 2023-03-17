import { DataSet } from "vis-data";

import { exprToRPN, operators, functions } from '../expr/index.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeNEdge,
    makeWholeEdge,
    makeValueNode,
    makeOperatorNode,
    makeFunctionNode
} from './nodesedges.js';
import { makeId } from '../id.js';

function isNumber(item) {
    return (Number(item) === item);
}


function moveEdges(from, to, edges) {
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
}



export function loadFormula(formulaStr) {
    const rpn = exprToRPN(formulaStr);
    console.log("loadFormula: RPN:", rpn);

    const nodes = new DataSet();
    const edges = new DataSet();

    const stack = [];
    for ( let item of rpn ) {
        if ( operators[item] ) {
            const operator = item;
            const operator_info = operators[item];
            const arity = operator_info.arity;
            const symbol = operator_info.symbol;
            const opId = makeId();

            if ( operator === "=/2" ) {
                const op2 = stack.pop();
                const op1 = stack.pop();
                console.log("= (1) [", op1, "]:", nodes.get(op1));
                console.log("= (2) [", op2, "]:", nodes.get(op2));
                if ( nodes.get(op1).data === null ) {
                    nodes.update({ ...nodes.get(op2), id: op1 });
                    nodes.remove(op2);
                    moveEdges(op2, op1, edges);
                    stack.push(op1);
                } else {
                    nodes.update({ ...nodes.get(op1), id: op2 });
                    nodes.remove(op1);
                    moveEdges(op1, op2, edges);
                    stack.push(op2);
                }
                nodes.remove(opId);
            } else if ( operator === "−/2" ) {
                nodes.add(makeOperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                edges.add(makeWholeEdge(trunk, opId, '+/2'));
                stack.push(op2);

            } else if ( operator === '//2' ) {
                nodes.add(makeOperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                edges.add(makeWholeEdge(trunk, opId, '·/2'));
                stack.push(op2);

            } else if ( operator === '√/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                edges.add(makeWholeEdge(trunk, opId, '^/2'));
                stack.push(op2);

            } else if ( operator === 'log/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeBEdge(opId, op1));
                edges.add(makeAEdge(opId, op2));
                edges.add(makeWholeEdge(trunk, opId, '^/2'));
                stack.push(op2);

            } else if ( operator === '+/2' ) {
                nodes.add(makeOperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(opId, op2));
                edges.add(makePartEdge(opId, op1));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, opId, '+/2'));
                stack.push(valId);

            } else if ( operator === '·/2' ) {
                nodes.add(makeOperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(opId, op2));
                edges.add(makePartEdge(opId, op1));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, opId, '·/2'));
                stack.push(valId);

            } else if ( operator === '^/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, opId, '^/2'));
                stack.push(valId);
            } else if ( arity === 2 ) {
                throw new Error(`Unknown operator: ${operator}`);
            } else {
                throw new Error("Not implemented");
            }
        } else if ( functions[item] ) {
            const func = item;
            const funcInfo = functions[item];
            const arity = funcInfo.arity;
            const symbol = funcInfo.symbol;
            const funcId = makeId();

            if ( arity === 1 ) {
                nodes.add(makeFunctionNode(funcId, symbol, func));
                const op1 = stack.pop();
                edges.add(makeNEdge(funcId, op1, 1));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, funcId, func));
                stack.push(valId);
            } else {
                throw new Error("Not implemented");
            }
        } else if ( isNumber(item) ) {
            const valId = makeId();
            nodes.add(makeValueNode(valId, item));
            stack.push(valId);
            //console.log("create val", valId);
        } else {
            const symId = item;
            if ( !nodes.get(symId) ) {
                nodes.add(makeValueNode(item, item));
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
