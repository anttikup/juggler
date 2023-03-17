import { makeId } from '../id.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeWholeEdge,
    makeValueNode,
    makeOperatorNode
} from '../nodesedges.js';

const duplicates = arr => {
    const seen = {};
    const out = [];
    for ( let item of arr ) {
        if ( seen[item] ) {
            out.push(item);
        }
        seen[item] = true;
    }
    return out;
};


export function extractCommonFactor(network, nodeId) {
    const { nodes, edges } = network.body.data;
    const node = nodes.get(nodeId);

    if ( node.data === '+' ) {
        const connected1 = network.getConnectedEdges(nodeId);
        //console.log("connected 1:", connected1);
        const tosummands = connected1.filter(id => edges.get(id).role === 'operand');
        //console.log("tosummands:", tosummands);
        const summands = tosummands.flatMap(id => network.getConnectedNodes(id, 'to')).filter(id => id !== nodeId);
        //console.log("summands:", summands);
        const multiplications = summands.flatMap(id => network.getConnectedNodes(id, 'to'));
        //console.log("multiplications:", multiplications);
        const factors = multiplications.flatMap(id => network.getConnectedNodes(id, 'to'));
        //console.log("factors:", factors);
        const commonFactor = duplicates(factors);
        if ( commonFactor.length === 0 ) {
            return;
        }
        //console.log(commonFactor[0]);
        const otherFactors = factors.filter(factor => factor !== commonFactor[0]);

        nodes.update(makeOperatorNode(node.id, '·'));
        const plus = makeId();
        nodes.add(makeOperatorNode(plus, '+'));
        const helper = makeId();
        nodes.add(makeValueNode(helper));

        summands.forEach(id => nodes.remove(id));
        multiplications.forEach(id => nodes.remove(id));

        edges.add(makePartEdge(node.id, commonFactor[0]));
        edges.add(makePartEdge(node.id, helper));
        edges.add(makeWholeEdge(helper, plus));
        edges.add(makePartEdge(plus, otherFactors[0]));
        edges.add(makePartEdge(plus, otherFactors[1]));

        //const connected2 = connected1.map(id => network.getConnectedNodes(id)).filter(id => id !== node.id);
        //console.log("connected 2:", connected2);
    }
};
