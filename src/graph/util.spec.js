import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { expect } from "../testconfig.js";
import NetworkStub from "../test/NetworkStub.js";
import {
    makeTrunkEdge,
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeOrderedEdge,
} from "./nodesedges.js";

import {
    ValueNode,
    OperatorNode,
    FunctionNode,
} from "./nodes.js";

import {
    bundlePaths,
    combineNodes,
    findLoopingPaths,
    findLoopingPathsWithRole,
    findPaths,
    findPathsWithRole,
    getMembersByRole,
    getMembers,
    getNeighbours,
    getNeighboursOfType,
    getRoleIn,
    hasRoleIn,
    removeEdges,
    removeEdge,
} from './util.js';


describe("getNeighbours", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '4' });
        edges.add({ from: 1, to: 2, id: "1\v2" });
        edges.add({ from: 2, to: 3, id: "2\v3" });
        edges.add({ from: 3, to: 4, id: "3\v4" });
    });

    it("can get neighbouring nodes", function () {
        {
            const nodes = getNeighbours(network, 1, []);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(2);
        }
        {
            const nodes = getNeighbours(network, 2, []);
            expect(nodes.length).to.equal(2);
            expect(nodes[0].id).to.equal(1);
            expect(nodes[1].id).to.equal(3);
        }
    });

    it("can exclude nodes", function () {
        {
            const nodes = getNeighbours(network, 2, [1]);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(3);
        }
        {
            const nodes = getNeighbours(network, 3, [4]);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(2);
        }
    });


});


describe("getNeighboursOfType", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '+', data: '+/2' });
        nodes.add({ id: 5, label: '·', data: '·/2' });
        edges.add({ from: 1, to: 4, id: "1\v4" });
        edges.add({ from: 4, to: 2, id: "4\v2" });
        edges.add({ from: 2, to: 5, id: "2\v5" });
    });

    it("can get neighbouring nodes", function () {
        {
            const nodes = getNeighboursOfType(network, 2, '+/2');
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(4);
        }
        {
            const nodes = getNeighboursOfType(network, 2, '·/2');
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(5);
        }
    });
});


describe("removeEdges", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '+', data: '+/2' });
        nodes.add({ id: 5, label: '·', data: '·/2' });
        edges.add({ from: 1, to: 4, id: "1\v4" });
        edges.add({ from: 4, to: 2, id: "4\v2" });
        edges.add({ from: 2, to: 5, id: "2\v5" });
    });

    it("can remove edges of node", function () {
        removeEdges(network, 2);
        {
            const nodes = getNeighbours(network, 2, []);
            expect(nodes.length).to.equal(0);
        }
        {
            const nodes = getNeighbours(network, 4, []);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(1);
        }
        {
            const nodes = getNeighbours(network, 5, []);
            expect(nodes.length).to.equal(0);
        }
    });
});

describe("removeEdge", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '+', data: '+/2' });
        nodes.add({ id: 5, label: '·', data: '·/2' });
        edges.add({ from: 1, to: 4, id: "1\v4" });
        edges.add({ from: 4, to: 2, id: "4\v2" });
        edges.add({ from: 2, to: 5, id: "2\v5" });
    });

    it("can remove specific edge", function () {
        removeEdge(network, 4, 2);
        {
            const nodes = getNeighbours(network, 2, []);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(5);
        }
        {
            const nodes = getNeighbours(network, 4, []);
            expect(nodes.length).to.equal(1);
            expect(nodes[0].id).to.equal(1);
        }
    });
});

