import { Entorno } from "./entorno.js";
import { BaseVisitor } from "./visitor.js";
import nodos, { Expresion } from './nodos.js'
import { BreakException, ContinueException, ReturnException } from "./transferencia.js";
import { Invocable } from "./invocable.js";
import { embebidas } from "./embebidas.js";
import { FuncionForanea } from "./foreanea.js";
import { Clase } from "./clase.js";
import { Instancia } from "./instancia.js";
import lodashCloneDeep from "./lodash/cloneDeep.js"

export class InterpreterVisitor extends BaseVisitor {
    constructor() {
        super();
        this.entornoActual = new Entorno();

        // funciones embebidas
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.set(nombre, funcion);
        });


        this.salida = '';

        /**
         * @type {Expresion | null}
        */
        this.prevContinue = null;
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    /**
      * @type {BaseVisitor['visitOperacionBinaria']}
      */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        const leftType = this.getTrueType(node.izq);
        const rightType = this.getTrueType(node.der);

        node.tipo = getBinOpType(leftType, rightType, node.op);

        switch (node.op) {
            case '+':
                return izq + der;
            case '-':
                return izq - der;
            case '*':
                return izq * der;
            case '/':
                return izq / der;
            case '<=':
                return izq <= der;
            case '>=':
                return izq >= der;
            case '<':
                return izq < der;
            case '>':
                return izq > der;
            case '%':
                return izq % der;
            case '!=':
                return izq !== der;
            case '&&':
                return izq && der;
            case '||':
                return izq || der;
            case '==':
                return izq === der;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);
        const expType = this.getTrueType(node.exp);

        node.tipo = expType;
        switch (node.op) {
            case '-':
                if (expType === "float" || expType === "int") {
                    return -exp;
                } else {
                    throw new Error("Tipo no soportado");
                }
            case '!':
                if (expType === "boolean") {
                    return !exp;
                } else {
                    throw new Error("Tipo no soportado");
                }
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    /**
      * @type {BaseVisitor['visitTernario']}
      */
    visitTernario(node) {
        const resultCondition = node.condition.accept(this);

        if (this.getTrueType(node.condition) != "boolean") {
            throw new Error("La condición debe de ser booleana");
        }

        if (typeof resultCondition === 'boolean') {
            if (resultCondition === true) {
                const resultTrueExpr = node.trueExpr.accept(this);

                node.tipo = this.getTrueType(node.trueExpr);

                return resultTrueExpr;
            } else {
                const resultFalseExpr = node.falseExpr.accept(this);

                node.tipo = this.getTrueType(node.falseExpr);

                return resultFalseExpr;
            }
        }
    }

    /**
      * @type {BaseVisitor['visitAgrupacion']}
      */
    visitAgrupacion(node) {
        const finalValue = node.exp.accept(this);

        node.tipo = this.getTrueType(node.exp);
        return finalValue;
    }

    /**
      * @type {BaseVisitor['visitNString']}
      */
    visitNString(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNBoolean']}
      */
    visitNBoolean(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNNull']}
      */
    visitNNull(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNChar']}
      */
    visitNChar(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNInt']}
      */
    visitNInt(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNFloat']}
      */
    visitNFloat(node) {
        return node.valor;
    }

    /**
      * @type {BaseVisitor['visitNewExp']}
      */
    visitNewExp(node) {
        return generateMultidimensionalArray(node.dimensions, defaultValueByType(node.tipo)).valor;
    }

    /**
      * @type {BaseVisitor['visitNVector']}
      */
    visitNVector(node) {
        let typeVector = "";
        let hasVectors = false;

        const value = node.valor.map((elem, index) => {
            let proccesedValue = elem.accept(this);
            let typeElem = this.getTrueType(elem);

            if (index === 0) {
                if (typeElem === "vector") {
                    // console.log({part: "A", typeElem, elemTipo: elem.tipo});
                    typeVector = elem.tipo;
                    hasVectors = true;
                } else {
                    // console.log({part:"B", typeElem, elemTipo: elem.tipo});
                    typeVector = typeElem;
                }

            } else {
                if (typeElem === "vector") {
                    if ((hasVectors === false) || (typeVector !== elem.tipo)) {
                        throw new Error("Los valores del vector no son del mismo tipo")
                    }
                } else {
                    if ((hasVectors === true) || (typeVector !== typeElem)) {
                        throw new Error("Los valores del vector no son del mismo tipo")
                    }
                }
            }

            return {
                tipoSimbolo: getTipoSimboloByType(typeElem),
                tipoVariable: typeVector,
                valor: proccesedValue
            };
        });

        node.tipo = typeVector;

        return value;
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;

        if (this.entornoActual.exists(nombreVariable)) {
            throw new Error("Variable ya existe");
        }

        const valorVariable = node.exp.accept(this);
        const tipoVariable = this.getTrueType(node.exp);

        this.entornoActual.set(nombreVariable, "simple", tipoVariable, valorVariable);
    }

    /**
     * @type {BaseVisitor['visitStructDecl']}
     */
    visitStructDecl(node) {
        if (!this.entornoActual.exists(node.id)) {
            this.entornoActual.set(node.id, "structDecl", "struct", node.attrs);
        }
    }

    /**
     * @type {BaseVisitor['visitNStruct']}
     */
    visitNStruct(node) {
        let objectToReturn = {};

        if (!this.entornoActual.exists(node.id) || this.entornoActual.get(node.id).tipoSimbolo !== "structDecl") throw new Error("Struct para modelar no existente");

        const structure = this.entornoActual.get(node.id);

        structure.forEach((elem) => {
            let attrFoundIndex = -1;

            // Método: Buscar si existe el elemento en node.vals
            for (let i = 0; i < node.vals.length; i++) {
                if (node.vals[i].id === elem.iden) {
                    attrFoundIndex = i;

                    break;
                }
            }

            if (attrFoundIndex === -1) {
                throw new Error("Struct no cumple con la estrucutura del la estructura del Struct de " + node.id);
            } else {
                let acceptedVal = node.vals[attrFoundIndex].exp.accept(this);

                let typeSymbol = this.getTrueType(node.vals[attrFoundIndex].exp);

                // Checar lo de los structs
                if (node.vals[attrFoundIndex].exp.constructor.name === "NStruct") {
                    this.visitNStruct(node.vals[attrFoundIndex].exp);

                    if (exp.id !== elem.tipo) {
                        throw new Error("Struct no cumple con la estrucutura del la estructura del Struct de " + node.id);
                    }
                } else if (this.getTrueType(node.vals[attrFoundIndex].exp) !== elem.tipo) {
                    throw new Error("Struct no cumple con la estrucutura del la estructura del Struct de " + node.id);
                }

                objectToReturn[node.vals[attrFoundIndex].id] = {
                    tipoSimbolo: getTipoSimboloByType(typeSymbol),
                    tipoVariable: elem.tipo,
                    valor: acceptedVal,
                };
            }
        });

        return objectToReturn;
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable1']}
     */
    visitDeclaracionVariable1(node) {
        const nombreVariable = node.id;
        let typeSymbol = "simple";

        if (this.entornoActual.exists(nombreVariable)) {
            throw new Error("Variable ya existe");
        }

        const tipoVariable = node.type;

        if (node.exp !== null) {
            const valorVariable = node.exp.accept(this);
            let tipoValor = "";

            if ((node.exp.constructor.name === "NewExp") || (node.exp.constructor.name === "NVector")) {
                let dimensionCounter = 0;
                typeSymbol = "vector";
                tipoValor = node.exp.tipo;

                // Método: checar:
                // 1. Misma dimension
                // 2. Mismo tipo

                // console.log(valorVariable)
                function recFindLastNonVector(nod) {
                    if (nod.valor[0] !== undefined && nod.valor[0].tipoSimbolo === "vector") {
                        dimensionCounter++;
                        recFindLastNonVector(nod.valor[0]);
                    }
                }

                recFindLastNonVector({ valor: [{ valor: valorVariable, tipoSimbolo: "vector" }] });

                // console.log({ dimensionCounter })

                if (node.numBrackets !== dimensionCounter) {
                    throw new Error("El array a asignar, no tiene la misma dimensión (n) que el que se especifica en el tipo");
                }
            } else if (node.exp.constructor.name === "ReferenciaVariable") {
                typeSymbol = node.exp.tipoSimbolo;
                tipoValor = node.exp.tipoVariable;
            } else {
                tipoValor = this.getTrueType(node.exp);
            }

            if (tipoValor === tipoVariable) {
                this.entornoActual.set(nombreVariable, typeSymbol, tipoVariable, valorVariable);
            } else {
                throw new Error("Tipos no coinciden");
            }
        } else {
            this.entornoActual.set(nombreVariable, "simple", tipoVariable, null);
        }
    }


    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        // Hacer el de las funciones
        const { head, tail } = node.refData;
        const headData = this.entornoActual.get(head);

        if (tail.length > 0) {
            return tail.reduce((prev, currVal, currIdx) => {
                let hadToFinish = false;

                if (currVal.type === "PropertyAccess") {
                    if (currVal.property === "length") {
                        if (prev.tipoSimbolo !== "vector") {
                            throw new Error("El valor referenciado no es un array.");
                        } else {
                            return prev.valor.length;
                        }
                    } else {
                        // Dado que los structs no guardan funciones, se puede hacer esto
                        return { type: currVal.type, property: currVal.property, prevVal: prev }
                    }

                    /*
                    if (prev[currVal.property] === undefined) {
                        throw new Error("El valor referenciado no existe.");
                    } else {
                        return prev.valor[currVal.property].valor;
                    }
                        */
                } else if (currVal.type === "ArrayAccess") {
                    if (prev.tipoSimbolo !== "vector") {
                        throw new Error("El valor referenciado no es un array.");
                    } else {
                        if (this.getTrueType(currVal.index) === "int") {
                            let acceptedIndex = Number(currVal.index.accept(this));

                            node.tipoSimbolo = prev.valor[acceptedIndex].tipoSimbolo;
                            node.tipoVariable = prev.valor[acceptedIndex].tipoVariable;

                            if (prev.valor[acceptedIndex].tipoSimbolo === "vector") {
                                return lodashCloneDeep(prev.valor)[acceptedIndex];
                            } else {
                                return prev.valor[acceptedIndex].valor;
                            }
                        } else {
                            throw new Error("El indice tiene que ser un entero");
                        }
                    }
                } else if (currVal.type === "FunctionCall") {
                    console.log({prev});
                    if (prev.type && prev.type === "PropertyAccess") {
                        if (prev.property === "indexOf") {
                            if (prev.prevVal.tipoSimbolo !== "vector") throw new Error("indexOf solo se puede usar en arrays");

                            if ((currVal.arguments.length === 1) && (this.getTrueType(currVal.arguments[0]) === "int")) {
                                const acceptedVal = currVal.arguments[0].accept(this);

                                return prev.prevVal.valor.map((elem) => elem.valor).indexOf(acceptedVal);
                            } else {
                                throw new Error("Se esperaba 1 parámetro entero")
                            }
                        } else if (prev.property === "join") {
                            if (prev.prevVal.tipoSimbolo !== "vector") throw new Error("join solo se puede usar en arrays");

                            if (currVal.arguments.length === 0) {
                                return prev.prevVal.valor.map((elem) => elem.valor).join();
                            } else {
                                throw new Error("Se esperaba 0 parámetros");
                            }
                        }
                    }
                }
            }, headData);
        } else {
            node.tipoSimbolo = headData.tipoSimbolo;
            node.tipoVariable = headData.tipoVariable;

            if (headData.tipoSimbolo === "vector") {
                return lodashCloneDeep(headData.valor);
            } else {
                return headData.valor;
            }
        }
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        let finalOutput = "";

        node.exp.forEach((elem, i) => {
            if (i > 0) {
                finalOutput += " "
            }

            let tempString = "";
            tempString += elem.accept(this);

            tempString = tempString
                .replace("\\n", "\n")
                .replace("\\\\", "\\")
                .replace("\\\"", "\"")
                .replace("\\r", "\r")
                .replace("\\t", "\t")

            finalOutput += tempString
        })

        this.salida += finalOutput + '\n';
    }

    /**
      * @type {BaseVisitor['visitExpresionStmt']}
      */
    visitExpresionStmt(node) {
        node.exp.accept(this);
    }

    /**
     * @type {BaseVisitor['visitAsignacion']}
     */
    visitAsignacion(node) {
        const { head, tail } = node.ref;
        const headData = this.entornoActual.get(head);

        let whereToSave;
        const acceptedVal = node.value.accept(this);

        if (tail.length > 0) {
            whereToSave = tail.reduce((prev, currVal, currIdx) => {
                if (currVal.type === "PropertyAccess") {
                    if (prev[currVal.property] === undefined) {
                        throw new Error("El valor referenciado no existe.")
                    } else {
                        return prev.valor[currVal.property];
                    }
                } else if (currVal.type === "ArrayAccess") {
                    if (prev.tipoSimbolo !== "vector") {
                        throw new Error("El valor referenciado no es un array.")
                    } else {
                        return prev.valor[currVal.index.accept(this)];
                    }
                }
            }, headData);
        } else {
            whereToSave = headData;
        }

        if (whereToSave.tipoSimbolo === "simple") {
            if (this.getTrueType(node.value) === whereToSave.tipoVariable) {
                if (node.op === "=") {
                    whereToSave.valor = acceptedVal;
                } else {
                    if (whereToSave.tipoVariable === "float" || whereToSave.tipoVariable === "int" || whereToSave.tipoVariable === "string") {
                        if (node.op === "+=") {
                            whereToSave.valor = whereToSave.valor + acceptedVal;
                        } else {
                            whereToSave.valor = whereToSave.valor - acceptedVal;
                        }
                    } else {
                        throw new Error("Para += o -=, tipos incorrectos");
                    }
                }
            } else {
                throw new Error("Para Asignacion, tipos incorrectos");
            }
        } else {
            console.log("Aún no sé que hacer aquí xd")
        }
    }

    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {

        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);

        node.dcls.forEach(dcl => dcl.accept(this));

        this.entornoActual = entornoAnterior;
    }

    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        const cond = node.cond.accept(this);

        if (cond) {
            node.stmtTrue.accept(this);
            return;
        }

        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }

    }

    /**
     * @type {BaseVisitor['visitSwitch']}
     */
    visitSwitch(node) {
        let i = 0;
        let alreadyMatched = false;

        while (i < node.listCases.length) {
            const evaluatedConditionB = new nodos.OperacionBinaria({
                izq: node.cond,
                der: node.listCases[i].exp,
                op: "=="
            });

            const evaluatedCondition = evaluatedConditionB.accept(this);

            if ((evaluatedCondition === true) && (alreadyMatched === false)) alreadyMatched = true;
            if (alreadyMatched === true) {
                if (node.listCases[i].dcls.length > 0) {
                    try {
                        const dclsToEvaluate = new nodos.Bloque({
                            dcls: node.listCases[i].dcls
                        });

                        dclsToEvaluate.accept(this);

                    } catch (error) {
                        if (error instanceof BreakException) {
                            break;
                        }

                        throw error;
                    }

                }
            }
            i++;
        }

        if (i === node.listCases.length) {
            if (node.defaultCase != undefined) {
                const dclsToEvaluate = new nodos.Bloque({
                    dcls: node.defaultCase.dcls
                });

                dclsToEvaluate.accept(this);
            }
        }
    }

    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        const entornoConElQueEmpezo = this.entornoActual;

        try {
            while (node.cond.accept(this)) {
                node.stmt.accept(this);
            }
        } catch (error) {
            this.entornoActual = entornoConElQueEmpezo;

            if (error instanceof BreakException) {
                console.log('break');
                return
            }

            if (error instanceof ContinueException) {
                return this.visitWhile(node);
            }

            throw error;

        }
    }

    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        // this.prevContinue = node.inc;
        const incrementoAnterior = this.prevContinue;
        this.prevContinue = node.inc;

        const forTraducido = new nodos.Bloque({
            dcls: [
                node.init,
                new nodos.While({
                    cond: node.cond,
                    stmt: new nodos.Bloque({
                        dcls: [
                            node.stmt,
                            node.inc
                        ]
                    })
                })
            ]
        })

        forTraducido.accept(this);

        this.prevContinue = incrementoAnterior;
    }

    /**
     * @type {BaseVisitor['visitBreak']}
     */
    visitBreak(node) {
        throw new BreakException();
    }

    /**
     * @type {BaseVisitor['visitContinue']}
     */
    visitContinue(node) {

        if (this.prevContinue) {
            this.prevContinue.accept(this);
        }

        throw new ContinueException();
    }

    /**
     * @type {BaseVisitor['visitReturn']}
     */
    visitReturn(node) {
        let valor = null
        if (node.exp) {
            valor = node.exp.accept(this);
        }
        throw new ReturnException(valor);
    }

    /**
    * @type {BaseVisitor['visitLlamada']}
    */
    visitLlamada(node) {
        const funcion = node.callee.accept(this);

        const argumentos = node.args.map(arg => arg.accept(this));

        if (!(funcion instanceof Invocable)) {
            throw new Error('No es invocable');
            // 1() "sdalsk"()
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Error('Aridad incorrecta');
        }

        return funcion.invocar(this, argumentos);
    }

    /**
    * @type {BaseVisitor['visitFuncDcl']}
    */
    visitFuncDcl(node) {
        const funcion = new FuncionForanea(node, this.entornoActual);
        this.entornoActual.set(node.id, funcion);
    }


    /**
    * @type {BaseVisitor['visitClassDcl']}
    */
    visitClassDcl(node) {

        const metodos = {}
        const propiedades = {}

        node.dcls.forEach(dcl => {
            if (dcl instanceof nodos.FuncDcl) {
                metodos[dcl.id] = new FuncionForanea(dcl, this.entornoActual);
            } else if (dcl instanceof nodos.DeclaracionVariable) {
                propiedades[dcl.id] = dcl.exp
            }
        });

        const clase = new Clase(node.id, propiedades, metodos);

        this.entornoActual.set(node.id, clase);

    }

    /**
    * @type {BaseVisitor['visitInstancia']}
    */
    visitInstancia(node) {

        const clase = this.entornoActual.get(node.id);

        const argumentos = node.args.map(arg => arg.accept(this));


        if (!(clase instanceof Clase)) {
            throw new Error('No es posible instanciar algo que no es una clase');
        }



        return clase.invocar(this, argumentos);
    }


    /**
    * @type {BaseVisitor['visitGet']}
    */
    visitGet(node) {

        // var a = new Clase();
        // a.propiedad
        const instancia = node.objetivo.accept(this);

        if (!(instancia instanceof Instancia)) {
            console.log(instancia);
            throw new Error('No es posible obtener una propiedad de algo que no es una instancia');
        }

        return instancia.get(node.propiedad);
    }

    /**
    * @type {BaseVisitor['visitSet']}
    */
    visitSet(node) {
        const instancia = node.objetivo.accept(this);

        if (!(instancia instanceof Instancia)) {
            throw new Error('No es posible asignar una propiedad de algo que no es una instancia');
        }

        const valor = node.valor.accept(this);

        instancia.set(node.propiedad, valor);

        return valor;
    }

    getTrueType(node) {
        if (node.constructor.name === "OperacionBinaria"
            || node.constructor.name === "OperacionUnaria"
            || node.constructor.name === "OperacionBinaria"
            || node.constructor.name === "Ternario"
            || node.constructor.name === "Agrupacion"
        ) {
            return node.tipo;
        } else if (node.constructor.name === "ReferenciaVariable") {
            return this.entornoActual.get(node.refData.head).tipoVariable
        } else {
            return getNativeType(node.constructor.name);
        }
    }
}

