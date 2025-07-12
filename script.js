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

function actualizarBloqueados() {
  document.querySelectorAll('button.ramo').forEach(boton => {
    const requisitos = boton.dataset.prerequisitos;
    if (requisitos) {
      let cumplido = false;
      const grupos = requisitos.split(',');
      for (const grupo of grupos) {
        const opciones = grupo.replace(/[()]/g, '').split('|');
        const grupoCumplido = opciones.every(id => {
          const b = document.getElementById(id.trim());
          return b && b.classList.contains('aprobado');
        });
        if (grupoCumplido) {
          cumplido = true;
          break;
        }
      }
      if (!cumplido) {
        boton.classList.add('bloqueado');
      } else {
        boton.classList.remove('bloqueado');
      }
    }
  });
}

document.querySelectorAll('button.ramo').forEach(button => {
  button.addEventListener('click', () => {
    if (!button.classList.contains('bloqueado')) {
      button.classList.toggle('aprobado');
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
