import { Entorno } from "./entorno.js";
import { BaseVisitor } from "./visitor.js";
import nodos, { Expresion } from './nodos.js'
import { BreakException, ContinueException, ReturnException } from "./transferencia.js";
import { Invocable } from "./invocable.js";
import { embebidas } from "./embebidas.js";
import { FuncionForanea } from "./foreanea.js";
import { Clase } from "./clase.js";
import { Instancia } from "./instancia.js";


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
                if(expType === "float" || expType === "int") {
                    return -exp;
                } else {
                    throw new Error("Tipo no soportado");
                }
            case '!':
                if(expType === "boolean") {
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

        if(this.getTrueType(node.condition) != "boolean") {
            throw new Error("La condición debe de ser booleana");
        }

        if(typeof resultCondition === 'boolean') {
            if(resultCondition === true) {
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
        return node.exp.accept(this);
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
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp.accept(this);
        const tipoVariable = this.getTrueType(node.exp);

        this.entornoActual.set(nombreVariable, tipoVariable, valorVariable);
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable1']}
     */
    visitDeclaracionVariable1(node) {
        const nombreVariable = node.id;
        const tipoVariable = node.type;

        if (node.exp !== null) {
            const valorVariable = node.exp.accept(this);
            const tipoValor = this.getTrueType(node.exp);

            if (tipoValor === tipoVariable) {
                this.entornoActual.set(nombreVariable, tipoVariable, valorVariable);
            } else {
                throw new Error();
            }
        } else {
            this.entornoActual.set(nombreVariable, tipoVariable, null);
        }
    }


    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.get(nombreVariable).valor;
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.salida += valor + '\n';
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
        // const valor = this.interpretar(node.asgn);
        const valor = node.asgn.accept(this);
        const tipoValor = this.getTrueType(node.asgn);

        if(this.entornoActual.get(nombreVariable).tipo === tipoValor) {
            this.entornoActual.assign(node.id, {
                tipo: tipoValor,
                valor
            });
            return valor;
        } else {
            throw new Error("Tipos incorrectos al asignar")
        }
    }

    /**
     * @type {BaseVisitor['visitImplicitAddSubstract']}
     */
    visitImplicitAddSubstract(node) {
        const valor = node.exp.accept(this);
        const tipoValor = this.getTrueType(node.exp);

        if(this.entornoActual.get(node.id).tipo === "int" || this.entornoActual.get(node.id).tipo === "float" || this.entornoActual.get(node.id).tipo === "string") {
            this.entornoActual.assign(node.id, {
                tipo: tipoValor,
                valor: node.op === "+=" ? this.entornoActual.get(node.id).valor + valor : this.entornoActual.get(node.id).valor - valor 
            });
    
            return valor;
        } else {
            throw new Error("Solo se puede hacer operación implícita con tipo 'int' o 'float'");
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
        } else if(node.constructor.name === "ReferenciaVariable") {
            return this.entornoActual.get(node.id).tipo
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
            if(typeB === "float") {
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