function getNativeType(name) {
    switch (name) {
        case "NInt":
            return "int";
        case "NFloat":
            return "float";
        case "NString":
            return "string";
        case "NBoolean":
            return "boolean";
        case "NNull":
            return "null";
        case "NChar":
            return "char";
        case "NVector":
            return "vector";
        case "NStruct":
            return "struct";
        case "NewExp":
            return "struct";
    }
}

function getBinOpType(typeA, typeB, op) {
    switch (typeA) {
        case "int":
            switch (op) {
                case "+":
                case "-":
                case "*":
                case "/":
                    if (typeB === "float") {
                        return "float";
                    }
                case "%":
                    switch (typeB) {
                        case "int":
                            return "int";

                        default:
                            throw new Error("Tipos incorrectos");
                    }

                case "==":
                case "!=":
                case ">":
                case "<":
                case ">=":
                case "<=":
                    switch (typeB) {
                        case "int":
                        case "float":
                            return "boolean";
                        default:
                            throw new Error("Tipos incorrectos");
                    }

                default:
                    throw new Error("Operador incorrecto");
            }

        case "float":
            switch (op) {
                case "+":
                case "-":
                case "*":
                case "/":
                    switch (typeB) {
                        case "int":
                        case "float":
                            return "float";

                        default:
                            throw new Error("Tipos incorrectos");
                    }

                case "==":
                case "!=":
                case ">":
                case "<":
                case ">=":
                case "<=":
                    switch (typeB) {
                        case "int":
                        case "float":
                            return "boolean";
                        default:
                            throw new Error("Tipos incorrectos");
                    }
                default:
                    throw new Error("Tipos incorrectos");
            }


        case "string":
            switch (op) {
                case "+":
                    switch (typeB) {
                        case "string":
                            return "string";

                        default:
                            throw new Error("Tipos incorrectos");
                    }


                case "==":
                case "!=":
                    switch (typeB) {
                        case "string":
                            return "boolean";
                        default:
                            throw new Error("Tipos incorrectos");
                    }

                default:
                    throw new Error("Tipos incorrectos");
            }

        case "char":
            switch (op) {
                case "==":
                case "!=":
                case ">":
                case "<":
                case ">=":
                case "<=":
                    switch (typeB) {
                        case "string":
                            return "boolean";
                        default:
                            throw new Error("Tipos incorrectos");
                    }

                default:
                    throw new Error("Tipos incorrectos");
            }

        case "boolean":
            switch (op) {
                case "&&":
                case "||":
                    switch (typeB) {
                        case "boolean":
                            return "boolean";
                        default:
                            throw new Error("Tipos incorrectos");
                    }

                default:
                    throw new Error("Tipos incorrectos");
            }
        default:
            throw new Error("Tipos incorrectos");
    }
}

