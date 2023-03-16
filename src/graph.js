import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { exprToRPN, operators } from './expr/index.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeWholeEdge,
    makeValueNode,
    makeOperatorNode
} from './nodesedges.js';
import { makeId } from './id.js';

function isNumber(item) {
    return (Number(item) === item);
}

export function loadFormula(formulaStr) {
    const rpn = exprToRPN(formulaStr);
    console.log("loadFormula: RPN:", rpn);

    const nodes = new DataSet();
    const edges = new DataSet();

    const stack = [];
    for ( let item of rpn ) {
        //console.log("item:", item, operators[item], isNumber(item));
        if ( operators[item] ) {
            const operator = operators[item];
            const arity = operator.arity;
            const symbol = operator.symbol;
            const opId = makeId();

            if ( arity === 2 && symbol === '=' ) {
                const op2 = stack.pop();
                const op1 = stack.pop();
                //console.log("= (1):", nodes.get(op1));
                //console.log("= (2):", nodes.get(op2));
                if ( nodes.get(op1).data === null ) {
                    nodes.update({ ...nodes.get(op2), id: op1 });
                    nodes.remove(op2);
                } else {
                    nodes.update({ ...nodes.get(op1), id: op2 });
                    nodes.remove(op1);
                }
                nodes.remove(opId);
            } else if ( arity === 2 && (symbol === '-' || symbol === ':') ) {
                if ( symbol === "-" ) {
                    nodes.add(makeOperatorNode(opId, '+', '+'));
                } else if ( symbol === ":" ) {
                    nodes.add(makeOperatorNode(opId, '·', '·'));
                }
                const op1 = stack.pop();
                const hub = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, symbol));
                stack.push(op2);
            } else if ( arity === 2 && (symbol === '√') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^'));
                const hub = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, symbol));
                stack.push(op2);
            } else if ( arity === 2 && (symbol === 'log') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^'));
                const hub = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2));
                edges.add(makeBEdge(opId, op1));
                edges.add(makeAEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, symbol));
                stack.push(op2);
            } else if ( arity === 2 && (symbol === '+' || symbol === '·') ) {
                nodes.add(makeOperatorNode(opId, symbol, symbol));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(opId, op2));
                edges.add(makePartEdge(opId, op1));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, opId, symbol));
                stack.push(valId);
            } else if ( arity === 2 && (symbol === '^') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ', '^'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                const valId = makeId();
                nodes.add(makeValueNode(valId));
                edges.add(makeWholeEdge(valId, opId, symbol));
                stack.push(valId);
            } else if ( arity === 2 ) {
                throw new Error(`Unknown operator: ${symbol}`);
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

    //console.log("nodes:", nodes);
    //console.log("edges:", edges);

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };

    // initialize your network!

    return data;
};
