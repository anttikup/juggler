import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { expect } from "../testconfig.js";
import NetworkStub from "../test/NetworkStub.js";
import {
    rpnToGraph
} from "./exprToGraph.js";


describe("rpnToGraph", function () {
    beforeEach(() => {

    });

    it("inserts correct number of elements", function () {
        {
            const data = rpnToGraph([1, 2, "+/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
        }
        {
            const data = rpnToGraph([1, 2, "·/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
        }
        {
            const data = rpnToGraph([1, 2, "−/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
        }
        {
            const data = rpnToGraph([1, 2, "√/2"]);
            expect(data.nodes.length).to.equal(4);
            expect(data.edges.length).to.equal(3);
        }

        {
            const data = rpnToGraph([1, 2, "·/2", 3, "+/2"]);
            expect(data.nodes.length).to.equal(3 + 2 + 2); // 3 operands + 2 operators + 2 results
            expect(data.edges.length).to.equal(6);         // number of nodes - 1
        }

    });



});
