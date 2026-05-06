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

  // SUBMIT
  function submitRSVP() {
    document.getElementById('the-form').style.display = 'none';
    const s = document.getElementById('form-success');
    s.style.display = 'block';
    s.style.animation = 'fadeUp 0.6s ease both';
  }

  function submitNoAsiste() {
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
  const params = new URLSearchParams(window.location.search);
  const invitado = params.get('invitado');
  if (invitado) {
    const tag = document.querySelector('.hero-tag');
    tag.textContent = '// SAVE THE DATE — HOLA ' + decodeURIComponent(invitado).toUpperCase() + ' 👋';
  }