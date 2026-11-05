// ==========================================================================
// 366 DAYS WITH GOD - High-Quality PDF Generator Module
// Generates Single Day, Monthly Section, or Complete 366-Day Book using jsPDF
// ==========================================================================

const PdfGenerator = {
  getJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) {
      return window.jspdf.jsPDF;
    }
    if (window.jsPDF) {
      return window.jsPDF;
    }
    return null;
  },

  // Generate Single Daily Page
  generateSingleDay(dayNumber) {
    const jsPDF = this.getJsPDF();
    if (!jsPDF) {
      window.print();
      return;
    }

    const entry = window.BIBLE_DEVOTIONALS[dayNumber - 1];
    if (!entry) return;

    App.showToast(`Generating PDF for Day ${dayNumber}... 📄`);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    this.renderDailyPage(doc, entry, 1, 1);
    doc.save(`366-Days-With-God-Day-${String(dayNumber).padStart(3, '0')}.pdf`);
    App.showToast(`Day ${dayNumber} PDF downloaded! ✨`);
  },

  // Generate Monthly Section PDF
  generateMonth(monthName) {
    const jsPDF = this.getJsPDF();
    if (!jsPDF) {
      window.print();
      return;
    }

    const monthEntries = window.BIBLE_DEVOTIONALS.filter(e => e.month.toLowerCase() === monthName.toLowerCase());
    if (monthEntries.length === 0) return;

    App.showToast(`Generating ${monthName} Section PDF (${monthEntries.length} pages)... 📄`);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const theme = monthEntries[0].theme;

    // Monthly Intro Page
    this.renderMonthlyIntroPage(doc, monthName, theme, monthEntries.length, 1);

    // Each daily page
    monthEntries.forEach((entry, idx) => {
      doc.addPage();
      this.renderDailyPage(doc, entry, idx + 2, monthEntries.length + 1);
    });

    doc.save(`366-Days-With-God-${monthName}.pdf`);
    App.showToast(`${monthName} PDF downloaded! ✨`);
  },

  // Generate Complete 366-Day Devotional Book
  async generateCompleteBook() {
    const jsPDF = this.getJsPDF();
    if (!jsPDF) {
      window.print();
      return;
    }

    const statusModal = `
      <div class="modal-header">
        <h3 class="modal-title">Generating Complete 366-Day PDF Book 📖</h3>
      </div>
      <div style="text-align:center; padding: 2rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem; animation: pulse-heart 1.5s infinite;">⏳</div>
        <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;" id="pdf-progress-text">
          Preparing Cover & Dedication...
        </p>
        <div class="progress-bar-track" style="margin: 1.25rem 0;">
          <div class="progress-bar-fill" id="pdf-progress-fill" style="width: 2%;"></div>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Building all 366 daily pages with zero duplicate verses, 12 monthly sections, and closing celebration. Please wait a moment...
        </p>
      </div>
    `;
    App.openModal(statusModal);

    // Allow UI to update
    await new Promise(r => setTimeout(r, 100));

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const totalPagesEstimate = 1 + 1 + 2 + 12 + 366; // Cover, Dedication, TOC, 12 Monthly intros, 366 days
    let currentPage = 1;

    // 1. Cover Page
    this.renderCoverPage(doc);
    currentPage++;

    // 2. Dedication Page
    doc.addPage();
    this.renderDedicationPage(doc);
    currentPage++;

    // 3. Table of Contents
    doc.addPage();
    this.renderTableOfContents(doc);
    currentPage++;

    // 4. 12 Months & 366 Daily Pages
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const progressFill = document.getElementById('pdf-progress-fill');
    const progressText = document.getElementById('pdf-progress-text');

    for (let mIdx = 0; mIdx < months.length; mIdx++) {
      const mName = months[mIdx];
      const mEntries = window.BIBLE_DEVOTIONALS.filter(e => e.month === mName);
      if (mEntries.length === 0) continue;

      if (progressText) progressText.textContent = `Building ${mName} (${mEntries.length} days)...`;
      if (progressFill) progressFill.style.width = `${Math.round(((mIdx + 1) / months.length) * 95)}%`;

      await new Promise(r => setTimeout(r, 10));

      // Monthly Intro Page
      doc.addPage();
      this.renderMonthlyIntroPage(doc, mName, mEntries[0].theme, mEntries.length, currentPage);
      currentPage++;

      // Daily Pages
      for (let dIdx = 0; dIdx < mEntries.length; dIdx++) {
        doc.addPage();
        this.renderDailyPage(doc, mEntries[dIdx], currentPage, totalPagesEstimate);
        currentPage++;
      }
    }

    if (progressText) progressText.textContent = 'Finalizing and downloading PDF...';
    if (progressFill) progressFill.style.width = '100%';
    await new Promise(r => setTimeout(r, 200));

    doc.save('366-Days-With-God-Complete-Devotional-Book.pdf');
    App.closeModal();
    App.showToast('Complete 366-Day PDF Book Downloaded! 🎉📖');
  },

  // Helper: Render Cover Page
  renderCoverPage(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background fill
    doc.setFillColor(250, 247, 245);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Elegant Outer Gold Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(2.5);
    doc.rect(36, 36, pageWidth - 72, pageHeight - 72);

    // Inner Subtle Frame
    doc.setDrawColor(201, 122, 139);
    doc.setLineWidth(0.8);
    doc.rect(44, 44, pageWidth - 88, pageHeight - 88);

    // Header Badge
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(190, 115, 130);
    doc.text('A DAILY SPIRITUAL GIFT OF FAITH & LOVE', pageWidth / 2, 160, { align: 'center' });

    // Main Title
    doc.setFont('times', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(45, 37, 41);
    doc.text('366 DAYS WITH GOD', pageWidth / 2, 230, { align: 'center' });

    // Gold Divider line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.line(pageWidth / 2 - 80, 260, pageWidth / 2 + 80, 260);

    // Subtitle
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(107, 94, 101);
    doc.text('One Year. 366 Days. A Journey of Faith, Hope, Prayer and Love.', pageWidth / 2, 300, { align: 'center' });

    // Description
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(120, 110, 115);
    const desc = 'A little reminder every day that His love, grace and guidance are always with you.\nComplete collection of 366 unique King James Version Bible devotionals.';
    doc.text(desc, pageWidth / 2, 350, { align: 'center', lineHeightFactor: 1.5 });

    // Cross / Heart symbol
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(212, 175, 55);
    doc.text('✝', pageWidth / 2, 440, { align: 'center' });

    // Partner dedication at bottom
    const partner = window.appState.settings.partnerName;
    const creator = window.appState.settings.creatorName;
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(80, 70, 75);
    doc.text(`Prepared especially for: ${partner}`, pageWidth / 2, 650, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`With endless love from: ${creator}`, pageWidth / 2, 680, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(150, 140, 145);
    doc.text('King James Version (KJV) Scripture Readings', pageWidth / 2, 760, { align: 'center' });
  },

  // Helper: Render Dedication Page
  renderDedicationPage(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.rect(45, 45, pageWidth - 90, pageHeight - 90);

    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text('A GIFT MADE WITH FAITH AND LOVE', pageWidth / 2, 110, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(45, 37, 41);
    doc.text('To My Beloved,', 80, 170);

    const letter = window.appState.settings.dedicationLetter;
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(60, 50, 55);
    
    const splitLetter = doc.splitTextToSize(letter, pageWidth - 160);
    doc.text(splitLetter, 80, 220, { lineHeightFactor: 1.6 });

    const creator = window.appState.settings.creatorName;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(190, 115, 130);
    doc.text(`— ${creator}`, pageWidth - 100, pageHeight - 160, { align: 'right' });
  },

  // Helper: Render Table of Contents
  renderTableOfContents(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(45, 37, 41);
    doc.text('TABLE OF CONTENTS', pageWidth / 2, 90, { align: 'center' });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, 105, pageWidth / 2 + 60, 105);

    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(100, 90, 95);
    doc.text('12 Monthly Spiritual Themes Across 366 Days', pageWidth / 2, 130, { align: 'center' });

    const themes = [
      { month: 'January', theme: "New Beginnings and God's Guidance", days: 'Days 1 – 31' },
      { month: 'February', theme: 'Love and Kindness', days: 'Days 32 – 60' },
      { month: 'March', theme: 'Faith and Trust', days: 'Days 61 – 91' },
      { month: 'April', theme: 'Forgiveness and Grace', days: 'Days 92 – 121' },
      { month: 'May', theme: 'Patience and Understanding', days: 'Days 122 – 152' },
      { month: 'June', theme: 'Prayer and Relationship with God', days: 'Days 153 – 182' },
      { month: 'July', theme: 'Strength and Courage', days: 'Days 183 – 213' },
      { month: 'August', theme: 'Gratitude and Blessings', days: 'Days 214 – 244' },
      { month: 'September', theme: "Hope and God's Promises", days: 'Days 245 – 274' },
      { month: 'October', theme: 'Peace and Wisdom', days: 'Days 275 – 305' },
      { month: 'November', theme: "God's Faithfulness", days: 'Days 306 – 335' },
      { month: 'December', theme: 'Thankfulness and Reflection', days: 'Days 336 – 366' },
    ];

    let startY = 175;
    themes.forEach(t => {
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(45, 37, 41);
      doc.text(t.month, 80, startY);

      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(90, 80, 85);
      doc.text(`— ${t.theme}`, 160, startY);

      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(190, 115, 130);
      doc.text(t.days, pageWidth - 80, startY, { align: 'right' });

      doc.setDrawColor(230, 220, 215);
      doc.setLineWidth(0.5);
      doc.line(80, startY + 10, pageWidth - 80, startY + 10);

      startY += 45;
    });
  },

  // Helper: Render Monthly Introduction Page
  renderMonthlyIntroPage(doc, monthName, theme, dayCount, pageNum) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Soft warm background
    doc.setFillColor(250, 247, 245);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Gold Frame
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.rect(40, 40, pageWidth - 80, pageHeight - 80);

    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text('MONTHLY SPIRITUAL JOURNEY', pageWidth / 2, 220, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(45, 37, 41);
    doc.text(monthName.toUpperCase(), pageWidth / 2, 280, { align: 'center' });

    doc.setFont('times', 'italic');
    doc.setFontSize(18);
    doc.setTextColor(190, 115, 130);
    doc.text(`Theme: ${theme}`, pageWidth / 2, 330, { align: 'center' });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, 360, pageWidth / 2 + 60, 360);

    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(100, 90, 95);
    doc.text(`${dayCount} Daily Devotionals · Authentic King James Version`, pageWidth / 2, 400, { align: 'center' });

    // Page Number footer
    doc.setFontSize(10);
    doc.text(String(pageNum), pageWidth / 2, pageHeight - 55, { align: 'center' });
  },

  // Helper: Render Exact 8-Section Daily Page on PDF
  renderDailyPage(doc, entry, pageNum, totalPages) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 54;
    const contentWidth = pageWidth - (marginX * 2);

    // Clean white page with subtle top gold rule
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(2);
    doc.line(marginX, 36, pageWidth - marginX, 36);

    let currentY = 56;

    // Header: DAY 001 | Date | Theme
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(190, 115, 130);
    doc.text(`DAY ${String(entry.day).padStart(3, '0')}  •  ${entry.dateString.toUpperCase()}`, marginX, currentY);

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(120, 110, 115);
    doc.text(entry.theme, pageWidth - marginX, currentY, { align: 'right' });

    currentY += 20;

    // Daily Title
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(45, 37, 41);
    doc.text(entry.dailyTitle, marginX, currentY);

    currentY += 16;

    // SECTION 1: TODAY'S BIBLE VERSE (Framed Card)
    const verseText = `"${entry.text}"`;
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    const splitVerse = doc.splitTextToSize(verseText, contentWidth - 28);
    const verseCardHeight = (splitVerse.length * 15) + 36;

    doc.setFillColor(250, 247, 245);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.roundedRect(marginX, currentY, contentWidth, verseCardHeight, 4, 4, 'FD');

    doc.setTextColor(30, 25, 28);
    doc.text(splitVerse, marginX + 14, currentY + 18, { lineHeightFactor: 1.35 });

    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(170, 120, 30);
    doc.text(`— ${entry.reference} (KJV)`, pageWidth - marginX - 14, currentY + verseCardHeight - 10, { align: 'right' });

    currentY += verseCardHeight + 14;

    // SECTION 2: UNDERSTANDING THE VERSE
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(190, 115, 130);
    doc.text('UNDERSTANDING THE VERSE', marginX, currentY);
    currentY += 11;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 50, 55);
    const splitExpl = doc.splitTextToSize(entry.explanation, contentWidth);
    doc.text(splitExpl, marginX, currentY, { lineHeightFactor: 1.3 });
    currentY += (splitExpl.length * 12.5) + 10;

    // SECTION 3: TODAY'S DEVOTIONAL
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(190, 115, 130);
    doc.text("TODAY'S DEVOTIONAL", marginX, currentY);
    currentY += 11;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(45, 37, 41);
    const splitDevo = doc.splitTextToSize(entry.devotional, contentWidth);
    doc.text(splitDevo, marginX, currentY, { lineHeightFactor: 1.3 });
    currentY += (splitDevo.length * 12.5) + 10;

    // SECTION 4: TODAY'S PRAYER
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(190, 115, 130);
    doc.text("TODAY'S PRAYER", marginX, currentY);
    currentY += 11;

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 40, 45);
    const splitPrayer = doc.splitTextToSize(`"${entry.prayer}"`, contentWidth);
    doc.text(splitPrayer, marginX, currentY, { lineHeightFactor: 1.3 });
    currentY += (splitPrayer.length * 12.5) + 10;

    // SECTION 5: REFLECT ON THIS
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(190, 115, 130);
    doc.text('REFLECT ON THIS', marginX, currentY);
    currentY += 11;

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 40, 45);
    const splitRefl = doc.splitTextToSize(entry.reflection, contentWidth);
    doc.text(splitRefl, marginX, currentY, { lineHeightFactor: 1.3 });
    currentY += (splitRefl.length * 12) + 10;

    // SECTION 6: TODAY'S FAITH ACTION
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(74, 122, 93);
    doc.text("TODAY'S FAITH ACTION", marginX, currentY);
    currentY += 11;

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 40, 45);
    const splitAction = doc.splitTextToSize(entry.action, contentWidth);
    doc.text(splitAction, marginX, currentY, { lineHeightFactor: 1.3 });
    currentY += (splitAction.length * 12) + 10;

    // SECTION 7: A NOTE FROM ME ❤️
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(217, 79, 110);
    doc.text('A NOTE FROM ME ❤️', marginX, currentY);
    currentY += 11;

    const note = window.appState.getCustomNote(entry.day);
    const creator = window.appState.settings.creatorName;
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(60, 45, 50);
    const splitNote = doc.splitTextToSize(`${note} — With love, ${creator}`, contentWidth);
    doc.text(splitNote, marginX, currentY, { lineHeightFactor: 1.3 });

    // Page number bottom footer
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(140, 130, 135);
    doc.text(`366 Days With God  •  Page ${pageNum}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
  }
};

window.PdfGenerator = PdfGenerator;

