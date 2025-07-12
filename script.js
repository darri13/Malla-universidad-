// Mapa de prerrequisitos
const requisitos = {
  economia: ['matematica'],
  contabilidadGestion: ['contabilidad1'],
  algebra1: ['matematica'],
  costos: ['contabilidad1'],
  ingles2: ['ingles1'],
  calculo: ['matematica'],
  datos: ['tecnologia1'],
  estrategia: ['introduccionNegocios'],
  liderazgo: ['introduccionNegocios', 'comunicacion'],
  microeconomia: ['calculo', 'economia'],
  marketingEstrategico: ['estrategia'],
  ingles3: ['ingles2'],
  probabilidad: ['matematica'],
  finanzas: [
    ['contabilidadGestion', 'matematica'],
    ['contabilidad1', 'matematica']
  ],
  marketingOperacional: [
    ['costos'],
    ['finanzas', 'marketingEstrategico']
  ],
  macroeconomia: ['economia'],
  inferencia: ['probabilidad'],
  calidad: ['probabilidad']
};

// Estado de ramos aprobados
let aprobados = {};

// Cargar estado guardado desde localStorage
const datosGuardados = localStorage.getItem('aprobados');
if (datosGuardados) {
  aprobados = JSON.parse(datosGuardados);
}

// Inicializar botones
function inicializarBotones() {
  document.querySelectorAll('button').forEach(btn => {
    const id = btn.id;
    if (aprobados[id]) {
      btn.classList.add('aprobado');
    }
    actualizarEstadoBoton(btn);
  });
}

function actualizarEstadoBoton(btn) {
  const id = btn.id;
  if (!requisitos[id]) return;

  let desbloqueado = false;

  // Si es un array de arrays (opciones OR), revisa cada combinación
  if (Array.isArray(requisitos[id][0])) {
    desbloqueado = requisitos[id].some(opcion =>
      opcion.every(r => aprobados[r])
    );
  } else {
    desbloqueado = requisitos[id].every(r => aprobados[r]);
  }

  if (desbloqueado) {
    btn.classList.remove('bloqueado');
  } else {
    btn.classList.add('bloqueado');
  }
}

// Manejar clic en botones
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('bloqueado')) return;

    btn.classList.toggle('aprobado');
    const id = btn.id;
    aprobados[id] = btn.classList.contains('aprobado');

    // Guardar en localStorage
    localStorage.setItem('aprobados', JSON.stringify(aprobados));

    // Verificar todos los botones
    document.querySelectorAll('button').forEach(actualizarEstadoBoton);
  });
});

// Inicializar todo al cargar
inicializarBotones();
