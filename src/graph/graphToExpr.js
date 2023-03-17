import { rpnToExpr, functions } from '../expr/index.js';
import { isMain, getInverse } from './inverse.js';


export function getFormula(network, start) {
    const visited = {};
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    const rpn = [];

    const nodeinfo = nodes.get(start);

    // if node has a name
    if ( nodeinfo.data !== null ) {
        rpn.push(nodes.get(start).data);
        getFormulaRecursive(start, rpn);
        rpn.push('=/2');
    } else {
        getFormulaRecursive(start, rpn);
    }

    console.log("getFormula: RPN:", rpn);
    return rpnToExpr(rpn);


    function text(nodeId, output) {
        const node = nodes.get(nodeId);
        if ( node.data === null ) {
            output += getFormulaRecursive(nodeId, output);
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
            if ( role === "operand" || role === "n-operand" ) {
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

    function getFormulaRecursive(nodeId, output) {
        const relations = network.getConnectedNodes(nodeId);
        let added = 0;
        for ( let relation of relations ) {
            if ( visited[relation] ) {
                continue;
            }

            visited[relation] = true;

            const operator = nodes.get(relation).data;
            const members = getMembersOfRelation(relation);
            console.log("operator:", operator, "members:", members, "node:", nodeId);

            if ( members['trunk'] === nodeId  && operator === "^/2" ) {
                text(members['l-operand'], output);
                text(members['r-operand'], output);
                output.push('^/2');

            } else if ( members['trunk'] === nodeId  && ["·/2", "+/2"].includes(operator) ) {
                text(members.operands[0], output);
                text(members.operands[1], output);
                output.push(operator);
            } else if ( members['l-operand'] === nodeId && operator === "^/2" ) {
                text(members['r-operand'], output);
                text(members['trunk'], output);
                output.push('√/2');

            } else if ( members['r-operand'] === nodeId && operator === "^/2" ) {
                text(members['l-operand'], output);
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

            } else if ( members['operands'] && members['operands'].includes(nodeId) && operator === "+/2" ) {

                text(members['trunk'], output);
                members.operands.forEach((member) => {
                    if ( member !== nodeId ) {
                        text(member, output);
                    }
                });
                output.push('−/' + members.operands.length);

            } else if ( members['trunk'] === nodeId && functions[operator] && isMain(operator) ) {
                console.log("trunk, ", operator);
                text(members.operands[0], output);
                output.push(operator);

            } else if ( members.operands && members.operands[0] === nodeId && isMain(operator) ) {
                console.log("operand, cos");
                text(members['trunk'], output);
                output.push(getInverse(operator));

            }

            added++;
        }

        while ( --added > 0 ) {
            output.push('=/2');
        }
    }

}
