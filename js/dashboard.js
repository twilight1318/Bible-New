// ==========================================================================
// 366 DAYS WITH GOD - Dashboard Module
// ==========================================================================

const Dashboard = {
  render() {
    const container = document.getElementById('dashboard-view');
    if (!container || !window.BIBLE_DEVOTIONALS) return;

    const lastDay = window.appState.lastReadDay || 1;
    const todayEntry = window.BIBLE_DEVOTIONALS[lastDay - 1] || window.BIBLE_DEVOTIONALS[0];
    const partnerName = window.appState.settings.partnerName;
    const completedCount = window.appState.getCompletedCount();
    const percent = window.appState.getCompletionPercentage();
    const favCount = window.appState.favouriteDays.size;
    const prayersCount = window.appState.prayerJournal.length;
    const journalCount = window.appState.personalJournal.length;

    // Calculate streak
    let streak = 0;
    for (let d = lastDay; d >= 1; d--) {
      if (window.appState.isCompleted(d)) streak++;
      else break;
    }

    container.innerHTML = `
      <div class="dashboard-grid">
        <!-- Hero Section: Greeting & Progress Widget -->
        <div class="dashboard-hero">
          <div class="hero-greeting">
            <div class="floral-badge">🕊️ Daily Walk of Grace</div>
            <h2>Peace to You, ${this.escapeHTML(partnerName)} ❤️</h2>
            <div class="hero-theme-badge">Current Theme: ${this.escapeHTML(todayEntry.theme)}</div>
            <p style="color: var(--text-secondary); font-size: 0.98rem; margin-bottom: 1.5rem;">
              May God's word be your lamp, shield, and daily companion throughout this sacred year.
            </p>
            <div style="display:flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-primary" onclick="App.navigateToDaily(${lastDay})">
                Continue Reading (Day ${lastDay}) →
              </button>
              <button class="btn-secondary" onclick="App.openRandomVerseModal()">
                🎲 Random Verse
              </button>
            </div>
          </div>

          <div class="progress-widget">
            <div class="progress-header">
              <span class="progress-label">Reading Journey</span>
              <span class="progress-percentage" id="dash-progress-percent">${percent}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="dash-progress-fill" style="width: ${percent}%;"></div>
            </div>
            <div class="progress-stats">
              <span>Day ${lastDay} of 366</span>
              <span id="dash-completed-stat">${completedCount} Completed</span>
              <span>🔥 ${streak} Day Streak</span>
            </div>
          </div>
        </div>

        <!-- Today's Highlighted Devotional Card -->
        <div class="today-devotional-card">
          <div class="card-top-meta">
            <span class="day-badge">DAY ${String(todayEntry.day).padStart(3, '0')}</span>
            <span class="date-text">${todayEntry.dateString}</span>
          </div>
          <h3 style="font-size: 1.6rem; margin-bottom: 1.25rem;">${this.escapeHTML(todayEntry.dailyTitle)}</h3>

          <div class="today-verse-box">
            <p class="verse-quotation">"${this.escapeHTML(todayEntry.text)}"</p>
            <div class="verse-reference">${this.escapeHTML(todayEntry.reference)} (KJV)</div>
          </div>

          <p class="today-preview-text">
            ${this.escapeHTML(todayEntry.devotional.substring(0, 240))}...
          </p>

          <div style="display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <button class="btn-primary" onclick="App.navigateToDaily(${todayEntry.day})">
              Open Full Devotional & Prayer →
            </button>
            <div style="display:flex; gap: 0.5rem;">
              <button class="btn-pill" onclick="DailyReading.copyVerseDirect(${todayEntry.day})">Copy Verse</button>
              <button class="btn-pill" onclick="App.navigateTo('calendar')">Browse 366 Days</button>
            </div>
          </div>
        </div>

        <!-- Feature Tiles Grid -->
        <div class="dashboard-features-grid">
          <div class="feature-tile" onclick="App.navigateTo('calendar')">
            <div>
              <div class="tile-icon gold">📅</div>
              <div class="tile-title">366-Day Calendar</div>
              <div class="tile-desc">Explore all 12 monthly themes, leap-year readings, and complete yearly schedule.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--gold-primary); font-size: 0.85rem;">Open Calendar →</div>
          </div>

          <div class="feature-tile" onclick="App.navigateTo('favourites')">
            <div>
              <div class="tile-icon rose">★</div>
              <div class="tile-title">My Favourites</div>
              <div class="tile-desc">${favCount} precious Bible verses saved and categorized for quiet meditation.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--fav-color); font-size: 0.85rem;">View Favourites (${favCount}) →</div>
          </div>

          <div class="feature-tile" onclick="App.navigateTo('prayer-journal')">
            <div>
              <div class="tile-icon green">🙏</div>
              <div class="tile-title">Prayer Journal</div>
              <div class="tile-desc">Pour out your heart, record answered prayers, and celebrate God's faithfulness.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--completed-color); font-size: 0.85rem;">Open Journal (${prayersCount}) →</div>
          </div>

          <div class="feature-tile" onclick="App.navigateTo('personal-journal')">
            <div>
              <div class="tile-icon lavender">✍️</div>
              <div class="tile-title">Personal Reflections</div>
              <div class="tile-desc">Private daily reflections, questions answered, and personal spiritual notes.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--accent-primary); font-size: 0.85rem;">View Notes (${journalCount}) →</div>
          </div>

          <div class="feature-tile" onclick="App.navigateTo('special-messages')">
            <div>
              <div class="tile-icon rose">💌</div>
              <div class="tile-title">Special Occasions</div>
              <div class="tile-desc">Heartfelt personal letters for birthdays, anniversaries, Christmas, and milestones.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--accent-primary); font-size: 0.85rem;">Read Letters →</div>
          </div>

          <div class="feature-tile" onclick="App.openPdfModal()">
            <div>
              <div class="tile-icon gold">📖</div>
              <div class="tile-title">Printable PDF Book</div>
              <div class="tile-desc">Download individual days, monthly chapters, or the complete 366-day devotional book.</div>
            </div>
            <div style="margin-top: 1rem; font-weight:600; color:var(--gold-primary); font-size: 0.85rem;">Download PDF →</div>
          </div>
        </div>
      </div>
    `;
  },

  updateStats() {
    const percent = window.appState.getCompletionPercentage();
    const count = window.appState.getCompletedCount();
    const percentEl = document.getElementById('dash-progress-percent');
    const fillEl = document.getElementById('dash-progress-fill');
    const statEl = document.getElementById('dash-completed-stat');

    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;
    if (statEl) statEl.textContent = `${count} Completed`;
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

window.Dashboard = Dashboard;

