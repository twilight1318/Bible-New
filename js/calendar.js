// ==========================================================================
// 366 DAYS WITH GOD - 366-Day Calendar Experience
// ==========================================================================

const Calendar = {
  render() {
    const container = document.getElementById('calendar-view');
    if (!container || !window.BIBLE_DEVOTIONALS) return;

    const completedCount = window.appState.getCompletedCount();
    const percent = window.appState.getCompletionPercentage();
    const currentLastDay = window.appState.lastReadDay;

    const monthsConfig = [
      { name: 'January', startDay: 1, daysCount: 31, theme: "New Beginnings and God's Guidance" },
      { name: 'February', startDay: 32, daysCount: 29, theme: "Love and Kindness" },
      { name: 'March', startDay: 61, daysCount: 31, theme: "Faith and Trust" },
      { name: 'April', startDay: 92, daysCount: 30, theme: "Forgiveness and Grace" },
      { name: 'May', startDay: 122, daysCount: 31, theme: "Patience and Understanding" },
      { name: 'June', startDay: 153, daysCount: 30, theme: "Prayer and Relationship with God" },
      { name: 'July', startDay: 183, daysCount: 31, theme: "Strength and Courage" },
      { name: 'August', startDay: 214, daysCount: 31, theme: "Gratitude and Blessings" },
      { name: 'September', startDay: 245, daysCount: 30, theme: "Hope and God's Promises" },
      { name: 'October', startDay: 275, daysCount: 31, theme: "Peace and Wisdom" },
      { name: 'November', startDay: 306, daysCount: 30, theme: "God's Faithfulness" },
      { name: 'December', startDay: 336, daysCount: 31, theme: "Thankfulness and Reflection" },
    ];

    let html = `
      <div class="calendar-view-header">
        <div class="floral-badge">🕊️ A Year with Scripture</div>
        <h1 style="font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 0.5rem;">366-Day Devotional Calendar</h1>
        <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto 1.5rem;">
          366 Days organized into 12 monthly spiritual themes. Select any day to open its devotional reading.
        </p>

        <!-- Progress Overview -->
        <div style="max-width: 500px; margin: 0 auto 1.5rem;" class="progress-widget">
          <div class="progress-header">
            <span class="progress-label">Total Reading Progress</span>
            <span class="progress-percentage">${percent}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="progress-stats">
            <span>${completedCount} of 366 Days Read</span>
            <span>${366 - completedCount} Days Remaining</span>
          </div>
        </div>

        <div class="calendar-controls">
          <button class="btn-primary" onclick="App.navigateToDaily(${currentLastDay})">
            Resume Reading (Day ${currentLastDay}) →
          </button>
          <button class="btn-gold" onclick="App.navigateToDaily(366)">
            ✨ Open Special Day 366
          </button>
        </div>
      </div>

      <div class="calendar-months-container">
    `;

    monthsConfig.forEach((m) => {
      html += `
        <div class="month-card">
          <div class="month-header">
            <div>
              <div class="month-name font-serif">${m.name}</div>
              <div class="month-theme-label">Theme: ${m.theme}</div>
            </div>
            <button class="btn-pill" style="font-size: 0.78rem;" onclick="PdfGenerator.generateMonth('${m.name}')">
              Download ${m.name} PDF
            </button>
          </div>

          <div class="days-grid">
      `;

      for (let i = 0; i < m.daysCount; i++) {
        const dayNumber = m.startDay + i;
        const entry = window.BIBLE_DEVOTIONALS[dayNumber - 1];
        if (!entry) continue;

        const isCompleted = window.appState.isCompleted(dayNumber);
        const isFav = window.appState.isFavourite(dayNumber);
        const isCurrent = dayNumber === currentLastDay;
        const isSpecial366 = dayNumber === 366;

        let classes = ['day-cell'];
        if (isCompleted) classes.push('is-completed');
        if (isFav) classes.push('is-fav');
        if (isCurrent) classes.push('is-today');

        const titleAttr = `Day ${dayNumber}: ${entry.dateString} - ${entry.reference}`;

        html += `
          <div class="${classes.join(' ')}" onclick="App.navigateToDaily(${dayNumber})" title="${titleAttr}">
            <span class="cell-day-num">${isSpecial366 ? '✨' : dayNumber}</span>
            <span class="cell-date-num">${i + 1}</span>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }
};

window.Calendar = Calendar;

