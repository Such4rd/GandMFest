  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbze8-z6p-uy_JQEQPr26mJCnh3_ORUeVgFnEOV1jJuudvyRQgrgFkZ3nYcT82KH3-dY/exec';

  const params = new URLSearchParams(window.location.search);
  const invitadoId = params.get('id');

  // COUNTDOWN
  function updateCountdown() {
    const target = new Date('2026-10-17T11:00:00').getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      ['cnt-d','cnt-h','cnt-m','cnt-s'].forEach(id => document.getElementById(id).textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cnt-d').textContent = String(d).padStart(2,'0');
    document.getElementById('cnt-h').textContent = String(h).padStart(2,'0');
    document.getElementById('cnt-m').textContent = String(m).padStart(2,'0');
    document.getElementById('cnt-s').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // SCROLL REVEAL
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
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
    if (si) { sec.classList.add('show'); }
    else { sec.classList.remove('show'); }
  }

  // COMPANIONS
  let compCount = 0;
  function addCompanion() {
    compCount++;
    const list = document.getElementById('companions-list');
    const row = document.createElement('div');
    row.className = 'companion-row';
    row.id = 'comp-' + compCount;
    row.innerHTML = `
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" placeholder="Nombre acompañante"/>
      </div>
      <div class="form-group">
        <label>Intol. específica</label>
        <input type="text" placeholder="Ninguna"/>
      </div>
      <button type="button" class="btn-remove" onclick="removeRow('comp-${compCount}')">✕</button>
    `;
    list.appendChild(row);
  }

  let childCount = 0;
  function addChild() {
    childCount++;
    const list = document.getElementById('children-list');
    const row = document.createElement('div');
    row.className = 'companion-row';
    row.id = 'child-' + childCount;
    row.innerHTML = `
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" placeholder="Nombre del niño/a"/>
      </div>
      <div class="form-group">
        <label>Edad</label>
        <input type="number" placeholder="Edad" min="0" max="17"/>
      </div>
      <button type="button" class="btn-remove" onclick="removeRow('child-${childCount}')">✕</button>
    `;
    list.appendChild(row);
  }

  function removeRow(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function showToast(message, type = 'info') {

    const toast = document.getElementById('toast');

    toast.textContent = message;

    toast.className = '';
    toast.classList.add(type);
    toast.classList.add('show');

    clearTimeout(toast._timeout);

    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // SUBMIT
  async function submitRSVP() {
    const asistencia = document.getElementById('r-si').checked ? 'si' : 'no';
    const acompanante = document.getElementById('a-si').checked ? 'si' : 'no';

    const intolerancias = document.getElementById('intolerancias')?.value.trim() || '';
    const cancion = document.getElementById('cancion')?.value.trim() || '';
    const ninos = obtenerTextoNinos();

    if (!invitadoId) {
      showToast('Falta el ID del invitado en el enlace.','error');
      return;
    }

    const payload = {
      id: invitadoId,
      asistencia: asistencia,
      intolerancias: intolerancias,
      acompanante: acompanante,
      ninos: ninos,
      cancion: cancion
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.success) {
      showToast(result.message, 'error');
      return;
    }

    document.getElementById('the-form').style.display = 'none';
    const s = document.getElementById('form-success');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';
  }

  async function submitNoAsiste() {
    if (!invitadoId) {
      showToast('Falta el ID del invitado en el enlace.', 'error');
      return;
    }

    const payload = {
      id: invitadoId,
      asistencia: 'no',
      intolerancias: '',
      acompanante: 'no',
      ninos: '',
      cancion: ''
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.success) {
      showToast(result.message, 'error');
      return;
    }

    document.getElementById('the-form').style.display = 'none';

    const s = document.getElementById('form-no-asiste');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';
  }

  function flash(id) {
    const el = document.getElementById(id);
    el.style.borderColor = 'var(--magenta)';
    el.style.boxShadow = '0 0 0 1px var(--magenta)';
    el.focus();
    setTimeout(() => { el.style.borderColor=''; el.style.boxShadow=''; }, 1500);
  }

  // URL param invitado
  const invitado = params.get('invitado');
  if (invitado) {
    const tag = document.querySelector('.hero-tag');
    tag.textContent = '// SAVE THE DATE — HOLA ' + decodeURIComponent(invitado).toUpperCase() + ' 👋';
  }




  //formulario
  function obtenerTextoNinos() {
  const rows = document.querySelectorAll('#children-list .companion-row');

  const ninos = [];

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const nombre = inputs[0]?.value.trim();
    const edad = inputs[1]?.value.trim();

    if (nombre) {
      ninos.push(`${nombre}(${edad || 'sin edad'})`);
    }
  });

  return ninos.join(',');
}