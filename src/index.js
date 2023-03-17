import { DataSet } from "vis-data";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

import { getFormula, loadFormula } from './graph/index.js';
import { extractCommonFactor } from './transformations/commonFactor.js';




window.onload = () => {
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

        const povId = ids[0];
        const node = nodes.get(povId);
        if ( node.type !== "value" ) {
            return;
        }



        document.querySelector('#output').value = getFormula(network, povId);
    });

    const button = document.querySelector('#common');
    button.onclick = (event) => {
        const ids = network.getSelectedNodes();
        extractCommonFactor(network, ids[0]);
    };

    const input = document.querySelector('#formula');
    input.onkeypress = (event) => {
        //console.log(event);
        switch ( event.keyCode ) {
            case 13:
                network.setData(loadFormula(event.target.value));
                break;
        }
    };

    network.setData(loadFormula(input.value));
};
