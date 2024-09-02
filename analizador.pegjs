
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'agrupacion': nodos.Agrupacion,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'declaracionVariable': nodos.DeclaracionVariable,
      'declaracionVariable1': nodos.DeclaracionVariable1,
      'referenciaVariable': nodos.ReferenciaVariable,
      'print': nodos.Print,
      'expresionStmt': nodos.ExpresionStmt,
      'asignacion': nodos.Asignacion,
      'bloque': nodos.Bloque,
      'if': nodos.If,
      'while': nodos.While,
      'for': nodos.For,
      'break': nodos.Break,
      'continue': nodos.Continue,
      'return': nodos.Return,
      'llamada': nodos.Llamada,
      'dclFunc': nodos.FuncDcl,
      'dclClase': nodos.ClassDcl,
      'instancia': nodos.Instancia,
      'get': nodos.Get,
      'set': nodos.Set,
      'string': nodos.NString,
      'boolean': nodos.NBoolean,
      'null': nodos.NNull,
      'char': nodos.NChar,
      'int': nodos.NInt,
      'float': nodos.NFloat
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
  }
}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = 
            dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl1 _ { return dcl}
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / dcl:Asignacion _ {return dcl}
            / stmt:Stmt _ { return stmt }

VarDcl1 = typ:("string"/"boolean"/"char"/"int"/"float") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable1', { type: typ, id, exp }) }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable', { id, exp }) }

FuncDcl = "function" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('dclFunc', { id, params: params || [], bloque }) }

ClassDcl = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" { return crearNodo('dclClase', { id, dcls }) }

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

// param1, param2, param3
// id = 'param1'
// params = ['param2, 'param3']
// return ['param1', ...['param2', 'param3']]
Parametros = id:Identificador _ params:("," _ ids:Identificador { return ids })* { return [id, ...params] }

Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }
    / Bloque:Bloque { return Bloque }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }
    / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
      return crearNodo('for', { init, cond, inc, stmt })
    }
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }

ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Comparacion

// a.b.c.d = 2
// a.b() = 2
Asignacion = asignado:Expresion _ "=" _ asgn:Asignacion 
  { 

    console.log({asignado})

    if (asignado instanceof nodos.ReferenciaVariable) {
      return crearNodo('asignacion', { id: asignado.id, asgn })
    }

    if (!(asignado instanceof nodos.Get)) {
      throw new Error('Solo se pueden asignar valores a propiedades de objetos')
    }
    
    return crearNodo('set', { objetivo: asignado.objetivo, propiedad: asignado.propiedad, valor: asgn })


  }


Comparacion = izq:Suma expansion:(
  _ op:("<=" / "==") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}


Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
}

Unaria = "-" _ num:Unaria { return crearNodo('unaria', { op: '-', exp: num }) }
/ Dato
/ Llamada


// "a"()()
// a.b().c().d.c.e
Llamada = objetivoInicial:Identificador operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:Identificador _ { return { id, tipo: 'get' } })
  )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      // return crearNodo('llamada', { callee, args: args || [] })
      const { tipo, id, args:argumentos } = args

      if (tipo === 'funcCall') {
        return crearNodo('llamada', { callee: objetivo, args: argumentos || [] })
      }else if (tipo === 'get') {
        return crearNodo('get', { objetivo, propiedad: id })
      }
    },
    objetivoInicial
  )

  console.log('llamada', {op}, {text: text()});

return op
}

// a()()
// NODO-> callee: a, params: [] --- CALLEE1
// NODO-> callee: NODO-> callee: CALLEE1, params: []

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Dato = [0-9]+"."[0-9]+ {return crearNodo('float', { valor: Number(text()) })}
  / [0-9]+ {return crearNodo('int', { valor: Number(text()) })} 
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / "new" _ id:Identificador _ "(" _ args:Argumentos? _ ")" { return crearNodo('instancia', { id, args: args || [] }) }
  / text:string { return crearNodo('string', { valor: text })}
  / text:null { return crearNodo('null', { valor: text })}
  / text:boolean { return crearNodo('boolean', { valor: text })}
  / text:char { return crearNodo('char', { valor: text })}
  / id:Identificador { return crearNodo('referenciaVariable', { id }) }
  
string
  = '"' chars:doubleQuotedChars* '"' {
      return chars.join(''); // Combina los caracteres en un string
  }

boolean
  = "true" { return true; }
  / "false" { return false; }

null
  = "null" { return null; }

doubleQuotedChars
  = char:[^"\\] / "\\" . { return text(); } // Acepta cualquier cosa excepto " o \, y maneja los caracteres escapados

_ = ([ \t\n\r] / Comentarios)*

char
  = "'" c:simpleChar "'" {
      return c;
  }

simpleChar
  = [^'\\] / "\\" . { return text(); }

Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"