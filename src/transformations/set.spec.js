import { expect } from "../testconfig.js";

import { intersection } from './set.js';


describe("intersection", function () {
    it("can intersect one sets", function () {
        {
            const s1 = new Set(['a', 'b', 'c']);

            expect(intersection(s1)).to.deep.equal(new Set(['a', 'b', 'c']));
        }
    });

    it("can intersect two sets", function () {
        {
            const s1 = new Set(['a', 'b', 'c']);
            const s2 = new Set(['a', 'b', 'c']);

            expect(intersection(s1, s2)).to.deep.equal(new Set(['a', 'b', 'c']));
        }
        {
            const s1 = new Set(['a', 'b']);
            const s2 = new Set(['b', 'c']);

            expect(intersection(s1, s2)).to.deep.equal(new Set(['b']));
        }
    });

    it("can intersect three sets", function () {
        {
            const s1 = new Set(['a', 'b', 'c']);
            const s2 = new Set(['a', 'b', 'c']);
            const s3 = new Set(['a', 'b', 'c']);

            expect(intersection(s1, s2, s3)).to.deep.equal(new Set(['a', 'b', 'c']));
        }
        {
            const s1 = new Set(['a', 'b']);
            const s2 = new Set(['b', 'c']);
            const s3 = new Set(['b', 'd']);

            expect(intersection(s1, s2, s3)).to.deep.equal(new Set(['b']));
        }
        {
            const s1 = new Set(['a', 'b']);
            const s2 = new Set(['b', 'c']);
            const s3 = new Set(['a', 'c']);

            expect(intersection(s1, s2, s3)).to.deep.equal(new Set([]));
        }
    });


});
