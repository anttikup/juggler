import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

import Graph from "./graph/index.js";
import { exprToRPN, rpnToExpr, functions } from './expr/index.js';
import { extractCommonFactor } from './transformations/commonFactor.js';
import { disableUnknown } from './transformations/disableUnknown.js';


window.onload = () => {
    const container = document.getElementById('mynetwork');
    const graph = new Graph(container);
    const formulaInput = document.querySelector('#formula');
    const formulaOutput = document.querySelector('#output');

    graph.setRPN(exprToRPN(formulaInput.value));

    window.network = graph.vis; // for debugging

    graph.on( 'click', (properties) => {
        const ids = properties.nodes;
        console.log("selected:", ids);

        if ( ids.length !== 1 ) {
            return;
        }

        const povId = ids[0];
        const node = graph.nodes.get(povId);
        if ( node.type !== "value" ) {
            return;
        }

        const rpn = graph.getRPN(povId);
        formulaOutput.value = rpnToExpr(rpn);
    });

    document.querySelector('#common').onclick = (event) => {
        const ids = graph.getSelectedNodes();
        extractCommonFactor(graph.vis, ids[0]);
    };

    document.querySelector('#formula').onkeypress = (event) => {
        switch ( event.keyCode ) {
            case 13:
                graph.setRPN(exprToRPN(event.target.value));
                break;
        }
    };

    document.querySelector('#copy-to-input').onclick = (event) => {
        formulaInput.value = document.querySelector('#output').value;
        graph.setRPN(exprToRPN(formulaInput.value));
    };

    document.querySelector('#disable').onclick = (event) => {
        const ids = graph.getSelectedNodes();
        ids.forEach((id) => {
            disableUnknown(graph.vis, id);
        });

    };

};