describe("combineNodes", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '+', data: '+/2' });
        nodes.add({ id: 5, label: '·', data: '·/2' });
        edges.add({ from: 1, to: 4, id: "1\v4" });
        edges.add({ from: 4, to: 2, id: "4\v2" });
        edges.add({ from: 2, to: 5, id: "2\v5" });
    });

    it("combines nodes", function () {
        combineNodes(network, 1, 5);
        {
            const nodes = getNeighbours(network, 1, []);
            expect(nodes.length).to.equal(2);
            expect(nodes[0].id).to.equal(4);
            expect(nodes[1].id).to.equal(2);
        }
    });

    it("removes combined nodes", function () {
        combineNodes(network, 1, 5);
        {
            expect(() => getNeighbours(network, 5, [])).to.throw();
        }
    });
});

describe("findPaths", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add({ id: 1, label: '1' });
        nodes.add({ id: 2, label: '2' });
        nodes.add({ id: 3, label: '3' });
        nodes.add({ id: 4, label: '+', data: '+/2' });
        nodes.add({ id: 5, label: '·', data: '·/2' });
        edges.add({ from: 1, to: 4, id: "1\v4" });
        edges.add({ from: 4, to: 2, id: "4\v2" });
        edges.add({ from: 2, to: 5, id: "2\v5" });
    });

    it("finds neighbouring operator node", function () {
        {
            const paths = findPaths(network, 2, ['+/2']);
            expect(paths.length).to.equal(1);
            expect(paths[0].length).to.equal(1);
            expect(paths).to.deep.equal([ [4] ]);
        }
        {
            const paths = findPaths(network, 2, ['·/2']);
            expect(paths.length).to.equal(1);
            expect(paths[0].length).to.equal(1);
            expect(paths).to.deep.equal([ [5] ]);
        }
    });

    it("finds neighbouring value node", function () {
        {
            const paths = findPaths(network, 4, ['value']);
            expect(paths.length).to.equal(2);
            expect(paths[0].length).to.equal(1);
            expect(paths).to.deep.equal([ [1], [2] ]);
        }
    });

    it("finds 2-neighbouring operator node", function () {
        {
            const paths = findPaths(network, 4, ['value', '·/2']);
            expect(paths.length).to.equal(1);
            expect(paths[0].length).to.equal(2);
            expect(paths).to.deep.equal([ [2, 5] ]);
        }
    });

    it("finds 2-neighbouring value node", function () {
        {
            const paths = findPaths(network, 2, ['+/2', 'value']);
            expect(paths).to.deep.equal([ [4, 1] ]);
        }
    });

    it("finds 3-neighbouring value node", function () {
        {
            const paths = findPaths(network, 1, ['+/2', 'value', '·/2']);
            expect(paths).to.deep.equal([ [4, 2, 5] ]);
        }
    });




});


describe("bundlePaths", function () {
    beforeEach(() => {

    });

    it("bundles paths ending in the same node", function () {
        {
            const bundles = bundlePaths([ [1, 2, 3], [5, 4, 3] ]);
            expect(bundles).to.deep.equal([ [ [1, 2, 3], [5, 4, 3] ] ]);
        }
        {
            const bundles = bundlePaths([ [1, 2, 3], [5, 4, 3], [9, 6, 3] ]);
            expect(bundles).to.deep.equal([ [ [1, 2, 3], [5, 4, 3], [9, 6, 3] ] ]);
        }
        {
            const bundles = bundlePaths([ [1, 2, 3], [1, 4, 3], [1, 3] ]);
            expect(bundles).to.deep.equal([ [ [1, 2, 3], [1, 4, 3], [1, 3] ] ]);
        }
    });

    it("ignores single paths", function () {
        {
            const bundles = bundlePaths([ [1, 2, 3], [4, 5, 6] ]);
            expect(bundles).to.deep.equal([ ]);
        }
        {
            const bundles = bundlePaths([ [1, 2, 3], [1, 2, 6] ]);
            expect(bundles).to.deep.equal([ ]);
        }
        {
            const bundles = bundlePaths([ [1, 2, 3], [1, 4, 3], [1, 5, 9] ]);
            expect(bundles).to.deep.equal([ [ [1, 2, 3], [1, 4, 3] ] ]);
        }
    });

    it("bundles multiple paths", function () {
        {
            const bundles = bundlePaths([ [1, 2, 3], [5, 4, 3], [10, 20, 30], [50, 40, 30] ]);
            expect(bundles).to.deep.equal([
                [ [1, 2, 3], [5, 4, 3] ],
                [ [10, 20, 30], [50, 40, 30] ]
            ]);
        }
    });

});


