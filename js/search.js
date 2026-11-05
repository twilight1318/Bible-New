// ==========================================================================
// 366 DAYS WITH GOD - Universal Search Module
// Searches by Bible book, reference, theme, keyword, or day number
// ==========================================================================

const Search = {
  lastQuery: '',

  renderView() {
    const container = document.getElementById('search-view');
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="floral-badge">🔍 Scripture Finder</div>
          <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.5rem;">Search 366 Devotionals</h1>
          <p style="color: var(--text-secondary); font-size: 0.98rem; max-width: 600px; margin: 0 auto 1.5rem;">
            Search all 366 daily readings by Bible book, chapter & verse, monthly theme, spiritual keyword, or day number.
          </p>

          <div style="position: relative; max-width: 560px; margin: 0 auto 1.25rem;">
            <input 
              type="text" 
              id="global-search-input" 
              class="form-input" 
              placeholder="e.g. Psalms, Romans 8, Grace, Peace, Day 100..." 
              value="${this.escapeHTML(this.lastQuery)}"
              oninput="Search.performSearch(this.value)"
              style="padding: 1rem 1.5rem; font-size: 1.05rem; border-radius: var(--radius-full); box-shadow: var(--shadow-sm);"
              autofocus
            />
          </div>

          <!-- Quick Search Pill Suggestions -->
          <div style="display:flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-pill" onclick="Search.setQuery('Peace')">Peace</button>
            <button class="btn-pill" onclick="Search.setQuery('Strength')">Strength</button>
            <button class="btn-pill" onclick="Search.setQuery('Love')">Love</button>
            <button class="btn-pill" onclick="Search.setQuery('Psalms')">Psalms</button>
            <button class="btn-pill" onclick="Search.setQuery('Grace')">Grace</button>
            <button class="btn-pill" onclick="Search.setQuery('Day 366')">Day 366</button>
          </div>
        </div>

        <div id="search-results-stats" style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-muted);"></div>
        <div id="search-results-container" class="journal-timeline"></div>
      </div>
    `;

    if (this.lastQuery) {
      this.performSearch(this.lastQuery);
    }
  },

  setQuery(q) {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.value = q;
      input.focus();
    }
    this.performSearch(q);
  },

  performSearch(query) {
    this.lastQuery = query;
    const statsEl = document.getElementById('search-results-stats');
    const container = document.getElementById('search-results-container');
    if (!container || !window.BIBLE_DEVOTIONALS) return;

    query = query.trim().toLowerCase();
    if (!query) {
      if (statsEl) statsEl.textContent = '';
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          Type any keyword, Bible book, or verse to search across all 366 daily readings.
        </div>
      `;
      return;
    }

    // Check if query is day number e.g. "day 45" or "45"
    let targetDay = null;
    const dayMatch = query.match(/^(?:day\s*)?(\d{1,3})$/);
    if (dayMatch) {
      const num = parseInt(dayMatch[1]);
      if (num >= 1 && num <= 366) targetDay = num;
    }

    const results = window.BIBLE_DEVOTIONALS.filter(entry => {
      if (targetDay && entry.day === targetDay) return true;
      if (entry.book.toLowerCase().includes(query)) return true;
      if (entry.reference.toLowerCase().includes(query)) return true;
      if (entry.dailyTitle.toLowerCase().includes(query)) return true;
      if (entry.theme.toLowerCase().includes(query)) return true;
      if (entry.text.toLowerCase().includes(query)) return true;
      if (entry.explanation.toLowerCase().includes(query)) return true;
      if (entry.devotional.toLowerCase().includes(query)) return true;
      return false;
    });

    if (statsEl) {
      statsEl.textContent = `Found ${results.length} daily devotionals matching "${this.escapeHTML(query)}"`;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-card);">
          <h3 style="margin-bottom: 0.5rem;">No Devotionals Found</h3>
          <p style="color: var(--text-muted);">Try a different keyword, Bible book name, or day number.</p>
        </div>
      `;
      return;
    }

    let html = '';
    // Limit rendered results to top 50 for performance
    results.slice(0, 50).forEach(entry => {
      html += `
        <div class="journal-card" style="cursor:pointer;" onclick="App.navigateToDaily(${entry.day})">
          <div class="journal-card-header">
            <div style="display:flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="day-badge">DAY ${String(entry.day).padStart(3, '0')}</span>
              <span style="font-weight: 700; font-size: 1.1rem;">${this.highlightMatch(entry.dailyTitle, query)}</span>
            </div>
            <div class="journal-date-tag">${entry.dateString} • ${entry.reference}</div>
          </div>

          <p style="font-family: var(--font-quote); font-size: 1.15rem; font-style: italic; color: var(--text-verse); line-height: 1.6; margin-bottom: 0.75rem;">
            "${this.highlightMatch(entry.text, query)}"
          </p>

          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            ${this.highlightMatch(entry.devotional.substring(0, 180), query)}...
          </p>

          <div style="display:flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.6rem;">
            <span class="theme-pill-tag">${entry.theme}</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-primary);">Read Day ${entry.day} →</span>
          </div>
        </div>
      `;
    });

    if (results.length > 50) {
      html += `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.88rem;">
          Showing top 50 of ${results.length} results. Please narrow your search query.
        </div>
      `;
    }

    container.innerHTML = html;
  },

  highlightMatch(text, query) {
    if (!query || !text) return this.escapeHTML(text);
    const escapedText = this.escapeHTML(text);
    const escapedQuery = this.escapeHTML(query);
    const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapedText.replace(regex, '<mark style="background:var(--gold-light); color:var(--text-main); padding: 0 3px; border-radius: 3px;">$1</mark>');
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

window.Search = Search;

