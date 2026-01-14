/* =========================
   CONFIG
========================= */
const API_URL = '/.netlify/functions';

/* =========================
   DYNAMIC DROPDOWN DATA
========================= */
const sightingData = {
  ghost: [
    'Headless Knight',
    'Wailing Woman',
    'Victorian Lady',
    'Phantom Butler',
    'Spectral Child',
    'Grey Lady',
    'Hooded Figure'
  ],
  creature: [
    'Dragon',
    'Unicorn',
    'Phoenix',
    'Hippogriff',
    'Basilisk',
    'Griffin',
    'Thunderbird',
    'Kelpie'
  ],
  phenomenon: [
    'Time Distortion',
    'Unexplained Light',
    'Floating Object',
    'Mysterious Fog',
    'Portal/Vortex',
    'Telepathic Event',
    'Temporal Loop'
  ]
};

/* =========================
   ELEMENTS
========================= */
const typeSelect = document.getElementById('type');
const specificSelect = document.getElementById('specific');
const form = document.getElementById('reportForm');
const successMessage = document.getElementById('successMessage');
const reportsGrid = document.getElementById('reportsGrid');
const navTabs = document.querySelectorAll('.nav-tab');
const views = document.querySelectorAll('.view');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

/* =========================
   NAVIGATION
========================= */
navTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    const targetView = this.dataset.view;

    navTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');

    views.forEach(v => v.classList.remove('active'));
    document.getElementById(targetView + 'View').classList.add('active');

    const url = new URL(window.location);
    url.searchParams.set('view', targetView);
    window.history.pushState({}, '', url);

    if (targetView === 'browse') {
      renderReports(currentFilter);
    }
  });
});

/* =========================
   TYPE → SPECIFIC DROPDOWN
========================= */
typeSelect.addEventListener('change', function () {
  const selectedType = this.value;
  specificSelect.innerHTML = '';

  if (selectedType && sightingData[selectedType]) {
    specificSelect.disabled = false;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select specific…';
    specificSelect.appendChild(placeholder);

    sightingData[selectedType].forEach(item => {
      const option = document.createElement('option');
      option.value = item.toLowerCase().replace(/\s+/g, '-');
      option.textContent = item;
      specificSelect.appendChild(option);
    });
  } else {
    specificSelect.disabled = true;
    specificSelect.innerHTML =
      '<option value="">First select a type…</option>';
  }
});

/* =========================
   RENDER REPORTS (API)
========================= */
async function renderReports(filter = 'all') {
  reportsGrid.innerHTML = '';

  const res = await fetch(
    `${API_URL}/reports-get?type=${filter}`
  );
  const reports = await res.json();

  if (!reports.length) {
    reportsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No sightings found in this category.</p>
      </div>
    `;
    return;
  }

  reports.forEach(report => {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.innerHTML = `
      <div class="report-header">
        <span class="report-type">
          ${report.type_name}: ${report.specific}
        </span>
        <span class="report-date">
          ${new Date(report.date).toLocaleDateString()}
        </span>
      </div>
      <div class="report-location">📍 ${report.location}</div>
      <div class="report-description">${report.description}</div>
    `;
    reportsGrid.appendChild(card);
  });
}

/* =========================
   FILTER BUTTONS + URL
========================= */
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const filter = this.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    currentFilter = filter;

    const url = new URL(window.location);
    url.searchParams.set('view', 'browse');
    url.searchParams.set('type', filter);
    window.history.pushState({}, '', url);

    renderReports(filter);
  });
});

/* =========================
   FORM SUBMISSION
========================= */
form.addEventListener('submit', async e => {
  e.preventDefault();

  const refId = 'PS-' + Date.now().toString(36).toUpperCase();
  const data = Object.fromEntries(new FormData(form));

  await fetch(`${API_URL}/reports-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: refId,
      type: data.type,
      typeName: typeSelect.options[typeSelect.selectedIndex].text,
      specific: specificSelect.options[specificSelect.selectedIndex].text,
      location: data.location,
      date: data.datetime.split('T')[0],
      description: data.notes || 'No additional details provided.'
    })
  });

  document.getElementById('refId').textContent = refId;
  successMessage.classList.add('show');

  form.reset();
  specificSelect.disabled = true;
  specificSelect.innerHTML =
    '<option value="">First select a type…</option>';

  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 5000);

  renderReports(currentFilter);
});

/* =========================
   LOAD STATE FROM URL
========================= */
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') || 'report';
  const type = params.get('type') || 'all';

  document
    .querySelector(`[data-view="${view}"]`)
    ?.click();

  currentFilter = type;

  filterBtns.forEach(btn => {
    btn.classList.toggle(
      'active',
      btn.dataset.filter === type
    );
  });

  if (view === 'browse') {
    renderReports(type);
  }
}

loadFromURL();
