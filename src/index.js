import { DataSet } from "vis-data";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

import { exprToRPN, rpnToExpr, functions } from './expr/index.js';
import { graphToRPN, rpnToGraph } from './graph/index.js';
import { extractCommonFactor } from './transformations/commonFactor.js';
import { disableUnknown } from './transformations/disableUnknown.js';

const loadFormula = formula => {
    const rpn = exprToRPN(formula);
    return rpnToGraph(rpn);
};

const outputFormula = (network, povId) => {
    const rpn = graphToRPN(network, povId);
    document.querySelector('#output').value = rpnToExpr(rpn);
};


window.onload = () => {
    var options = {};
    var container = document.getElementById('mynetwork');

    const network = new Network(container, {}, options);

    window.vis = network; // for debugging

    network.on( 'click', function(properties) {
        const nodes = network.body.data.nodes;

        const ids = properties.nodes;
        console.log("selected:", ids);

        if ( ids.length !== 1 ) {
            return;
        }


        const povId = ids[0];
        const node = nodes.get(povId);
        if ( node.type !== "value" ) {
            return;
        }


        outputFormula(network, povId);

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

    document.querySelector('#copy-to-input').onclick = (event) => {
        input.value = document.querySelector('#output').value;
        network.setData(loadFormula(input.value));
    };

    document.querySelector('#disable').onclick = (event) => {
        const ids = network.getSelectedNodes();
        ids.forEach((id) => {
            disableUnknown(network, id);
        });

    };

    network.setData(loadFormula(input.value));
};
