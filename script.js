const prerrequisitos = {
  "ECONOMÍA": ["MATEMÁTICA GENERAL"],
  "CONTABILIDAD PARA LA GESTIÓN": ["CONTABILIDAD 1"],
  "ÁLGEBRA 1": ["MATEMÁTICA GENERAL"],
  "COSTOS": ["CONTABILIDAD 1"],
  "INGLÉS II": ["INGLÉS I"],
  "CÁLCULO DIFERENCIAL": ["MATEMÁTICA GENERAL"],
  "DATOS & DECISIONES": ["TECNOLOGÍA DE LA INFORMACIÓN 1"],
  "FUNDAMENTOS DE ESTRATEGIA": ["INTRODUCCIÓN A LOS NEGOCIOS"],
  "TALLER DE LIDERAZGO & DESARROLLO PERSONAL": ["INTRODUCCIÓN A LOS NEGOCIOS", "TÉCNICAS DE COMUNICACIÓN & HABILIDADES INTERPERSONALES"],
  "MICROECONOMÍA 1": ["ECONOMÍA", "CÁLCULO DIFERENCIAL"],
  "MARKETING ESTRATÉGICO": ["FUNDAMENTOS DE ESTRATEGIA"],
  "INGLÉS III": ["INGLÉS II"],
  "INTRODUCCIÓN A LAS FINANZAS": [["CONTABILIDAD PARA LA GESTIÓN", "MATEMÁTICA GENERAL"], ["CONTABILIDAD 1", "MATEMÁTICA GENERAL"]],
  "PROBABILIDAD & ESTADÍSTICA": ["MATEMÁTICA GENERAL"],
  "MARKETING OPERACIONAL": [["COSTOS"], ["INTRODUCCIÓN A LAS FINANZAS", "MARKETING ESTRATÉGICO"]],
  "MACROECONOMÍA 1": ["ECONOMÍA"],
  "INFERENCIA ESTADÍSTICA": ["PROBABILIDAD & ESTADÍSTICA"],
  "GESTIÓN DE LA CALIDAD": ["PROBABILIDAD & ESTADÍSTICA"],
  "ECONOMETRÍA": ["MICROECONOMÍA 1", "INFERENCIA ESTADÍSTICA"],
  "MICROECONOMÍA II": ["MICROECONOMÍA 1"],
  "MARKETING DE SERVICIOS": ["MARKETING ESTRATÉGICO", "MARKETING OPERACIONAL"],
  "DIRECCIÓN ESTRATÉGICA DE RRHH": ["INTRODUCCIÓN A LOS NEGOCIOS"],
  "PLANIFICACIÓN & GESTIÓN TRIBUTARIA": ["CONTABILIDAD 1"],
  "GESTIÓN DEL CAMBIO ORGANIZACIONAL": ["DIRECCIÓN ESTRATÉGICA DE RRHH"],
  "DIRECCIÓN ESTRATÉGICA": ["EMPRENDIMIENTO & NEGOCIOS", "MARKETING ESTRATÉGICO", "FUNDAMENTOS DE ESTRATEGIA"],
  "PREPARACIÓN & EVALUACIÓN DE PROYECTOS": ["MARKETING ESTRATÉGICO", "INTRODUCCIÓN A LAS FINANZAS"],
  "MACROECONOMÍA II": ["MACROECONOMÍA 1"],
  "COMERCIO INTERNACIONAL": ["FUNDAMENTOS DE ESTRATEGIA"],
  "ADMINISTRACIÓN DE LA PRODUCCIÓN": [["DIRECCIÓN ESTRATÉGICA"], ["GESTIÓN DE LA CALIDAD"]],
  "INVESTIGACIÓN DE MERCADOS": ["MARKETING OPERACIONAL", "MARKETING ESTRATÉGICO", "INFERENCIA ESTADÍSTICA"],
  "FINANZAS CORPORATIVAS": ["INTRODUCCIÓN A LAS FINANZAS"],
  "CONTROL DE GESTIÓN": ["FUNDAMENTOS DE ESTRATEGIA", "DIRECCIÓN ESTRATÉGICA DE RRHH"],
  "NEGOCIACIÓN & RESOLUCIÓN DE CONFLICTOS": ["TALLER DE LIDERAZGO & DESARROLLO PERSONAL"],
  "GESTIÓN DE MARCAS": ["MARKETING ESTRATÉGICO", "MARKETING OPERACIONAL"],
  "TALLER DE CONSULTORÍA": ["INTRODUCCIÓN A LAS FINANZAS", "PREPARACIÓN & EVALUACIÓN DE PROYECTOS", "MARKETING ESTRATÉGICO"],
  "GESTIÓN DE EMPRENDIMIENTO & NUEVOS NEGOCIOS": ["EMPRENDIMIENTO & NEGOCIOS"],
  "TALLER DE DESARROLLO DE CARRERA": ["TALLER DE LIDERAZGO & DESARROLLO PERSONAL"],
  "INSTRUMENTOS DE INVERSIÓN": ["FINANZAS CORPORATIVAS"],
  "ECONOMÍA PARA POLÍTICAS PÚBLICAS": ["MACROECONOMÍA 1", "MICROECONOMÍA 1"],
  "DECISIONES & SIMULACIÓN": ["ECONOMETRÍA"],
  "RESPONSABILIDAD SOCIAL CORPORATIVA": ["FUNDAMENTOS DE ESTRATEGIA"],
  "FINANCIAMIENTO DE INVERSIONES": ["PREPARACIÓN & EVALUACIÓN DE PROYECTOS"],
  "TALLER APLICADO A ADMINISTRACIÓN": ["PREPARACIÓN & EVALUACIÓN DE PROYECTOS", "DIRECCIÓN ESTRATÉGICA", "DIRECCIÓN ESTRATÉGICA DE RRHH", "MARKETING OPERACIONAL"]
};

