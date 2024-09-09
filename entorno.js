

export class Entorno {

    /**
        * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        /**
         * Identificador de la variable
         * @type {[val]: { tipoSimbolo: string, tipoVariable: string, dimension: number, valor: any }}
        */
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} tipoSimbolo
     * @param {any} tipoVariable
     * @param {number} dimension
     * @param {any} valor
     */
    set(nombre, tipoSimbolo, tipoVariable, dimension, valor) {
        // TODO: si algo ya está definido, lanzar error

        this.valores[nombre] = {
            tipoSimbolo,
            tipoVariable,
            dimension,
            valor
        };
    }

    /**
     * @param {string} nombre
     */
    get(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.get(nombre);
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    /**
     * @param {string} nombre
     * @returns {boolean}
     */
    exists(nombre) {
        return this.valores[nombre] !== undefined;
    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assign(nombre, valor) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) {
            this.valores[nombre].valor = valor;
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assign(nombre, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    /**
     * @param {string} nombre
     * @param {number[]} indexes
     * @param {any} valor
   */
    assignVector(nombre, indexes ,valor) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) {
            this.updateValueByIndices(this.valores[nombre].valor, indexes, valor);
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assignVector(nombre, indexes, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    updateValueByIndices(array, indices, newValue) {
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
}