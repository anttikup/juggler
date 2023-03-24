import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { expect } from "../testconfig.js";
import NetworkStub from "../test/NetworkStub.js";
import {
    rpnToGraph
} from "./exprToGraph.js";


function nodeValues(data) {
    return data.nodes.get().map(
        node => !node.data ? '=' : node.data
    ).join(' ');
}

function edgeValues(data) {
    return data.edge.get().map(edge => edgee.label);
}

describe("rpnToGraph", function () {
    beforeEach(() => {

    });

    it("inserts binary operators", function () {
        {
            const data = rpnToGraph([1, 2, "+/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
            expect(nodeValues(data)).to.equal("1 2 +/2 =");
        }
        {
            const data = rpnToGraph([1, 2, "·/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
            expect(nodeValues(data)).to.equal("1 2 ·/2 =");
        }
        {
            const data = rpnToGraph([1, 2, "−/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
            expect(nodeValues(data)).to.equal("1 2 +/2 =");
        }
        {
            const data = rpnToGraph([1, 2, "√/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
            expect(nodeValues(data)).to.equal("1 2 ^/2 =");
        }
    });

    it("inserts unary operators", function () {
        {
            const data = rpnToGraph([1, "−/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 +/1 =");
        }
        {
            const data = rpnToGraph([1, "+/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 +/1 =");
        }
        {
            const data = rpnToGraph([1, "sin/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 sin/1 =");
        }
        {
            const data = rpnToGraph([1, "cos/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 cos/1 =");
        }
        {
            const data = rpnToGraph([1, "tan/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 tan/1 =");
        }
        {
            const data = rpnToGraph([1, "arcsin/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 arcsin/1 =");
        }
        {
            const data = rpnToGraph([1, "arccos/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 arccos/1 =");
        }
        {
            const data = rpnToGraph([1, "arctan/1"]);
            expect(data.nodes.length).to.equal(3);
            expect(data.edges.length).to.equal(2);
            expect(nodeValues(data)).to.equal("1 arctan/1 =");
        }
    });

    it("inserts expressions", function () {
        {
            const data = rpnToGraph([1, 2, "·/2", 3, "+/2"]);
            expect(data.nodes.length).to.equal(3 + 2 + 2); // 3 operands + 2 operators + 2 results
            expect(data.edges.length).to.equal(6);         // number of nodes - 1
            expect(nodeValues(data)).to.equal("1 2 ·/2 = 3 +/2 =");
        }
    });



});
