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

    var ids = properties.nodes;
    var clickedNodes = nodes.get(ids);
    const node = nodes.get(ids[0]);
    document.querySelector('#output').value = (node.label === ' ' ? '' : node.label + ' = ') + getFormula(network, ids[0]);
});



window.onload = () => {
    console.log("load");
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
                console.log("enter");
                network.setData(loadFormula(event.target.value));
                break;
        }
    };

    network.setData(loadFormula(input.value));

    console.log("hello");
};
