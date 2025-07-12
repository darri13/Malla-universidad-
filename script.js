// Guarda en localStorage los IDs de los ramos aprobados
function guardarProgreso() {
  const aprobados = [];
  document.querySelectorAll('button.aprobado').forEach(boton => {
    aprobados.push(boton.id);
  });
  localStorage.setItem('ramosAprobados', JSON.stringify(aprobados));
}

// Carga el progreso guardado al iniciar
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

// Actualiza la barra de progreso
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

// Cuando se haga click en un botón
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    if (!button.classList.contains('bloqueado')) {
      button.classList.toggle('aprobado');
      guardarProgreso();
      actualizarProgreso();
    }
  });
});

// Al cargar la página, carga el progreso guardado y actualiza barra
window.addEventListener('load', () => {
  cargarProgreso();
  actualizarProgreso();
});
