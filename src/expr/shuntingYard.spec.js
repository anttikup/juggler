import { expect } from "../testconfig.js";

import { exprToRPN } from './shuntingYard.js';


describe("exprToRPN", function () {
    it("can parse unary", function () {
        expect(exprToRPN("+2")).to.deep.equal([2, "+/1"]);
        expect(exprToRPN("-2")).to.deep.equal([2, "−/1"]);
        expect(exprToRPN("sqrt 2")).to.deep.equal([2, "√/1"]);
    });

    it("can parse infix", function () {
        expect(exprToRPN("1 + 2")).to.deep.equal([1, 2, "+/2"]);
        expect(exprToRPN("1 - 2")).to.deep.equal([1, 2, "−/2"]);
        expect(exprToRPN("1 * 2")).to.deep.equal([1, 2, "·/2"]);
        expect(exprToRPN("1 ^ 2")).to.deep.equal([1, 2, "^/2"]);
        expect(exprToRPN("1 root 2")).to.deep.equal([1, 2, "√/2"]);
        expect(exprToRPN("1 log 2")).to.deep.equal([1, 2, "log/2"]);
    });

    it("can parse complex expressions", function () {
        expect(exprToRPN("1 * +2")).to.deep.equal([1, 2, "+/1", "·/2"]);
        expect(exprToRPN("1 * -2")).to.deep.equal([1, 2, "−/1", "·/2"]);
        expect(exprToRPN("1 + +2")).to.deep.equal([1, 2, "+/1", "+/2"]);
        expect(exprToRPN("1 + -2")).to.deep.equal([1, 2, "−/1", "+/2"]);
        expect(exprToRPN("1 - +2")).to.deep.equal([1, 2, "+/1", "−/2"]);
        expect(exprToRPN("1 - -2")).to.deep.equal([1, 2, "−/1", "−/2"]);
        expect(exprToRPN("-1 - -2")).to.deep.equal([1, "−/1", 2, "−/1", "−/2"]);

        expect(exprToRPN("1 - 2 + 3 - 4 + 5")).to.deep.equal([1, 2, "−/2", 3, "+/2", 4, "−/2", 5, "+/2"]);

        expect(exprToRPN("1 * 2 + 3")).to.deep.equal([1, 2, "·/2", 3, "+/2"]);
        expect(exprToRPN("1 + 2 * 3")).to.deep.equal([1, 2, 3, "·/2", "+/2"]);

        expect(exprToRPN("1 ^ 2 * 3")).to.deep.equal([1, 2, "^/2", 3, "·/2"]);
        expect(exprToRPN("1 * 2 ^ 3")).to.deep.equal([1, 2, 3, "^/2", "·/2"]);

        expect(exprToRPN("1 / 2 - 3")).to.deep.equal([1, 2, "//2", 3, "−/2"]);
        expect(exprToRPN("1 - 2 / 3")).to.deep.equal([1, 2, 3, "//2", "−/2"]);

        expect(exprToRPN("1 ^ 2 / 3")).to.deep.equal([1, 2, "^/2", 3, "//2"]);
        expect(exprToRPN("1 / 2 ^ 3")).to.deep.equal([1, 2, 3, "^/2", "//2"]);

        expect(exprToRPN("1 log 2 root 3")).to.deep.equal([1, 2, "log/2", 3, "√/2"]);

        // TODO
        //expect(exprToRPN("1 ^ 2 ^ 3")).to.deep.equal([1, 2, 3, "^/2", "^/2"]);
    });

    it("can parse parenthesis", function () {
        expect(exprToRPN("(1 * 2)")).to.deep.equal([1, 2, "·/2"]);

        expect(exprToRPN("1 - 2 + 3 - (4 + 5)")).to.deep.equal([1, 2, "−/2", 3, "+/2", 4 , 5, "+/2", "−/2"]);
        expect(exprToRPN("1 - (2 + (3 - (4 + 5)))")).to.deep.equal([1, 2, 3, 4 , 5, "+/2", "−/2", "+/2", "−/2"]);

        expect(exprToRPN("(1 + 2) * 3")).to.deep.equal([1, 2, "+/2", 3, "·/2"]);
        expect(exprToRPN("1 * (2 + 3)")).to.deep.equal([1, 2, 3, "+/2", "·/2"]);

        expect(exprToRPN("(1 * 2) + 3")).to.deep.equal([1, 2, "·/2", 3, "+/2"]);
        expect(exprToRPN("1 + (2 * 3)")).to.deep.equal([1, 2, 3, "·/2", "+/2"]);

        expect(exprToRPN("(1 * 2) ^ 3")).to.deep.equal([1, 2, "·/2", 3, "^/2"]);
        expect(exprToRPN("1 ^ (2 * 3)")).to.deep.equal([1, 2, 3, "·/2", "^/2"]);

        expect(exprToRPN("(1 - 2) / 3")).to.deep.equal([1, 2, "−/2", 3, "//2"]);
        expect(exprToRPN("1 / (2 - 3)")).to.deep.equal([1, 2, 3, "−/2", "//2"]);

        expect(exprToRPN("(1 / 2) - 3")).to.deep.equal([1, 2, "//2", 3, "−/2"]);
        expect(exprToRPN("1 - (2 / 3)")).to.deep.equal([1, 2, 3, "//2", "−/2"]);

        expect(exprToRPN("(1 / 2) ^ 3")).to.deep.equal([1, 2, "//2", 3, "^/2"]);
        expect(exprToRPN("1 ^ (2 / 3)")).to.deep.equal([1, 2, 3, "//2", "^/2"]);

        expect(exprToRPN("(a)")).to.deep.equal(["a"]);
        expect(exprToRPN("(((((((((a)))))))))")).to.deep.equal(["a"]);
        expect(exprToRPN("(a + 1)")).to.deep.equal(["a", 1, "+/2"]);
        expect(exprToRPN("((((((a))))) + (1))")).to.deep.equal(["a", 1, "+/2"]);
        expect(exprToRPN("((a) + (((((1))))))")).to.deep.equal(["a", 1, "+/2"]);
        expect(exprToRPN("((((((a))))) + (((((1))))))")).to.deep.equal(["a", 1, "+/2"]);


    });


    it("throws on incorrect expressions", function () {
        expect(() => exprToRPN("1 + 1 -")).to.throw("Unexpected");
        expect(() => exprToRPN("1 + (")).to.throw("Unexpected");
        expect(() => exprToRPN("* 1")).to.throw("Unexpected");
        expect(() => exprToRPN("1 1")).to.throw("Unexpected");
        expect(() => exprToRPN(") + 1")).to.throw("Unexpected");
        expect(() => exprToRPN("(1 + 1) 1")).to.throw("Unexpected");
        expect(() => exprToRPN("1 + )")).to.throw("Unexpected");

        // ??
        expect(() => exprToRPN("()")).to.throw("Unexpected");

        expect(() => exprToRPN("1 (1 + 1)")).to.throw("Unexpected");

    });

    it("throws when function is used as a value", function () {
        expect(() => exprToRPN("1 + cos")).to.throw("Unexpected");
    });

    it("can parse simple functions", function () {
        expect(exprToRPN("test(1)")).to.deep.equal([1, "test/1"]);
        expect(exprToRPN("test(1 + 2)")).to.deep.equal([1, 2, "+/2", "test/1"]);
        expect(exprToRPN("test(1, 2)")).to.deep.equal([1, 2, "test/2"]);
    });

    it("can parse multiparameter functions", function () {
        expect(exprToRPN("test(1, 2)")).to.deep.equal([1, 2, "test/2"]);
        expect(exprToRPN("test(1, 2, 3)")).to.deep.equal([1, 2, ",/2", 3, "test/2"]);
        expect(exprToRPN("test(-1, -2, -3)")).to.deep.equal([1, "−/1", 2, "−/1", ",/2", 3, "−/1", "test/2"]);
        expect(exprToRPN("test(1 + 2, 3 + 4)")).to.deep.equal([1, 2, "+/2", 3, 4, "+/2", "test/2"]);
        expect(exprToRPN("test(1 + 2, 3 + 4, 5 + 6)")).to.deep.equal([1, 2, "+/2", 3, 4, "+/2", ",/2", 5, 6, "+/2", "test/2"]);
    });

    it("can parse semicolon", function () {
        expect(exprToRPN("1 ; 2")).to.deep.equal([1, 2, ";/2"]);
        expect(exprToRPN("1 + 2; 2 + 3")).to.deep.equal([1, 2, "+/2", 2, 3, "+/2", ";/2"]);
        expect(exprToRPN("y = 1*x + 2; y = 2*x + 3"))
            .to.deep.equal(["y", 1, "x", "·/2", 2, "+/2", "=/2", "y", 2, "x", "·/2", 3, "+/2", "=/2", ";/2"]);
    });



});
