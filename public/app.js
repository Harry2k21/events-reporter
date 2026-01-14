/* =========================
   THEME & ACCESSIBILITY UI
========================= */

// Theme Management
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
document.body.appendChild(themeToggle);

// Accessibility Button
const a11yButton = document.createElement('button');
a11yButton.className = 'a11y-button';
a11yButton.setAttribute('aria-label', 'Accessibility information');
a11yButton.textContent = '?';
document.body.appendChild(a11yButton);

// Accessibility Modal
const a11yModal = document.createElement('div');
a11yModal.className = 'a11y-modal';
a11yModal.setAttribute('role', 'dialog');
a11yModal.setAttribute('aria-labelledby', 'a11y-modal-title');
a11yModal.setAttribute('aria-modal', 'true');
a11yModal.innerHTML = `
  <div class="a11y-modal-content">
    <div class="a11y-modal-header">
      <h3 id="a11y-modal-title">Accessibility Features</h3>
      <button class="a11y-modal-close" aria-label="Close accessibility information">×</button>
    </div>
    <div class="a11y-modal-body">
      <h4>Keyboard Navigation</h4>
      <ul>
        <li><kbd>Tab</kbd> - Navigate forward through interactive elements</li>
        <li><kbd>Shift + Tab</kbd> - Navigate backward</li>
        <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and links</li>
        <li><kbd>Esc</kbd> - Close this dialog</li>
      </ul>
      
      <h4>Screen Reader Support</h4>
      <ul>
        <li>All form fields have descriptive labels</li>
        <li>Required fields are clearly marked</li>
        <li>Error messages are announced</li>
        <li>Success notifications are live regions</li>
      </ul>
      
      <h4>Visual Accessibility</h4>
      <ul>
        <li>WCAG 2.2 AA compliant color contrast ratios</li>
        <li>Light and dark mode options available</li>
        <li>Focus indicators on all interactive elements</li>
        <li>Text can be resized up to 200% without loss of content</li>
      </ul>
      
      <h4>Form Accessibility</h4>
      <ul>
        <li>Semantic HTML structure throughout</li>
        <li>Clear error validation messages</li>
        <li>Logical tab order maintained</li>
        <li>All interactive elements keyboard accessible</li>
      </ul>
      
      <p class="a11y-contact">If you encounter any accessibility barriers, please contact our support team.</p>
    </div>
  </div>
`;
document.body.appendChild(a11yModal);

// Theme functionality
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    // Moon icon
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Sun icon
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// Accessibility modal functionality
a11yButton.addEventListener('click', () => {
  a11yModal.classList.add('show');
  document.body.classList.add('modal-open');
  const closeBtn = a11yModal.querySelector('.a11y-modal-close');
  closeBtn.focus();
});

const closeModal = () => {
  a11yModal.classList.remove('show');
  document.body.classList.remove('modal-open');
  a11yButton.focus();
};

a11yModal.querySelector('.a11y-modal-close').addEventListener('click', closeModal);

a11yModal.addEventListener('click', (e) => {
  if (e.target === a11yModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && a11yModal.classList.contains('show')) {
    closeModal();
  }
});

// Trap focus in modal
a11yModal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && a11yModal.classList.contains('show')) {
    const focusableElements = a11yModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
});

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