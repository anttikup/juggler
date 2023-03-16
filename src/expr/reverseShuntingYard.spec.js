import { expect } from "../testconfig.js";

import { rpnToExpr } from './reverseShuntingYard.js';


describe("rpnToExpr", function () {
    it("can construct unary", function () {
        expect(rpnToExpr([1, "+/1"])).to.equal("+1");
        expect(rpnToExpr([1, "-/1"])).to.equal("-1");
        expect(rpnToExpr([1, "–/1"])).to.equal("–1");
    });

    it("can construct infix", function () {
        expect(rpnToExpr([1, 2, "+/2"])).to.equal("1 + 2");
        expect(rpnToExpr([1, 2, "-/2"])).to.equal("1 - 2");
        expect(rpnToExpr([1, 2, "–/2"])).to.equal("1 – 2");
        expect(rpnToExpr([1, 2, "·/2"])).to.equal("1 · 2");
        expect(rpnToExpr([1, 2, "×/2"])).to.equal("1 × 2");
        expect(rpnToExpr([1, 2, "*/2"])).to.equal("1 * 2");
        expect(rpnToExpr([1, 2, ":/2"])).to.equal("1 : 2");
        expect(rpnToExpr([1, 2, "//2"])).to.equal("1 / 2");
        expect(rpnToExpr([1, 2, "^/2"])).to.equal("1 ^ 2");
        expect(rpnToExpr([1, 2, "root/2"])).to.equal("1 root 2");
        expect(rpnToExpr([1, 2, "log/2"])).to.equal("1 log 2");
    });

    it("can construct complex expressions", function () {
        expect(rpnToExpr([1, 2, "·/2", 3, "+/2"])).to.equal("1 · 2 + 3");
        expect(rpnToExpr([1, 2, 3, "·/2", "+/2"])).to.equal("1 + 2 · 3");
        expect(rpnToExpr([1, 2, "+/2", 3, "·/2"])).to.equal("(1 + 2) · 3");
        expect(rpnToExpr([1, 2, 3, "+/2", "·/2"])).to.equal("1 · (2 + 3)");

        expect(rpnToExpr([1, 2, "^/2", 3, "·/2"])).to.equal("1 ^ 2 · 3");
        expect(rpnToExpr([1, 2, 3, "^/2", "·/2"])).to.equal("1 · 2 ^ 3");
        expect(rpnToExpr([1, 2, "·/2", 3, "^/2"])).to.equal("(1 · 2) ^ 3");
        expect(rpnToExpr([1, 2, 3, "·/2", "^/2"])).to.equal("1 ^ (2 · 3)");

        expect(rpnToExpr([1, 2, "//2", 3, "-/2"])).to.equal("1 / 2 - 3");
        expect(rpnToExpr([1, 2, 3, "//2", "-/2"])).to.equal("1 - 2 / 3");
        expect(rpnToExpr([1, 2, "-/2", 3, "//2"])).to.equal("(1 - 2) / 3");
        expect(rpnToExpr([1, 2, 3, "-/2", "//2"])).to.equal("1 / (2 - 3)");

        expect(rpnToExpr([1, 2, "^/2", 3, "//2"])).to.equal("1 ^ 2 / 3");
        expect(rpnToExpr([1, 2, 3, "^/2", "//2"])).to.equal("1 / 2 ^ 3");
        expect(rpnToExpr([1, 2, "//2", 3, "^/2"])).to.equal("(1 / 2) ^ 3");
        expect(rpnToExpr([1, 2, 3, "//2", "^/2"])).to.equal("1 ^ (2 / 3)");
    });
});
