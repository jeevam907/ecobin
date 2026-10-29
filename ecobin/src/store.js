/**
 * EcoBin State Store
 * Reactive Pub/Sub State Container for User Session, Role, Drafts & Eco Points
 */

import { APP_CONFIG, SAMPLE_COMPLAINTS, SAMPLE_BINS } from './config.js';

class EcoBinStore {
  constructor() {
    this.state = {
      userRole: APP_CONFIG.roles.CITIZEN, // default preview as Citizen
      currentUser: {
        name: 'Aarav Sharma',
        phone: '+91 98765 43210',
        email: 'aarav.sharma@example.com',
        ward: 'Ward 150 - Bellandur',
        zone: 'East Zone',
        ecoPoints: 480,
        tier: 'Gold Citizen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
      },
      complaints: [...SAMPLE_COMPLAINTS],
      bins: [...SAMPLE_BINS],
      offlineDrafts: [],
      unreadNotificationsCount: 3,
      currentLanguage: APP_CONFIG.defaultLanguage,
      isOnline: navigator.onLine !== undefined ? navigator.onLine : true
    };

    this.listeners = new Set();

    // Listen for network online/offline events
    window.addEventListener('online', () => this.update({ isOnline: true }));
    window.addEventListener('offline', () => this.update({ isOnline: false }));
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  update(patch) {
    this.state = { ...this.state, ...patch };
    this.notify();
  }

  setRole(role) {
    if (Object.values(APP_CONFIG.roles).includes(role)) {
      this.update({ userRole: role });
    }
  }

  addComplaint(newComplaint) {
    const complaint = {
      id: `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleString(),
      status: 'submitted',
      ...newComplaint
    };
    this.update({
      complaints: [complaint, ...this.state.complaints],
      currentUser: {
        ...this.state.currentUser,
        ecoPoints: this.state.currentUser.ecoPoints + 50 // 50 Eco Points per report
      }
    });
    return complaint;
  }

  setLanguage(langCode) {
    this.update({ currentLanguage: langCode });
  }
}

export const store = new EcoBinStore();
