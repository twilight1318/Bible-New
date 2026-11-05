// ==========================================================================
// 366 DAYS WITH GOD - Daily Reading Page Module
// Renders the exact 8-part daily structure & handles interactive actions
// ==========================================================================

const DailyReading = {
  currentDay: 1,

  render(dayNumber) {
    if (!window.BIBLE_DEVOTIONALS || !window.BIBLE_DEVOTIONALS.length) {
      console.error('Bible devotionals database not loaded.');
      return;
    }

    dayNumber = Math.max(1, Math.min(366, parseInt(dayNumber) || 1));
    this.currentDay = dayNumber;
    window.appState.setLastReadDay(dayNumber);

    const entry = window.BIBLE_DEVOTIONALS[dayNumber - 1];
    if (!entry) return;

    const container = document.getElementById('daily-reading-view');
    if (!container) return;

    const isCompleted = window.appState.isCompleted(dayNumber);
    const isFavourite = window.appState.isFavourite(dayNumber);
    const customNote = window.appState.getCustomNote(dayNumber);
    const reflectionText = window.appState.getDailyReflection(dayNumber);
    const partnerName = window.appState.settings.partnerName;
    const creatorName = window.appState.settings.creatorName;

    const formattedDayNum = String(entry.day).padStart(3, '0');
    const isDay366 = entry.day === 366;

    let html = `
      <div class="daily-container">
        <!-- Daily Reading Toolbar -->
        <div class="daily-toolbar">
          <div class="toolbar-group">
            <button class="btn-pill" onclick="App.navigateTo('calendar')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Calendar</span>
            </button>
            <button class="btn-pill completed-btn ${isCompleted ? 'is-completed' : ''}" id="btn-toggle-completed" onclick="DailyReading.toggleCompleted()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span id="label-completed">${isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
            </button>
            <button class="btn-pill fav-btn ${isFavourite ? 'is-fav' : ''}" id="btn-toggle-fav" onclick="DailyReading.toggleFavourite()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavourite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span id="label-fav">${isFavourite ? 'Favourited' : 'Add to Favourites'}</span>
            </button>
          </div>

          <div class="toolbar-group">
            <button class="btn-pill" onclick="DailyReading.copyVerse()" title="Copy Bible Verse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
            </button>
            <button class="btn-pill" onclick="DailyReading.shareVerse()" title="Share Verse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              <span>Share</span>
            </button>
            <button class="btn-pill" onclick="DailyReading.printPage()" title="Print / Download PDF of this page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        <!-- Main Daily Article -->
        <article class="daily-article" id="printable-daily-page">
          ${isDay366 ? `
            <div class="day-366-celebration">
              <div class="floral-badge">🕊️ Final Milestone · Day 366 🕊️</div>
              <h2 class="celebration-title">366 DAYS OF FAITH – OUR JOURNEY CONTINUES</h2>
              <p style="font-family: var(--font-quote); font-size: 1.25rem; font-style: italic; color: var(--text-secondary); max-width: 650px; margin: 0 auto;">
                "One Year of Grace. 366 Days of Walking with God. A Lifetime of Faith and Love."
              </p>
            </div>
          ` : ''}

          <!-- Daily Header -->
          <header class="daily-header">
            <div class="daily-day-label">DAY ${formattedDayNum}</div>
            <h1 class="daily-main-title">${this.escapeHTML(entry.dailyTitle)}</h1>
            <div class="daily-date-theme">
              <span>Date: ${entry.dateString}</span>
              <span>•</span>
              <span class="theme-pill-tag">${this.escapeHTML(entry.theme)}</span>
            </div>
          </header>

          <!-- 1. TODAY'S BIBLE VERSE -->
          <div class="section-tagline">TODAY'S BIBLE VERSE</div>
          <div class="verse-highlight-card">
            <div class="verse-text-body">"${this.escapeHTML(entry.text)}"</div>
            <div class="verse-ref-footer">
              <span class="verse-kjv-tag">KING JAMES VERSION (KJV)</span>
              <span class="verse-ref-text">${this.escapeHTML(entry.reference)}</span>
            </div>
          </div>

          <!-- 2. UNDERSTANDING THE VERSE -->
          <div class="section-tagline">UNDERSTANDING THE VERSE</div>
          <div class="understanding-section">
            <p>${this.escapeHTML(entry.explanation)}</p>
          </div>

          <!-- 3. TODAY'S DEVOTIONAL -->
          <div class="section-tagline">TODAY'S DEVOTIONAL</div>
          <div class="devotional-section">
            <p class="devotional-text">${this.escapeHTML(entry.devotional)}</p>
          </div>

          <!-- 4. TODAY'S PRAYER -->
          <div class="section-tagline">TODAY'S PRAYER</div>
          <div class="prayer-card">
            <p class="prayer-text">"${this.escapeHTML(entry.prayer)}"</p>
            <div style="text-align: right; font-size: 0.85rem; color: var(--text-muted);">
              <button class="btn-pill" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;" onclick="DailyReading.saveAsPersonalPrayer('${this.escapeQuotes(entry.prayer)}', '${entry.reference}')">
                Save to My Prayer Journal
              </button>
            </div>
          </div>

          <!-- 5. REFLECT ON THIS -->
          <div class="section-tagline">REFLECT ON THIS</div>
          <div class="reflection-section">
            <p class="reflection-question">${this.escapeHTML(entry.reflection)}</p>
            <textarea 
              class="reflection-textarea" 
              id="daily-reflection-input" 
              placeholder="Write your personal thoughts, quiet prayers, or reflections here..."
              oninput="DailyReading.handleReflectionInput(this.value)"
            >${this.escapeHTML(reflectionText)}</textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--text-muted);">
              <span id="reflection-save-status">${reflectionText ? 'Saved to Personal Journal ✓' : 'Auto-saves as you type'}</span>
              <button class="btn-pill" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;" onclick="App.navigateTo('personal-journal')">
                View My Journal
              </button>
            </div>
          </div>

          <!-- 6. TODAY'S FAITH ACTION -->
          <div class="section-tagline">TODAY'S FAITH ACTION</div>
          <div class="action-section">
            <p class="action-text">🌱 <strong>Today's Practice:</strong> ${this.escapeHTML(entry.action)}</p>
          </div>

          <!-- 7. A NOTE FROM ME ❤️ -->
          <div class="section-tagline">A NOTE FROM ME ❤️</div>
          <div class="creator-note-section">
            <div class="note-header">
              <div class="note-title">For ${this.escapeHTML(partnerName)} ❤️</div>
              <button class="btn-edit-note" onclick="DailyReading.openEditNoteModal(${dayNumber})">Edit Note ✎</button>
            </div>
            <div class="note-content-display" id="note-display-${dayNumber}">
              ${this.escapeHTML(customNote)}
            </div>
            <div class="note-author-sig">— With all my love & prayers, ${this.escapeHTML(creatorName)}</div>
          </div>

          <!-- Navigation Controls (Bottom) -->
          <div class="daily-bottom-nav">
            <button class="btn-secondary" onclick="DailyReading.navigatePrevious()" ${dayNumber === 1 ? 'disabled style="opacity:0.4; cursor:default;"' : ''}>
              ← Previous Day
            </button>
            <button class="btn-pill" onclick="App.navigateTo('calendar')">
              Return to 366-Day Calendar
            </button>
            <button class="btn-primary" onclick="DailyReading.navigateNext()" ${dayNumber === 366 ? 'disabled style="opacity:0.4; cursor:default;"' : ''}>
              Next Day →
            </button>
          </div>
        </article>
      </div>
    `;

    container.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  toggleCompleted() {
    const isNow = window.appState.toggleCompleted(this.currentDay);
    const btn = document.getElementById('btn-toggle-completed');
    const label = document.getElementById('label-completed');
    if (btn && label) {
      if (isNow) {
        btn.classList.add('is-completed');
        label.textContent = 'Completed ✓';
        App.showToast(`Day ${this.currentDay} marked as completed! 🎉`);
      } else {
        btn.classList.remove('is-completed');
        label.textContent = 'Mark as Completed';
        App.showToast(`Day ${this.currentDay} marked incomplete.`);
      }
    }
    // Update dashboard & calendar if loaded
    if (window.Dashboard) Dashboard.updateStats();
  },

  toggleFavourite() {
    const isNow = window.appState.toggleFavourite(this.currentDay);
    const btn = document.getElementById('btn-toggle-fav');
    const label = document.getElementById('label-fav');
    if (btn && label) {
      if (isNow) {
        btn.classList.add('is-fav');
        label.textContent = 'Favourited';
        App.showToast(`Day ${this.currentDay} added to Favourite Verses! ★`);
      } else {
        btn.classList.remove('is-fav');
        label.textContent = 'Add to Favourites';
        App.showToast(`Day ${this.currentDay} removed from Favourites.`);
      }
    }
    if (window.Dashboard) Dashboard.updateStats();
  },

  copyVerse() {
    const entry = window.BIBLE_DEVOTIONALS[this.currentDay - 1];
    if (!entry) return;
    const textToCopy = `"${entry.text}" — ${entry.reference} (KJV)\n(366 Days With God)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      App.showToast('Bible verse copied to clipboard! 📋');
    }).catch(() => {
      App.showToast('Unable to copy automatically.');
    });
  },

  shareVerse() {
    const entry = window.BIBLE_DEVOTIONALS[this.currentDay - 1];
    if (!entry) return;
    const shareData = {
      title: `Day ${entry.day}: ${entry.dailyTitle}`,
      text: `"${entry.text}" — ${entry.reference} (KJV)\n\nFrom 366 Days With God ❤️`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      this.copyVerse();
    }
  },

  handleReflectionInput(val) {
    window.appState.saveDailyReflection(this.currentDay, val);
    const status = document.getElementById('reflection-save-status');
    if (status) {
      status.textContent = val.trim() ? 'Saved to Personal Journal ✓' : 'Auto-saves as you type';
    }
  },

  saveAsPersonalPrayer(prayerText, ref) {
    window.appState.addPrayer(`Prayer from Day ${this.currentDay} (${ref})`, prayerText, 'Devotional Prayer');
    App.showToast('Prayer saved to your Prayer Journal! 🙏');
  },

  openEditNoteModal(dayNumber) {
    const currentNote = window.appState.getCustomNote(dayNumber);
    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Edit Note for Day ${dayNumber} ❤️</h3>
        <button class="btn-close-modal" onclick="App.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Personal Message from ${this.escapeHTML(window.appState.settings.creatorName)}:</label>
        <textarea id="edit-custom-note-textarea" class="form-textarea" rows="6">${this.escapeHTML(currentNote)}</textarea>
      </div>
      <div style="display:flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
        <button class="btn-primary" onclick="DailyReading.saveCustomNote(${dayNumber})">Save Note</button>
      </div>
    `;
    App.openModal(modalContent);
  },

  saveCustomNote(dayNumber) {
    const textarea = document.getElementById('edit-custom-note-textarea');
    if (!textarea) return;
    window.appState.setCustomNote(dayNumber, textarea.value);
    const display = document.getElementById(`note-display-${dayNumber}`);
    if (display) {
      display.textContent = textarea.value;
    }
    App.closeModal();
    App.showToast('Personal note updated! ❤️');
  },

  navigatePrevious() {
    if (this.currentDay > 1) {
      this.render(this.currentDay - 1);
    }
  },

  navigateNext() {
    if (this.currentDay < 366) {
      this.render(this.currentDay + 1);
    }
  },

  printPage() {
    // Generate PDF for this specific day or print
    if (window.PdfGenerator) {
      PdfGenerator.generateSingleDay(this.currentDay);
    } else {
      window.print();
    }
  },

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  escapeQuotes(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
  }
};

window.DailyReading = DailyReading;

