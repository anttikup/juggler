export default class NetworkStub {
    constructor(container, data, options) {
        this.body = {
            data: {}
        }
        this.setData(data);
    }

    setData(data) {
        this.body.data = data;
    }

    getConnectedEdges(nodeId) {
        const node = this.body.data.nodes.get(nodeId);
        const edges = [];
        this.body.data.edges.forEach(edge => {
            if ( edge.from === node.id ) {
                edges.push(edge);
            }
            if ( edge.to === node.id ) {
                edges.push(edge);
            }
        });

        return edges.map(edge => edge.id);
    }

    _isNodeId(id) {
        if ( this.body.data.nodes.get(id) ) {
            return true;
        }
        return false;
    }

    _isEdgeId(id) {
        if ( this.body.data.edges.get(id) ) {
            return true;
        }
        return false;
    }

    getConnectedNodes(nodeOrEdgeId) {
        let edgeIds = [];

        if ( this._isNodeId(nodeOrEdgeId) ) {
            const node = this.body.data.nodes.get(nodeOrEdgeId);
            if ( node ) {
                edgeIds = edgeIds.concat(this.getConnectedEdges(nodeOrEdgeId));
            }
        } else if ( this._isEdgeId(nodeOrEdgeId) ) {
            const edge = this.body.data.edges.get(nodeOrEdgeId);
            if ( edge ) {
                edgeIds = [edge.id];
            }
        } else {
            throw new Error(`not an edge or node id: ${nodeOrEdgeId}`);
        }



        const edges = this.body.data.edges.get(edgeIds);

        return edges.flatMap(edge => [edge.from, edge.to]).filter(id => id !== nodeOrEdgeId);
    }
};
