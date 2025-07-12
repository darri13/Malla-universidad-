// Función para actualizar la barra de progreso y el porcentaje
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

// Escucha clics en botones para cambiar estado aprobado
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    if (!button.classList.contains('bloqueado')) {
      button.classList.toggle('aprobado');
    }
    actualizarProgreso();
  });
});

// Inicializa la barra cuando carga la página
actualizarProgreso();
