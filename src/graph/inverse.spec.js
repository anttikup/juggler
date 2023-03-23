import { expect } from "../testconfig.js";

import { getInverse, getReverse } from './inverse.js';


describe("getInverse", function () {
    it("returns inverse", function () {
        expect(getInverse("+/1")).to.equal("−/1");
        expect(getInverse("sin/1")).to.equal("arcsin/1");
        expect(getInverse("cos/1")).to.equal("arccos/1");
        expect(getInverse("tan/1")).to.equal("arctan/1");

        expect(getInverse("+/2")).to.equal("−/2");
        expect(getInverse("·/2")).to.equal("//2");

        expect(getInverse("^/2")).to.equal("√/2");

    });

    it("returns reverse", function () {
        expect(getReverse("+/1")).to.equal("−/1");
        expect(getReverse("sin/1")).to.equal("arcsin/1");
        expect(getReverse("cos/1")).to.equal("arccos/1");
        expect(getReverse("tan/1")).to.equal("arctan/1");

        expect(getReverse("+/2")).to.equal("−/2");
        expect(getReverse("·/2")).to.equal("//2");

        expect(getReverse("^/2")).to.equal("log/2");

    });

    it("throws on functions, that are not the main functions", function () {
        expect(() => getInverse("−/1")).to.throw("not the main");
        expect(() => getInverse("arcsin/1")).to.throw("not the main");
        expect(() => getInverse("arccos/1")).to.throw("not the main");
        expect(() => getInverse("arctan/1")).to.throw("not the main");

        expect(() => getInverse("−/2")).to.throw("not the main");
        expect(() => getReverse("//2")).to.throw("not the main");

        expect(() => getInverse("√/2")).to.throw("not the main");
        expect(() => getReverse("log/2")).to.throw("not the main");
    });

    it("throws on unknown functions", function () {
        expect(() => getInverse("<!>/1")).to.throw("Unknown");
        expect(() => getReverse("<!>/1")).to.throw("Unknown");
    });

});
