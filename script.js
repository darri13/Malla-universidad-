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
  ], // O cualquiera de estos + matematica
  marketingOperacional: [
    ['costos'],
    ['finanzas', 'marketingEstrategico']
  ],
  macroeconomia: ['economia'],
  inferencia: ['probabilidad'],
  calidad: ['probabilidad']
};

// Estado de ramos aprobados
const aprobados = {};

// Manejar click
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('bloqueado')) return;

    btn.classList.toggle('aprobado');
    const id = btn.id;
    aprobados[id] = btn.classList.contains('aprobado');

    verificarDesbloqueo();
  });
});

function verificarDesbloqueo() {
  document.querySelectorAll('button').forEach(btn => {
    const id = btn.id;
    if (!requisitos[id]) return;

    let desbloqueado = false;

    if (Array.isArray(requisitos[id][0])) {
      // Tiene varias opciones de combinación
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
