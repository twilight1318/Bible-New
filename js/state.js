// ==========================================================================
// 366 DAYS WITH GOD - Central State & LocalStorage Management
// ==========================================================================

const STORAGE_KEYS = {
  SETTINGS: '366_god_settings',
  COMPLETED_DAYS: '366_god_completed_days',
  FAVOURITE_DAYS: '366_god_favourite_days',
  FAVOURITE_TAGS: '366_god_favourite_tags',
  PRAYER_JOURNAL: '366_god_prayer_journal',
  PERSONAL_JOURNAL: '366_god_personal_journal',
  CUSTOM_NOTES: '366_god_custom_notes',
  SPECIAL_OCCASIONS: '366_god_special_occasions',
  LAST_READ_DAY: '366_god_last_read_day'
};

const DEFAULT_SETTINGS = {
  partnerName: 'My Beloved',
  creatorName: 'Your Partner',
  dedicationLetter: `My Dearest,\n\nI created this 366-day devotional book as a personal gift of faith and love for you. Every single day of this year is an invitation to pause, breathe, and remember how fiercely you are loved by God—and by me.\n\nMay these daily scriptures bring comfort to your weary moments, courage to your trials, and boundless joy to your heart. Whenever you open these pages, know that you are wrapped in prayers and walking in His grace.\n\nWith all my heart and faith,`,
  themeMode: 'light', // 'light' or 'dark'
  accentColor: 'blush', // 'blush', 'sage', 'lavender', 'gold'
  fontSize: 'md', // 'sm', 'md', 'lg', 'xl'
  reminderTime: '08:00',
  reminderEnabled: false,
  leapYearMode: true,
  startDate: '2026-01-01'
};

const DEFAULT_SPECIAL_OCCASIONS = {
  birthday: {
    title: 'Happy Birthday, My Love! 🎂',
    message: 'On this blessed day God brought you into the world, I thank Him for the immense gift of your life. May He shower you with peace, happiness, and abundant favor this year!'
  },
  anniversary: {
    title: 'Happy Anniversary ❤️',
    message: 'Every moment with you is a testament to God’s grace and kindness. Thank you for walking this sacred journey of faith and love beside me. Here is to a lifetime more.'
  },
  milestone: {
    title: 'Celebrating a Sacred Milestone ✨',
    message: 'Look at what the Lord has done! Today marks a milestone of growth and victory. I am so proud of your dedication and faith.'
  },
  christmas: {
    title: 'Merry Christmas! 🎄',
    message: 'Glory to God in the highest! As we celebrate the birth of our Savior Jesus Christ, my greatest earthly blessing is celebrating Emmanuel—God with us—with you.'
  },
  easter: {
    title: 'He Is Risen! 🕊️',
    message: 'Hallelujah! The tomb is empty and our Lord lives! May the joy and victory of the Resurrection fill your soul with living hope today and always.'
  }
};

class AppState {
  constructor() {
    this.settings = this.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.completedDays = new Set(this.load(STORAGE_KEYS.COMPLETED_DAYS, []));
    this.favouriteDays = new Set(this.load(STORAGE_KEYS.FAVOURITE_DAYS, []));
    this.favouriteTags = this.load(STORAGE_KEYS.FAVOURITE_TAGS, {}); // dayId -> tag
    this.prayerJournal = this.load(STORAGE_KEYS.PRAYER_JOURNAL, []);
    this.personalJournal = this.load(STORAGE_KEYS.PERSONAL_JOURNAL, []);
    this.customNotes = this.load(STORAGE_KEYS.CUSTOM_NOTES, {});
    this.specialOccasions = this.load(STORAGE_KEYS.SPECIAL_OCCASIONS, DEFAULT_SPECIAL_OCCASIONS);
    this.lastReadDay = this.load(STORAGE_KEYS.LAST_READ_DAY, 1);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return fallback;
      return JSON.parse(data);
    } catch (e) {
      console.warn(`Error loading ${key} from localStorage`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }

  // --- Settings ---
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    this.applyVisualPreferences();
  }

