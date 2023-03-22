import { makeId } from '../id.js';
import {
    ValueNode
} from '../graph/nodes.js';


export function disableUnknown(graph, nodeId) {
    const node = graph.nodes.get(nodeId);
    if ( !node.name ) {
        throw new Error("Not an unknown");
    }
    if ( graph.getConnectedEdges(nodeId).length < 2 ) {
        throw new Error("Node must be connected to at least two nodes");
    }

    graph.nodes.update(ValueNode.getBridgeEnabled(node));
};


export function enableUnknown(graph, nodeId) {
    const node = graph.nodes.get(nodeId);

    graph.nodes.update(ValueNode.getBridgeDisabled(node));
};

export function toggleEnabled(graph, nodeId) {
    const node = graph.nodes.get(nodeId);
    if ( !node.name ) {
        throw new Error("Not an unknown");
    }

    if ( node.data ) {
        console.log("disable");
        disableUnknown(graph, nodeId);
    } else {
        console.log("enable");

        enableUnknown(graph, nodeId);
    }
};
