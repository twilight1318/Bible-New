// ==========================================================================
// 366 DAYS WITH GOD - Settings & Customization Module
// ==========================================================================

const Settings = {
  render() {
    const container = document.getElementById('settings-view');
    if (!container) return;

    const s = window.appState.settings;
    const occ = window.appState.specialOccasions;

    container.innerHTML = `
      <div style="max-width: 780px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="floral-badge">⚙️ Personalization & Settings</div>
          <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.5rem;">Gift Customization</h1>
          <p style="color: var(--text-secondary); font-size: 0.98rem; max-width: 600px; margin: 0 auto;">
            Customize names, dedication letters, visual aesthetics, and daily notifications. All changes are saved privately in your browser.
          </p>
        </div>

        <!-- 1. Names & Dedication -->
        <div class="month-card" style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 1.25rem;">Personal Dedication Details</h3>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label">Partner's Display Name:</label>
              <input type="text" id="setting-partner-name" class="form-input" value="${this.escapeHTML(s.partnerName)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Gift Creator's Display Name:</label>
              <input type="text" id="setting-creator-name" class="form-input" value="${this.escapeHTML(s.creatorName)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Dedication Letter (Displayed on Opening Dedication Page):</label>
            <textarea id="setting-dedication-letter" class="form-textarea" rows="6">${this.escapeHTML(s.dedicationLetter)}</textarea>
          </div>

          <button class="btn-primary" onclick="Settings.saveNamesAndDedication()">
            Save Dedication Details
          </button>
        </div>

        <!-- 2. Visual Themes & Typography -->
        <div class="month-card" style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 1.25rem;">Visual Appearance</h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label class="form-label">Color Theme Palette:</label>
              <div style="display:flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="chip-btn ${s.accentColor === 'blush' ? 'active' : ''}" onclick="Settings.setAccent('blush')">🌸 Blush Rose</button>
                <button class="chip-btn ${s.accentColor === 'sage' ? 'active' : ''}" onclick="Settings.setAccent('sage')">🌿 Sage Garden</button>
                <button class="chip-btn ${s.accentColor === 'lavender' ? 'active' : ''}" onclick="Settings.setAccent('lavender')">💜 Lavender</button>
                <button class="chip-btn ${s.accentColor === 'gold' ? 'active' : ''}" onclick="Settings.setAccent('gold')">✨ Royal Gold</button>
              </div>
            </div>

            <div>
              <label class="form-label">Mode:</label>
              <div style="display:flex; gap: 0.5rem;">
                <button class="chip-btn ${s.themeMode === 'light' ? 'active' : ''}" onclick="Settings.setThemeMode('light')">☀️ Light Mode</button>
                <button class="chip-btn ${s.themeMode === 'dark' ? 'active' : ''}" onclick="Settings.setThemeMode('dark')">🌙 Night Mode</button>
              </div>
            </div>

            <div>
              <label class="form-label">Reading Text Size:</label>
              <div style="display:flex; gap: 0.5rem;">
                <button class="chip-btn ${s.fontSize === 'sm' ? 'active' : ''}" onclick="Settings.setFontSize('sm')">A-</button>
                <button class="chip-btn ${s.fontSize === 'md' ? 'active' : ''}" onclick="Settings.setFontSize('md')">A (Default)</button>
                <button class="chip-btn ${s.fontSize === 'lg' ? 'active' : ''}" onclick="Settings.setFontSize('lg')">A+</button>
                <button class="chip-btn ${s.fontSize === 'xl' ? 'active' : ''}" onclick="Settings.setFontSize('xl')">A++</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Daily Reminder Settings -->
        <div class="month-card" style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Daily Reading Reminder</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">
            Set a daily time to receive a gentle browser notification to read today's devotional. (Requires notification permissions).
          </p>

          <div style="display:flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <input type="time" id="setting-reminder-time" class="form-input" style="width: auto;" value="${s.reminderTime || '08:00'}" />
            <button class="btn-primary" onclick="Settings.saveReminderTime()">
              Set Reminder Time
            </button>
            <button class="btn-secondary" onclick="Notifications.testNotification()">
              🔔 Send Test Notification
            </button>
          </div>
        </div>

        <!-- 4. Special Occasions Messages -->
        <div class="month-card" style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Special Occasions Messages</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">
            Customize personal messages for milestone celebrations, birthdays, anniversaries, Christmas, and Easter.
          </p>

          <div style="display:flex; flex-direction: column; gap: 1rem;">
            ${['birthday', 'anniversary', 'milestone', 'christmas', 'easter'].map(key => {
              const item = occ[key];
              return `
                <div style="background: var(--bg-surface-soft); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label class="form-label" style="text-transform: capitalize;">${key} Heading:</label>
                    <input type="text" id="occ-title-${key}" class="form-input" value="${this.escapeHTML(item.title)}" />
                  </div>
                  <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label">Personal Message:</label>
                    <textarea id="occ-msg-${key}" class="form-textarea" rows="3">${this.escapeHTML(item.message)}</textarea>
                  </div>
                  <button class="btn-pill" onclick="Settings.saveOccasion('${key}')">Save ${key} Message</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 5. Backup, Export & Reset -->
        <div class="month-card" style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Data Backup & Privacy</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">
            All your journal entries, favourites, and reading progress are stored locally on your device for complete privacy. You can download a backup copy anytime.
          </p>

          <div style="display:flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-primary" onclick="Settings.exportData()">
              ⬇ Export & Download Backup (JSON)
            </button>
            <label class="btn-secondary" style="cursor: pointer;">
              ⬆ Restore Backup (JSON)
              <input type="file" id="import-file-input" accept=".json" style="display: none;" onchange="Settings.importData(event)" />
            </label>
            <button class="btn-pill" style="color: #D94F6E; border-color: rgba(217, 79, 110, 0.4);" onclick="Settings.confirmReset()">
              Reset All Reading Progress
            </button>
          </div>
        </div>
      </div>
    `;
  },

  saveNamesAndDedication() {
    const partner = document.getElementById('setting-partner-name').value;
    const creator = document.getElementById('setting-creator-name').value;
    const letter = document.getElementById('setting-dedication-letter').value;

    window.appState.updateSettings({
      partnerName: partner.trim() || 'My Beloved',
      creatorName: creator.trim() || 'Your Partner',
      dedicationLetter: letter.trim()
    });

    App.showToast('Dedication details saved successfully! ❤️');
  },

  setAccent(accent) {
    window.appState.updateSettings({ accentColor: accent });
    this.render();
  },

  setThemeMode(mode) {
    window.appState.updateSettings({ themeMode: mode });
    this.render();
  },

  setFontSize(size) {
    window.appState.updateSettings({ fontSize: size });
    this.render();
  },

  saveReminderTime() {
    const timeVal = document.getElementById('setting-reminder-time').value;
    window.appState.updateSettings({ reminderTime: timeVal, reminderEnabled: true });
    Notifications.requestPermission();
    App.showToast(`Daily reminder time saved for ${timeVal}! ⏰`);
  },

  saveOccasion(key) {
    const title = document.getElementById(`occ-title-${key}`).value;
    const msg = document.getElementById(`occ-msg-${key}`).value;
    window.appState.updateSpecialOccasion(key, title, msg);
    App.showToast(`Saved message for ${key}! ❤️`);
  },

  exportData() {
    const jsonStr = window.appState.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `366-days-with-god-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Backup file downloaded! 💾');
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const success = window.appState.importBackup(content);
      if (success) {
        App.showToast('Backup restored successfully! 🎉');
        this.render();
        if (window.Dashboard) Dashboard.render();
      } else {
        alert('Invalid backup file. Please select a valid JSON backup exported from 366 Days With God.');
      }
    };
    reader.readAsText(file);
  },

  confirmReset() {
    if (confirm('Are you sure you want to reset all reading progress? This will reset completed days and favorites.')) {
      if (confirm('Please confirm once more: Do you really wish to reset?')) {
        window.appState.resetAllProgress();
        App.showToast('All progress has been reset.');
        this.render();
        if (window.Dashboard) Dashboard.render();
      }
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

window.Settings = Settings;

