import { DataSet } from "vis-data";
import { Network } from "vis-network";

import { expect } from "../testconfig.js";
import NetworkStub from "../test/NetworkStub.js";
import {
    TrunkEdge,
    OperandEdge,
    OrderedEdge,
} from "./edges.js";

import {
    ValueNode,
    OperatorNode,
    FunctionNode,
} from './nodes.js';

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
                nodes.add(new ValueNode(1, 1));
                nodes.add(new ValueNode(2, 2));
                nodes.add(new ValueNode(3, 3));
                nodes.add(new OperatorNode(10, '+', '+/2'));
                edges.add(new OperandEdge(1, 10));
                edges.add(new OperandEdge(2, 10));
                edges.add(new TrunkEdge(10, 3));
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
                nodes.add(new ValueNode(2, 2));
                nodes.add(new ValueNode(3, 3));
                nodes.add(new ValueNode(6, 6));
                nodes.add(new OperatorNode(10, '·', '·/2'));
                edges.add(new OperandEdge(2, 10));
                edges.add(new OperandEdge(3, 10));
                edges.add(new TrunkEdge(10, 6));
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
                nodes.add(new ValueNode(3, 3));
                nodes.add(new ValueNode(2, 2));
                nodes.add(new ValueNode(9, 9));
                nodes.add(new OperatorNode(10, '◌ⁿ', '^/2'));
                edges.add(new OrderedEdge(3, 10, 1));
                edges.add(new OrderedEdge(2, 10, 2));
                edges.add(new TrunkEdge(10, 9));
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
                nodes.add(new ValueNode(1, 1));
                nodes.add(new ValueNode("90°", "90°"));
                nodes.add(new FunctionNode(10, 'sin', 'sin/1'));
                edges.add(new OrderedEdge(1, 10));
                edges.add(new TrunkEdge(10, "90°"));
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
                nodes.add(new ValueNode(1, 1));
                nodes.add(new ValueNode(0, 0));
                nodes.add(new FunctionNode(10, 'cos', 'cos/1'));
                edges.add(new OrderedEdge(1, 10));
                edges.add(new TrunkEdge(10, 0));
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
                nodes.add(new ValueNode(1, 1));
                nodes.add(new ValueNode("45°", "45°"));
                nodes.add(new FunctionNode(10, 'tan', 'tan/1'));
                edges.add(new OrderedEdge(1, 10));
                edges.add(new TrunkEdge(10, "45°"));
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
         *         nodes.add(new ValueNode(1, 1));
         *         nodes.add(new ValueNode("x", "x"));
         *         nodes.add(new ValueNode("y", "y"));
         *         nodes.add(new ValueNode("xy", "xy"));
         *         nodes.add(new FunctionNode(10, 'f', 'f/2'));
         *         edges.add(new OrderedEdge("x", 10));
         *         edges.add(new OrderedEdge("y", 10));
         *         edges.add(new TrunkEdge(10, "xy"));
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
         *         nodes.add(new ValueNode(1, 1));
         *         nodes.add(new ValueNode("x", "x"));
         *         nodes.add(new ValueNode("y", "y"));
         *         nodes.add(new ValueNode("z", "z"));
         *         nodes.add(new ValueNode("xyz", "xyz"));
         *         nodes.add(new FunctionNode(10, 'f', 'f/3'));
         *         edges.add(new OrderedEdge("x", 10));
         *         edges.add(new OrderedEdge("y", 10));
         *         edges.add(new OrderedEdge("z", 10));
         *         edges.add(new TrunkEdge(10, "xyz"));
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
                nodes.add(new ValueNode(1, 1));
                nodes.add(new ValueNode(2, 2));
                nodes.add(new ValueNode(3, 3));
                nodes.add(new ValueNode(6));
                nodes.add(new ValueNode(7, 7));
                nodes.add(new OperatorNode(10, '+', '+/2'));
                nodes.add(new OperatorNode(20, '·', '·/2'));

                edges.add(new OperandEdge(2, 20));
                edges.add(new OperandEdge(3, 20));
                edges.add(new TrunkEdge(20, 6));
                edges.add(new OperandEdge(1, 10));
                edges.add(new OperandEdge(6, 10));
                edges.add(new TrunkEdge(10, 7));
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
                nodes.add(new ValueNode(2, 2));
                nodes.add(new ValueNode(3, 3));
                nodes.add(new ValueNode(4, 4));
                nodes.add(new ValueNode(6));
                nodes.add(new ValueNode(24, 24));
                nodes.add(new OperatorNode(10, '·', '·/2'));
                nodes.add(new OperatorNode(20, '·', '·/2'));

                edges.add(new OperandEdge(2, 20));
                edges.add(new OperandEdge(3, 20));
                edges.add(new TrunkEdge(20, 6));
                edges.add(new OperandEdge(6, 10));
                edges.add(new OperandEdge(4, 10));
                edges.add(new TrunkEdge(10, 24));
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
