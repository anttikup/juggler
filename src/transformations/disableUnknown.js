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
    if ( !node.name ) {
        throw new Error("Not an unknown");
    }
    if ( network.getConnectedEdges(nodeId).length < 2 ) {
        throw new Error("Node must be connected to at least two nodes");
    }

    nodes.update(makeValueNode(node.id, null, node.name));

    console.log(nodes.get(node.id));
};


export function enableUnknown(network, nodeId) {
    const { nodes, edges } = network.body.data;
    const node = nodes.get(nodeId);

    nodes.update(makeValueNode(node.id, node.name, node.name));
};

export function toggleEnabled(network, nodeId) {
    const { nodes, edges } = network.body.data;
    const node = nodes.get(nodeId);
    if ( !node.name ) {
        throw new Error("Not an unknown");
    }

    if ( node.data ) {
        console.log("disable");
        disableUnknown(network, nodeId);
    } else {
        console.log("enable");

        enableUnknown(network, nodeId);
    }
};
