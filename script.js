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
function actualizarProgreso() {
  const botones = document.querySelectorAll('button');
  const total = botones.length;
  let aprobados = 0;

  botones.forEach(boton => {
    if (boton.classList.contains('aprobado')) {
      aprobados++;
    }
  });

  const porcentaje = Math.round((aprobados / total) * 100);
  const barra = document.getElementById('progress-bar');
  const texto = document.getElementById('progress-text');

  barra.style.width = porcentaje + '%';
  texto.textContent = `Progreso: ${porcentaje}%`;
}

// Llama a la función cada vez que cambies un estado
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    // Aquí va tu lógica para marcar/desmarcar, si no está en tu código actual
    // Por ejemplo, para toggle aprobado:
    if (!button.classList.contains('bloqueado')) {
      button.classList.toggle('aprobado');
    }
    actualizarProgreso();
  });
});

// Inicializa la barra al cargar la página
actualizarProgreso();
