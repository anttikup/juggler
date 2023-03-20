import { DataSet } from "vis-data";

import { exprToRPN, operators, functions } from '../expr/index.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeOrderedEdge,
    makeTrunkEdge,
    makeValueNode,
    makeOperatorNode,
    makeFunctionNode
} from './nodesedges.js';
import { makeId } from '../id.js';

function isNumber(item) {
    return (Number(item) === item);
}


function combineNodes(from, to, edges) {
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
                    stack.push(combineNodes(op2, op1, edges));
                    nodes.remove(op2);
                } else if ( nodes.get(op2).data !== null ) {
                    stack.push(combineNodes(op1, op2, edges));
                    nodes.remove(op1);
                } else {
                    stack.push(combineNodes(op1, op2, edges));
                    nodes.remove(op1);
                }
                nodes.remove(opId);

            } else if ( operator === '+/1' ) {
                nodes.add(makeOperatorNode(opId, '+', '+/1'));
                const op1 = stack.pop();
                edges.add(makePartEdge(op1, opId));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeTrunkEdge(valId, opId, '+/1'));
                stack.push(valId);

            } else if ( operator === '−/1' ) {
                nodes.add(makeOperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                //const trunk = makeId();
                const op2 = makeId();
                //nodes.add(makeValueNode(trunk, '0'));
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(op1, opId));
                edges.add(makePartEdge(op2, opId));
                //edges.add(makeTrunkEdge(trunk, opId, '+/2'));
                stack.push(op2);

            } else if ( operator === '+/2' ) {
                nodes.add(makeOperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(op2, opId));
                edges.add(makePartEdge(op1, opId));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeTrunkEdge(valId, opId, '+/2'));
                stack.push(valId);

            } else if ( operator === '·/2' ) {
                nodes.add(makeOperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(op2, opId));
                edges.add(makePartEdge(op1, opId));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeTrunkEdge(valId, opId, '·/2'));
                stack.push(valId);

            } else if ( operator === '^/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makeAEdge(op1, opId));
                edges.add(makeBEdge(op2, opId));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeTrunkEdge(valId, opId, '^/2'));
                stack.push(valId);
            } else if ( operator === "−/2" ) {
                nodes.add(makeOperatorNode(opId, '+', '+/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(op1, opId));
                edges.add(makePartEdge(op2, opId));
                edges.add(makeTrunkEdge(trunk, opId, '+/2'));
                stack.push(op2);

            } else if ( operator === '//2' ) {
                nodes.add(makeOperatorNode(opId, '·', '·/2'));
                const op1 = stack.pop();
                const trunk = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(op1, opId));
                edges.add(makePartEdge(op2, opId));
                edges.add(makeTrunkEdge(trunk, opId, '·/2'));
                stack.push(op2);

            } else if ( operator === '√/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeAEdge(op1, opId));
                edges.add(makeBEdge(op2, opId));
                edges.add(makeTrunkEdge(trunk, opId, '^/2'));
                stack.push(op2);

            } else if ( operator === 'log/2' ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^/2'));
                const trunk = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeBEdge(op1, opId));
                edges.add(makeAEdge(op2, opId));
                edges.add(makeTrunkEdge(trunk, opId, '^/2'));
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
                nodes.add(makeFunctionNode(funcId, symbol, func));
                const op1 = stack.pop();
                edges.add(makeOrderedEdge(op1, funcId, 1));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeTrunkEdge(valId, funcId, func));
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
