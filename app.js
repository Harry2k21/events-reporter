    // Sample recent reports data
    const recentReports = [
      {
        type: 'ghost',
        typeName: 'Ghost Sighting',
        specific: 'Grey Lady',
        location: 'Sheffield Cathedral',
        date: '2026-01-10',
        description: 'Translucent figure observed near the altar at midnight, dressed in Victorian-era clothing.'
      },
      {
        type: 'creature',
        typeName: 'Magical Creature',
        specific: 'Phoenix',
        location: 'Peak District',
        date: '2026-01-09',
        description: 'Large bird with golden-red plumage seen rising from flames near ancient stone circle.'
      },
      {
        type: 'phenomenon',
        typeName: 'Phenomenon',
        specific: 'Time Distortion',
        location: 'Chatsworth House',
        date: '2026-01-08',
        description: 'Experienced lost time - entered room for 5 minutes but 2 hours had passed outside.'
      },
      {
        type: 'ghost',
        typeName: 'Ghost Sighting',
        specific: 'Headless Knight',
        location: 'Bolsover Castle',
        date: '2026-01-07',
        description: 'Armored figure without head seen patrolling the castle walls at dawn.'
      },
      {
        type: 'creature',
        typeName: 'Magical Creature',
        specific: 'Unicorn',
        location: 'Sherwood Forest',
        date: '2026-01-06',
        description: 'White horse-like creature with spiral horn spotted drinking from stream.'
      }
    ];

    // Dynamic dropdown data
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

    // Form elements
    const typeSelect = document.getElementById('type');
    const specificSelect = document.getElementById('specific');
    const form = document.getElementById('reportForm');
    const successMessage = document.getElementById('successMessage');
    const reportsGrid = document.getElementById('reportsGrid');
    const navTabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.view');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    // Navigation between views
    navTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetView = this.dataset.view;
        
        // Update tabs
        navTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Update views
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(targetView + 'View').classList.add('active');
        
        // If switching to browse view, render reports
        if (targetView === 'browse') {
          renderReports(currentFilter);
        }
      });
    });

    // Update specific dropdown based on type selection
    typeSelect.addEventListener('change', function() {
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
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'First select a type…';
        specificSelect.appendChild(placeholder);
      }
    });

    // Render reports
    function renderReports(filter = 'all') {
      reportsGrid.innerHTML = '';
      const filteredReports = filter === 'all' 
        ? recentReports 
        : recentReports.filter(r => r.type === filter);

      if (filteredReports.length === 0) {
        reportsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p>No sightings found in this category.</p>
          </div>
        `;
        return;
      }

      filteredReports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
          <div class="report-header">
            <span class="report-type">${report.typeName}: ${report.specific}</span>
            <span class="report-date">${new Date(report.date).toLocaleDateString()}</span>
          </div>
          <div class="report-location">📍 ${report.location}</div>
          <div class="report-description">${report.description}</div>
        `;
        reportsGrid.appendChild(card);
      });
    }

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderReports(currentFilter);
      });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const refId = 'PS-' + Date.now().toString(36).toUpperCase();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      console.log('Report submitted:', data);
      console.log('Reference ID:', refId);
      
      // Add to recent reports
      const newReport = {
        type: data.type,
        typeName: typeSelect.options[typeSelect.selectedIndex].text,
        specific: specificSelect.options[specificSelect.selectedIndex].text,
        location: data.location,
        date: data.datetime.split('T')[0],
        description: data.notes || 'No additional details provided.'
      };
      recentReports.unshift(newReport);
      
      document.getElementById('refId').textContent = refId;
      successMessage.classList.add('show');
      
      form.reset();
      specificSelect.disabled = true;
      specificSelect.innerHTML = '<option value="">First select a type…</option>';
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
      
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Initial render
    renderReports();