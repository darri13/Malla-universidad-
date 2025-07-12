function guardarProgreso() {
  const aprobados = [];
  document.querySelectorAll('button.ramo.aprobado').forEach(boton => {
    aprobados.push(boton.id);
  });
  localStorage.setItem('ramosAprobados', JSON.stringify(aprobados));
}

function cargarProgreso() {
  const datos = localStorage.getItem('ramosAprobados');
  if (!datos) return;
  const aprobados = JSON.parse(datos);
  aprobados.forEach(id => {
    const boton = document.getElementById(id);
    if (boton) {
      boton.classList.add('aprobado');
    }
  });
}

function actualizarProgreso() {
  const botones = document.querySelectorAll('button.ramo');
  const total = botones.length;
  let aprobados = 0;
  botones.forEach(boton => {
    if (boton.classList.contains('aprobado')) aprobados++;
  });
  const porcentaje = Math.round((aprobados / total) * 100);
  document.getElementById('progress-bar').style.width = porcentaje + '%';
  document.getElementById('progress-text').textContent = `Progreso: ${porcentaje}%`;
}

// Función para evaluar prerrequisitos con AND (,) y OR (|)
function cumplePrerequisitos(prereq) {
  // Si no tiene prerrequisitos, siempre está habilitado
  if (!prereq) return true;

  // El formato esperado es: grupos separados por coma (AND)
  // cada grupo puede tener opciones separadas por | (OR)
  // Ejemplo: "(a|b),c" significa (a o b) y c
  // Primero dividimos por comas para obtener AND
  const gruposAND = prereq.split(',').map(g => g.trim());

  // Para cada grupo AND, debe cumplirse al menos una opción OR
  return gruposAND.every(grupo => {
    if (grupo.includes('|')) {
      // Grupo con OR
      const opcionesOR = grupo.replace(/[()]/g, '').split('|').map(op => op.trim());
      return opcionesOR.some(opcion => {
        const boton = document.getElementById(opcion);
        return boton && boton.classList.contains('aprobado');
      });
    } else {
      // Grupo simple (AND)
      const boton = document.getElementById(grupo);
      return boton && boton.classList.contains('aprobado');
    }
  });
}

function actualizarBloqueados() {
  document.querySelectorAll('button.ramo').forEach(boton => {
    const prereq = boton.dataset.prerequisitos;
    if (!prereq) {
      boton.classList.remove('bloqueado');
      return;
    }
    if (cumplePrerequisitos(prereq)) {
      boton.classList.remove('bloqueado');
    } else {
      boton.classList.add('bloqueado');
      // Si está bloqueado, quitar aprobado para evitar inconsistencias
      boton.classList.remove('aprobado');
    }
  });
}

document.querySelectorAll('button.ramo').forEach(boton => {
  boton.addEventListener('click', () => {
    if (!boton.classList.contains('bloqueado')) {
      boton.classList.toggle('aprobado');
      guardarProgreso();
      actualizarProgreso();
      actualizarBloqueados();
    }
  });
});

document.getElementById('buscador').addEventListener('input', e => {
  const texto = e.target.value.toLowerCase();
  document.querySelectorAll('button.ramo').forEach(boton => {
    boton.style.display = boton.textContent.toLowerCase().includes(texto) ? '' : 'none';
  });
});

window.addEventListener('load', () => {
  cargarProgreso();
  actualizarProgreso();
  actualizarBloqueados();
});