describe("findLoopingPaths", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
    });

    describe("simple paths", function () {
        beforeEach(() => {
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            nodes.add({ id: 4, label: '+', data: '+/2' });
            nodes.add({ id: 5, label: '+', data: '+/2' });
            edges.add({ from: 1, to: 4, id: "1\v4" });
            edges.add({ from: 1, to: 5, id: "1\v5" });
            edges.add({ from: 4, to: 2, id: "4\v2" });
            edges.add({ from: 5, to: 2, id: "5\v2" });
        });

        it("finds simple operator–value paths", function () {
            {
                const paths = findLoopingPaths(network, 1, ['+/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 4, 2 ], [ 5, 2 ] ]);
            }
            {
                const paths = findLoopingPaths(network, 2, ['+/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 4, 1 ], [ 5, 1 ] ]);
            }
        });

        it("finds simple value–operator paths", function () {
            {
                const paths = findLoopingPaths(network, 4, ['value', '+/2']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 1, 5 ], [ 2, 5 ] ]);
            }
            {
                const paths = findLoopingPaths(network, 5, ['value', '+/2']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 1, 4 ], [ 2, 4 ] ]);
            }
        });
    });

    describe("two four item paths", function () {
        beforeEach(() => {
            /*
               .             1
               .           /   \
               .  +/2    101   102
               .         /       \
               .        2         3
               .         \       /
               .  ·/2    103   104
               .           \   /
               .             4
             */
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            nodes.add({ id: 3, label: '3' });
            nodes.add({ id: 4, label: '4' });
            nodes.add({ id: 101, label: '+', data: '+/2' });
            nodes.add({ id: 102, label: '+', data: '+/2' });
            nodes.add({ id: 103, label: '·', data: '·/2' });
            nodes.add({ id: 104, label: '·', data: '·/2' });

            edges.add({ from: 1, to: 101, id: "1\v101" });
            edges.add({ from: 101, to: 2, id: "101\v2" });
            edges.add({ from: 2, to: 103, id: "2\v103" });
            edges.add({ from: 103, to: 4, id: "103\v4" });

            edges.add({ from: 1, to: 102, id: "1\v102" });
            edges.add({ from: 102, to: 3, id: "102\v3" });
            edges.add({ from: 3, to: 104, id: "3\v104" });
            edges.add({ from: 104, to: 4, id: "104\v4" });
        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPaths(network, 1, ['+/2', 'value', '·/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 101, 2, 103, 4 ], [ 102, 3, 104, 4 ] ]);
            }
            {
                const paths = findLoopingPaths(network, 1, ['·/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(0);
            }
            {
                const paths = findLoopingPaths(network, 4, ['·/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 103, 2, 101, 1 ], [ 104, 3, 102, 1 ] ]);
            }
        });
    });

    describe("three four item paths", function () {
        beforeEach(() => {
            /*
               .             1
               .           /   \    \
               .  +/2    101   102  105
               .         /       \    \
               .        2         3    5
               .         \       /    /
               .  ·/2    103   104  106
               .           \   /    /
               .             4
             */
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            nodes.add({ id: 3, label: '3' });
            nodes.add({ id: 4, label: '4' });
            nodes.add({ id: 5, label: '5' });
            nodes.add({ id: 101, label: '+', data: '+/2' });
            nodes.add({ id: 102, label: '+', data: '+/2' });
            nodes.add({ id: 105, label: '+', data: '+/2' });
            nodes.add({ id: 103, label: '·', data: '·/2' });
            nodes.add({ id: 104, label: '·', data: '·/2' });
            nodes.add({ id: 106, label: '·', data: '·/2' });

            edges.add({ from: 1, to: 101, id: "1\v101" });
            edges.add({ from: 101, to: 2, id: "101\v2" });
            edges.add({ from: 2, to: 103, id: "2\v103" });
            edges.add({ from: 103, to: 4, id: "103\v4" });

            edges.add({ from: 1, to: 102, id: "1\v102" });
            edges.add({ from: 102, to: 3, id: "102\v3" });
            edges.add({ from: 3, to: 104, id: "3\v104" });
            edges.add({ from: 104, to: 4, id: "104\v4" });

            edges.add({ from: 1, to: 105, id: "1\v105" });
            edges.add({ from: 105, to: 5, id: "105\v5" });
            edges.add({ from: 5, to: 106, id: "5\v106" });
            edges.add({ from: 106, to: 4, id: "106\v4" });
        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPaths(network, 1, ['+/2', 'value', '·/2', 'value']);
                expect(paths.length).to.equal(3);
                expect(paths).to.deep.equal([ [ 101, 2, 103, 4 ], [ 102, 3, 104, 4 ], [ 105, 5, 106, 4 ] ]);
            }
            {
                const paths = findLoopingPaths(network, 1, ['·/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(0);
            }
            {
                const paths = findLoopingPaths(network, 4, ['·/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(3);
                expect(paths).to.deep.equal([ [ 103, 2, 101, 1 ], [ 104, 3, 102, 1 ], [ 106, 5, 105, 1 ] ]);
            }
        });

    });

    describe("two four item paths with red-herring", function () {
        /*
           .             1
           .           /   \    \
           .  +/2    101   102  105
           .         /       \    \
           .        2         3    5
           .         \       /    /
           .  ·/2    103   104  106
           .           \   /      \
           .             4         6
         */

        beforeEach(() => {
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            nodes.add({ id: 3, label: '3' });
            nodes.add({ id: 4, label: '4' });
            nodes.add({ id: 5, label: '5' });
            nodes.add({ id: 6, label: '6' });

            nodes.add({ id: 101, label: '+', data: '+/2' });
            nodes.add({ id: 102, label: '+', data: '+/2' });
            nodes.add({ id: 105, label: '+', data: '+/2' });
            nodes.add({ id: 103, label: '·', data: '·/2' });
            nodes.add({ id: 104, label: '·', data: '·/2' });
            nodes.add({ id: 106, label: '·', data: '·/2' });

            edges.add({ from: 1, to: 101, id: "1\v101" });
            edges.add({ from: 101, to: 2, id: "101\v2" });
            edges.add({ from: 2, to: 103, id: "2\v103" });
            edges.add({ from: 103, to: 4, id: "103\v4" });

            edges.add({ from: 1, to: 102, id: "1\v102" });
            edges.add({ from: 102, to: 3, id: "102\v3" });
            edges.add({ from: 3, to: 104, id: "3\v104" });
            edges.add({ from: 104, to: 4, id: "104\v4" });

            edges.add({ from: 1, to: 105, id: "1\v105" });
            edges.add({ from: 105, to: 5, id: "105\v5" });
            edges.add({ from: 5, to: 106, id: "5\v106" });
            edges.add({ from: 106, to: 6, id: "106\v6" });
        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPaths(network, 1, ['+/2', 'value', '·/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 101, 2, 103, 4 ], [ 102, 3, 104, 4 ] ]);
            }
        });

    });


    describe("two four item paths with same operator", function () {
        beforeEach(() => {
            nodes.add({ id: 1, label: '1' });
            nodes.add({ id: 2, label: '2' });
            nodes.add({ id: 3, label: '3' });
            nodes.add({ id: 4, label: '4' });
            nodes.add({ id: 101, label: '+', data: '+/2' });
            nodes.add({ id: 102, label: '+', data: '+/2' });
            nodes.add({ id: 103, label: '+', data: '+/2' });
            nodes.add({ id: 104, label: '+', data: '+/2' });

            edges.add({ from: 1, to: 101, id: "1\v101" });
            edges.add({ from: 101, to: 2, id: "101\v2" });
            edges.add({ from: 2, to: 103, id: "2\v103" });
            edges.add({ from: 103, to: 4, id: "103\v4" });

            edges.add({ from: 1, to: 102, id: "1\v102" });
            edges.add({ from: 102, to: 3, id: "102\v3" });
            edges.add({ from: 3, to: 104, id: "3\v104" });
            edges.add({ from: 104, to: 4, id: "104\v4" });
        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPaths(network, 1, ['+/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 101, 2, 103, 4 ], [ 102, 3, 104, 4 ] ]);
            }
            {
                const paths = findLoopingPaths(network, 4, ['+/2', 'value', '+/2', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 103, 2, 101, 1 ], [ 104, 3, 102, 1 ] ]);
            }
        });

        it("finds value–operator–value–operator paths", function () {
            {
                const paths = findLoopingPaths(network, 103, ['value', '+/2', 'value', '+/2']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 2, 101, 1, 102 ], [ 4, 104, 3, 102 ] ]);
            }
        });

    });

});


describe("getMembers", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
    });

    it("returns unordered operator members", function () {
        nodes.add(new OperatorNode(10, '+', '+/2'));
        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const members = getMembers(network, 10);
            expect(members).to.deep.equal({ operands: [1, 2], trunk: 3 });
        }
    });

    it("returns ordered operator members", function () {
        nodes.add(new OperatorNode(10, '^', '^/2'));
        edges.add(makeBEdge(1, 10));
        edges.add(makeAEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const members = getMembers(network, 10);
            expect(members).to.deep.equal({ "l-operand": 1, "r-operand": 2, trunk: 3 });
        }
    });

    it("returns function members", function () {
        nodes.add(new OperatorNode(10, 'f', 'f/2'));
        edges.add(makeOrderedEdge(1, 10));
        edges.add(makeOrderedEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const members = getMembers(network, 10);
            expect(members).to.deep.equal({ operands: [1, 2], trunk: 3 });
        }
    });
});

describe("getRoleIn", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();

        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
    });

    it("returns role for unordered operands", function () {
        nodes.add(new OperatorNode(10, '+', '+/2'));

        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const role = getRoleIn(network, 1, 10);
            expect(role).to.equal('operand');
        }
        {
            const role = getRoleIn(network, 3, 10);
            expect(role).to.equal('trunk');
        }
    });

    it("returns role for ordered operands", function () {
        nodes.add(new OperatorNode(10, '^', '^/2'));

        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const role = getRoleIn(network, 1, 10);
            expect(role).to.equal('operand');
        }
        {
            const role = getRoleIn(network, 3, 10);
            expect(role).to.equal('trunk');
        }
    });
});


