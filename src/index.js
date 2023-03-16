import { DataSet } from "vis-data";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

import { getFormula } from './traverse.js';
import { loadFormula } from './graph.js';
import { extractCommonFactor } from './transformations/commonFactor.js';


var options = {};

// create a network
var container = document.getElementById('mynetwork');

const network = new Network(container, {}, options);
network.on( 'click', function(properties) {
    const nodes = network.body.data.nodes;

    const ids = properties.nodes;
    if ( ids.length !== 1 ) {
        return;
    }

    const node = nodes.get(ids[0]);
    if ( node.type !== "value" ) {
        return;
    }

    document.querySelector('#output').value = (node.data === null ? '' : node.label + ' = ') + getFormula(network, ids[0]);
});



window.onload = () => {
    const button = document.querySelector('#common');
    button.onclick = (event) => {
        const ids = network.getSelectedNodes();
        extractCommonFactor(network, ids[0]);
    };

    const input = document.querySelector('#formula');
    input.onkeypress = (event) => {
        console.log(event);
        switch ( event.keyCode ) {
            case 13:
                network.setData(loadFormula(event.target.value));
                break;
        }
    };

    network.setData(loadFormula(input.value));
};
