/**
 * Move one end of an edge from `oldNodeId` to `newNodeId`.
 *
 * Actually creates a new edge.
 **/
export function moveEdge(network, edgeId, oldNodeId, newNodeId) {
    const edges = network.body.data.edges;

    const oldEdge = edges.get(edgeId);
    edges.remove(edgeId);

    const newEdge = { ...oldEdge };
    if ( oldEdge.from === oldNodeId ) {
        newEdge.from = newNodeId;
    }
    if ( oldEdge.to === oldNodeId ) {
        newEdge.to = newNodeId;
    }

    newEdge.id = getEdgeId(newEdge.from, newEdge.to);

    if ( !edges.get(newEdge.id) ) {
        return edges.add(newEdge);
    }
}


/**
 * Move all edges from `oldNodeIds` to `newNodeId` and remove nodes `oldNodeIds`.
 **/
export function combineNodes(network, newNodeId, ...oldNodeIds) {
    const edges = network.body.data.edges;
    const nodes = network.body.data.nodes;

    const edgesToMove = edges.get(oldNodeIds.flatMap(oldNode => network.getConnectedEdges(oldNode)));

    edgesToMove.forEach(edge => {
        if ( oldNodeIds.includes(edge.from) ) {
            moveEdge(network, edge.id, edge.from, newNodeId);
        }
        if ( oldNodeIds.includes(edge.to) ) {
            moveEdge(network, edge.id, edge.to, newNodeId);
        }
    });

    oldNodeIds.forEach(oldNodeId => nodes.remove(oldNodeId));

    return newNodeId;
};

export function getEdgeId(from, to) {
    return String(from) + "\v" + String(to);
};

export function removeEdge(network, from, to) {
    const edges = network.body.data.edges;
    edges.remove(getEdgeId(from, to));
};

export function getEdge(network, from, to) {
    const edges = network.body.data.edges;
    return edges.get(getEdgeId(from, to));
};

export function removeEdges(network, node) {
    const edges = network.body.data.edges;

    const edges_to_remove = edges.get({
        filter: function (item) {
            return (item.from === node || item.to === node);
        }
    });

    edges_to_remove.forEach(edge => {
        edges.remove(edge);
    });

};


export function getNeighbours(network, nodeId, exclude) {
    const { nodes } = network.body.data;
    const nodeIds = network
        .getConnectedNodes(nodeId)
        .filter(id => !exclude.includes(id));

    return nodes.get(nodeIds);
};

export function getNeighboursOfType(network, nodeId, type) {
    const { nodes } = network.body.data;

    const nodeIds = network.getConnectedNodes(nodeId);
    const res = nodes.get(nodeIds).filter(node => node.data === type);
    //console.log("Found neighbours of type", type, ":", res);

    return res;
};




export function findPaths(network, start, path) {
    const foundPaths = [];

    findPathsInner(start, path, []);

    return foundPaths;

    function findPathsInner(current, pathLeft, pathGone) {
        if ( pathLeft.length === 0 ) {
            foundPaths.push(pathGone);
            return;
        }

        const type = pathLeft[0];
        const neighbours = type === 'value'
                         ? getNeighbours(network, current, pathGone)
                        :  getNeighboursOfType(network, current, type)
                            .filter(node => !pathGone.includes(node.id));

        for ( const neighbour of neighbours ) {
            if ( neighbour.id !== start ) {
                findPathsInner(neighbour.id, pathLeft.slice(1), pathGone.concat([neighbour.id]));
            }
        }
    }
};


export function bundlePaths(paths) {
    const bundles = new Map();
    for ( const path of paths ) {
        const last = path[path.length - 1];
        if ( !bundles.has(last) ) {
            bundles.set(last, []);
        }
        bundles.get(last).push(path);
    }

    for ( const [key, pathList] of bundles.entries() ) {
        if ( pathList.length < 2 ) {
            bundles.delete(key);
        }
    }

    return Array.from(bundles.values());
};


