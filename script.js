const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwDK5_DNJ2XUsipcvWNHEsbnOPx5p6jLF0tKg0U2B-IITILyqUYbyauCPDwg1XIcFWp/exec';

const params = new URLSearchParams(window.location.search);





// COUNTDOWN
function updateCountdown() {
  const target = new Date('2026-10-17T11:00:00').getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) {
    ['cnt-d', 'cnt-h', 'cnt-m', 'cnt-s'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cnt-d').textContent = String(d).padStart(2, '0');
  document.getElementById('cnt-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cnt-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cnt-s').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 120);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

// ASISTENCIA TOGGLE
function toggleAsistencia() {
  const si = document.getElementById('r-si').checked;
  document.getElementById('no-asiste-msg').style.display = si ? 'none' : 'block';
  document.getElementById('no-asiste-btn-wrap').style.display = si ? 'none' : 'block';

  const intoleranciasGroup = document.getElementById('intolerancias-main-group');
  const intoleranciasInput = document.getElementById('intolerancias');
  if (intoleranciasGroup) intoleranciasGroup.style.display = si ? '' : 'none';
  if (!si && intoleranciasInput) intoleranciasInput.value = '';

  const sec = document.getElementById('acompanantes-section');
  if (si) sec.classList.add('show');
  else sec.classList.remove('show');
}

function toggleAcompanante() {
  const visible = document.getElementById('a-si').checked;
  document.getElementById('acompanante-fields').style.display = visible ? 'grid' : 'none';
}

function toggleNinos() {
  const si = document.getElementById('ninos-si')?.checked;
  const counterBlock = document.getElementById('children-counter-block');
  const input = document.getElementById('num-hijos');

  if (counterBlock) counterBlock.style.display = si ? 'grid' : 'none';

  if (!si) {
    if (input) input.value = '0';
    const list = document.getElementById('children-list');
    if (list) list.innerHTML = '';
  }

  renderChildrenFields();
}

function changeChildrenCount(step) {
  const input = document.getElementById('num-hijos');
  const current = Number(input?.value || 0);
  const next = Math.max(0, Math.min(10, current + step));
  if (input) input.value = String(next);
  renderChildrenFields();
}

function renderChildrenFields() {
  const input = document.getElementById('num-hijos');
  const num = Math.max(0, Math.min(10, Number(input?.value || 0)));
  const list = document.getElementById('children-list');
  const group = document.getElementById('children-data-group');
  const display = document.getElementById('num-hijos-display');
  if (display) display.textContent = String(num);
  if (group) group.style.display = (document.getElementById('ninos-si')?.checked && num > 0) ? 'block' : 'none';

  const current = list.querySelectorAll('.child-row').length;

  if (current < num) {
    for (let i = current + 1; i <= num; i++) {
      const row = document.createElement('div');
      row.className = 'companion-row child-row';
      row.dataset.index = String(i);
      row.innerHTML = `
        <div class="form-group">
            <label>Nombre niño/a ${i}</label>
            <input type="text" class="child-name" placeholder="Nombre del niño/a"/>
          </div>

          <div class="form-group">
            <label>Edad niño/a ${i}</label>
            <input type="number" class="child-age" placeholder="Edad"/>
          </div>

          <div class="form-group">
            <label>Alergias niño/a ${i}</label>
            <input type="text" class="child-allergy" placeholder="Ninguna / indicar alergias"/>
          </div>
      `;
      list.appendChild(row);
    }
  }

  if (current > num) {
    Array.from(list.querySelectorAll('.child-row')).slice(num).forEach(row => row.remove());
  }
}

function mostrarCargando(idBoton) {
  const loading = document.getElementById('form-loading');
  if (loading) loading.style.display = 'block';

  const btn = document.getElementById(idBoton);
  if (btn) {
    btn.disabled = true;
    btn.style.display = 'none';
  }
}

function ocultarCargando(idBoton) {
  const loading = document.getElementById('form-loading');
  if (loading) loading.style.display = 'none';

  const btn = document.getElementById(idBoton);
  if (btn) {
    btn.disabled = false;
    btn.style.display = '';
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = '';
  toast.classList.add(type, 'show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function validateBaseFields() {
  const nombre = getValue('nombre-invitado');

  if (!nombre) {
    showToast('Indica el nombre del invitado/a.', 'error');
    flash('nombre-invitado');
    return false;
  }

  return true;
}

function obtenerHijos() {
  if (!document.getElementById('ninos-si')?.checked) return [];

  return Array.from(document.querySelectorAll('#children-list .child-row'))
    .map((row, idx) => ({
      orden: idx + 1,
      nombre: row.querySelector('.child-name')?.value.trim() || '',
      edad: row.querySelector('.child-age')?.value.trim() || '',
      alergias: row.querySelector('.child-allergy')?.value.trim() || ''
    }))
    .filter(hijo => hijo.nombre);
}


function formatearHijos(hijos) {
  return hijos
    .map(h => `${h.nombre}${h.edad ? `(${h.edad})` : ''}`)
    .join(', ');
}

function formatearIntolerancias(hijos) {
  const intoleranciaInvitado = getValue('intolerancias');
  const intoleranciasHijos = hijos
    .filter(h => h.alergias)
    .map(h => `${h.nombre}(${h.alergias})`);

  return [
    intoleranciaInvitado,
    ...intoleranciasHijos
  ].filter(Boolean).join(', ');
}

function formatearAutobus() {
  const autobus = getValue('autobus');
  return autobus ? autobus : '';
}

function obtenerPreboda() {
  const seleccion = document.querySelector('input[name="preboda"]:checked');
  if (!seleccion) return '';
  if (seleccion.value === 'si') return 'Sí';
  if (seleccion.value === 'no') return 'No';
  return 'Pendiente';
}


function toggleRecoveryArea() {
  const panel = document.getElementById('recovery-panel');
  const button = document.querySelector('.recovery-toggle');
  if (!panel) return;

  panel.hidden = !panel.hidden;

  if (button) {
    button.classList.remove('recovery-pulse');
    void button.offsetWidth;
    button.classList.add('recovery-pulse');
  }

  if (!panel.hidden) {
    panel.classList.remove('recovery-panel-open');
    void panel.offsetWidth;
    panel.classList.add('recovery-panel-open');
  }
}

async function copyIban() {
  const iban = document.getElementById('iban-text')?.textContent.trim() || '';
  if (!iban) return;

  try {
    await navigator.clipboard.writeText(iban);
    showToast('Cuenta copiada.', 'success');
  } catch (error) {
    showToast('No se pudo copiar. Mantén pulsado sobre la cuenta para copiarla.', 'error');
  }
}

// SUBMIT
async function submitRSVP() {
  if (!validateBaseFields()) return;

  const asistencia = 'si';

  const tieneAcompanante = document.getElementById('a-si')?.checked;
  const nombreAcompanante = tieneAcompanante ? getValue('nombre-acompanante') : '';

  const cancion = getValue('cancion');
  const hijos = obtenerHijos();

  if (tieneAcompanante && !nombreAcompanante) {
    showToast('Indica el nombre del acompañante.', 'error');
    flash('nombre-acompanante');
    return;
  }

  if (!cancion) {
    showToast('Canción obligatoria para tenerte en nuestra playlist.', 'error');
    flash('cancion');
    return;
  }

  const ninosTexto = hijos
    .map(h => `${h.nombre}${h.edad ? `(${h.edad})` : ''}`)
    .join(', ');

  const intoleranciaInvitado = getValue('intolerancias');

  const intoleranciaAcompanante = tieneAcompanante
  ? getValue('alergias-acompanante')
  : '';

  const intoleranciasHijos = hijos
    .filter(h => h.alergias)
    .map(h => `${h.nombre}(${h.alergias})`);

  const intoleranciasTexto = [
    intoleranciaInvitado,
    intoleranciaAcompanante && `${nombreAcompanante}(${intoleranciaAcompanante})`,
    ...intoleranciasHijos
  ].filter(Boolean).join(', ');

  let autobusTexto = getValue('autobus');

  if (
    !autobusTexto ||
    autobusTexto.toLowerCase().includes('no necesito') ||
    autobusTexto.toLowerCase() === 'no'
  ) {
    autobusTexto = '';
  }

  const payload = {
    asistencia,
    invitado: getValue('nombre-invitado'),
    autobus: autobusTexto,
    preboda: obtenerPreboda(),
    intolerancias: intoleranciasTexto,
    acompanante: nombreAcompanante,
    numeroHijos: hijos.length,
    ninos: ninosTexto,
    cancion,
    mensaje: getValue('mensaje-novios')
  };
  mostrarCargando('btn-confirmar');
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.ok) {
      showToast(result.message || 'No se pudo guardar la confirmación.', 'error');
      return;
    }

    document.getElementById('the-form').style.display = 'none';

    const s = document.getElementById('form-success');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';

  } catch (error) {
    showToast('Error de conexión al enviar la confirmación.', 'error');
  }
  finally {
    ocultarCargando('btn-confirmar');
  }
}

async function submitNoAsiste() {
  if (!validateBaseFields()) return;

  const payload = {
    asistencia: 'no',
    invitado: getValue('nombre-invitado'),
    autobus: '',
    preboda: '',
    intolerancias: '',
    acompanante: '',
    numeroHijos: 0,
    ninos: '',
    cancion: '',
    mensaje: getValue('mensaje-novios-no')
  };
  mostrarCargando('btn-no-asiste');
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.ok) {
      showToast(result.message || 'No se pudo guardar la respuesta.', 'error');
      return;
    }

    document.getElementById('the-form').style.display = 'none';

    const s = document.getElementById('form-no-asiste');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';

  } catch (error) {
    showToast('Error de conexión al enviar la respuesta.', 'error');
  }finally {
    ocultarCargando('btn-no-asiste');
  }
}

