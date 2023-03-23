import { expect } from "../testconfig.js";

import { tokenize } from './tokenizer.js';


const splitsTo = (input, expected) => {
    const tokens = Array.from(tokenize(input));
    expect(tokens.join(" ")).to.equal(expected);
};

describe("tokenizer", function () {
    it("tokenize", function () {
        {
            const tokens = Array.from(tokenize("1+1"));
            expect(tokens).to.deep.equal(["1", "+", "1"]);
        }
        {
            const tokens = Array.from(tokenize("+-+-1"));
            expect(tokens).to.deep.equal(["+", "-", "+", "-", "1"]);
        }
        {
            const tokens = Array.from(tokenize("x+x"));
            expect(tokens).to.deep.equal(["x", "+", "x"]);
        }
        {
            const tokens = Array.from(tokenize("aa + bb - cc"));
            expect(tokens).to.deep.equal(["aa", "+", "bb", "-", "cc"]);
        }
        {
            const tokens = Array.from(tokenize("aa bb"));
            expect(tokens).to.deep.equal(["aa", "bb"]);
        }


        splitsTo("+++", "+ + +");
        splitsTo("---", "- - -");
        splitsTo("<<<===", "< < <= = =");

        splitsTo("x=y", "x = y");
        splitsTo("x!=y", "x != y");
        splitsTo("x<y", "x < y");
        splitsTo("x<=y", "x <= y");
        splitsTo("x>y", "x > y");
        splitsTo("x>=y", "x >= y");

        splitsTo("x*y", "x * y");
        splitsTo("x^y", "x ^ y");
        splitsTo("x/y", "x / y");
        splitsTo("x log y", "x log y");
        splitsTo("x root y", "x root y");
        splitsTo("x, y; a, b", "x , y ; a , b");

        splitsTo("x, y; a, b", "x , y ; a , b");

        splitsTo("sin(1 + 2)", "sin ( 1 + 2 )");
        splitsTo("sin(cos(1 + 2))", "sin ( cos ( 1 + 2 ) )");

        splitsTo("x*(-1 + 1/2) / (1 + 3 root 4)", "x * ( - 1 + 1 / 2 ) / ( 1 + 3 root 4 )");

    });


});
