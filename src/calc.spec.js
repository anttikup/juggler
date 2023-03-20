import { expect } from "./testconfig.js";

import {
    division,
    logarithm,
    root,
} from './calc.js';


describe("division", function () {
    it("divides integer", function () {
        expect(division(4, 2)).to.equal(2);
    });

    it("throws on not integer division", function () {
        expect(() => division(3, 2)).to.throw('not integer');
    });
});


const pow = Math.pow;

describe("root", function () {
    it("returns root when result is integer", function () {
        expect(root(2, pow(3, 2))).to.equal(3);
        expect(root(2, pow(5, 2))).to.equal(5);
        expect(root(2, pow(10, 2))).to.equal(10);
        expect(root(2, pow(16, 2))).to.equal(16);
        expect(root(2, pow(282, 2))).to.equal(282);
        expect(root(2, pow(999, 2))).to.equal(999);
        expect(root(2, pow(9999, 2))).to.equal(9999);

        expect(root(3, pow(3, 3))).to.equal(3);
        expect(root(3, pow(5, 3))).to.equal(5);
        expect(root(3, pow(10, 3))).to.equal(10);
        expect(root(3, pow(16, 3))).to.equal(16);
        expect(root(3, pow(282, 3))).to.equal(282);
        expect(root(3, pow(999, 3))).to.equal(999);
        expect(root(3, pow(9999, 3))).to.equal(9999);

        expect(root(4, pow(3, 4))).to.equal(3);
        expect(root(4, pow(5, 4))).to.equal(5);
        expect(root(4, pow(10, 4))).to.equal(10);
        expect(root(4, pow(16, 4))).to.equal(16);
        expect(root(4, pow(282, 4))).to.equal(282);
        expect(root(4, pow(999, 4))).to.equal(999);

        expect(root(5, pow(3, 5))).to.equal(3);
        expect(root(5, pow(5, 5))).to.equal(5);
        expect(root(5, pow(10, 5))).to.equal(10);
        expect(root(5, pow(16, 5))).to.equal(16);
        expect(root(5, pow(282, 5))).to.equal(282);
        expect(root(5, pow(999, 5))).to.equal(999);

        expect(root(7, pow(3, 7))).to.equal(3);
        expect(root(7, pow(5, 7))).to.equal(5);
        expect(root(7, pow(10, 7))).to.equal(10);
        expect(root(7, pow(16, 7))).to.equal(16);

        expect(root(11, pow(3, 11))).to.equal(3);
        expect(root(11, pow(5, 11))).to.equal(5);
        expect(root(11, pow(10, 11))).to.equal(10);
        expect(root(11, pow(16, 11))).to.equal(16);
    });

    it("throws if check result is max safe integer", function () {
        expect(() => root(2, Number.MAX_SAFE_INTEGER)).to.throw('overflow');
        expect(() => root(2, Number.MAX_SAFE_INTEGER + 1)).to.throw('overflow');

        expect(() => root(4, pow(9999, 4) + 1)).to.throw('overflow');
        expect(() => root(5, pow(9999, 5) + 1)).to.throw('overflow');

        expect(() => root(7, pow(282, 7) + 1)).to.throw('overflow');
        expect(() => root(7, pow(999, 7) + 1)).to.throw('overflow');
        expect(() => root(7, pow(9999, 7) + 1)).to.throw('overflow');

        expect(() => root(11, pow(282, 11) + 1)).to.throw('overflow');
        expect(() => root(11, pow(999, 11) + 1)).to.throw('overflow');
        expect(() => root(11, pow(9999, 11) + 1)).to.throw('overflow');
    });

    it("throws if result is not integer", function () {
        expect(() => root(2 , 2)).to.throw('not integer');
        expect(() => root(2, 5)).to.throw('not integer');


        expect(() => root(2, pow(3, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(5, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(10, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(16, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(282, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(999, 2) + 1)).to.throw('not integer');
        expect(() => root(2, pow(9999, 2) + 1)).to.throw('not integer');

        expect(() => root(3, pow(3, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(5, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(10, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(16, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(282, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(999, 3) + 1)).to.throw('not integer');
        expect(() => root(3, pow(9999, 3) + 1)).to.throw('not integer');

        expect(() => root(4, pow(3, 4) + 1)).to.throw('not integer');
        expect(() => root(4, pow(5, 4) + 1)).to.throw('not integer');
        expect(() => root(4, pow(10, 4) + 1)).to.throw('not integer');
        expect(() => root(4, pow(16, 4) + 1)).to.throw('not integer');
        expect(() => root(4, pow(282, 4) + 1)).to.throw('not integer');
        expect(() => root(4, pow(999, 4) + 1)).to.throw('not integer');

        expect(() => root(5, pow(3, 5) + 1)).to.throw('not integer');
        expect(() => root(5, pow(5, 5) + 1)).to.throw('not integer');
        expect(() => root(5, pow(10, 5) + 1)).to.throw('not integer');
        expect(() => root(5, pow(16, 5) + 1)).to.throw('not integer');
        expect(() => root(5, pow(282, 5) + 1)).to.throw('not integer');
        expect(() => root(5, pow(999, 5) + 1)).to.throw('not integer');

        expect(() => root(7, pow(3, 7) + 1)).to.throw('not integer');
        expect(() => root(7, pow(5, 7) + 1)).to.throw('not integer');
        expect(() => root(7, pow(10, 7) + 1)).to.throw('not integer');
        expect(() => root(7, pow(16, 7) + 1)).to.throw('not integer');

        expect(() => root(11, pow(3, 11) + 1)).to.throw('not integer');
        expect(() => root(11, pow(5, 11) + 1)).to.throw('not integer');
        expect(() => root(11, pow(10, 11) + 1)).to.throw('not integer');
        expect(() => root(11, pow(16, 11) + 1)).to.throw('not integer');
    });

});


describe("logarithm", function () {
    it("returns logarithm when result is integer", function () {
        expect(logarithm(2, pow(2, 1))).to.equal(1);
        expect(logarithm(2, pow(2, 2))).to.equal(2);
        expect(logarithm(2, pow(2, 3))).to.equal(3);
        expect(logarithm(2, pow(2, 5))).to.equal(5);
        expect(logarithm(2, pow(2, 7))).to.equal(7);
        expect(logarithm(2, pow(2, 11))).to.equal(11);
        expect(logarithm(2, pow(2, 23))).to.equal(23);
        expect(logarithm(2, pow(2, 31))).to.equal(31);
        expect(logarithm(2, pow(2, 37))).to.equal(37);
        expect(logarithm(2, pow(2, 41))).to.equal(41);
        expect(logarithm(2, pow(2, 43))).to.equal(43);
        expect(logarithm(2, pow(2, 47))).to.equal(47);
        expect(logarithm(2, pow(2, 52))).to.equal(52);

        expect(logarithm(3, pow(3, 1))).to.equal(1);
        expect(logarithm(3, pow(3, 2))).to.equal(2);
        expect(logarithm(3, pow(3, 3))).to.equal(3);
        expect(logarithm(3, pow(3, 5))).to.equal(5);
        expect(logarithm(3, pow(3, 7))).to.equal(7);
        expect(logarithm(3, pow(3, 11))).to.equal(11);
        expect(logarithm(3, pow(3, 23))).to.equal(23);
        expect(logarithm(3, pow(3, 31))).to.equal(31);

        expect(logarithm(5, pow(5, 1))).to.equal(1);
        expect(logarithm(5, pow(5, 2))).to.equal(2);
        expect(logarithm(5, pow(5, 3))).to.equal(3);
        expect(logarithm(5, pow(5, 5))).to.equal(5);
        expect(logarithm(5, pow(5, 7))).to.equal(7);
        expect(logarithm(5, pow(5, 11))).to.equal(11);

        expect(logarithm(7, pow(7, 1))).to.equal(1);
        expect(logarithm(7, pow(7, 2))).to.equal(2);
        expect(logarithm(7, pow(7, 3))).to.equal(3);
        expect(logarithm(7, pow(7, 5))).to.equal(5);
        expect(logarithm(7, pow(7, 7))).to.equal(7);
        expect(logarithm(7, pow(7, 11))).to.equal(11);

        expect(logarithm(10, pow(10, 2))).to.equal(2);
        expect(logarithm(10, pow(10, 15))).to.equal(15);

        expect(logarithm(11, pow(11, 15))).to.equal(15);

        expect(logarithm(13, pow(13, 13))).to.equal(13);

        expect(logarithm(17, pow(17, 11))).to.equal(11);
        expect(logarithm(19, pow(19, 11))).to.equal(11);
        expect(logarithm(23, pow(23, 11))).to.equal(11);

        expect(logarithm(29, pow(29, 7))).to.equal(7);
        expect(logarithm(31, pow(31, 7))).to.equal(7);
        expect(logarithm(37, pow(37, 7))).to.equal(7);
        expect(logarithm(41, pow(41, 7))).to.equal(7);
        expect(logarithm(43, pow(43, 7))).to.equal(7);
        expect(logarithm(47, pow(47, 7))).to.equal(7);
        expect(logarithm(53, pow(53, 7))).to.equal(7);
    });

    it("throws if check result is max safe integer", function () {
        expect(() => logarithm(2, pow(2, 53))).to.throw('overflow');

        expect(() => logarithm(3, pow(3, 37))).to.throw('overflow');
        expect(() => logarithm(5, pow(5, 23))).to.throw('overflow');
        expect(() => logarithm(5, pow(5, 31))).to.throw('overflow');
        expect(() => logarithm(10, pow(10, 16))).to.throw('overflow');
        expect(() => logarithm(13, pow(13, 15))).to.throw('overflow');
        expect(() => logarithm(17, pow(17, 13))).to.throw('overflow');
        expect(() => logarithm(29, pow(29, 11))).to.throw('overflow');
        expect(() => logarithm(53, pow(53, 11))).to.throw('overflow');
    });

    it("throws if result is not integer", function () {
        expect(() => logarithm(10, 101)).to.throw('not integer');
        expect(() => logarithm(2, 257)).to.throw('not integer');
        expect(() => logarithm(2.3854378, 257)).to.throw('not integer');
        expect(() => logarithm(2, 2.57834738)).to.throw('not integer');
    });
});