  applyVisualPreferences() {
    document.documentElement.setAttribute('data-theme', this.settings.themeMode);
    document.documentElement.setAttribute('data-accent', this.settings.accentColor);
    document.body.className = `font-${this.settings.fontSize}`;
  }

  // --- Reading Progress ---
  toggleCompleted(dayNumber) {
    if (this.completedDays.has(dayNumber)) {
      this.completedDays.delete(dayNumber);
    } else {
      this.completedDays.add(dayNumber);
    }
    this.save(STORAGE_KEYS.COMPLETED_DAYS, Array.from(this.completedDays));
    return this.completedDays.has(dayNumber);
  }

  isCompleted(dayNumber) {
    return this.completedDays.has(dayNumber);
  }

  getCompletedCount() {
    return this.completedDays.size;
  }

  getCompletionPercentage() {
    return Math.round((this.completedDays.size / 366) * 100);
  }

  setLastReadDay(dayNumber) {
    this.lastReadDay = dayNumber;
    this.save(STORAGE_KEYS.LAST_READ_DAY, dayNumber);
  }

  // --- Favourites ---
  toggleFavourite(dayNumber, tag = 'General') {
    if (this.favouriteDays.has(dayNumber)) {
      this.favouriteDays.delete(dayNumber);
      delete this.favouriteTags[dayNumber];
    } else {
      this.favouriteDays.add(dayNumber);
      this.favouriteTags[dayNumber] = tag;
    }
    this.save(STORAGE_KEYS.FAVOURITE_DAYS, Array.from(this.favouriteDays));
    this.save(STORAGE_KEYS.FAVOURITE_TAGS, this.favouriteTags);
    return this.favouriteDays.has(dayNumber);
  }

  isFavourite(dayNumber) {
    return this.favouriteDays.has(dayNumber);
  }

  getFavouriteTag(dayNumber) {
    return this.favouriteTags[dayNumber] || 'General';
  }

  setFavouriteTag(dayNumber, tag) {
    this.favouriteTags[dayNumber] = tag;
    this.save(STORAGE_KEYS.FAVOURITE_TAGS, this.favouriteTags);
  }

  // --- Creator Custom Notes ---
  getCustomNote(dayNumber) {
    if (this.customNotes[dayNumber]) {
      return this.customNotes[dayNumber];
    }
    // Default personal notes
    return `Praying that this verse fills your day with peace, joy and holy courage. I am always holding you in my heart and prayers! ❤️`;
  }

  setCustomNote(dayNumber, noteText) {
    this.customNotes[dayNumber] = noteText;
    this.save(STORAGE_KEYS.CUSTOM_NOTES, this.customNotes);
  }

  // --- Prayer Journal ---
  addPrayer(title, content, tag = 'General') {
    const prayer = {
      id: 'prayer_' + Date.now(),
      title: title.trim() || 'My Prayer',
      content: content.trim(),
      tag,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isAnswered: false,
      answeredDate: null
    };
    this.prayerJournal.unshift(prayer);
    this.save(STORAGE_KEYS.PRAYER_JOURNAL, this.prayerJournal);
    return prayer;
  }

  updatePrayer(id, updates) {
    this.prayerJournal = this.prayerJournal.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save(STORAGE_KEYS.PRAYER_JOURNAL, this.prayerJournal);
  }

