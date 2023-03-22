import { expect } from "../testconfig.js";
import {
    ValueNode,
    OperatorNode,
    FunctionNode,
} from './nodes.js';


describe("ValueNode", function () {

    it("can access fields", function () {
        {
            const node = new ValueNode(1, 3);
            expect(node.id).to.equal(1);
            expect(node.data).to.equal(3);
            expect(node.name).to.be.null;
        }
        {
            const node = new ValueNode(1, 'x');
            expect(node.id).to.equal(1);
            expect(node.data).to.equal('x');
            expect(node.name).to.equal('x');
            expect(node.color).to.equal('black');
        }
    });

});

describe("OperatorNode", function () {

    it("can access fields", function () {

        {
            const node = new OperatorNode(1, 'label', 'operator');
            expect(node.id).to.equal(1);
            expect(node.data).to.equal('operator');
            expect(node.label).to.equal('label');
        }
    });

});
