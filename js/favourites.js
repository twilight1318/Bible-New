// ==========================================================================
// 366 DAYS WITH GOD - My Favourite Verses Module
// ==========================================================================

const Favourites = {
  currentFilter: 'All',
  searchQuery: '',

  render() {
    const container = document.getElementById('favourites-view');
    if (!container || !window.BIBLE_DEVOTIONALS) return;

    const favDayNumbers = Array.from(window.appState.favouriteDays);
    const categories = ['All', 'Guidance', 'Love', 'Faith', 'Grace', 'Patience', 'Prayer', 'Strength', 'Blessings', 'Hope', 'Peace', 'Faithfulness'];

    let html = `
      <div class="favorites-view-header">
        <div class="floral-badge">★ Sacred Collection</div>
        <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.5rem;">My Favourite Verses</h1>
        <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto 1.5rem;">
          Your personal sanctuary of cherished scriptures. Saved for quiet meditation, comfort, and daily encouragement.
        </p>

        <!-- Search Bar within Favourites -->
        <div style="max-width: 480px; margin: 0 auto 1.5rem;">
          <input 
            type="text" 
            class="form-input" 
            placeholder="Search saved favourite verses or references..." 
            value="${this.escapeHTML(this.searchQuery)}"
            oninput="Favourites.handleSearch(this.value)"
            style="border-radius: var(--radius-full); padding: 0.75rem 1.25rem;"
          />
        </div>

        <!-- Filter Chips -->
        <div class="fav-filter-chips">
    `;

    categories.forEach(cat => {
      const activeClass = this.currentFilter === cat ? 'active' : '';
      html += `
        <button class="chip-btn ${activeClass}" onclick="Favourites.setFilter('${cat}')">${cat}</button>
      `;
    });

    html += `
        </div>
      </div>
      <div class="favorites-grid" id="fav-cards-grid">
    `;

    const filteredDays = favDayNumbers.filter(dayNum => {
      const entry = window.BIBLE_DEVOTIONALS[dayNum - 1];
      if (!entry) return false;

      // Category check
      if (this.currentFilter !== 'All') {
        const matchesTheme = entry.theme.toLowerCase().includes(this.currentFilter.toLowerCase());
        const tag = window.appState.getFavouriteTag(dayNum);
        const matchesTag = tag.toLowerCase() === this.currentFilter.toLowerCase();
        if (!matchesTheme && !matchesTag) return false;
      }

      // Search query check
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchesText = entry.text.toLowerCase().includes(q);
        const matchesRef = entry.reference.toLowerCase().includes(q);
        const matchesTitle = entry.dailyTitle.toLowerCase().includes(q);
        if (!matchesText && !matchesRef && !matchesTitle) return false;
      }

      return true;
    });

    if (filteredDays.length === 0) {
      html += `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-card);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem; color: var(--gold-primary);">★</div>
          <h3 style="margin-bottom: 0.5rem;">No Favourite Verses Found</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">
            ${this.searchQuery || this.currentFilter !== 'All' 
              ? 'No saved verses match your current filter or search.' 
              : 'You have not saved any favourite verses yet. While reading your daily devotional, tap "Add to Favourites" to build your personal treasury!'}
          </p>
          <button class="btn-primary" onclick="App.navigateTo('dashboard')">
            Browse Today's Reading →
          </button>
        </div>
      `;
    } else {
      filteredDays.forEach(dayNum => {
        const entry = window.BIBLE_DEVOTIONALS[dayNum - 1];
        html += `
          <div class="fav-card">
            <div>
              <div style="display:flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                <span class="day-badge">DAY ${String(entry.day).padStart(3, '0')}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${entry.dateString}</span>
              </div>
              <h4 style="font-size: 1.15rem; margin-bottom: 1rem;">${this.escapeHTML(entry.dailyTitle)}</h4>
              <p style="font-family: var(--font-quote); font-size: 1.18rem; font-style: italic; color: var(--text-verse); line-height: 1.6; margin-bottom: 1rem;">
                "${this.escapeHTML(entry.text)}"
              </p>
              <div style="font-family: var(--font-serif); font-size: 0.98rem; font-weight: 700; color: var(--text-gold); margin-bottom: 1.25rem;">
                — ${this.escapeHTML(entry.reference)} (KJV)
              </div>
            </div>

            <div style="display:flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <button class="btn-pill" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;" onclick="App.navigateToDaily(${entry.day})">
                Open Day ${entry.day} →
              </button>
              <div style="display:flex; gap: 0.35rem;">
                <button class="icon-btn" style="width: 32px; height: 32px; font-size: 0.85rem;" onclick="DailyReading.copyVerseDirect(${entry.day})" title="Copy verse">
                  📋
                </button>
                <button class="icon-btn" style="width: 32px; height: 32px; font-size: 0.85rem; color: var(--fav-color);" onclick="Favourites.removeFavourite(${entry.day})" title="Remove from favourites">
                  ✕
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  setFilter(category) {
    this.currentFilter = category;
    this.render();
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.render();
  },

  removeFavourite(dayNumber) {
    window.appState.toggleFavourite(dayNumber);
    App.showToast(`Removed Day ${dayNumber} from Favourites.`);
    this.render();
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

window.Favourites = Favourites;

