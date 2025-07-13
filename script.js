const semestres = [
  {
    nombre: "semestre 1",
    ramos: [
      { nombre: "tecnologia de la informacion 1", prereqs: [] },
      { nombre: "matematica general", prereqs: [] },
      { nombre: "introduccion a los negocios", prereqs: [] },
      { nombre: "contabilidad 1", prereqs: [] },
      { nombre: "tecnicas de comunicacion & habilidades interpersonales", prereqs: [] }
    ]
  },
  {
    nombre: "semestre 2",
    ramos: [
      { nombre: "economia", prereqs: ["matematica general"] },
      { nombre: "emprendimiento & negocios", prereqs: [] },
      { nombre: "ingles 1", prereqs: [] },
      { nombre: "contabilidad para la gestion", prereqs: ["contabilidad 1"] },
      { nombre: "algebra 1", prereqs: ["matematica general"] }
    ]
  },
  {
    nombre: "semestre 3",
    ramos: [
      { nombre: "costos", prereqs: ["contabilidad 1"] },
      { nombre: "ingles 2", prereqs: ["ingles 1"] },
      { nombre: "calculo diferencial", prereqs: ["matematica general"] },
      { nombre: "datos & decisiones", prereqs: ["tecnologia de la informacion 1"] },
      { nombre: "fundamentos de estrategia", prereqs: ["introduccion a los negocios"] },
      { nombre: "economia circular & desarrollo sostenible", prereqs: [] }
    ]
  },
  {
    nombre: "semestre 4",
    ramos: [
      { nombre: "taller de liderazgo & desarrollo personal", prereqs: ["introduccion a los negocios", "tecnicas de comunicacion & habilidades interpersonales"] },
      { nombre: "microeconomia 1", prereqs: ["economia", "calculo diferencial"] },
      { nombre: "marketing estrategico", prereqs: ["fundamentos de estrategia"] },
      { nombre: "ingles 3", prereqs: ["ingles 2"] },
      { nombre: "introduccion a las finanzas", prereqs: [
          ["contabilidad para la gestion", "matematica general"],
          ["contabilidad 1", "matematica general"]
        ]
      },
      { nombre: "probabilidad & estadistica", prereqs: ["matematica general"] }
    ]
  },
  {
    nombre: "semestre 5",
    ramos: [
      { nombre: "marketing operacional", prereqs: [["costos"], ["introduccion a las finanzas", "marketing estrategico"]] }, 
      { nombre: "macroeconomia 1", prereqs: ["economia"] },
      { nombre: "derecho empresarial", prereqs: [] },
      { nombre: "inferencia estadistica", prereqs: ["probabilidad & estadistica"] },
      { nombre: "gestion de la calidad", prereqs: ["probabilidad & estadistica"] }
    ]
  },
  {
    nombre: "semestre 6",
    ramos: [
      { nombre: "econometria", prereqs: ["microeconomia 1", "inferencia estadistica"] },
      { nombre: "microeconomia 2", prereqs: ["microeconomia 1"] },
      { nombre: "marketing de servicios", prereqs: ["marketing estrategico", "marketing operacional"] },
      { nombre: "direccion estrategica de rrhh", prereqs: ["introduccion a los negocios"] },
      { nombre: "planificacion & gestion tributaria", prereqs: ["contabilidad 1"] }
    ]
  },
  {
    nombre: "semestre 7",
    ramos: [
      { nombre: "gestion del cambio organizacional", prereqs: ["direccion estrategica de rrhh"] },
      { nombre: "direccion estrategica", prereqs: ["emprendimiento & negocios", "marketing estrategico", "fundamentos de estrategia"] },
      { nombre: "preparacion & evaluacion de proyectos", prereqs: ["marketing estrategico", "introduccion a las finanzas"] },
      { nombre: "macroeconomia 2", prereqs: ["macroeconomia 1"] },
      { nombre: "comercio internacional", prereqs: ["fundamentos de estrategia"] }
    ]
  },
  {
    nombre: "semestre 8",
    ramos: [
      { nombre: "administracion de la produccion", prereqs: [["direccion estrategica"], ["gestion de la calidad"]] },
      { nombre: "investigacion de mercados", prereqs: ["marketing operacional", "marketing estrategico", "inferencia estadistica"] },
      { nombre: "finanzas corporativas", prereqs: ["introduccion a las finanzas"] },
      { nombre: "control de gestion", prereqs: ["fundamentos de estrategia", "direccion estrategica de rrhh"] },
      { nombre: "negociacion & resolucion de conflictos", prereqs: ["taller de liderazgo & desarrollo personal"] }
    ]
  },
  {
    nombre: "semestre 9",
    ramos: [
      { nombre: "gestion de marcas", prereqs: ["marketing estrategico", "marketing operacional"] },
      { nombre: "taller de consultoria", prereqs: ["introduccion a las finanzas", "preparacion & evaluacion de proyectos", "marketing estrategico"] },
      { nombre: "gestion de emprendimiento & nuevos negocios", prereqs: ["emprendimiento & negocios"] },
      { nombre: "taller de desarrollo de carrera", prereqs: ["taller de liderazgo & desarrollo personal"] },
      { nombre: "instrumentos de inversion", prereqs: ["finanzas corporativas"] },
      { nombre: "economia para politicas publicas", prereqs: ["macroeconomia 1", "microeconomia 1"] }
    ]
  },
  {
    nombre: "semestre 10",
    ramos: [
      { nombre: "decisiones & simulacion", prereqs: ["econometria"] },
      { nombre: "responsabilidad social corporativa", prereqs: ["fundamentos de estrategia"] },
      { nombre: "financiamiento de inversiones", prereqs: ["preparacion & evaluacion de proyectos"] },
      { nombre: "taller aplicado a administracion", prereqs: ["preparacion & evaluacion de proyectos", "direccion estrategica", "direccion estrategica de rrhh", "marketing operacional"] }
    ]
  }
];

