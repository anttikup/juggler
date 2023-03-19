import { makeId } from '../id.js';
import {
    isUnboundVariable,
    makePartEdge,
    makeAEdge,
    makeBEdge,
    makeTrunkEdge,
    makeValueNode,
    makeOperatorNode,
} from '../graph/nodesedges.js';
import { intersection, union } from './set.js';
import {
    combineNodes,
    findLoopingPathsWithRole,
    getNeighbours,
    getNeighboursOfType,
    getMembersByRole,
    removeEdge,
    removeEdges,
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
        nodes.add(makeValueNode(mid));

        edges.add(makeTrunkEdge(newMult, sumTrunk, '·/2'));
        edges.add(makePartEdge(commonFactor, newMult));
        edges.add(makePartEdge(mid, newMult));
        edges.add(makeTrunkEdge(sumOper, mid, '+/2'));
        edges.add(makePartEdge(otherFactors[0], sumOper));
        edges.add(makePartEdge(otherFactors[1], sumOper));

    }
};
