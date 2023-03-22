import { isMain, getInverse } from './inverse.js';
import { functions } from '../expr/index.js';


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
            //console.log(" ", role, "->", children);
        }

        return members;
    }

    function graphToRPNRecursive(nodeId, output) {
        const neighbours = network.getConnectedNodes(nodeId);
        let added = 0;
        for ( let neighbour of neighbours ) {
            if ( visited[neighbour] ) {
                continue;
            }

            visited[neighbour] = true;

            const operator = nodes.get(neighbour).data;
            const members = getMembersOfRelation(neighbour);
            //console.log("operator:", operator, "members:", members, "node:", nodeId);

            if ( members['trunk'] === nodeId  && operator === "^/2" ) {
                text(members.operands[0], output);
                text(members.operands[1], output);
                output.push('^/2');

            } else if ( members['trunk'] === nodeId  && ["+/1", "−/1"].includes(operator) ) {
                text(members.operands[0], output);
                output.push(operator);
            } else if ( members['trunk'] === nodeId  && ["·/2", "+/2"].includes(operator) ) {
                text(members.operands[0], output);
                text(members.operands[1], output);
                output.push(operator);
            } else if ( members.operands[0] === nodeId && operator === "^/2" ) {
                text(members.operands[1], output);
                text(members['trunk'], output);
                output.push('√/2');

            } else if ( members.operands[1] === nodeId && operator === "^/2" ) {
                text(members.operands[0], output);
                text(members['trunk'], output);
                output.push('log/2');

            } else if ( members['operands'] && members['operands'].includes(nodeId) && operator === "·/2" ) {

                text(members['trunk'], output);
                members.operands.forEach((member) => {
                    if ( member !== nodeId ) {
                        text(member, output);
                    }
                });
                output.push('//' + members.operands.length);

            } else if ( members['operands'] && members['operands'].includes(nodeId) && ["+/1", "+/2"].includes(operator) ) {
                text(members['trunk'], output);
                members.operands.forEach((member) => {
                    if ( member !== nodeId ) {
                        text(member, output);
                    }
                });
                output.push('−/' + members.operands.length);

            } else if ( members['trunk'] === nodeId && functions[operator] && isMain(operator) ) {
                text(members.operands[0], output);
                output.push(operator);

            } else if ( members.operands && members.operands[0] === nodeId && isMain(operator) ) {
                text(members['trunk'], output);
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
