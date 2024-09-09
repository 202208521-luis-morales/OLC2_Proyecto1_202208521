function generateMultidimensionalArray(dimensions) {
    if (dimensions.length === 0) {
        return 0;
    }

    function createArray(dims) {
        if (dims.length === 1) {
            return new Array(dims[0]).fill(0);
        }
        return new Array(dims[0]).fill().map(() => createArray(dims.slice(1)));
    }

    return createArray(dimensions);
}

function getValueByIndices(array, indices) {
    let current = array;
    for (let i = 0; i < indices.length; i++) {
        if (current === undefined || typeof current !== 'object') {
            throw new Error(`Error de dimensión: se esperaban ${indices.length} niveles, pero solo hay ${i}`);
        }
        current = current[indices[i]];
    }
    if (current === undefined) {
        throw new Error("Índice fuera de rango");
    }
    return current;
}

function updateValueByIndices(array, indices, newValue) {
    let current = array;
    for (let i = 0; i < indices.length - 1; i++) {
        if (current === undefined || typeof current !== 'object') {
            throw new Error(`Error de dimensión: se esperaban ${indices.length} niveles, pero solo hay ${i}`);
        }
        current = current[indices[i]];
    }
    if (current === undefined || typeof current !== 'object') {
        throw new Error(`Error de dimensión: se esperaban ${indices.length} niveles, pero solo hay ${indices.length - 1}`);
    }
    const lastIndex = indices[indices.length - 1];
    if (lastIndex in current) {
        current[lastIndex] = newValue;
    } else {
        throw new Error("Índice fuera de rango");
    }
}

let array1 = generateMultidimensionalArray([4]);

console.log(array1);