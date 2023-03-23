import { isMain, getInverse, getReverse } from './inverse.js';
import { isBinary, isCommutative, isFunction, isUnary } from './operators.js';


export function graphToRPN(network, start) {
    const visited = {};
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    const rpn = [];

    const nodeinfo = nodes.get(start);

    // if node has a name
    if ( nodeinfo.data !== null ) {
        rpn.push(nodes.get(start).data);
        graphToRPNRecursive(start, rpn);
        rpn.push('=/2');
    } else {
        graphToRPNRecursive(start, rpn);
    }

    console.log("graphToRPN: RPN:", rpn);
    return rpn;


    function text(nodeId, output) {
        const node = nodes.get(nodeId);
        if ( node.data === null ) {
            output += graphToRPNRecursive(nodeId, output);
        } else {
            output.push(node.data);
        }
    }

    function getMembersOfRelation(nodeId) {
        const conns = network.getConnectedEdges(nodeId);
        const members = {};
        let counter = 0;
        for ( let conn of conns ) {
            const role = edges.get(conn).role;
            const children = network.getConnectedNodes(conn).filter(id => id !== nodeId);
            if ( role === "operand" || role === "orderedOperand" ) {
                if ( !members.operands ) {
                    members.operands = [];
                }
                members.operands.push(children[0]);
            } else {
                members[ role ] = children[0];
            }
        }

        return members;
    }

    function graphToRPNRecursive(nodeId, output) {
        let added = 0;
        const neighbours = network.getConnectedNodes(nodeId);

        for ( let neighbour of neighbours ) {
            if ( visited[neighbour] ) {
                continue;
            }

            visited[neighbour] = true;

            const operator = nodes.get(neighbour).data;
            const members = getMembersOfRelation(neighbour);

            if ( members.trunk === nodeId && isBinary(operator) ) {
                text(members.operands[0], output);
                text(members.operands[1], output);
                output.push(operator);

            } else if ( members.trunk === nodeId  && isUnary(operator) ) {
                text(members.operands[0], output);
                output.push(operator);
            }
            // eg. exponentiation
            else if ( members.operands[0] === nodeId && isBinary(operator) && !isCommutative(operator) ) {
                text(members.operands[1], output);
                text(members.trunk, output);
                // eg. root for exponentiation
                output.push(getInverse(operator));

            } else if ( members.operands[1] === nodeId && isBinary(operator) && !isCommutative(operator) ) {
                text(members.operands[0], output);
                text(members.trunk, output);
                // eg. logarithm for exponentiation
                output.push(getReverse(operator));

            } else if ( members.operands.includes(nodeId) && isCommutative(operator) ) {
                text(members.trunk, output);
                members.operands.forEach((member) => {
                    if ( member !== nodeId ) {
                        text(member, output);
                    }
                });
                output.push(getInverse(operator));

            } else if ( members.operands[0] === nodeId && isUnary(operator) ) {
                text(members.trunk, output);
                output.push(getInverse(operator));

            } else {
                throw new Error(`Unknown operator: ${operator}`);
            }

            added++;
        }

        while ( --added > 0 ) {
            output.push('=/2');
        }
    }

}