describe("getMembersByRole", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();

        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
    });

    it("returns trunk members", function () {
        nodes.add(new OperatorNode(10, '+', '+/2'));
        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const member = getMembersByRole(network, 10, 'trunk');
            expect(member).to.deep.equal([3]);
        }
    });

    it("returns lr-operands members", function () {
        nodes.add(new OperatorNode(10, '^', '^/2'));
        edges.add(makeBEdge(1, 10));
        edges.add(makeAEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const member = getMembersByRole(network, 10, 'l-operand');
            expect(member).to.deep.equal([1]);
        }
        {
            const member = getMembersByRole(network, 10, 'r-operand');
            expect(member).to.deep.equal([2]);
        }
        {
            const member = getMembersByRole(network, 10, 'trunk');
            expect(member).to.deep.equal([3]);
        }
    });

    it("returns unordered operands", function () {
        nodes.add(new OperatorNode(10, '+', '+/2'));
        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        {
            const neighbours = getMembersByRole(network, 10, 'operand');
            expect(neighbours.length).to.equal(2);
            expect(neighbours).to.deep.equal([1, 2]);
        }

    });

});

describe("hasRoleIn", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
    });

    it("plus operator", function () {
        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
        nodes.add(new OperatorNode(10, '+', '+/2'));
        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        expect(
            hasRoleIn(network, 1, 'operand', 10)
        ).to.be.true;
        expect(
            hasRoleIn(network, 2, 'operand', 10)
        ).to.be.true;

        expect(
            hasRoleIn(network, 3, 'trunk', 10)
        ).to.be.true;

    });

    it("power operator", function () {
        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
        nodes.add(new OperatorNode(10, '^', '^/2'));
        edges.add(makeBEdge(1, 10));
        edges.add(makeAEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));

        expect(
            hasRoleIn(network, 1, 'l-operand', 10)
        ).to.be.true;
        expect(
            hasRoleIn(network, 2, 'r-operand', 10)
        ).to.be.true;

        expect(
            hasRoleIn(network, 3, 'trunk', 10)
        ).to.be.true;

    });

    it("function operator", function () {
        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
        nodes.add(new OperatorNode(10, 'f', 'f/2'));
        edges.add(makeOrderedEdge(1, 10, 1));
        edges.add(makeOrderedEdge(2, 10, 2));
        edges.add(makeTrunkEdge(10, 3));

        expect(
            hasRoleIn(network, 1, 'orderedOperand', 10)
        ).to.be.true;
        expect(
            hasRoleIn(network, 2, 'orderedOperand', 10)
        ).to.be.true;

        expect(
            hasRoleIn(network, 3, 'trunk', 10)
        ).to.be.true;

    });
});


