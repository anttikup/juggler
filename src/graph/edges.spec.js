import { expect } from "../testconfig.js";
import {
    TrunkEdge,
    OperandEdge,
    OrderedEdge,
} from './edges.js';


describe("TrunkEdge", function () {

    it("can access fields", function () {
        {
            const edge = new TrunkEdge(1, 2);
            expect(edge.from).to.equal(1);
            expect(edge.to).to.equal(2);
        }
    });

});

describe("OperandEdge", function () {

    it("can access fields", function () {
        {
            const edge = new OperandEdge(1, 2);
            expect(edge.from).to.equal(1);
            expect(edge.to).to.equal(2);
        }
    });

});

describe("OrderedEdge", function () {

    it("can access fields", function () {
        {
            const edge = new OrderedEdge(1, 2, 5);
            expect(edge.from).to.equal(1);
            expect(edge.to).to.equal(2);
            expect(edge.label).to.equal(String(5));
        }
    });

});