/**
 * Find paths starting from `start` going through `path` and ending
 * up in the same node (last element of `path`).
 **/
export function findLoopingPaths(network, start, path) {
    const paths = findPaths(network, start, path);

    // Find the paths that end in the same +/2 node.
    const bundledPaths = bundlePaths(paths);

    if ( bundledPaths.length === 0 ) {
        return [];
    }

    console.assert(bundledPaths.length === 1, "not implemented");

    return bundledPaths[0];
};

/**
 * Find paths starting from `start` going through `path` and ending
 * up in the same node (last element of `path`).
 **/
export function findLoopingPathsWithRole(network, start, path) {
    const paths = findPathsWithRole(network, start, path);
    //console.log("paths:", paths);
    // Find the paths that end in the same +/2 node.
    const bundledPaths = bundlePaths(paths);

    if ( bundledPaths.length === 0 ) {
        return [];
    }

    console.assert(bundledPaths.length === 1, "not implemented");

    return bundledPaths[0];
};




export function getMembers(network, nodeId) {
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    const node = nodes.get(nodeId);

    console.assert(node.type === 'operator' || node.type === 'function', `Node is not an operator or a function: ${nodeId}`);

    const conns = network.getConnectedEdges(nodeId);

    const members = {};
    for ( let conn of conns ) {
        const role = edges.get(conn).role;
        const children = network.getConnectedNodes(conn).filter(id => id !== nodeId);
        console.assert(children.length === 1, "many nodes");
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
};


export function getRoleIn(network, nodeId, targetId) {
    const edges = network.body.data.edges;
    const nodes = network.body.data.nodes;
    const targetNode = nodes.get(targetId);

    console.assert(targetNode.type === 'operator' || targetNode.type === 'function', `Not an operator or function: ${targetId}`);

    const conn = edges.get(getEdgeId(nodeId, targetId));
    if ( conn ) {
        return conn.role;
    }

    return edges.get(getEdgeId(targetId, nodeId)).role;
};

export function getMembersByRole(network, nodeId, role) {
    const edges = network.body.data.edges;
    const nodes = network.body.data.nodes;
    const node = nodes.get(nodeId);

    console.assert(node.type === 'operator' || node.type === 'function', `Not an operator or function: ${nodeId}`);

    const conns = network.getConnectedEdges(nodeId)
                         .map(edgeId => edges.get(edgeId))
                         .filter(edge => edge.role === role);

    return conns.flatMap(edge => [ edge.to, edge.from ]).filter(id => id != nodeId);
};


/**
 * Return true if node `nodeId` has role `role` in operator node `targetId´.
 **/
export function hasRoleIn(network, nodeId, role, targetId) {
    const edges = network.body.data.edges;

    if ( role === "trunk" ) {
        const edge = edges.get(getEdgeId(targetId, nodeId));
        if ( edge && edge.role === "trunk" ) {
            return true;
        }
    }

    const edge = edges.get(getEdgeId(nodeId, targetId));
    if ( edge && edge.role === role ) {
        return true;
    }

    return false;
}



export function findPathsWithRole(network, start, path) {
    const nodes = network.body.data.nodes;
    const foundPaths = [];

    findPathsInner(start, path, []);

    return foundPaths;

    function findPathsInner(current, pathLeft, pathGone) {
        if ( pathLeft.length === 0 ) {
            foundPaths.push(pathGone);
            return;
        }

        const role = pathLeft[0];
        const type = pathLeft[1];

        //console.log("looking for ", role, "in", type);

        let neighbours = [];
        if ( type === 'value' ) {
            neighbours = nodes.get(getMembersByRole(network, current, role));

        } else {
            neighbours = getNeighboursOfType(network, current, type)
                .filter(node => !pathGone.includes(node.id))
                .filter(node => hasRoleIn(network, current, role, node.id));
        }

        for ( const neighbour of neighbours ) {
            if ( neighbour.id !== start ) {
                findPathsInner(neighbour.id, pathLeft.slice(2), pathGone.concat([neighbour.id]));
            }
        }

    }
};