function flash(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = 'var(--magenta)';
  el.style.boxShadow = '0 0 0 1px var(--magenta)';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 1500);
}

// URL param invitado
const invitado = params.get('invitado');
if (invitado) {
  const nombre = decodeURIComponent(invitado);
  const tag = document.querySelector('.hero-tag');
  tag.textContent = '// BODORRIO FEST — HOLA ' + nombre.toUpperCase() + ' 👋';
  const inputNombre = document.getElementById('nombre-invitado');
  if (inputNombre && !inputNombre.value) inputNombre.value = nombre;
}

const musica = document.getElementById("musicaFondo");

let musicaActivada = false;
let pausadaPorCambioPestana = false;

if (musica) {
  musica.volume = 0.25;
  musica.loop = true;
  musica.preload = "auto";
}

async function activarMusica() {
  if (!musica || musicaActivada) return;

  try {
    await musica.play();

    musicaActivada = true;

    // Quitamos los eventos solo cuando la música haya arrancado bien
    quitarEventosIniciales();

    console.log("Música activada correctamente");
  } catch (err) {
    console.log("El navegador ha bloqueado la música de momento:", err.name);

    // Importante:
    // No quitamos los eventos si falla.
    // Así el siguiente toque/click volverá a intentarlo.
  }
}

function quitarEventosIniciales() {
  window.removeEventListener("pointerdown", activarMusica);
  window.removeEventListener("touchend", activarMusica);
  window.removeEventListener("click", activarMusica);
  window.removeEventListener("keydown", activarMusica);
}

