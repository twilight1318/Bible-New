// ==========================================================================
// 366 DAYS WITH GOD - Personal Journal (Reflections) Module
// ==========================================================================

const PersonalJournal = {
  searchQuery: '',

  render() {
    const container = document.getElementById('personal-journal-view');
    if (!container) return;

    const entries = window.appState.personalJournal;

    let filtered = entries;
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = entries.filter(e => e.content.toLowerCase().includes(q));
    }

    let html = `
      <div class="journal-view-header">
        <div>
          <div class="floral-badge">✍️ Quiet Time Sanctuary</div>
          <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.35rem;">Personal Journal</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            A safe, private haven for your daily reflections, thoughts, and spiritual discoveries. Stored strictly in your browser.
          </p>
        </div>
        <div style="display:flex; gap: 0.5rem;">
          <button class="btn-primary" onclick="PersonalJournal.openNewReflectionModal()">
            + Add New Reflection
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div style="max-width: 480px; margin-bottom: 2rem;">
        <input 
          type="text" 
          class="form-input" 
          placeholder="Search your private journal entries..." 
          value="${this.escapeHTML(this.searchQuery)}"
          oninput="PersonalJournal.handleSearch(this.value)"
          style="border-radius: var(--radius-full);"
        />
      </div>

      <!-- Timeline Entries -->
      <div class="journal-timeline">
    `;

    if (filtered.length === 0) {
      html += `
        <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-card);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">✍️</div>
          <h3 style="margin-bottom: 0.5rem;">No Journal Entries Found</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">
            ${this.searchQuery 
              ? 'No entries match your search query.' 
              : 'As you read each daily devotional, write your personal reflection in the "Reflect on This" section, or add one directly here!'}
          </p>
          <button class="btn-primary" onclick="PersonalJournal.openNewReflectionModal()">
            + Write an Entry Now
          </button>
        </div>
      `;
    } else {
      filtered.forEach(entry => {
        const dayNum = entry.dayNumber;
        const devotionalEntry = dayNum && window.BIBLE_DEVOTIONALS ? window.BIBLE_DEVOTIONALS[dayNum - 1] : null;

        html += `
          <div class="journal-card">
            <div class="journal-card-header">
              <div style="display:flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                ${dayNum ? `<span class="day-badge" style="cursor:pointer;" onclick="App.navigateToDaily(${dayNum})">DAY ${String(dayNum).padStart(3, '0')}</span>` : '<span class="day-badge">REFLECTION</span>'}
                ${devotionalEntry ? `<span style="font-weight: 600; font-size: 0.95rem;">${this.escapeHTML(devotionalEntry.dailyTitle)}</span>` : ''}
              </div>
              <div class="journal-date-tag">${entry.date}</div>
            </div>

            <p style="font-family: var(--font-quote); font-size: 1.2rem; line-height: 1.7; color: var(--text-main); white-space: pre-line; margin-bottom: 1.25rem;">
              "${this.escapeHTML(entry.content)}"
            </p>

            <div style="display:flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <div>
                ${dayNum ? `<button class="btn-pill" style="font-size: 0.8rem; padding: 0.25rem 0.65rem;" onclick="App.navigateToDaily(${dayNum})">Open Devotional →</button>` : ''}
              </div>
              <div style="display:flex; gap: 0.5rem;">
                <button class="btn-pill" style="font-size: 0.8rem;" onclick="PersonalJournal.openEditModal('${entry.id}')">Edit</button>
                <button class="btn-pill" style="font-size: 0.8rem; color: #D94F6E;" onclick="PersonalJournal.deleteEntry('${entry.id}')">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.render();
  },

  openNewReflectionModal() {
    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Write Personal Reflection ✍️</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Related Day Number (Optional, 1-366):</label>
        <input type="number" id="new-reflection-day" class="form-input" min="1" max="366" placeholder="e.g. 45" />
      </div>
      <div class="form-group">
        <label class="form-label">Your Reflection / Thoughts:</label>
        <textarea id="new-reflection-content" class="form-textarea" rows="6" placeholder="What has God spoken to your heart today?"></textarea>
      </div>
      <div style="display:flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
        <button class="btn-primary" onclick="PersonalJournal.submitNewReflection()">Save Reflection</button>
      </div>
    `;
    App.openModal(modalContent);
  },

  submitNewReflection() {
    const dayInput = document.getElementById('new-reflection-day').value;
    const content = document.getElementById('new-reflection-content').value;

    if (!content.trim()) {
      alert('Please write your reflection content.');
      return;
    }

    const dayNum = dayInput ? parseInt(dayInput) : null;
    window.appState.saveDailyReflection(dayNum || Date.now() % 366, content);
    App.closeModal();
    App.showToast('Reflection saved to your personal journal! ✍️');
    this.render();
  },

  openEditModal(id) {
    const entry = window.appState.personalJournal.find(e => e.id === id);
    if (!entry) return;

    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Edit Reflection</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Reflection Content:</label>
        <textarea id="edit-reflection-content" class="form-textarea" rows="6">${this.escapeHTML(entry.content)}</textarea>
      </div>
      <div style="display:flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
        <button class="btn-primary" onclick="PersonalJournal.submitEdit('${id}')">Save Changes</button>
      </div>
    `;
    App.openModal(modalContent);
  },

  submitEdit(id) {
    const content = document.getElementById('edit-reflection-content').value;
    const entry = window.appState.personalJournal.find(e => e.id === id);
    if (entry) {
      entry.content = content.trim();
      entry.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      window.appState.save(STORAGE_KEYS.PERSONAL_JOURNAL, window.appState.personalJournal);
    }
    App.closeModal();
    App.showToast('Reflection updated.');
    this.render();
  },

  deleteEntry(id) {
    if (confirm('Delete this reflection entry?')) {
      window.appState.deleteJournalEntry(id);
      App.showToast('Reflection entry deleted.');
      this.render();
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

window.PersonalJournal = PersonalJournal;