const estado = {
  aprobados: new Set()
};

function guardarEstado() {
  localStorage.setItem("ramosAprobados", JSON.stringify(Array.from(estado.aprobados)));
}

function cargarEstado() {
  const datos = localStorage.getItem("ramosAprobados");
  if (datos) {
    estado.aprobados = new Set(JSON.parse(datos));
  }
}

function prereqsCumplidos(prereqs) {
  if (prereqs.length === 0) return true;
  if (Array.isArray(prereqs[0])) {
    return prereqs.some(grupo => grupo.every(ramo => estado.aprobados.has(ramo)));
  } else {
    return prereqs.every(ramo => estado.aprobados.has(ramo));
  }
}

function estaDesbloqueado(ramo) {
  return prereqsCumplidos(ramo.prereqs);
}

const planDiv = document.getElementById("plan");

function renderizarPlan() {
  planDiv.innerHTML = "";

  semestres.forEach(semestre => {
    const divSem = document.createElement("div");
    divSem.className = "semestre";

    const h2 = document.createElement("h2");
    h2.textContent = semestre.nombre;
    divSem.appendChild(h2);

    semestre.ramos.forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo";

      const desbloqueado = estaDesbloqueado(ramo);
      const aprobado = estado.aprobados.has(ramo.nombre);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = ramo.nombre;
      checkbox.disabled = !desbloqueado;
      checkbox.checked = aprobado;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          estado.aprobados.add(ramo.nombre);
        } else {
          estado.aprobados.delete(ramo.nombre);
        }
        guardarEstado();
        renderizarPlan();
      });

      const label = document.createElement("label");
      label.htmlFor = ramo.nombre;
      label.textContent = ramo.nombre;

      const botonFlecha = document.createElement("button");
      botonFlecha.textContent = "▼";
      botonFlecha.style.marginLeft = "10px";
      botonFlecha.style.cursor = "pointer";
      botonFlecha.style.border = "none";
      botonFlecha.style.background = "transparent";
      botonFlecha.style.fontSize = "16px";
      botonFlecha.style.userSelect = "none";

      const divPrereqs = document.createElement("div");
      divPrereqs.style.display = "none";
      divPrereqs.style.fontSize = "13px";
      divPrereqs.style.marginTop = "4px";
      divPrereqs.style.marginLeft = "30px";
      divPrereqs.style.color = "#555";

      if (ramo.prereqs.length === 0) {
        divPrereqs.textContent = "sin prerrequisitos";
      } else {
        if (Array.isArray(ramo.prereqs[0])) {
          const opciones = ramo.prereqs.map(grupo => grupo.join(" + "));
          divPrereqs.textContent = "prerrequisitos: " + opciones.join(" o ");
        } else {
          divPrereqs.textContent = "prerrequisitos: " + ramo.prereqs.join(" + ");
        }
      }

      botonFlecha.addEventListener("click", () => {
        if (divPrereqs.style.display === "none") {
          divPrereqs.style.display = "block";
          botonFlecha.textContent = "▲";
        } else {
          divPrereqs.style.display = "none";
          botonFlecha.textContent = "▼";
        }
      });

      divRamo.appendChild(checkbox);
      divRamo.appendChild(label);
      divRamo.appendChild(botonFlecha);
      divRamo.appendChild(divPrereqs);

      if (aprobado) {
        divRamo.classList.add("aprobado");
      } else if (!desbloqueado) {
        divRamo.classList.add("bloqueado");
      } else {
        divRamo.classList.add("desbloqueado");
      }

      divSem.appendChild(divRamo);
    });

    planDiv.appendChild(divSem);
  });
}

cargarEstado();
renderizarPlan();
