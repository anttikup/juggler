
export function getFormula(network, start) {
    const visited = {};
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    return getFormulaRecursive(start);


    function text(nodeId) {
        const node = nodes.get(nodeId);
        if ( node.label === ' ' ) {
            return `(${getFormulaRecursive(nodeId)})`;
        } else {
            return node.label;
        }
    }

    function getFormulaRecursive(node) {
        const relations = network.getConnectedNodes(node);
        console.log("relations:", relations);
        const output = [];
        for ( let relation of relations ) {
            if ( visited[relation] ) {
                continue;
            }
            visited[relation] = true;
            const operator = nodes.get(relation).label;
            const conns = network.getConnectedEdges(relation);
            console.log("operator", operator);
            const parts = {};
            let counter = 0;
            for ( let conn of conns ) {
                const connType = edges.get(conn).label;
                const children = network.getConnectedNodes(conn).filter(id => id !== relation);
                if ( connType !== "⊙" ) {
                    parts[ connType ] = children[0];
                } else {
                    parts[ counter++ ] = children[0];
                }
                console.log(" ", connType, "->", children);
            }

            console.log("operator", operator, "parts:", parts, "node:", node, parts['='] === node, operator === "◌ⁿ");
            if ( parts['='] === node  && operator === "◌ⁿ" ) {
                console.log("hello");
                output.push(text(parts['L']) + ' ^ ' + text(parts['R']));
            } else if ( parts['='] === node  && operator !== "◌ⁿ" ) {
                output.push(text(parts[0]) + ' ' + operator + ' ' + text(parts[1]));
            } else if ( parts['L'] === node && operator === "◌ⁿ" ) {
                output.push(text(parts['R']) + '√(' + text(parts['=']) + ')');
            } else if ( parts['R'] === node && operator === "◌ⁿ" ) {
                output.push('log_' + text(parts['L']) + '(' + text(parts['=']) + ')');
            } else if ( parts[0] === node && operator === "·" ) {
                output.push(text(parts['=']) + ' : ' + text(parts[1]));
            } else if ( parts[1] === node && operator === "·" ) {
                output.push(text(parts['=']) + ' : ' + text(parts[0]));
            } else if ( parts[0] === node && operator === "+" ) {
                output.push(text(parts['=']) + ' – ' + text(parts[1]));
            } else if ( parts[1] === node && operator === "+" ) {
                output.push(text(parts['=']) + ' – ' + text(parts[0]));
            }
        }

        return output.join(' = ');
    }
}
