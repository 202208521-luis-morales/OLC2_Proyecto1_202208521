import { parse } from './analizador.js'
import { InterpreterVisitor } from './interprete.js'

document.getElementById("btn-execute").addEventListener("click", () => {
  const output = document.getElementById("output");
  const tablinks = document.getElementsByClassName("tablinks");
  const interprete = new InterpreterVisitor();

  let sentencias;

  for (let i = 0; i < tablinks.length; i++) {
    if (tablinks[i].classList.contains("active")) {
      sentencias = parse(document.getElementById(tablinks[i].id.slice(4)).childNodes[1].value)
      break;
    }
  }

  sentencias.forEach(sentencia => sentencia.accept(interprete))
  //interprete.salida.split("\n")

  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  const newP1 = document.createElement("p");
  newP1.textContent = " ";
  output.appendChild(newP1);

  for (let i = 0; i < interprete.salida.split("\n").length - 1; i++) {
    const newP = document.createElement("p");

    newP.textContent = "> " + interprete.salida.split("\n")[i];
    output.appendChild(newP);
  }
})