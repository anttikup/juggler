export function union(setA, ...sets) {
    const out = new Set(setA);
    for ( const setB of sets ) {
        for (const elem of setB) {
            out.add(elem);
        }
    }

    return out;
};

export function intersection(setA, ...sets) {
    let out;
    for ( const setB of sets ) {
        out = new Set();
        for ( const elem of setB ) {
            if (setA.has(elem)) {
                out.add(elem);
            }
        }
        setA = out;
    }
    return out ?? setA;
};
