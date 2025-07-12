// ramos organizados por semestre con prerrequisitos en minusculas y sin tildes
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
      { nombre: "introduccion a las finanzas", prereqs: ["contabilidad para la gestion", "matematica general"] }, 
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

// para prerrequisitos alternativos (ej: marketing operacional) usaremos arrays anidados para "o", arrays planos para "y"

const estado = {
  aprobados: new Set()
};

// guardamos y cargamos del localStorage
function guardarEstado() {
  localStorage.setItem("ramosAprobados", JSON.stringify(Array.from(estado.aprobados)));
}

function cargarEstado() {
  const datos = localStorage.getItem("ramosAprobados");
  if (datos) {
    estado.aprobados = new Set(JSON.parse(datos));
  }
}

// función para comprobar si todos los prerequisitos de un ramo están aprobados
// para prerrequisitos "y" (AND) y "o" (OR)
function prereqsCumplidos(prereqs) {
  if (prereqs.length === 0) return true;
  // si es prerrequisito alternativo "o", es array de arrays
  if (Array.isArray(prereqs[0])) {
    // ejemplo: prereqs = [ ["costos"], ["introduccion a las finanzas", "marketing estrategico"] ]
    // Se cumple si se cumple alguna de las opciones (OR)
    return prereqs.some(grupo => grupo.every(ramo => estado.aprobados.has(ramo)));
  } else {
    // prerrequisitos AND
    return prereqs.every(ramo => estado.aprobados.has(ramo));
  }
}

// verificamos si el ramo esta desbloqueado
function estaDesbloqueado(ramo) {
  return prereqsCumplidos(ramo.prereqs);
}

const planDiv = document.getElementById("plan");

// renderizamos todo el plan
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

      divRamo.appendChild(checkbox);
      divRamo.appendChild(label);

      // colores segun estado
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

// al cargar la pagina
cargarEstado();
renderizarPlan();
