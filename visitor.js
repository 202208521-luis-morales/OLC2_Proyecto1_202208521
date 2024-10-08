
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').OperacionBinaria} OperacionBinaria


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Agrupacion} Agrupacion


 * @typedef {import('./nodos').NString} NString

 * @typedef {import('./nodos').NBoolean} NBoolean

 * @typedef {import('./nodos').NNull} NNull

 * @typedef {import('./nodos').NChar} NChar

 * @typedef {import('./nodos').NInt} NItn

 * @typedef {import('./nodos').NFloat} NFloat

 * @typedef {import('./nodos').NVector} NVector

 * @typedef {import('./nodos').NStruct} NStruct

 * @typedef {import('./nodos').DeclaracionVariable} DeclaracionVariable

 * @typedef {import('./nodos').DeclaracionVariable1} DeclaracionVariable1

 * @typedef {import('./nodos').StructDecl} StructDecl

 * @typedef {import('./nodos').Ternario} Ternario

 * @typedef {import('./nodos').NewExp} NewExp

 * @typedef {import('./nodos').TypeOf} TypeOf

 * @typedef {import('./nodos').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').ExpresionStmt} ExpresionStmt


 * @typedef {import('./nodos').Asignacion} Asignacion


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').If} If

 * @typedef {import('./nodos').Switch} Switch


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').FuncDcl} FuncDcl


 * @typedef {import('./nodos').ClassDcl} ClassDcl


 * @typedef {import('./nodos').Instancia} Instancia


 * @typedef {import('./nodos').Get} Get


 * @typedef {import('./nodos').Set} Set

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {


    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }


    /**
     * @param {OperacionBinaria} node
     * @returns {any}
     */
    visitOperacionBinaria(node) {
        throw new Error('Metodo visitOperacionBinaria no implementado');
    }


    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }

    /**
     * @param {Ternario} node
     * @returns {any}
     */
    visitTernario(node) {
        throw new Error('Metodo visitTernario no implementado');
    }

    /**
     * @param {TypeOf} node
     * @returns {any}
     */
    visitTypeOf(node) {
        throw new Error('Metodo visitTypeOf no implementado');
    }


    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }

    /**
     * @param {NString} node
     * @returns {any}
     */
    visitNString(node) {
        throw new Error('Metodo visitNString no implementado');
    }

    /**
     * @param {NStruct} node
     * @returns {any}
     */
    visitNStruct(node) {
        throw new Error('Metodo visitNStruct no implementado');
    }

    /**
     * @param {NBoolean} node
     * @returns {any}
     */
    visitNBoolean(node) {
        throw new Error('Metodo visitNBoolean no implementado');
    }

    /**
     * @param {NNull} node
     * @returns {any}
     */
    visitNNull(node) {
        throw new Error('Metodo visitNNull no implementado');
    }

    /**
     * @param {NChar} node
     * @returns {any}
     */
    visitNChar(node) {
        throw new Error('Metodo visitNChar no implementado');
    }

    /**
     * @param {NChar} node
     * @returns {any}
     */
    visitNInt(node) {
        throw new Error('Metodo visitNInt no implementado');
    }

    /**
     * @param {NChar} node
     * @returns {any}
     */
    visitNFloat(node) {
        throw new Error('Metodo visitNFloat no implementado');
    }

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }

    /**
     * @param {StructDecl} node
     * @returns {any}
     */
    visitStructDecl(node) {
        throw new Error('Metodo visitStructDecl no implementado');
    }

    /**
     * @param {DeclaracionVariable1} node
     * @returns {any}
     */
    visitDeclaracionVariable1(node) {
        throw new Error('Metodo visitDeclaracionVariable1 no implementado');
    }


    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }


    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }

    /**
     * @param {ExpresionStmt} node
     * @returns {any}
     */
    visitExpresionStmt(node) {
        throw new Error('Metodo visitExpresionStmt no implementado');
    }


    /**
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }


    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }


    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitIf no implementado');
    }


    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }


    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }


    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }


    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }


    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }


    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }


    /**
     * @param {FuncDcl} node
     * @returns {any}
     */
    visitFuncDcl(node) {
        throw new Error('Metodo visitFuncDcl no implementado');
    }


    /**
     * @param {ClassDcl} node
     * @returns {any}
     */
    visitClassDcl(node) {
        throw new Error('Metodo visitClassDcl no implementado');
    }


    /**
     * @param {Instancia} node
     * @returns {any}
     */
    visitInstancia(node) {
        throw new Error('Metodo visitInstancia no implementado');
    }


    /**
     * @param {Get} node
     * @returns {any}
     */
    visitGet(node) {
        throw new Error('Metodo visitGet no implementado');
    }


    /**
     * @param {Set} node
     * @returns {any}
     */
    visitSet(node) {
        throw new Error('Metodo visitSet no implementado');
    }

    /**
     * @param {NVector} node
     * @returns {any}
     */
    visitNVector(node) {
        throw new Error('Metodo visitNVector no implementado');
    }

    /**
     * @param {NewExp} node
     * @returns {any}
     */
    visitNewExp(node) {
        throw new Error('Metodo visitNewExp no implementado');
    }

}
