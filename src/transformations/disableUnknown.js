import { makeId } from '../id.js';
import {
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeTrunkEdge,
    makeValueNode,
    makeOperatorNode
} from '../graph/nodesedges.js';

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


export function disableUnknown(network, nodeId) {
    const { nodes, edges } = network.body.data;
    const node = nodes.get(nodeId);
    node.value = null;
    nodes.update(makeValueNode(node.id));
};