describe("findPathsWithRole", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
        nodes.add(new ValueNode(1, '1'));
        nodes.add(new ValueNode(2, '2'));
        nodes.add(new ValueNode(3, '3'));
        nodes.add(new OperatorNode(10, '+', '+/2'));
        edges.add(makePartEdge(1, 10));
        edges.add(makePartEdge(2, 10));
        edges.add(makeTrunkEdge(10, 3));
    });

    it("finds neighbouring operator node", function () {
        {
            const paths = findPathsWithRole(network, 1, ['operand', '+/2']);
            expect(paths).to.deep.equal([ [10] ]);
        }
        {
            const paths = findPathsWithRole(network, 2, ['operand', '+/2']);
            expect(paths).to.deep.equal([ [10] ]);
        }
        {
            const paths = findPathsWithRole(network, 3, ['trunk', '+/2']);
            expect(paths).to.deep.equal([ [10] ]);
        }
    });

    it("finds neighbouring value node", function () {
        {
            const paths = findPathsWithRole(network, 10, ['operand', 'value']);
            expect(paths).to.deep.equal([ [1], [2] ]);
        }
        {
            const paths = findPathsWithRole(network, 10, ['trunk', 'value']);
            expect(paths).to.deep.equal([ [3] ]);
        }
    });
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


