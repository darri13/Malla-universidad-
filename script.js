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
    if (boton.classList.contains('aprobado')) {
      aprobados++;
    }
  });

  const porcentaje = Math.round((aprobados / total) * 100);
  const barra = document.getElementById('progress-bar');
  const texto = document.getElementById('progress-text');

  barra.style.width = porcentaje + '%';
  texto.textContent = `Progreso: ${porcentaje}%`;

  if (porcentaje === 100) {
    alert("🎉 ¡Felicidades! Has completado toda la malla 🎓");
  }
}

function actualizarBloqueados() {
  document.querySelectorAll('button.ramo').forEach(boton => {
    const requisitos = boton.dataset.prerequisitos;
    if (requisitos) {
      let cumplido = false;
      requisitos.split(",").forEach(grupo => {
        const opciones = grupo.split("|");
        const grupoCumplido = opciones.every(id => {
          const b = document.getElementById(id);
          return b && b.classList.contains('aprobado');
        });
        if (grupoCumplido) {
          cumplido = true;
        }
      });
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
      const frases = [
        "¡Buen trabajo!",
        "¡Vas avanzando genial!",
        "¡Un paso más cerca del título!",
        "¡Sigue así, crack!"
      ];
      alert(frases[Math.floor(Math.random() * frases.length)]);
    }
  });
});

document.getElementById('reset-button').addEventListener('click', () => {
  if (confirm("¿Seguro que quieres borrar todo tu progreso?")) {
    localStorage.removeItem('ramosAprobados');
    document.querySelectorAll('button.ramo').forEach(b => b.classList.remove('aprobado'));
    actualizarProgreso();
    actualizarBloqueados();
  }
});

document.getElementById('modo-oscuro').addEventListener('click', () => {
  document.body.classList.toggle('oscuro');
});

document.getElementById('buscador').addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  document.querySelectorAll('button.ramo').forEach(boton => {
    if (boton.textContent.toLowerCase().includes(texto)) {
      boton.style.display = "";
    } else {
      boton.style.display = "none";
    }
  });
});

window.addEventListener('load', () => {
  cargarProgreso();
  actualizarProgreso();
  actualizarBloqueados();
});
