import { DataSet } from "vis-data";

import { expect } from "../testconfig.js";
import NetworkStub from "./NetworkStub.js";

describe("NetworkStub", function () {
    const nodes = new DataSet();
    const edges = new DataSet();

    describe("construction", function () {
        beforeEach(() => {
            nodes.clear();
            edges.clear();
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            edges.add({ from: 1, to: 2, id: "1-2" });
        });

        it("can construct", function () {
            const stub = new NetworkStub(null, { nodes: new DataSet(), edges: new DataSet() }, {});
        });
    });

    describe("functionality", function () {
        const stub = new NetworkStub(null, { nodes, edges }, {});

        beforeEach(() => {
            nodes.clear();
            edges.clear();
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            edges.add({ from: 1, to: 2, id: "1-2" });
        });

        it("can set data", function () {
            stub.setData({ nodes, edges });
        });

        it("can get edges connected to a node", function () {
            const conns = stub.getConnectedEdges(1);
            expect(conns).to.deep.equal(["1-2"]);
        });

        it("can get nodes connected to an edge", function () {
            const nodes = stub.getConnectedNodes("1-2");
            expect(nodes.length).to.equal(2);
            expect(nodes).to.deep.equal([1, 2]);
        });

        it("can get nodes connected to a node", function () {
            const nodes = stub.getConnectedNodes(1);
            expect(nodes.length).to.equal(1);
            expect(nodes).to.deep.equal([2]);

        });
    });

});
