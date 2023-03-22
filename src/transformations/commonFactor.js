import { makeId } from '../id.js';
import {
    OperandEdge,
    TrunkEdge,
} from '../graph/edges.js';
import {
    ValueNode
} from '../graph/nodes.js';

import {
    combineNodes,
    findLoopingPathsWithRole,
    getMembersByRole,
    removeEdges,
    isNumber,
} from '../graph/util.js';



function getParticipantNodes(network, nodeId) {
    const { nodes, edges } = network.body.data;

    const paths = findLoopingPathsWithRole(network, nodeId, ['operand', '·/2', 'trunk', 'value', 'operand', '+/2']);

    console.log("paths", paths);

    const multiplications = paths.map(path => path[0]);
    console.log("multiplications:", multiplications);
    const otherFactors = multiplications.flatMap(id => getMembersByRole(network, id, 'operand')).filter(id => id !== nodeId);
    console.log("otherFactors:", otherFactors);
    const summands = multiplications.flatMap(id => getMembersByRole(network, id, 'trunk')).filter(id => id !== nodeId);
    console.log("summands:", summands);

    const sumOper = paths[0][paths[0].length - 1];
    const sumTrunk = getMembersByRole(network, sumOper, 'trunk')[0];


    return {
        commonFactor: nodeId,
        otherFactors,
        multiplications,
        sumOper,
        sumTrunk,
        summands,
    };
}


function isUnboundVariable(node) {
    return node.name !== null && node.data !== null && !isNumber(node.data);
}

export function extractCommonFactor(network, nodeId) {
    const { nodes, edges } = network.body.data;
    const node = nodes.get(nodeId);
    if ( isUnboundVariable(node) ) {

        const {
            commonFactor,
            otherFactors,
            multiplications,
            sumOper,
            sumTrunk,
            summands
        } = getParticipantNodes(network, nodeId);



        nodes.remove(summands);

        removeEdges(network, sumOper);
        multiplications.forEach(multiplication => removeEdges(network, multiplication));

        const newMult = combineNodes(network, ...multiplications);


        console.log("mults:", multiplications);


        const mid = makeId();
        nodes.add(new ValueNode(mid));

        edges.add(new TrunkEdge(newMult, sumTrunk, '·/2'));
        edges.add(new OperandEdge(commonFactor, newMult));
        edges.add(new OperandEdge(mid, newMult));
        edges.add(new TrunkEdge(sumOper, mid, '+/2'));
        edges.add(new OperandEdge(otherFactors[0], sumOper));
        edges.add(new OperandEdge(otherFactors[1], sumOper));

    }
};