  deletePrayer(id) {
    this.prayerJournal = this.prayerJournal.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PRAYER_JOURNAL, this.prayerJournal);
  }

  togglePrayerAnswered(id) {
    this.prayerJournal = this.prayerJournal.map(p => {
      if (p.id === id) {
        const nextState = !p.isAnswered;
        return {
          ...p,
          isAnswered: nextState,
          answeredDate: nextState ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
        };
      }
      return p;
    });
    this.save(STORAGE_KEYS.PRAYER_JOURNAL, this.prayerJournal);
  }

  // --- Personal Journal (Reflections) ---
  saveDailyReflection(dayNumber, text) {
    const existingIndex = this.personalJournal.findIndex(j => j.dayNumber === dayNumber);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (existingIndex >= 0) {
      if (!text.trim()) {
        this.personalJournal.splice(existingIndex, 1);
      } else {
        this.personalJournal[existingIndex].content = text.trim();
        this.personalJournal[existingIndex].date = dateStr;
      }
    } else if (text.trim()) {
      this.personalJournal.unshift({
        id: 'journal_' + Date.now(),
        dayNumber,
        content: text.trim(),
        date: dateStr
      });
    }
    this.save(STORAGE_KEYS.PERSONAL_JOURNAL, this.personalJournal);
  }

  getDailyReflection(dayNumber) {
    const entry = this.personalJournal.find(j => j.dayNumber === dayNumber);
    return entry ? entry.content : '';
  }

  deleteJournalEntry(id) {
    this.personalJournal = this.personalJournal.filter(j => j.id !== id);
    this.save(STORAGE_KEYS.PERSONAL_JOURNAL, this.personalJournal);
  }

  // --- Special Occasions ---
  updateSpecialOccasion(key, title, message) {
    if (this.specialOccasions[key]) {
      this.specialOccasions[key] = { title, message };
      this.save(STORAGE_KEYS.SPECIAL_OCCASIONS, this.specialOccasions);
    }
  }

  // --- Backup & Restore ---
  exportBackup() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.settings,
      completedDays: Array.from(this.completedDays),
      favouriteDays: Array.from(this.favouriteDays),
      favouriteTags: this.favouriteTags,
      prayerJournal: this.prayerJournal,
      personalJournal: this.personalJournal,
      customNotes: this.customNotes,
      specialOccasions: this.specialOccasions,
      lastReadDay: this.lastReadDay
    };
    return JSON.stringify(backupData, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.settings || !Array.isArray(data.completedDays)) {
        throw new Error('Invalid backup file structure.');
      }
      this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      this.completedDays = new Set(data.completedDays || []);
      this.favouriteDays = new Set(data.favouriteDays || []);
      this.favouriteTags = data.favouriteTags || {};
      this.prayerJournal = data.prayerJournal || [];
      this.personalJournal = data.personalJournal || [];
      this.customNotes = data.customNotes || {};
      this.specialOccasions = { ...DEFAULT_SPECIAL_OCCASIONS, ...(data.specialOccasions || {}) };
      this.lastReadDay = data.lastReadDay || 1;

      this.save(STORAGE_KEYS.SETTINGS, this.settings);
      this.save(STORAGE_KEYS.COMPLETED_DAYS, Array.from(this.completedDays));
      this.save(STORAGE_KEYS.FAVOURITE_DAYS, Array.from(this.favouriteDays));
      this.save(STORAGE_KEYS.FAVOURITE_TAGS, this.favouriteTags);
      this.save(STORAGE_KEYS.PRAYER_JOURNAL, this.prayerJournal);
      this.save(STORAGE_KEYS.PERSONAL_JOURNAL, this.personalJournal);
      this.save(STORAGE_KEYS.CUSTOM_NOTES, this.customNotes);
      this.save(STORAGE_KEYS.SPECIAL_OCCASIONS, this.specialOccasions);
      this.save(STORAGE_KEYS.LAST_READ_DAY, this.lastReadDay);

      this.applyVisualPreferences();
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }

  resetAllProgress() {
    this.completedDays.clear();
    this.favouriteDays.clear();
    this.favouriteTags = {};
    this.prayerJournal = [];
    this.personalJournal = [];
    this.customNotes = {};
    this.lastReadDay = 1;

    this.save(STORAGE_KEYS.COMPLETED_DAYS, []);
    this.save(STORAGE_KEYS.FAVOURITE_DAYS, []);
    this.save(STORAGE_KEYS.FAVOURITE_TAGS, {});
    this.save(STORAGE_KEYS.PRAYER_JOURNAL, []);
    this.save(STORAGE_KEYS.PERSONAL_JOURNAL, []);
    this.save(STORAGE_KEYS.CUSTOM_NOTES, {});
    this.save(STORAGE_KEYS.LAST_READ_DAY, 1);
  }
}

window.appState = new AppState();

