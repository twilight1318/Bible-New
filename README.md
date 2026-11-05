# 366 DAYS WITH GOD ❤️
*One Year. 366 Days. A Journey of Faith, Hope, Prayer and Love.*

A premium, interactive Christian Bible devotional web application and printable digital book designed as a personal faith-based gift.

---

## 🌟 Core Highlights

* **366 Unique Daily Devotionals**: Exactly 366 days with **zero duplicate Bible references**. Every day features a distinct, authentic Scripture quotation from the King James Version (KJV).
* **Strict Automated Validation**: Built-in verification report certifying all 366 unique references, 100% complete sections, and 12 balanced monthly themes.
* **12 Monthly Spiritual Themes**:
  1. **January** – New Beginnings and God's Guidance (31 Days)
  2. **February** – Love and Kindness (29 Days)
  3. **March** – Faith and Trust (31 Days)
  4. **April** – Forgiveness and Grace (30 Days)
  5. **May** – Patience and Understanding (31 Days)
  6. **June** – Prayer and Relationship with God (30 Days)
  7. **July** – Strength and Courage (31 Days)
  8. **August** – Gratitude and Blessings (31 Days)
  9. **September** – Hope and God's Promises (30 Days)
  10. **October** – Peace and Wisdom (31 Days)
  11. **November** – God's Faithfulness (30 Days)
  12. **December** – Thankfulness and Reflection (31 Days)
* **Special Day 366**: *"366 DAYS OF FAITH – OUR JOURNEY CONTINUES"* (Philippians 1:6) celebrating the completed annual milestone and launching into the future.
* **Full 8-Section Daily Layout**:
  1. `DAY [Number]` Header & Date
  2. `TODAY'S BIBLE VERSE` (Highlighted quote card with KJV reference)
  3. `UNDERSTANDING THE VERSE` (Contextual explanation in simple English)
  4. `TODAY'S DEVOTIONAL` (Heartfelt reflection connecting Scripture to daily life)
  5. `TODAY'S PRAYER` (Sincere prayer, saveable to prayer journal)
  6. `REFLECT ON THIS` (Thoughtful question with private journal entry)
  7. `TODAY'S FAITH ACTION` (Practical daily practice)
  8. `A NOTE FROM ME ❤️` (Customizable personal letter from the gift creator)

---

## ✨ Features & Architecture

### 1. Interactive Website & Mobile PWA
* **Responsive Layout**: Designed for phones, tablets, laptops, and desktop screens with a native mobile bottom navigation bar and touch-friendly controls.
* **Installable Progressive Web App (PWA)**: Works offline via `service-worker.js` and `manifest.json`.
* **Keyboard Shortcuts**: Left/Right arrows navigate days smoothly; Escape closes modals.

### 2. Reading Tracker & Dashboard
* Real-time progress bar (e.g. *Day 45 of 366, 12% Completed*).
* Consecutive day reading streaks.
* One-click "Continue Reading" resuming on the user's last read day.
* Random Bible Verse drawer for spontaneous encouragement.

### 3. Favourites & Journals
* **My Favourite Verses**: Categorized collection with search, tags, and one-click removal.
* **Prayer Journal**: Record personal prayers, categorize needs, edit, and mark prayers as *Answered* with dates and celebratory badges.
* **Personal Journal**: Private daily reflections linked with day numbers and full search.
* **100% Private Local Storage**: All personal journals and notes remain private on the user's device. No account required.

### 4. Downloadable Printable PDF Book
* **Complete 366-Day Book**: Cover page, dedication letter, table of contents, 12 monthly introductory dividers, all 366 daily pages (one page per day), and the special Day 366 closing celebration.
* **Monthly Sections**: Download individual monthly chapters (e.g. Month of Love, Month of Grace).
* **Single Daily Page**: Instant single-page PDF with exact margins, headers, and footer numbering.

### 5. Personal Customization & Admin Area
* Partner's display name and gift creator's name.
* Editable Dedication Letter.
* Special Occasions Letters (Birthdays, Anniversaries, Milestones, Christmas, Easter).
* Visual themes: Blush Rose, Sage Garden, Heavenly Lavender, Royal Gold.
* Light & Nocturnal Dark Mode.
* Font size adjustments (Small, Medium, Large, Extra Large).
* Daily Reminder Scheduler (Browser Notification API).
* Full JSON Backup Export & Import.

---

## 📁 Project Structure

```
366-Days-With-God/
├── index.html                   # Master single-page app layout
├── manifest.json                # PWA web manifest
├── service-worker.js            # Offline caching & service worker
│
├── css/
│   ├── style.css                # Master styling & card layouts
│   ├── themes.css               # Color palettes, light/dark mode, typography
│   └── responsive.css           # Mobile & tablet responsiveness, bottom bar
│
├── js/
│   ├── app.js                   # Main application router and coordinator
│   ├── bible-data.js            # 366 verified KJV devotionals database
│   ├── state.js                 # LocalStorage persistence, backup & restore
│   ├── daily-reading.js         # Daily reading renderer & interactive tools
│   ├── dashboard.js             # Dashboard widgets, progress tracker & streak
│   ├── calendar.js              # 366-day calendar & leap-year handling
│   ├── favourites.js            # Saved favorite verses with category filters
│   ├── prayer-journal.js        # Prayer journal with answered state
│   ├── personal-journal.js      # Daily reflection journal & search
│   ├── search.js                # Universal search (book, theme, keyword, day)
│   ├── settings.js              # Customization, names, dedication, themes
│   ├── notifications.js         # Daily reminder scheduler & notifications
│   ├── validator.js             # In-browser validation report (0 duplicates)
│   ├── pdf-generator.js         # Single day, monthly, and complete PDF book
│   └── jspdf.umd.min.js         # Standalone jsPDF library for offline PDF generation
│
├── data/
│   └── daily-devotionals.json   # Raw JSON database of all 366 devotionals
│
├── assets/
│   └── icons/                   # App icons & favicons
│
└── README.md
```

---

## 🛡️ Validation & Scripture Accuracy Guarantee

Run the automated test suite at any time:
```powershell
python scratch/test_suite.py
```
**Results:**
* Exactly 366 daily entries.
* Exactly 366 unique Bible references (0 duplicates confirmed).
* Zero missing fields or placeholder content.
* 100% King James Version (KJV) quotations.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any modern web browser, or launch a simple local HTTP server:

```powershell
# Using Python
python -m http.server 8080

# Or using Node.js npx serve
npx serve .
```
Then navigate to `http://localhost:8080` in your browser.

