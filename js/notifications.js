// ==========================================================================
// 366 DAYS WITH GOD - Notifications & Reminder Module
// ==========================================================================

const Notifications = {
  init() {
    this.checkReminderLoop();
    setInterval(() => this.checkReminderLoop(), 60000); // Check every minute
  },

  async requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async testNotification() {
    const granted = await this.requestPermission();
    if (!granted) {
      alert('Notification permissions are required. Please enable notifications in your browser settings.');
      return;
    }

    const partnerName = window.appState.settings.partnerName;
    const lastDay = window.appState.lastReadDay || 1;
    const entry = window.BIBLE_DEVOTIONALS ? window.BIBLE_DEVOTIONALS[lastDay - 1] : null;

    const title = `366 Days With God ❤️ (Day ${lastDay})`;
    const options = {
      body: entry ? `"${entry.text}" — ${entry.reference}\nPeace to you, ${partnerName}!` : 'Time for your daily devotional with God!',
      icon: './assets/icons/icon-192.png',
      badge: './assets/icons/favicon.png'
    };

    try {
      new Notification(title, options);
      App.showToast('Test notification sent! 🔔');
    } catch (e) {
      console.warn('Direct notification failed, trying service worker', e);
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, options);
          App.showToast('Test notification sent! 🔔');
        });
      }
    }
  },

  checkReminderLoop() {
    const s = window.appState.settings;
    if (!s.reminderEnabled || !s.reminderTime) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    // Has already triggered this minute?
    const lastTriggeredDate = localStorage.getItem('366_god_last_notification_date');
    const todayDateStr = now.toDateString();

    if (currentTimeStr === s.reminderTime && lastTriggeredDate !== todayDateStr) {
      localStorage.setItem('366_god_last_notification_date', todayDateStr);
      const lastDay = window.appState.lastReadDay || 1;
      const entry = window.BIBLE_DEVOTIONALS ? window.BIBLE_DEVOTIONALS[lastDay - 1] : null;

      const title = `Good morning, ${s.partnerName} ❤️`;
      const options = {
        body: entry ? `Today's Reading (Day ${entry.day}): "${entry.text}"` : 'Your daily devotional with God is ready for you.',
        icon: './assets/icons/icon-192.png'
      };

      try {
        new Notification(title, options);
      } catch (e) {}
    }
  }
};

window.Notifications = Notifications;