function generateMultidimensionalArray(dimensions, toFill) {
    if (dimensions.length === 0) {
        return {
            tipoSimbolo: toFill.tipoSimbolo,
            tipoVariable: toFill.tipoVariable,
            valor: toFill.valor
        };
    }

    function createArray(dims) {
        if (dims.length === 1) {
            return {
                tipoSimbolo: "vector",
                tipoVariable: toFill.tipoVariable,
                valor: Array(dims[0]).fill().map(() => ({
                    tipoSimbolo: toFill.tipoSimbolo,
                    tipoVariable: toFill.tipoVariable,
                    valor: toFill.valor
                }))
            };
        }
        return {
            tipoSimbolo: "vector",
            tipoVariable: toFill.tipoVariable,
            valor: Array(dims[0]).fill().map(() => createArray(dims.slice(1)))
        };
    }

    return createArray(dimensions);
}
/*
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
*/

function defaultValueByType(type) {
    //(//"char"/"int"/"float")
    switch (type) {
        case "string":
            return {
                tipoSimbolo: "simple",
                tipoVariable: "string",
                valor: "",
            }
        case "boolean":
            return {
                tipoSimbolo: "simple",
                tipoVariable: "boolean",
                valor: "false",
            }
        case "char":
            return {
                tipoSimbolo: "simple",
                tipoVariable: "boolean",
                valor: "\u0000",
            }
        case "int":
            return {
                tipoSimbolo: "simple",
                tipoVariable: "int",
                valor: 0,
            }
        case "float":
            return {
                tipoSimbolo: "simple",
                tipoVariable: "float",
                valor: 0,
            }
    }
}

function getTipoSimboloByType(type) {
    if (reservedWords.includes(type)) {
        return "simple";
    } else {
        return type;
    }
}

const reservedWords = ["string", "boolean", "char", "int", "float"];