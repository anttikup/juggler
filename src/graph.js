import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { infixToRPN } from './shuntingYard.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeWholeEdge,
    makeValueNode,
    makeOperatorNode
} from './nodesedges.js';
import { makeId } from './id.js';


export function loadFormula(formulaStr) {
    const rpn = infixToRPN(formulaStr);
    console.log(rpn);

    const nodes = new DataSet();
    const edges = new DataSet();

    const stack = [];
    for ( let item of rpn ) {
        if ( item.item === "(val)" ) {
            const valId = makeId();
            nodes.add(makeValueNode(valId, item[0]));
            stack.push(valId);
            console.log("create val", valId);
        } else if ( item.item === "(sym)" ) {
            const symId = item[0];
            if ( !nodes.get(symId) ) {
                nodes.add(makeValueNode(item[0], item[0]));
                console.log("create sym", symId);
            }
            stack.push(symId);
        } else if ( item.item === undefined ) {
            const opId = makeId();
            const [operator, arity] = item.split('/');

            if ( Number(arity) === 2 && operator === '=' ) {
                const op2 = stack.pop();
                const op1 = stack.pop();
                console.log("= (1):", nodes.get(op1));
                console.log("= (2):", nodes.get(op2));
                if ( nodes.get(op1).label === ' ' ) {
                    nodes.update({ ...nodes.get(op2), id: op1 });
                    nodes.remove(op2);
                } else {
                    nodes.update({ ...nodes.get(op1), id: op2 });
                    nodes.remove(op1);
                }
                nodes.remove(opId);
            } else if ( Number(arity) === 2 && (operator === '-' || operator === ':') ) {
                if ( operator === "-" ) {
                    nodes.add(makeOperatorNode(opId, '+'));
                } else if ( operator === ":" ) {
                    nodes.add(makeOperatorNode(opId, '·'));
                }
                const op1 = stack.pop();
                const hub = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2, ' '));
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, operator));
                stack.push(op2);
            } else if ( Number(arity) === 2 && (operator === '√') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ'));
                const hub = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2, ' '));
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, operator));
                stack.push(op2);
            } else if ( Number(arity) === 2 && (operator === 'log') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ'));
                const hub = stack.pop();
                const op1 = stack.pop();
                const op2 = makeId();
                nodes.add(makeValueNode(op2, ' '));
                edges.add(makeBEdge(opId, op1));
                edges.add(makeAEdge(opId, op2));
                edges.add(makeWholeEdge(hub, opId, operator));
                stack.push(op2);
            } else if ( Number(arity) === 2 && (operator === '+' || operator === '·') ) {
                nodes.add(makeOperatorNode(opId, operator));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                const valId = makeId();
                nodes.add(makeValueNode(valId, ' '));
                edges.add(makeWholeEdge(valId, opId, operator));
                stack.push(valId);
            } else if ( Number(arity) === 2 && (operator === '^') ) {
                nodes.add(makeOperatorNode(opId, '◌ⁿ'));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makeAEdge(opId, op1));
                edges.add(makeBEdge(opId, op2));
                const valId = makeId();
                nodes.add(makeValueNode(valId, ' '));
                edges.add(makeWholeEdge(valId, opId, operator));
                stack.push(valId);
            } else if ( Number(arity) === 2 ) {
                nodes.add(makeOperatorNode(opId, operator));
                const op1 = stack.pop();
                const op2 = stack.pop();
                edges.add(makePartEdge(opId, op1));
                edges.add(makePartEdge(opId, op2));
                const valId = makeId();
                nodes.add(makeValueNode(valId, ' '));
                edges.add(makeWholeEdge(valId, opId, operator));
                stack.push(valId);
            }
        }
        console.log("stack:", stack);
    }

    console.log("nodes:", nodes);
    console.log("edges:", edges);

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };

    // initialize your network!

    return data;
};
