import { Network } from "vis-network";

import { rpnToGraph } from './exprToGraph.js';
import { graphToRPN } from './graphToExpr.js';

export default class Graph {

    constructor(container) {
        const options = {};
        const data = {};
        this.vis = new Network(container, data, options);
    }

    on(event, func) {
        this.vis.on('click', func);
    }

    getSelectedNodes() {
        return this.vis.getSelectedNodes();
    }

    setRPN(rpn) {
        this.vis.setData(rpnToGraph(rpn));
    }

    getRPN(povId) {
        return graphToRPN(this.vis, povId);
    }

    get nodes() {
        return this.vis.body.data.nodes;
    }

    get edges() {
        return this.vis.body.data.edges;
    }

    getConnectedEdges(node) {
        return this.vis.getConnectedEdges(node);
    }

};
