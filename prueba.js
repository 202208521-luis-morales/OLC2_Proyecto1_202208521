function generateMultidimensionalArray(dimensions) {
  if (dimensions.length === 0) {
    return {
      tipoSimbolo: "simple",
      tipoVariable: "numero",
      valor: 0
    };
  }

  function createArray(dims) {
    if (dims.length === 1) {
      return {
        tipoSimbolo: "vector",
        tipoVariable: "numero",
        valor: Array(dims[0]).fill().map(() => ({
          tipoSimbolo: "simple",
          tipoVariable: "numero",
          valor: 0
        }))
      };
    }
    return {
      tipoSimbolo: "vector",
      tipoVariable: "numero",
      valor: Array(dims[0]).fill().map(() => createArray(dims.slice(1)))
    };
  }

  return createArray(dimensions);
}

// Ejemplo de uso:
console.log(JSON.stringify(generateMultidimensionalArray([2, 2]), null, 2));