describe("findLoopingPathsWithRole", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
    });

    describe("simple paths", function () {
        beforeEach(() => {
            nodes.add(new ValueNode(1, '1'));
            nodes.add(new ValueNode(2, '2'));
            nodes.add(new OperatorNode(10, '+', '+/2'));
            nodes.add(new OperatorNode(20, '+', '+/2'));

            edges.add(makePartEdge(1, 10));
            edges.add(makeTrunkEdge(10, 2));
            edges.add(makePartEdge(1, 20));
            edges.add(makeTrunkEdge(20, 2));
        });

        it("finds simple operator–value paths", function () {
            {
                const paths = findLoopingPathsWithRole(network, 1, ['operand', '+/2', 'trunk', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 10, 2 ], [ 20, 2 ] ]);
            }
            {
                const paths = findLoopingPathsWithRole(network, 2, ['trunk', '+/2', 'operand', 'value']);
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 10, 1 ], [ 20, 1 ] ]);
            }
        });

    });

    describe("two four item paths", function () {
        beforeEach(() => {
            /*
               .             1
               .           /   \
               .  +/2    10     20
               .         /       \
               .        2         3
               .         \       /
               .  ·/2    30     40
               .           \   /
               .             4
             */
            nodes.add(new ValueNode(1, '1'));
            nodes.add(new ValueNode(2, '2'));
            nodes.add(new ValueNode(3, '3'));
            nodes.add(new ValueNode(4, '4'));
            nodes.add(new OperatorNode(10, '+', '+/2'));
            nodes.add(new OperatorNode(20, '+', '+/2'));
            nodes.add(new OperatorNode(30, '·', '·/2'));
            nodes.add(new OperatorNode(40, '·', '·/2'));

            edges.add(makePartEdge(1, 10));
            edges.add(makeTrunkEdge(10, 2));
            edges.add(makePartEdge(2, 30));
            edges.add(makeTrunkEdge(30, 4));

            edges.add(makePartEdge(1, 20));
            edges.add(makeTrunkEdge(20, 3));
            edges.add(makePartEdge(3, 40));
            edges.add(makeTrunkEdge(40, 4));

        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPathsWithRole(network, 1,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '·/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 10, 2, 30, 4 ], [ 20, 3, 40, 4 ] ]);
            }
            {
                const paths = findLoopingPathsWithRole(network, 1,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '+/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(0);
            }
            {
                const paths = findLoopingPathsWithRole(network, 4,
                                                       ['trunk', '·/2', 'operand', 'value', 'trunk', '+/2', 'operand', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 30, 2, 10, 1 ], [ 40, 3, 20, 1 ] ]);
            }
        });
    });

    describe("three four item paths", function () {
        beforeEach(() => {
            /*
               .             1
               .           /   \    \
               .  +/2    10    20   50
               .         /       \    \
               .        2         3    5
               .         \       /    /
               .  ·/2    30     40   60
               .           \   /    /
               .             4
             */
            nodes.add(new ValueNode(9, '9'));
            nodes.add(new ValueNode(2, '2'));
            nodes.add(new ValueNode(3, '3'));
            nodes.add(new ValueNode(4, '4'));
            nodes.add(new ValueNode(5, '5'));
            nodes.add(new OperatorNode(10, '+', '+/2'));
            nodes.add(new OperatorNode(20, '+', '+/2'));
            nodes.add(new OperatorNode(30, '·', '·/2'));
            nodes.add(new OperatorNode(40, '·', '·/2'));
            nodes.add(new OperatorNode(50, '+', '+/2'));
            nodes.add(new OperatorNode(60, '·', '·/2'));

            edges.add(makePartEdge(9, 10));
            edges.add(makeTrunkEdge(10, 2));
            edges.add(makePartEdge(2, 30));
            edges.add(makeTrunkEdge(30, 4));

            edges.add(makePartEdge(9, 20));
            edges.add(makeTrunkEdge(20, 3));
            edges.add(makePartEdge(3, 40));
            edges.add(makeTrunkEdge(40, 4));

            edges.add(makePartEdge(9, 50));
            edges.add(makeTrunkEdge(50, 5));
            edges.add(makePartEdge(5, 60));
            edges.add(makeTrunkEdge(60, 4));

        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPathsWithRole(network, 9,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '·/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(3);
                expect(paths).to.deep.equal([ [ 10, 2, 30, 4 ], [ 20, 3, 40, 4 ], [ 50, 5, 60, 4 ] ]);
            }
            {
                const paths = findLoopingPathsWithRole(network, 9,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '+/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(0);
            }
            {
                const paths = findLoopingPathsWithRole(network, 4,
                                                       ['trunk', '·/2', 'operand', 'value', 'trunk', '+/2', 'operand', 'value']
                );
                expect(paths.length).to.equal(3);
                expect(paths).to.deep.equal([ [ 30, 2, 10, 9 ], [ 40, 3, 20, 9 ], [ 60, 5, 50, 9 ] ]);
            }
        });

    });

    describe("two four item paths with red-herring", function () {
        beforeEach(() => {

            /*
               .             9
               .           /   \     \
               .  +/2    101   102   105
               .         /       \     \
               .        2         3     5
               .         \       /     /
               .  ·/2    103   104   106
               .           \   /       \
               .             4          6
             */

            nodes.add(new ValueNode(1, '1'));
            nodes.add(new ValueNode(2, '2'));
            nodes.add(new ValueNode(3, '3'));
            nodes.add(new ValueNode(4, '4'));
            nodes.add(new ValueNode(5, '5'));
            nodes.add(new ValueNode(6, '6'));

            nodes.add(new OperatorNode(10, '+', '+/2'));
            nodes.add(new OperatorNode(20, '+', '+/2'));
            nodes.add(new OperatorNode(30, '·', '·/2'));
            nodes.add(new OperatorNode(40, '·', '·/2'));
            nodes.add(new OperatorNode(50, '+', '+/2'));
            nodes.add(new OperatorNode(60, '·', '·/2'));

            edges.add(makePartEdge(1, 10));
            edges.add(makeTrunkEdge(10, 2));
            edges.add(makePartEdge(2, 30));
            edges.add(makeTrunkEdge(30, 4));

            edges.add(makePartEdge(1, 20));
            edges.add(makeTrunkEdge(20, 3));
            edges.add(makePartEdge(3, 40));
            edges.add(makeTrunkEdge(40, 4));

            edges.add(makePartEdge(1, 50));
            edges.add(makeTrunkEdge(50, 5));
            edges.add(makePartEdge(5, 60));
            edges.add(makeTrunkEdge(60, 6));

        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPathsWithRole(network, 1,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '·/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 10, 2, 30, 4 ], [ 20, 3, 40, 4 ] ]);
            }
            {
                const paths = findLoopingPathsWithRole(network, 4,
                                                       ['trunk', '·/2', 'operand', 'value', 'trunk', '+/2', 'operand', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 30, 2, 10, 1 ], [ 40, 3, 20, 1 ] ]);
            }

        });
    });

    describe("two four item paths with same operator", function () {
        beforeEach(() => {
            nodes.add(new ValueNode(1, '1'));
            nodes.add(new ValueNode(2, '2'));
            nodes.add(new ValueNode(3, '3'));
            nodes.add(new ValueNode(4, '4'));
            nodes.add(new OperatorNode(10, '+', '+/2'));
            nodes.add(new OperatorNode(20, '+', '+/2'));
            nodes.add(new OperatorNode(30, '+', '+/2'));
            nodes.add(new OperatorNode(40, '+', '+/2'));

            edges.add(makePartEdge(1, 10));
            edges.add(makeTrunkEdge(10, 2));
            edges.add(makePartEdge(2, 30));
            edges.add(makeTrunkEdge(30, 4));

            edges.add(makePartEdge(1, 20));
            edges.add(makeTrunkEdge(20, 3));
            edges.add(makePartEdge(3, 40));
            edges.add(makeTrunkEdge(40, 4));
        });

        it("finds operator–value–operator–value paths", function () {
            {
                const paths = findLoopingPathsWithRole(network, 1,
                                                       ['operand', '+/2', 'trunk', 'value', 'operand', '+/2', 'trunk', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 10, 2, 30, 4 ], [ 20, 3, 40, 4 ] ]);
            }
            {
                const paths = findLoopingPathsWithRole(network, 4,
                                                       ['trunk', '+/2', 'operand', 'value', 'trunk', '+/2', 'operand', 'value']
                );
                expect(paths.length).to.equal(2);
                expect(paths).to.deep.equal([ [ 30, 2, 10, 1 ], [ 40, 3, 20, 1 ] ]);
            }
        });


    });

});
