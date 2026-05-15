const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbze8-z6p-uy_JQEQPr26mJCnh3_ORUeVgFnEOV1jJuudvyRQgrgFkZ3nYcT82KH3-dY/exec';

const params = new URLSearchParams(window.location.search);
const invitadoId = params.get('id') || '';

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
          <label>Nombre hijo/a ${i}</label>
          <input type="text" class="child-name" placeholder="Nombre del niño/a"/>
        </div>
        <div class="form-group">
          <label>Alergias hijo/a ${i}</label>
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
  const invitadoDe = getValue('invitado-de');
  const email = getValue('email-confirmacion');

  if (!nombre) {
    showToast('Indica el nombre del invitado/a.', 'error');
    flash('nombre-invitado');
    return false;
  }

  if (!invitadoDe) {
    showToast('Selecciona si vienes de parte de Mario o de Gema.', 'error');
    flash('invitado-de');
    return false;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('El correo electrónico no parece válido.', 'error');
    flash('email-confirmacion');
    return false;
  }

  return true;
}

function obtenerHijos() {
  if (!document.getElementById('ninos-si')?.checked) return [];
  return Array.from(document.querySelectorAll('#children-list .child-row')).map((row, idx) => ({
    tipo: 'HIJO/A',
    orden: idx + 1,
    nombre: row.querySelector('.child-name')?.value.trim() || '',
    alergias: row.querySelector('.child-allergy')?.value.trim() || 'Ninguna'
  })).filter(hijo => hijo.nombre);
}

function construirLineas(asistencia) {
  const nombre = getValue('nombre-invitado');
  const invitadoDe = getValue('invitado-de');
  const email = getValue('email-confirmacion');
  const alergiasInvitado = getValue('intolerancias') || 'Ninguna';
  const cancion = getValue('cancion');
  const lineas = [{
    tipo: 'INVITADO/A',
    nombre,
    invitadoDe,
    email,
    asistencia,
    alergias: asistencia === 'si' ? alergiasInvitado : '',
    cancion: asistencia === 'si' ? cancion : ''
  }];

  if (asistencia === 'si' && document.getElementById('a-si').checked) {
    lineas.push({
      tipo: 'ACOMPAÑANTE',
      nombre: getValue('nombre-acompanante'),
      invitadoDe,
      email,
      asistencia,
      alergias: getValue('alergias-acompanante') || 'Ninguna',
      cancion: ''
    });
  }

  if (asistencia === 'si') {
    obtenerHijos().forEach(hijo => lineas.push({
      tipo: hijo.tipo,
      nombre: hijo.nombre,
      invitadoDe,
      email,
      asistencia,
      alergias: hijo.alergias,
      cancion: ''
    }));
  }

  return lineas;
}

// SUBMIT
async function submitRSVP() {
  if (!validateBaseFields()) return;

  const asistencia = 'si';
  const acompanante = document.getElementById('a-si').checked ? 'si' : 'no';
  const nombreAcompanante = getValue('nombre-acompanante');
  const cancion = getValue('cancion');

  if (acompanante === 'si' && !nombreAcompanante) {
    showToast('Indica el nombre del acompañante.', 'error');
    flash('nombre-acompanante');
    return;
  }

  if (!cancion) {
    showToast('Canción obligatoria para tenerte en nuestra playlist.', 'error');
    flash('cancion');
    return;
  }

  const hijos = obtenerHijos();
  const lineas = construirLineas(asistencia);

  const payload = {
    id: invitadoId,
    asistencia,
    invitado: getValue('nombre-invitado'),
    invitadoDe: getValue('invitado-de'),
    email: getValue('email-confirmacion'),
    intolerancias: getValue('intolerancias') || 'Ninguna',
    acompanante,
    nombreAcompanante,
    alergiasAcompanante: getValue('alergias-acompanante') || 'Ninguna',
    numeroHijos: hijos.length,
    hijos,
    ninos: hijos.map(h => `${h.nombre}(${h.alergias})`).join(', '),
    cancion,
    lineas
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!result.success) {
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
}

async function submitNoAsiste() {
  if (!validateBaseFields()) return;

  const payload = {
    id: invitadoId,
    asistencia: 'no',
    invitado: getValue('nombre-invitado'),
    invitadoDe: getValue('invitado-de'),
    email: getValue('email-confirmacion'),
    intolerancias: '',
    acompanante: 'no',
    nombreAcompanante: '',
    alergiasAcompanante: '',
    numeroHijos: 0,
    hijos: [],
    ninos: '',
    cancion: '',
    lineas: construirLineas('no')
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!result.success) {
      showToast(result.message || 'No se pudo guardar la respuesta.', 'error');
      return;
    }

    document.getElementById('the-form').style.display = 'none';
    const s = document.getElementById('form-no-asiste');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';
  } catch (error) {
    showToast('Error de conexión al enviar la respuesta.', 'error');
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
  tag.textContent = '// SAVE THE DATE — HOLA ' + nombre.toUpperCase() + ' 👋';
  const inputNombre = document.getElementById('nombre-invitado');
  if (inputNombre && !inputNombre.value) inputNombre.value = nombre;
}

toggleAsistencia();
toggleAcompanante();
toggleNinos();
renderChildrenFields();
