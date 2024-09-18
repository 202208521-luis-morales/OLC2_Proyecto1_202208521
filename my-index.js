import { parse } from './analizador.js'
import { InterpreterVisitor } from './interprete.js'

let symbolsTableRes = null;

document.getElementById("btn-symbols-table").addEventListener("click", () => {
  if (symbolsTableRes !== null) {
    if (document.getElementById("symbols-table-container").style.display === "none") {
      document.getElementById("symbols-table-container").style.display = "block";
    }
  
    const tBody = document.getElementById("symbols-table-tbody");
  
    tBody.innerHTML = "";

    for (const key in symbolsTableRes) {
      if (Object.prototype.hasOwnProperty.call(symbolsTableRes, key)) {
        const element = symbolsTableRes[key];
        if (element.tipoSimbolo.constructor.name !== "FuncionNativa") {
          const newR = document.createElement("tr");

          newR.innerHTML = `<td>${key}</td>
          <td>${element.tipoSimbolo}</td>
          <td>${element.tipoVariable}</td>
          <td>${element.row}</td>
          <td>${element.col}</td>
          `;
          tBody.appendChild(newR);
        }
      }
    }
  }
})

document.getElementById("btn-execute").addEventListener("click", () => {
  const output = document.getElementById("output");
  const tablinks = document.getElementsByClassName("tablinks");

  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  const newP1 = document.createElement("p");
  newP1.textContent = " ";
  output.appendChild(newP1);

  try {
    const interprete = new InterpreterVisitor();

    let sentencias;

    for (let i = 0; i < tablinks.length; i++) {
      if (tablinks[i].classList.contains("active")) {
        sentencias = parse(document.getElementById(tablinks[i].id.slice(4)).childNodes[1].value)
        break;
      }
    }

    sentencias.forEach(sentencia => sentencia.accept(interprete));
    document.getElementById("jsonOutput").innerHTML = JSON.stringify(sentencias, null, 20);
    console.log({ sentencias });

    for (let i = 0; i < interprete.salida.split("\n").length - 1; i++) {
      const newP = document.createElement("p");

      newP.textContent = "> " + interprete.salida.split("\n")[i];
      output.appendChild(newP);
    }

    symbolsTableRes = interprete.entornoActual.valores;
  } catch (error) {
    console.error(error);

    const newP = document.createElement("p");

    newP.textContent = error.location === undefined ? "ERROR: " + error.message : error.message + ' at line ' + error.location.start.line + ' column ' + error.location.start.column
    output.appendChild(newP);
  }
})