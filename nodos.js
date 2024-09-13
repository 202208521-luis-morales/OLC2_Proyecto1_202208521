
/**
 * @typedef {Object} Location
 * @typedef {import('./astTypes').Reference} Reference
 * @typedef {import('./astTypes').Reference2} Reference2
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/


/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {


        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}

export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
    * @param {Expresion} options.der Expresion derecha de la operacion
    * @param {string} options.op Operador de la operacion
    * @param {string} options
    */

    constructor({ izq, der, op }) {
        super();

        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;

        this.tipo = null;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;

        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}

export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
    * @param {string} options.op Operador de la operacion
    * @param {string} options.tipo Operador de la operacion
    */
    constructor({ exp, op }) {
        super();

        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;

        this.tipo = null;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}

export class Ternario extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condition Expresion de la operacion
    * @param {Expresion} options.trueExpr Operador de la operacion
    * @param {Expresion} options.falseExpr
    * @param {string} options.tipo Operador de la operacion
    */
    constructor({ condition, trueExpr, falseExpr }) {
        super();

        /**
         * Condicion de la operacion
         * @type {Expresion}
        */
        this.condition = condition;

        /**
         * Si la condicione es verdadera
         * @type {Expresion}
        */
        this.trueExpr = trueExpr;

        /**
         * Si la condicione es falsa
         * @type {Expresion}
        */
        this.falseExpr = falseExpr;

        /**
         * Expresion de la operacion
         * @type {string}
        */
        this.tipo = null;
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernario(this);
    }
}

export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();

        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

        this.tipo = null;
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}

export class NString extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();

        /**
         * @type {string}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNString(this);
    }
}

export class NBoolean extends Expresion {

    /**
    * @param {Object} options
    * @param {boolean} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {boolean}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNBoolean(this);
    }
}

export class NVector extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {Expresion[]}
        */
        this.valor = valor;

        /**
         * @type { string | null }
        */
        this.tipo = null;

        /**
         * @type {number}
        */
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNVector(this);
    }
}

export class NNull extends Expresion {

    /**
    * @param {Object} options
    * @param {any} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {any}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNNull(this);
    }
}

export class NChar extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {string}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNChar(this);
    }
}

export class NInt extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNInt(this);
    }
}

export class NFloat extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor
    */
    constructor({ valor }) {
        super();

        /**
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNFloat(this);
    }
}

export class NStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Tipo del struct
    * @param {{id: string, exp: Expresion}[]} options.vals
    */
    constructor({ id, vals }) {
        super();

        /**
         * @type {string}
         * Tipo del struct
        */
        this.id = id;

        /**
         * @type {{id: string, exp: Expresion}[]}
        */
        this.vals = vals;


    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNStruct(this);
    }
}

export class NewExp extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.type
    * @param {number[]} options.dimensions
    * @param {number} options.level
    */
    constructor({ type, dimensions, level }) {
        super();

        /**
         * @type {string}
        */
        this.tipo = type;

        /**
         * @type {number[]}
        */
        this.dimensions = dimensions;

        /**
         * @type {number}
        */
        this.level = level;
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNewExp(this);
    }
}

export class DeclaracionVariable1 extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    * @param {number} options.numBrackets Identificador de la variable
    * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ type, id, numBrackets, exp }) {
        super();

        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

        /**
         * Identificador de la variable
         * @type {number}
        */
        this.numBrackets = numBrackets;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

        /**
         * Tipo de la variable
         * @type {string}
         */
        this.type = type;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable1(this);
    }
}

export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ id, exp }) {
        super();

        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}

export class StructDecl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    * @param {{tipo: string, iden: string}[]} options.attrs
    */
    constructor({ id, attrs }) {
        super();

        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Datos a guardar
         * @type {{tipo: string, iden: string}[]}
        */
        this.attrs = attrs;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructDecl(this);
    }
}

export class ReferenciaVariable extends Expresion {

