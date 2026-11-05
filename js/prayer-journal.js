// ==========================================================================
// 366 DAYS WITH GOD - Prayer Journal Module
// ==========================================================================

const PrayerJournal = {
  currentTab: 'all', // 'all', 'active', 'answered'

  render() {
    const container = document.getElementById('prayer-journal-view');
    if (!container) return;

    const prayers = window.appState.prayerJournal;
    const answeredCount = prayers.filter(p => p.isAnswered).length;
    const activeCount = prayers.length - answeredCount;

    let filtered = prayers;
    if (this.currentTab === 'active') {
      filtered = prayers.filter(p => !p.isAnswered);
    } else if (this.currentTab === 'answered') {
      filtered = prayers.filter(p => p.isAnswered);
    }

    let html = `
      <div class="journal-view-header">
        <div>
          <div class="floral-badge">🙏 Personal Altar</div>
          <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.35rem;">Prayer Journal</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Pour out your heart before the Lord. Record your deepest petitions and celebrate His faithful answers.
          </p>
        </div>
        <button class="btn-primary" onclick="PrayerJournal.openAddModal()">
          + Write New Prayer
        </button>
      </div>

      <!-- Tabs and Summary Stats -->
      <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div class="fav-filter-chips" style="margin-bottom: 0;">
          <button class="chip-btn ${this.currentTab === 'all' ? 'active' : ''}" onclick="PrayerJournal.setTab('all')">
            All Prayers (${prayers.length})
          </button>
          <button class="chip-btn ${this.currentTab === 'active' ? 'active' : ''}" onclick="PrayerJournal.setTab('active')">
            Active Petitions (${activeCount})
          </button>
          <button class="chip-btn ${this.currentTab === 'answered' ? 'active' : ''}" onclick="PrayerJournal.setTab('answered')">
            Answered Prayers (${answeredCount} 🎉)
          </button>
        </div>
      </div>

      <!-- Prayer Timeline / Cards -->
      <div class="journal-timeline">
    `;

    if (filtered.length === 0) {
      html += `
        <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-card);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🙏</div>
          <h3 style="margin-bottom: 0.5rem;">Your Prayer Journal Is Empty</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">
            ${this.currentTab === 'all' 
              ? 'Begin writing your personal prayers, family needs, and grateful praises today.' 
              : 'No prayers found in this category.'}
          </p>
          <button class="btn-primary" onclick="PrayerJournal.openAddModal()">
            + Write Your First Prayer
          </button>
        </div>
      `;
    } else {
      filtered.forEach(p => {
        html += `
          <div class="journal-card ${p.isAnswered ? 'is-answered' : ''}">
            <div class="journal-card-header">
              <div style="display:flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="journal-card-title">${this.escapeHTML(p.title)}</span>
                <span class="theme-pill-tag">${this.escapeHTML(p.tag || 'Personal')}</span>
                ${p.isAnswered ? '<span class="theme-pill-tag" style="background:var(--completed-bg); color:var(--completed-color);">Answered by God ✓</span>' : ''}
              </div>
              <div class="journal-date-tag">
                ${p.date} ${p.isAnswered && p.answeredDate ? `• Answered on ${p.answeredDate}` : ''}
              </div>
            </div>

            <p style="font-size: 1.02rem; line-height: 1.7; color: var(--text-main); white-space: pre-line; margin-bottom: 1.25rem;">
              ${this.escapeHTML(p.content)}
            </p>

            <div style="display:flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <button class="btn-pill" style="font-size: 0.82rem; padding: 0.35rem 0.85rem;" onclick="PrayerJournal.toggleAnswered('${p.id}')">
                ${p.isAnswered ? 'Mark as Active' : 'Mark as Answered! 🎉'}
              </button>
              <div style="display:flex; gap: 0.5rem;">
                <button class="btn-pill" style="font-size: 0.8rem;" onclick="PrayerJournal.openEditModal('${p.id}')">Edit</button>
                <button class="btn-pill" style="font-size: 0.8rem; color: #D94F6E;" onclick="PrayerJournal.deletePrayer('${p.id}')">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  openAddModal() {
    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Write a Sincere Prayer 🙏</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Prayer Title or Subject:</label>
        <input type="text" id="prayer-input-title" class="form-input" placeholder="e.g. Guidance for the Family, Healing, Daily Thanks..." />
      </div>
      <div class="form-group">
        <label class="form-label">Category / Tag:</label>
        <select id="prayer-input-tag" class="form-select">
          <option value="Personal">Personal Petition</option>
          <option value="Family & Partner">Family & Partner</option>
          <option value="Gratitude">Gratitude & Praise</option>
          <option value="Healing">Health & Healing</option>
          <option value="Guidance">Guidance & Wisdom</option>
          <option value="Devotional Prayer">Devotional Scripture Prayer</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Your Prayer to the Lord:</label>
        <textarea id="prayer-input-content" class="form-textarea" rows="6" placeholder="Dear Heavenly Father..."></textarea>
      </div>
      <div style="display:flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
        <button class="btn-primary" onclick="PrayerJournal.submitNewPrayer()">Save to Journal</button>
      </div>
    `;
    App.openModal(modalContent);
  },

  submitNewPrayer() {
    const title = document.getElementById('prayer-input-title').value;
    const tag = document.getElementById('prayer-input-tag').value;
    const content = document.getElementById('prayer-input-content').value;

    if (!content.trim()) {
      alert('Please enter your prayer message.');
      return;
    }

    window.appState.addPrayer(title, content, tag);
    App.closeModal();
    App.showToast('Prayer saved to your journal! 🙏');
    this.render();
  },

  openEditModal(id) {
    const prayer = window.appState.prayerJournal.find(p => p.id === id);
    if (!prayer) return;

    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Edit Prayer</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Prayer Title:</label>
        <input type="text" id="edit-prayer-title" class="form-input" value="${this.escapeHTML(prayer.title)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Category / Tag:</label>
        <input type="text" id="edit-prayer-tag" class="form-input" value="${this.escapeHTML(prayer.tag)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Prayer Content:</label>
        <textarea id="edit-prayer-content" class="form-textarea" rows="6">${this.escapeHTML(prayer.content)}</textarea>
      </div>
      <div style="display:flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
        <button class="btn-primary" onclick="PrayerJournal.submitEdit('${id}')">Save Changes</button>
      </div>
    `;
    App.openModal(modalContent);
  },

  submitEdit(id) {
    const title = document.getElementById('edit-prayer-title').value;
    const tag = document.getElementById('edit-prayer-tag').value;
    const content = document.getElementById('edit-prayer-content').value;

    window.appState.updatePrayer(id, { title, tag, content });
    App.closeModal();
    App.showToast('Prayer updated.');
    this.render();
  },

  toggleAnswered(id) {
    window.appState.togglePrayerAnswered(id);
    App.showToast('Updated prayer status! 🎉');
    this.render();
  },

  deletePrayer(id) {
    if (confirm('Are you sure you want to delete this prayer entry?')) {
      window.appState.deletePrayer(id);
      App.showToast('Prayer entry deleted.');
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

window.PrayerJournal = PrayerJournal;

