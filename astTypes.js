/**
 * @typedef {import('./nodos').Expresion} Expresion
 * 
 * @typedef {Object} Reference
 * @property {'Reference'} type
 * @property {Identifier} head - El identificador principal de la referencia
 * @property {Array<PropertyAccess|ArrayAccess|FunctionCall>} tail - Lista de accesos a propiedades, arrays o llamadas a funciones
 */

/**
 * @typedef {Object} Reference2
 * @property {'Reference2'} type
 * @property {Identifier} head - El identificador principal de la referencia2
 * @property {Array<PropertyAccess|ArrayAccess>} tail - Lista de accesos a propiedades, arrays o llamadas a funciones
 */

/**
 * @typedef {Object} Identifier
 * @property {'Identifier'} type
 * @property {string} name - El nombre del identificador
 */

/**
 * @typedef {Object} PropertyAccess
 * @property {'PropertyAccess'} type
 * @property {Identifier} property - La propiedad a la que se accede
 */

/**
 * @typedef {Object} ArrayAccess
 * @property {'ArrayAccess'} type
 * @property {Expression} index - La expresión que representa el índice
 */

/**
 * @typedef {Object} FunctionCall
 * @property {'FunctionCall'} type
 * @property {Array<Expresion>} arguments - Lista de argumentos pasados a la función
 */

/**
 * @typedef {Object} NumberLiteral
 * @property {'Number'} type
 * @property {number} value - El valor numérico
 */

/**
 * @typedef {Object} StringLiteral
 * @property {'String'} type
 * @property {string} value - El valor de la cadena
 */

/**
 * @typedef {Object} BooleanLiteral
 * @property {'Boolean'} type
 * @property {boolean} value - El valor booleano
 */

/**
 * @typedef {Object} NullLiteral
 * @property {'Null'} type
 */

/**
 * @typedef {Object} ASTTypes
 * @property {Reference} Reference
 * @property {Identifier} Identifier
 * @property {PropertyAccess} PropertyAccess
 * @property {ArrayAccess} ArrayAccess
 * @property {FunctionCall} FunctionCall
 * @property {NumberLiteral} NumberLiteral
 * @property {StringLiteral} StringLiteral
 * @property {BooleanLiteral} BooleanLiteral
 * @property {NullLiteral} NullLiteral
 * @property {ASTNode} ASTNode
 */

/** @type {ASTTypes} */
const ASTTypes = {};

export default ASTTypes;