import { expect } from "../testconfig.js";

import { rpnToExpr } from './reverseShuntingYard.js';


describe("rpnToExpr", function () {
    it("can construct unary", function () {
        expect(rpnToExpr([1, "+/1"])).to.equal("+1");
        expect(rpnToExpr([1, "−/1"])).to.equal("-1");
        // ??
        expect(rpnToExpr([2, "√/1"])).to.equal("sqrt2");
    });

    it("can construct infix", function () {
        expect(rpnToExpr([1, 2, "+/2"])).to.equal("1 + 2");
        expect(rpnToExpr([1, 2, "−/2"])).to.equal("1 - 2");
        expect(rpnToExpr([1, 2, "·/2"])).to.equal("1 * 2");
        expect(rpnToExpr([1, 2, "//2"])).to.equal("1 / 2");
        expect(rpnToExpr([1, 2, "^/2"])).to.equal("1 ^ 2");
        expect(rpnToExpr([1, 2, "√/2"])).to.equal("1 root 2");
        expect(rpnToExpr([1, 2, "log/2"])).to.equal("1 log 2");
    });

    it("can construct complex expressions", function () {
        expect(rpnToExpr([1, 2, "·/2", 3, "+/2"])).to.equal("1 * 2 + 3");
        expect(rpnToExpr([1, 2, 3, "·/2", "+/2"])).to.equal("1 + 2 * 3");

        expect(rpnToExpr([1, 2, "^/2", 3, "·/2"])).to.equal("1 ^ 2 * 3");
        expect(rpnToExpr([1, 2, 3, "^/2", "·/2"])).to.equal("1 * 2 ^ 3");

        expect(rpnToExpr([1, 2, "//2", 3, "−/2"])).to.equal("1 / 2 - 3");
        expect(rpnToExpr([1, 2, 3, "//2", "−/2"])).to.equal("1 - 2 / 3");

        expect(rpnToExpr([1, 2, "^/2", 3, "//2"])).to.equal("1 ^ 2 / 3");
        expect(rpnToExpr([1, 2, 3, "^/2", "//2"])).to.equal("1 / 2 ^ 3");
    });

    it("can construct parenthesized expressions", function () {
        expect(rpnToExpr([1, 2, "+/2", 3, "·/2"])).to.equal("(1 + 2) * 3");
        expect(rpnToExpr([1, 2, 3, "+/2", "·/2"])).to.equal("1 * (2 + 3)");

        expect(rpnToExpr([1, 2, "·/2", 3, "^/2"])).to.equal("(1 * 2) ^ 3");
        expect(rpnToExpr([1, 2, 3, "·/2", "^/2"])).to.equal("1 ^ (2 * 3)");

        expect(rpnToExpr([1, 2, "−/2", 3, "//2"])).to.equal("(1 - 2) / 3");
        expect(rpnToExpr([1, 2, 3, "−/2", "//2"])).to.equal("1 / (2 - 3)");

        expect(rpnToExpr([1, 2, "//2", 3, "^/2"])).to.equal("(1 / 2) ^ 3");
        expect(rpnToExpr([1, 2, 3, "//2", "^/2"])).to.equal("1 ^ (2 / 3)");
    });

    it("can construct simple functions", function () {
        expect(rpnToExpr([1, "cos/1"])).to.equal("cos(1)");
        expect(rpnToExpr(["x", "cos/1"])).to.equal("cos(x)");
    });

    it("can construct simple functions in expressions", function () {
        expect(rpnToExpr([1, 2, "+/2", "cos/1"])).to.equal("cos(1 + 2)");
        expect(rpnToExpr([1, "cos/1", 2, "+/2"])).to.equal("cos(1) + 2");
        expect(rpnToExpr([1, 2, "cos/1", "+/2"])).to.equal("1 + cos(2)");
        expect(rpnToExpr([1, 2, "cos/1", "+/2", 3, "+/2"])).to.equal("1 + cos(2) + 3");
    });

    it("can construct multiparameter functions", function () {
        expect(rpnToExpr([1, 2, "f/2"])).to.equal("f(1, 2)");
        expect(rpnToExpr(["x", "y", "f/2"])).to.equal("f(x, y)");
        expect(rpnToExpr([1, 2, 3, "f/3"])).to.equal("f(1, 2, 3)");

        // ?? TODO these shouldn't work
        expect(rpnToExpr([1, 2, ",/2", "cos/1"])).to.equal("cos(1, 2)");
        expect(rpnToExpr([1, 2, ",/2", 3, "f/2"])).to.equal("f(1, 2, 3)");
    });

});