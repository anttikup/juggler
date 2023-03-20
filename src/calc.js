


export function division(num1, num2) {
    const remainder = num1 % num2;

    if ( remainder !== 0 ) {
        throw new Error('not integer result');
    }

    return num1 / num2;
};


function anyRoot(num1, num2) {
    return Math.pow(num2, 1/num1);
}

export function root(num1, num2) {
    // num1 root num2 = result  |  2 root 9 = 3
    // num2 = result ^ num1     |  9 = 3 ^ 2

    const result = Math.round(anyRoot(num1, num2));
    const checkNum2 = Math.pow(result, num1);

    if ( checkNum2 >= Number.MAX_SAFE_INTEGER ) {
        throw new Error('overflow');
    } else if ( checkNum2 !== num2 ) {
        throw new Error('not integer result');
    }

    return result;
};

function anyLog(num1, num2) {
    return Math.log(num2) / Math.log(num1);
}


export function logarithm(num1, num2) {
    // num1 log num2 = result  |  10 log 100 = 2
    // num2 = num1 ^ result    |  100 = 10 ^ 2

    const result = Math.round(anyLog(num1, num2));
    const checkNum2 = Math.pow(num1, result);

    if ( checkNum2 >= Number.MAX_SAFE_INTEGER ) {
        throw new Error('overflow');
    } else if ( checkNum2 !== num2 ) {
        throw new Error('not integer result');
    }

    return result;
};
