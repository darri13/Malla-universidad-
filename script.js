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
    ['contabilidadGestion'],
    ['contabilidad1']
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
document.querySelectorAll('button').forEach(btn => {
  const id = btn.id;
  if (aprobados[id]) {
    btn.classList.add('aprobado');
  }
  if (!requisitos[id]) return;

  let desbloqueado = false;

  if (Array.isArray(requisitos[id][0])) {
    // Opciones combinadas
    desbloqueado = requisitos[id].some(opcion => 
      opcion.every(r => aprobados[r])
    );
    if (id === 'finanzas') {
      desbloqueado = (aprobados['matematica'] && (
        aprobados['contabilidadGestion'] || aprobados['contabilidad1']
      ));
    }
    if (id === 'marketingOperacional') {
      desbloqueado = (
        aprobados['costos'] ||
        (aprobados['finanzas'] && aprobados['marketingEstrategico'])
      );
    }
  } else {
    desbloqueado = requisitos[id].every(r => aprobados[r]);
  }

  if (desbloqueado) {
    btn.classList.remove('bloqueado');
  }
});

// Manejar clic en botones
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('bloqueado')) return;

    btn.classList.toggle('aprobado');
    const id = btn.id;
    aprobados[id] = btn.classList.contains('aprobado');

    // Guardar en localStorage
    localStorage.setItem('aprobados', JSON.stringify(aprobados));

    verificarDesbloqueo();
  });
});

function verificarDesbloqueo() {
  document.querySelectorAll('button').forEach(btn => {
    const id = btn.id;
    if (!requisitos[id]) return;

    let desbloqueado = false;

    if (Array.isArray(requisitos[id][0])) {
      desbloqueado = requisitos[id].some(opcion => 
        opcion.every(r => aprobados[r])
      );
      if (id === 'finanzas') {
        desbloqueado = (aprobados['matematica'] && (
          aprobados['contabilidadGestion'] || aprobados['contabilidad1']
        ));
      }
      if (id === 'marketingOperacional') {
        desbloqueado = (
          aprobados['costos'] ||
          (aprobados['finanzas'] && aprobados['marketingEstrategico'])
        );
      }
    } else {
      desbloqueado = requisitos[id].every(r => aprobados[r]);
    }

    if (desbloqueado) {
      btn.classList.remove('bloqueado');
    } else {
      btn.classList.add('bloqueado');
    }
  });
}
