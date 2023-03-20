import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { expect } from "../testconfig.js";
import NetworkStub from "../test/NetworkStub.js";
import {
    makeFunctionNode,
    makeOperatorNode,
    makeValueNode,
    makeTrunkEdge,
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeOrderedEdge,
} from "./nodesedges.js";

import { graphToRPN } from './graphToExpr.js';


describe("graphToRPN", function () {
    const nodes = new DataSet();
    const edges = new DataSet();
    const network = new NetworkStub(null, { nodes, edges }, {});

    beforeEach(() => {
        nodes.clear();
        edges.clear();
    });

    describe("basic use", function () {

        describe("plus equation" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(1, 1));
                nodes.add(makeValueNode(2, 2));
                nodes.add(makeValueNode(3, 3));
                nodes.add(makeOperatorNode(10, '+', '+/2'));
                edges.add(makePartEdge(1, 10));
                edges.add(makePartEdge(2, 10));
                edges.add(makeTrunkEdge(10, 3));
            });

            it("returns result point-of-view", function () {

                {
                    const rpn = graphToRPN(network, 3);
                    expect(rpn).to.deep.equal([3, 1, 2, "+/2", "=/2"]);
                }
            });

            it("returns operand point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 1);
                    expect(rpn).to.deep.equal([1, 3, 2, "−/2", "=/2"]);
                }
                {
                    const rpn = graphToRPN(network, 2);
                    expect(rpn).to.deep.equal([2, 3, 1, "−/2", "=/2"]);
                }
            });
        });

        describe("multiplication equation" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(2, 2));
                nodes.add(makeValueNode(3, 3));
                nodes.add(makeValueNode(6, 6));
                nodes.add(makeOperatorNode(10, '·', '·/2'));
                edges.add(makePartEdge(2, 10));
                edges.add(makePartEdge(3, 10));
                edges.add(makeTrunkEdge(10, 6));
            });

            it("returns result point-of-view", function () {

                {
                    const rpn = graphToRPN(network, 6);
                    expect(rpn).to.deep.equal([6, 2, 3, "·/2", "=/2"]);
                }
            });

            it("returns operand point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 3);
                    expect(rpn).to.deep.equal([3, 6, 2, "//2", "=/2"]);
                }
                {
                    const rpn = graphToRPN(network, 2);
                    expect(rpn).to.deep.equal([2, 6, 3, "//2", "=/2"]);
                }
            });
        });


        describe("power equation" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(2, 2));
                nodes.add(makeValueNode(3, 3));
                nodes.add(makeValueNode(9, 9));
                nodes.add(makeOperatorNode(10, '◌ⁿ', '^/2'));
                edges.add(makeAEdge(2, 10));
                edges.add(makeBEdge(3, 10));
                edges.add(makeTrunkEdge(10, 9));
            });

            it("returns result point-of-view", function () {

                {
                    const rpn = graphToRPN(network, 9);
                    expect(rpn).to.deep.equal([9, 3, 2, "^/2", "=/2"]);
                }
            });

            it("returns square root point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 3);
                    expect(rpn).to.deep.equal([3, 2, 9, "√/2", "=/2"]);
                }
            });

            it("returns logarithm point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 2);
                    expect(rpn).to.deep.equal([2, 3, 9, "log/2", "=/2"]);
                }
            });
        });

        describe("sine function" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(1, 1));
                nodes.add(makeValueNode("90°", "90°"));
                nodes.add(makeFunctionNode(10, 'sin', 'sin/1'));
                edges.add(makeOrderedEdge(1, 10));
                edges.add(makeTrunkEdge(10, "90°"));
            });

            it("returns result point-of-view", function () {
                {
                    const rpn = graphToRPN(network, "90°");
                    expect(rpn).to.deep.equal(["90°", 1, "sin/1", "=/2"]);
                }
            });

            it("returns operand point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 1);
                    expect(rpn).to.deep.equal([1, "90°", "arcsin/1", "=/2"]);
                }
            });
        });


        describe("cosine function" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(1, 1));
                nodes.add(makeValueNode(0, 0));
                nodes.add(makeFunctionNode(10, 'cos', 'cos/1'));
                edges.add(makeOrderedEdge(1, 10));
                edges.add(makeTrunkEdge(10, 0));
            });

            it("returns result point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 0);
                    expect(rpn).to.deep.equal([0, 1, "cos/1", "=/2"]);
                }
            });

            it("returns operand point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 1);
                    expect(rpn).to.deep.equal([1, 0, "arccos/1", "=/2"]);
                }
            });
        });


        describe("tan function" ,function () {
            beforeEach(() => {
                nodes.add(makeValueNode(1, 1));
                nodes.add(makeValueNode("45°", "45°"));
                nodes.add(makeFunctionNode(10, 'tan', 'tan/1'));
                edges.add(makeOrderedEdge(1, 10));
                edges.add(makeTrunkEdge(10, "45°"));
            });

            it("returns result point-of-view", function () {
                {
                    const rpn = graphToRPN(network, "45°");
                    expect(rpn).to.deep.equal(["45°", 1, "tan/1", "=/2"]);
                }
            });

            it("returns operand point-of-view", function () {
                {
                    const rpn = graphToRPN(network, 1);
                    expect(rpn).to.deep.equal([1, "45°", "arctan/1", "=/2"]);
                }
            });
        });

        /* describe("test function f/2 function" ,function () {
         *     beforeEach(() => {
         *         nodes.add(makeValueNode(1, 1));
         *         nodes.add(makeValueNode("x", "x"));
         *         nodes.add(makeValueNode("y", "y"));
         *         nodes.add(makeValueNode("xy", "xy"));
         *         nodes.add(makeFunctionNode(10, 'f', 'f/2'));
         *         edges.add(makeOrderedEdge("x", 10));
         *         edges.add(makeOrderedEdge("y", 10));
         *         edges.add(makeTrunkEdge(10, "xy"));
         *     });

         *     it("returns result point-of-view", function () {
         *         {
         *             const rpn = graphToRPN(network, "xy");
         *             expect(rpn).to.deep.equal(["xy", "x", "y", "f/2", "=/2"]);
         *         }
         *     });

         * });

         * describe("test function f/3 function" ,function () {
         *     beforeEach(() => {
         *         nodes.add(makeValueNode(1, 1));
         *         nodes.add(makeValueNode("x", "x"));
         *         nodes.add(makeValueNode("y", "y"));
         *         nodes.add(makeValueNode("z", "z"));
         *         nodes.add(makeValueNode("xyz", "xyz"));
         *         nodes.add(makeFunctionNode(10, 'f', 'f/3'));
         *         edges.add(makeOrderedEdge("x", 10));
         *         edges.add(makeOrderedEdge("y", 10));
         *         edges.add(makeOrderedEdge("z", 10));
         *         edges.add(makeTrunkEdge(10, "xyz"));
         *     });

         *     it("returns result point-of-view", function () {
         *         {
         *             const rpn = graphToRPN(network, "xyz");
         *             expect(rpn).to.deep.equal(["xyz", "x", "y", "z", "f/3", "=/2"]);
         *         }
         *     });

         * });
         */
    });


    describe("operator precedence", function () {

        describe("multiplication – plus", function () {
            beforeEach(() => {
                /*
                   7 = 1 + 2 · 3
                   .
                   .            2
                   .           ·| = 6
                   .            3  +| = 7
                   .                1
                 */
                nodes.add(makeValueNode(1, 1));
                nodes.add(makeValueNode(2, 2));
                nodes.add(makeValueNode(3, 3));
                nodes.add(makeValueNode(6));
                nodes.add(makeValueNode(7, 7));
                nodes.add(makeOperatorNode(10, '+', '+/2'));
                nodes.add(makeOperatorNode(20, '·', '·/2'));

                edges.add(makePartEdge(2, 20));
                edges.add(makePartEdge(3, 20));
                edges.add(makeTrunkEdge(20, 6));
                edges.add(makePartEdge(1, 10));
                edges.add(makePartEdge(6, 10));
                edges.add(makeTrunkEdge(10, 7));
            });

            it("returns result point-of-view", function () {

                {
                    const rpn = graphToRPN(network, 7);
                    expect(rpn).to.deep.equal([7, 1, 2, 3, "·/2", "+/2", "=/2"]);
                }
            });

            it("returns operand point-of-view 1", function () {
                // 1 = 7 - 2 · 3
                {
                    const rpn = graphToRPN(network, 1);
                    expect(rpn).to.deep.equal([1, 7, 2, 3, "·/2", "−/2", "=/2"]);
                }
            });


            it("returns operand point-of-view 2", function () {
                // 2 = (7 - 1) / 3
                {
                    const rpn = graphToRPN(network, 2);
                    expect(rpn).to.deep.equal([2, 7, 1, "−/2", 3, "//2", "=/2"]);
                }
            });

            it("returns operand point-of-view 3", function () {
                // 3 = (7 - 1) / 2
                {
                    const rpn = graphToRPN(network, 3);
                    expect(rpn).to.deep.equal([3, 7, 1, "−/2", 2, "//2", "=/2"]);
                }
            });

            it("returns middle point-of-view", function () {
                // 2 · 3 = 7 - 1
                {
                    const rpn = graphToRPN(network, 6);
                    expect(rpn).to.deep.equal([2, 3, "·/2", 7, 1, "−/2", "=/2"]);
                }
            });

        });

        describe("multiplication – multiplication", function () {
            beforeEach(() => {
                /*
                   24 = 2 · 3 · 4
                   .
                   .            2
                   .           ·| = 6
                   .            3  ·| = 24
                   .                4
                 */
                nodes.add(makeValueNode(2, 2));
                nodes.add(makeValueNode(3, 3));
                nodes.add(makeValueNode(4, 4));
                nodes.add(makeValueNode(6));
                nodes.add(makeValueNode(24, 24));
                nodes.add(makeOperatorNode(10, '·', '·/2'));
                nodes.add(makeOperatorNode(20, '·', '·/2'));

                edges.add(makePartEdge(2, 20));
                edges.add(makePartEdge(3, 20));
                edges.add(makeTrunkEdge(20, 6));
                edges.add(makePartEdge(6, 10));
                edges.add(makePartEdge(4, 10));
                edges.add(makeTrunkEdge(10, 24));
            });

            it("returns result point-of-view", function () {

                {
                    const rpn = graphToRPN(network, 24);
                    expect(rpn).to.deep.equal([24, 2, 3, "·/2", 4, "·/2", "=/2"]);
                }
            });

            it("returns operand point-of-view 4", function () {
                // 4 = 24 / (2 · 3)
                {
                    const rpn = graphToRPN(network, 4);
                    expect(rpn).to.deep.equal([4, 24, 2, 3, "·/2", "//2", "=/2"]);
                }
            });


            it("returns operand point-of-view 2", function () {
                // 2 = 24 / 4 / 3
                {
                    const rpn = graphToRPN(network, 2);
                    expect(rpn).to.deep.equal([2, 24, 4, "//2", 3, "//2", "=/2"]);
                }
            });

            it("returns operand point-of-view 3", function () {
                // 3 = 24 / 4 / 2
                {
                    const rpn = graphToRPN(network, 3);
                    expect(rpn).to.deep.equal([3, 24, 4, "//2", 2, "//2", "=/2"]);
                }
            });

            it("returns middle point-of-view", function () {
                // 2 · 3 = 24 / 4
                {
                    const rpn = graphToRPN(network, 6);
                    expect(rpn).to.deep.equal([2, 3, "·/2", 24, 4, "//2", "=/2"]);
                }
            });

        });
    });

});