/*
  Activación por primera interacción real.
  No usamos scroll porque en móviles no siempre cuenta como gesto válido.
*/
window.addEventListener("pointerdown", activarMusica);
window.addEventListener("touchend", activarMusica);
window.addEventListener("click", activarMusica);
window.addEventListener("keydown", activarMusica);

/*
  Pausar al salir de la pestaña y reanudar al volver.
*/
document.addEventListener("visibilitychange", () => {
  if (!musica) return;

  if (document.hidden) {
    if (!musica.paused) {
      musica.pause();
      pausadaPorCambioPestana = true;
    }
  } else {
    if (pausadaPorCambioPestana && musicaActivada) {
      musica.play()
        .then(() => {
          pausadaPorCambioPestana = false;
        })
        .catch(err => {
          console.log("No se pudo reanudar la música:", err.name);
        });
    }
  }
});

/*
  Backup para algunos móviles.
*/
window.addEventListener("pagehide", () => {
  if (!musica) return;

  if (!musica.paused) {
    musica.pause();
    pausadaPorCambioPestana = true;
  }
});

window.addEventListener("pageshow", () => {
  if (!musica) return;

  if (pausadaPorCambioPestana && musicaActivada) {
    musica.play()
      .then(() => {
        pausadaPorCambioPestana = false;
      })
      .catch(() => {});
  }
});

toggleAsistencia();
toggleAcompanante();
toggleNinos();
renderChildrenFields();
