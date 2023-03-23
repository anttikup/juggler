import { expect } from "../testconfig.js";

import { rpnToExpr } from './reverseShuntingYard.js';


describe("rpnToExpr", function () {
    it("can construct unary", function () {
        expect(rpnToExpr([1, "+/1"])).to.equal("+1");
        expect(rpnToExpr([1, "−/1"])).to.equal("-1");
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

    it("can use special spacing", function () {
        expect(rpnToExpr([1, 2, ";/2"])).to.equal("1; 2");
        expect(rpnToExpr([1, 2, ",/2"])).to.equal("1, 2");
        expect(rpnToExpr([2, "√/1"])).to.equal("sqrt 2");
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

    it("can construct parenthesized expressions with same precedence operators", function () {
        expect(rpnToExpr([24, 2, 3, "·/2", "//2"])).to.equal("24 / (2 * 3)");
        expect(rpnToExpr([24, 2, "·/2", 3, "//2"])).to.equal("24 * 2 / 3");

        expect(rpnToExpr([2, 3, 2, "^/2", "√/2"])).to.equal("2 root (3 ^ 2)");
        expect(rpnToExpr([24, 2, "^/2", 3, "√/2"])).to.equal("24 ^ 2 root 3");

        expect(rpnToExpr([2, 3, 2, "^/2", "log/2"])).to.equal("2 log (3 ^ 2)");
        expect(rpnToExpr([24, 2, "^/2", 3, "log/2"])).to.equal("24 ^ 2 log 3");
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
        expect(rpnToExpr([1, 2, "test/2"])).to.equal("test(1, 2)");
        expect(rpnToExpr(["x", "y", "test/2"])).to.equal("test(x, y)");
        expect(rpnToExpr([1, 2, 3, "test/3"])).to.equal("test(1, 2, 3)");

        // ?? TODO these shouldn't work
        expect(rpnToExpr([1, 2, ",/2", "cos/1"])).to.equal("cos(1, 2)");
        expect(rpnToExpr([1, 2, ",/2", 3, "test/2"])).to.equal("test(1, 2, 3)");
    });

    it("no parenthesis around associative expressions", function () {
        expect(rpnToExpr([2, 3, 4, "+/2", "+/2"])).to.equal("2 + 3 + 4");
        expect(rpnToExpr([2, 3, 4, "·/2", "·/2"])).to.equal("2 * 3 * 4");
        expect(rpnToExpr([2, 3, 4, "=/2", "=/2"])).to.equal("2 = 3 = 4");
        expect(rpnToExpr([2, 3, 4, "⇔/2", "⇔/2"])).to.equal("2 <=> 3 <=> 4");
        expect(rpnToExpr([2, 3, 4, "≠/2", "≠/2"])).to.equal("2 != 3 != 4");
        expect(rpnToExpr([2, 'x', 4, "</2", "</2"])).to.equal("2 < x < 4");
        expect(rpnToExpr([2, 3, 4, "−/2", "+/2"])).to.equal("2 + 3 - 4");
    });

    it("parenthesis around non-associative expressions", function () {
        expect(rpnToExpr([2, 3, 4, "−/2", "−/2"])).to.equal("2 - (3 - 4)");
        expect(rpnToExpr([2, 3, 4, "+/2", "−/2"])).to.equal("2 - (3 + 4)");
        expect(rpnToExpr([2, 3, 4, "·/2", "//2"])).to.equal("2 / (3 * 4)");
        expect(rpnToExpr([2, 3, 4, "//2", "·/2"])).to.equal("2 * (3 / 4)");
        expect(rpnToExpr([2, 3, 4, "//2", "//2"])).to.equal("2 / (3 / 4)");
        expect(rpnToExpr([2, 3, 4, "^/2", "^/2"])).to.equal("2 ^ (3 ^ 4)");
    });


});