    // Importar los tipos
    /**
    * @param {Object} options
    * @param {Reference} options.refData Datos de la referencia
    */
    constructor({ refData }) {
        super();

        /**
         * 
         * @type {string|null}
         */
        this.tipoSimbolo = null;

        /**
         * 
         * @type {string|null}
         */
        this.tipoVariable = null;

        /**
         * Datos de la referencia
         * @type {Reference}
        */
        this.refData = refData;
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}

export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.exp Expresion a imprimir
    */
    constructor({ exp }) {
        super();

        /**
         * Expresion a imprimir
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}

export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();

        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}

export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Reference2} options.ref Identificador de la variable
    * @param {string} options.op Operador
    * @param {Expresion} options.value Expresion a asignar
    */
    constructor({ ref, op, value }) {
        super();

        /**
         * Identificador de la variable
         * @type {Reference2}
        */
        this.ref = ref;


        /**
         * Operador
         * @type {string}
        */
        this.op = op;

        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.value = value;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}

export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Sentencias del bloque
    */
    constructor({ dcls }) {
        super();

        /**
         * Sentencias del bloque
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}

export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion} options.stmtTrue Cuerpo del if
 * @param {Expresion|undefined} options.stmtFalse Cuerpo del else
    */
    constructor({ cond, stmtTrue, stmtFalse }) {
        super();

        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del if
         * @type {Expresion}
        */
        this.stmtTrue = stmtTrue;


        /**
         * Cuerpo del else
         * @type {Expresion|undefined}
        */
        this.stmtFalse = stmtFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}

export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicional
    * @param {{exp: Expresion, dcls: Expresion[]}[]} options.listCases
    * @param {{exp: Expresion, dcls: Expresion[]}|undefined} options.defaultCase
    */
    constructor({ cond, listCases, defaultCase }) {
        super();

        /**
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * @type {{exp: Expresion, dcls: Expresion[]}[]}
        */
        this.listCases = listCases;


        /**
         * @type {{exp: Expresion, dcls: Expresion[]}|undefined}
        */
        this.defaultCase = defaultCase;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}

export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion} options.stmt Cuerpo del while
    */
    constructor({ cond, stmt }) {
        super();

        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del while
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}

export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicializacion del for
 * @param {Expresion} options.cond Condicion del for
 * @param {Expresion} options.inc Incremento del for
 * @param {Expresion} options.stmt Cuerpo del for
    */
    constructor({ init, cond, inc, stmt }) {
        super();

        /**
         * Inicializacion del for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * Condicion del for
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del for
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Cuerpo del for
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}

export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}

export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}

export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion|undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();

        /**
         * Expresion a retornar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}

export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion a llamar
 * @param {Expresion[]} options.args Argumentos de la llamada
    */
    constructor({ callee, args }) {
        super();

        /**
         * Expresion a llamar
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la llamada
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}

export class FuncDcl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la funcion
 * @param {string[]} options.params Parametros de la funcion
 * @param {Bloque} options.bloque Cuerpo de la funcion
    */
    constructor({ id, params, bloque }) {
        super();

        /**
         * Identificador de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {string[]}
        */
        this.params = params;


        /**
         * Cuerpo de la funcion
         * @type {Bloque}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncDcl(this);
    }
}

export class ClassDcl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la clase
 * @param {Expresion[]} options.dcls Declaraciones de la clase
    */
    constructor({ id, dcls }) {
        super();

        /**
         * Identificador de la clase
         * @type {string}
        */
        this.id = id;


        /**
         * Declaraciones de la clase
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitClassDcl(this);
    }
}

export class Instancia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la clase
 * @param {Expresion[]} options.args Argumentos de la instancia
    */
    constructor({ id, args }) {
        super();

        /**
         * Identificador de la clase
         * @type {string}
        */
        this.id = id;


        /**
         * Argumentos de la instancia
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstancia(this);
    }
}

export class Get extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
    */
    constructor({ objetivo, propiedad }) {
        super();

        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGet(this);
    }
}

export class Set extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
 * @param {Expresion} options.valor Valor de la propiedad
    */
    constructor({ objetivo, propiedad, valor }) {
        super();

        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;


        /**
         * Valor de la propiedad
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSet(this);
    }
}

export default { NChar, NStruct, StructDecl, NVector, NewExp, NInt, Switch, NFloat, Expresion, Ternario, NBoolean, NNull, OperacionBinaria, OperacionUnaria, Agrupacion, NString, DeclaracionVariable1, DeclaracionVariable, ReferenciaVariable, Print, ExpresionStmt, Asignacion, Bloque, If, While, For, Break, Continue, Return, Llamada, FuncDcl, ClassDcl, Instancia, Get, Set }

