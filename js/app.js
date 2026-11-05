// ==========================================================================
// 366 DAYS WITH GOD - Master Application Coordinator
// ==========================================================================

const App = {
  currentView: 'dashboard',

  init() {
    console.log('Initializing 366 Days With God ❤️...');

    // Apply saved visual preferences
    window.appState.applyVisualPreferences();

    // Register service worker if available
    this.registerServiceWorker();

    // Initialize notification scheduler
    if (window.Notifications) {
      Notifications.init();
    }

    // Bind keyboard shortcuts
    this.bindKeyboardShortcuts();

    // Handle initial route based on hash or default
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('day-')) {
      const dayNum = parseInt(hash.replace('day-', ''));
      this.navigateToDaily(dayNum);
    } else if (hash && document.getElementById(`${hash}-view`)) {
      this.navigateTo(hash);
    } else {
      // If user hasn't completed day 1, show welcome on first visit or dashboard
      if (window.appState.getCompletedCount() === 0 && !localStorage.getItem('366_god_welcomed')) {
        this.navigateTo('welcome');
      } else {
        this.navigateTo('dashboard');
      }
    }
  },

  navigateTo(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(`${viewName}-view`);
    if (target) {
      target.classList.add('active');
    }

    // Update desktop nav pills
    document.querySelectorAll('.nav-link').forEach(link => {
      const targetNav = link.getAttribute('data-nav');
      if (targetNav === viewName) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Update mobile bottom nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const targetNav = item.getAttribute('data-nav');
      if (targetNav === viewName) item.classList.add('active');
      else item.classList.remove('active');
    });

    // Trigger view-specific render logic
    if (viewName === 'dashboard' && window.Dashboard) {
      Dashboard.render();
    } else if (viewName === 'calendar' && window.Calendar) {
      Calendar.render();
    } else if (viewName === 'favourites' && window.Favourites) {
      Favourites.render();
    } else if (viewName === 'prayer-journal' && window.PrayerJournal) {
      PrayerJournal.render();
    } else if (viewName === 'personal-journal' && window.PersonalJournal) {
      PersonalJournal.render();
    } else if (viewName === 'search' && window.Search) {
      Search.renderView();
    } else if (viewName === 'settings' && window.Settings) {
      Settings.render();
    } else if (viewName === 'dedication') {
      this.renderDedicationView();
    } else if (viewName === 'special-messages') {
      this.renderSpecialMessagesView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToDaily(dayNumber) {
    dayNumber = parseInt(dayNumber) || 1;
    this.navigateTo('daily-reading');
    window.location.hash = `day-${dayNumber}`;
    if (window.DailyReading) {
      DailyReading.render(dayNumber);
    }
  },

  startJourney() {
    localStorage.setItem('366_god_welcomed', 'true');
    this.navigateToDaily(1);
  },

  renderDedicationView() {
    const container = document.getElementById('dedication-view');
    if (!container) return;

    const s = window.appState.settings;
    container.innerHTML = `
      <div class="dedication-card">
        <div class="dedication-header">
          <div class="dedication-seal">✝</div>
          <div class="floral-badge">Sacred Gift of Love</div>
          <h1 class="dedication-title">A Gift Made With Faith and Love</h1>
          <div class="dedication-subtitle">To ${this.escapeHTML(s.partnerName)}</div>
        </div>

        <div class="dedication-letter">
          <div class="dedication-salutation">My Dearest ${this.escapeHTML(s.partnerName)},</div>
          <p>${this.escapeHTML(s.dedicationLetter)}</p>
          <div class="dedication-closing">
            With all my love & prayers,
            <div class="dedication-signature">${this.escapeHTML(s.creatorName)}</div>
          </div>
        </div>

        <div style="display:flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
          <button class="btn-primary" onclick="App.navigateToDaily(1)">
            Begin Your 366-Day Walk →
          </button>
          <button class="btn-secondary" onclick="App.navigateTo('dashboard')">
            Open Dashboard
          </button>
        </div>

        <div class="dedication-edit-trigger">
          <button class="btn-pill" onclick="App.navigateTo('settings')">
            Customize Names & Dedication Letter ✎
          </button>
        </div>
      </div>
    `;
  },

  renderSpecialMessagesView() {
    const container = document.getElementById('special-messages-view');
    if (!container) return;

    const occ = window.appState.specialOccasions;
    const partner = window.appState.settings.partnerName;
    const creator = window.appState.settings.creatorName;

    container.innerHTML = `
      <div style="max-width: 820px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="floral-badge">💌 Milestones & Love Letters</div>
          <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.5rem;">Special Occasions</h1>
          <p style="color: var(--text-secondary); font-size: 0.98rem; max-width: 600px; margin: 0 auto;">
            Personal letters of celebration, blessings, and prayer for ${this.escapeHTML(partner)}.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
          ${Object.entries(occ).map(([key, item]) => `
            <div class="month-card" style="position:relative;">
              <div style="display:flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
                <h3 style="font-size: 1.35rem; color: var(--text-main);">${this.escapeHTML(item.title)}</h3>
                <span class="theme-pill-tag" style="text-transform: capitalize;">${key}</span>
              </div>
              <p style="font-family: var(--font-quote); font-size: 1.25rem; font-style: italic; line-height: 1.7; color: var(--text-main); white-space: pre-line; margin-bottom: 1.25rem;">
                "${this.escapeHTML(item.message)}"
              </p>
              <div style="text-align: right; font-family: var(--font-serif); font-size: 0.95rem; font-weight: 600; color: var(--accent-primary);">
                — With endless love, ${this.escapeHTML(creator)}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn-pill" onclick="App.navigateTo('settings')">
            Edit Special Occasions Messages ✎
          </button>
        </div>
      </div>
    `;
  },

  // Modal Controls
  openModal(htmlContent) {
    const backdrop = document.getElementById('global-modal-backdrop');
    const container = document.getElementById('global-modal-container');
    if (backdrop && container) {
      container.innerHTML = htmlContent;
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal() {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Toast System
  showToast(message) {
    const container = document.getElementById('global-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${this.escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Random Bible Verse Feature
  openRandomVerseModal() {
    if (!window.BIBLE_DEVOTIONALS || !window.BIBLE_DEVOTIONALS.length) return;
    const randomIndex = Math.floor(Math.random() * window.BIBLE_DEVOTIONALS.length);
    const entry = window.BIBLE_DEVOTIONALS[randomIndex];

    const modalContent = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.3rem;">🎲</span>
          <h3 class="modal-title">Random Verse of Encouragement</h3>
        </div>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      
      <div class="verse-highlight-card" style="margin-bottom: 1.5rem;">
        <div class="verse-text-body">"${this.escapeHTML(entry.text)}"</div>
        <div class="verse-ref-footer">
          <span class="verse-kjv-tag">DAY ${entry.day} • ${entry.month}</span>
          <span class="verse-ref-text">${this.escapeHTML(entry.reference)} (KJV)</span>
        </div>
      </div>

      <div style="background: var(--bg-surface-soft); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
        <h4 style="margin-bottom: 0.4rem; font-size: 1.05rem;">${this.escapeHTML(entry.dailyTitle)}</h4>
        <p style="font-size: 0.94rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
          ${this.escapeHTML(entry.devotional.substring(0, 220))}...
        </p>
      </div>

      <div style="display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.openRandomVerseModal()">
          🎲 Another Random Verse
        </button>
        <button class="btn-primary" onclick="App.closeModal(); App.navigateToDaily(${entry.day});">
          Open Day ${entry.day} Devotional →
        </button>
      </div>
    `;

    this.openModal(modalContent);
  },

  // PDF Generator Modal
  openPdfModal() {
    const lastDay = window.appState.lastReadDay || 1;
    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Download Printable PDF Devotionals 📖</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>

      <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">
        Generate and download elegant, printable PDF documents directly from the central database.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        <!-- Option 1: Current Daily Page -->
        <div style="background: var(--bg-surface-soft); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem;">Current Daily Page (Day ${lastDay})</div>
            <div style="font-size: 0.84rem; color: var(--text-muted);">One beautiful printable page with all 8 devotional sections.</div>
          </div>
          <button class="btn-pill" onclick="PdfGenerator.generateSingleDay(${lastDay})">
            Download Day ${lastDay} PDF
          </button>
        </div>

        <!-- Option 2: Monthly Section -->
        <div style="background: var(--bg-surface-soft); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem;">Monthly Theme Section</div>
            <div style="font-size: 0.84rem; color: var(--text-muted);">Select any month to download its cover and all daily readings.</div>
          </div>
          <select id="pdf-month-select" class="form-select" style="width: auto; padding: 0.45rem 1rem;">
            <option value="January">January (Days 1–31)</option>
            <option value="February">February (Days 32–60)</option>
            <option value="March">March (Days 61–91)</option>
            <option value="April">April (Days 92–121)</option>
            <option value="May">May (Days 122–152)</option>
            <option value="June">June (Days 153–182)</option>
            <option value="July">July (Days 183–213)</option>
            <option value="August">August (Days 214–244)</option>
            <option value="September">September (Days 245–274)</option>
            <option value="October">October (Days 275–305)</option>
            <option value="November">November (Days 306–335)</option>
            <option value="December">December (Days 336–366)</option>
          </select>
          <button class="btn-pill" onclick="PdfGenerator.generateMonth(document.getElementById('pdf-month-select').value)">
            Download Month PDF
          </button>
        </div>

        <!-- Option 3: Complete 366-Day Book -->
        <div style="background: var(--gold-light); padding: 1.5rem; border-radius: var(--radius-md); border: 2px solid var(--gold-primary); text-align: center;">
          <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">✨ 📖 ✨</div>
          <h4 style="font-size: 1.25rem; margin-bottom: 0.35rem; color: var(--text-main);">Complete 366-Day Devotional Book</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 450px; margin: 0 auto 1.25rem;">
            Includes Cover Page, Dedication Letter, Table of Contents, 12 Monthly Dividers, all 366 Daily Devotionals, and Closing Day 366.
          </p>
          <button class="btn-gold" style="width: 100%; justify-content: center;" onclick="PdfGenerator.generateCompleteBook()">
            Download Complete 366-Day Book (PDF)
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content: flex-end;">
        <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      </div>
    `;

    this.openModal(modalContent);
  },

  // Keyboard Shortcuts
  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft' && this.currentView === 'daily-reading') {
        DailyReading.navigatePrevious();
      } else if (e.key === 'ArrowRight' && this.currentView === 'daily-reading') {
        DailyReading.navigateNext();
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(err => {
          console.log('SW registration note:', err);
        });
      });
    }
  },

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

window.DailyReading.copyVerseDirect = function(dayNumber) {
  const entry = window.BIBLE_DEVOTIONALS[dayNumber - 1];
  if (!entry) return;
  const textToCopy = `"${entry.text}" — ${entry.reference} (KJV)\n(366 Days With God)`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    App.showToast(`Day ${dayNumber} verse copied! 📋`);
  });
};

window.App = App;