const botones = document.querySelectorAll("button");

function normalizar(texto) {
  return texto.trim().toUpperCase();
}

function estaAprobado(nombre) {
  return [...botones].some(b => normalizar(b.textContent) === normalizar(nombre) && b.classList.contains("aprobado"));
}

function actualizarBloqueos() {
  botones.forEach(boton => {
    const nombre = normalizar(boton.textContent);
    if (boton.classList.contains("aprobado")) {
      boton.classList.remove("bloqueado");
      return;
    }

    const requisitos = prerrequisitos[nombre];
    if (!requisitos) {
      // Sin prerrequisitos, desbloqueado
      boton.classList.remove("bloqueado");
      return;
    }

    // Requisitos puede ser array de strings o array de arrays (para “o”)
    // La lógica es: si algún grupo de requisitos (array) se cumple, desbloquea (OR entre grupos)
    // Dentro de cada grupo, todos los ramos deben estar aprobados (AND dentro de grupo)

    const disponible = requisitos.some(grupo => {
      if (typeof grupo === "string") {
        // requisito único
        return estaAprobado(grupo);
      } else if (Array.isArray(grupo)) {
        // grupo con varios prereqs -> todos deben estar aprobados
        return grupo.every(req => estaAprobado(req));
      }
      return false;
    });

    boton.classList.toggle("bloqueado", !disponible);
  });

  actualizarProgreso();
}

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    if (!boton.classList.contains("bloqueado")) {
      boton.classList.toggle("aprobado");
      guardarProgreso();
      actualizarBloqueos();
    }
  });
});

function actualizarProgreso() {
  const total = botones.length;
  const aprobados = document.querySelectorAll(".aprobado").length;
  const porcentaje = ((aprobados / total) * 100).toFixed(1);
  document.getElementById("progress-bar").style.width = `${porcentaje}%`;
  document.getElementById("progress-text").textContent = `Avance: ${porcentaje}% (${aprobados}/${total})`;
}

function guardarProgreso() {
  const aprobados = [...botones].filter(b => b.classList.contains("aprobado")).map(b => b.textContent);
  localStorage.setItem("ramosAprobados", JSON.stringify(aprobados));
}

function cargarProgreso() {
  const datos = localStorage.getItem("ramosAprobados");
  if (datos) {
    const aprobados = JSON.parse(datos);
    botones.forEach(b => {
      if (aprobados.includes(b.textContent)) {
        b.classList.add("aprobado");
      }
    });
  }
}

document.getElementById("buscador").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  botones.forEach(b => {
    const visible = b.textContent.toLowerCase().includes(texto);
    b.style.display = visible ? "inline-block" : "none";
  });
});

cargarProgreso();
actualizarBloqueos();
