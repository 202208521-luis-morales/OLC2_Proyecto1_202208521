
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
      'switch': nodos.Switch,
      'boolean': nodos.NBoolean,
      'null': nodos.NNull,
      'char': nodos.NChar,
      'int': nodos.NInt,
      'float': nodos.NFloat,
      'vector': nodos.NVector,
      'ternario': nodos.Ternario,
      'newExp': nodos.NewExp,
      'structDecl': nodos.StructDecl,
      'structData': nodos.NStructData
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
  }
}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:StructDecl _ { return dcl }
            / dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl1 _ { return dcl}
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
            / dcl:Asignacion _ ";" _ {return dcl}
            / stmt:Stmt _ { return stmt }
            
StructDecl = "struct" _ id:([A-Z][A-Za-z0-9]* { return text() }) _ "{" _ attrs:( _ tipo:("string"/"boolean"/"char"/"int"/"float"/([A-Z][A-Za-z0-9]* { return text() })) _ iden:Identificador _ ";" _ { return { tipo, iden } })+ _ "}" _ ";" {
  return crearNodo('structDecl', { id, attrs })
}

VarDcl1 = typ:("string"/"boolean"/"char"/"int"/"float") _ brackets:( _"[" _ "]" _ )* _ id:Identificador _ optValue:("=" _ exp:Expresion)? _ ";" { return crearNodo('declaracionVariable1', { type: typ, id, numBrackets: brackets.length, exp: optValue ? optValue[2] : null }) }

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

Stmt = "System.out.println(" _ exp:Expresion _ expList:("," _ Expresion)* ")" _ ";" { return crearNodo('print', { exp: [exp].concat(expList.map(t => t[2])) }) }
    / Bloque:Bloque { return Bloque }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }
    / "switch" _ "(" _ cond:Expresion _ ")" _ "{" _ listCases:("case" _ exp:Expresion _ ":" _ dcls:(Declaracion)* { return {exp, dcls} })+ _ defaultCase:("default" _ ":" _ dcls:(Declaracion)* { return { dcls } })? _ "}" {
      return crearNodo('switch', { cond, listCases, defaultCase })
    }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }
    / "for" _ "(" _ init:(VarDcl1 / VarDcl) _ cond:Expresion _ ";" _ inc:Asignacion _ ")" _ stmt:Stmt {
      return crearNodo('for', { init, cond, inc, stmt })
    }
    / "break" _ ";" { return crearNodo('break') }
    / "continue" _ ";" { return crearNodo('continue') }
    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }

/*
ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }
*/

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion
  = left:BinOr rest:TernaryRest?
    { return rest ? crearNodo('ternario', {condition: left, trueExpr: rest[0], falseExpr: rest[1]}) : left; }

// a.b.c.d = 2
// a.b() = 2

Asignacion
  = ref:Reference2 _ op:("+="/"-="/"=" { return text() }) _ value:Expresion _ {
      return crearNodo('asignacion', { ref, op, value })
  }

/*
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
*/

TernaryRest
  = _ "?" _ trueExpr:Expresion _ ":" _ falseExpr:Expresion
    { return [trueExpr, falseExpr]; }

BinOr = izq:BinAnd expansion:(
  _ op:("||") _ der:BinAnd { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

BinAnd = izq:BinEqualNotEqual expansion:(
  _ op:("&&") _ der:BinEqualNotEqual { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

BinEqualNotEqual = izq:BinInequity expansion:(
  _ op:("==" / "!=") _ der:BinInequity { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

BinInequity = izq:Suma expansion:(
  _ op:("<=" / ">=" / "<" / ">") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

/*
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
*/

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
  _ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
}

Unaria = op:("-" / "!") _ num:Unaria { return crearNodo('unaria', { op, exp: num }) }
/ Dato

/*
/ Llamada

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
*/

// a()()
// NODO-> callee: a, params: [] --- CALLEE1
// NODO-> callee: NODO-> callee: CALLEE1, params: []

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Dato = [0-9]+"."[0-9]+ {return crearNodo('float', { valor: Number(text()) })}
  / [0-9]+ {return crearNodo('int', { valor: Number(text()) })} 
  / "{" _ listExps:(exp1:Expresion _ listRest:( _ "," _ exp2:Expresion { return exp2 })* { let finalArray = listRest; finalArray.unshift(exp1); return finalArray;} ) _ "}" { 
      return crearNodo('vector', { valor: listExps }) 
    }
  / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
  / "new" _ type:("string"/"boolean"/"char"/"int"/"float") _ dimensions:( _ "[" _ num:([0-9])+ _ "]" _ { return num; })+ { return crearNodo('newExp', { type, dimensions: dimensions.map((elem) => Number(elem)), level: dimensions.length } ) }
  / text:string { return crearNodo('string', { valor: text })}
  / text:null { return crearNodo('null', { valor: text })}
  / text:boolean { return crearNodo('boolean', { valor: text })}
  / text:char { return crearNodo('char', { valor: text })}
  / id:Identificador _ "{" _ firstVal:(id2:Identificador _ ":" _ exp1:Expresion { return { id: id2, exp: exp1 } }) _ vals:( _ "," _ id3:Identificador _ ":" _ exp2:Expresion _ { return { id: id3, exp: exp2 } } )* _ "}" { vals.unshift(firstVal); return crearNodo('structData', { id, vals })}
  / ref:Reference { return crearNodo('referenciaVariable', { refData: ref }) }

Reference
  = head:Identificador tail:(PropertyAccess / ArrayAccess / FunctionCall)* {
    return {
      type: "Reference",
      head: head,
      tail: tail
    };
  }

Reference2
  = head:Identificador tail:(PropertyAccess / ArrayAccess )* {
    return {
      type: "Reference",
      head: head,
      tail: tail
    };
  }

PropertyAccess
  = "." property:Identificador {
    return {
      type: "PropertyAccess",
      property
    };
  }

ArrayAccess
  = "[" index:Expresion "]" {
    return {
      type: "ArrayAccess",
      index
    };
  }

FunctionCall
  = "(" args:ArgumentList? ")" {
    return {
      type: "FunctionCall",
      arguments: args || []
    };
  }

ArgumentList
  = head:Expresion tail:("," Expresion)* {
    return [head].concat(tail.map(function(item) { return item[1]; }));
  }


//  / "new" _ id:Identificador _ "(" _ args:Argumentos? _ ")" { return crearNodo('instancia', { id, args: args || [] }) }
  
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