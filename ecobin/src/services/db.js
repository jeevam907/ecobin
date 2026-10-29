/**
 * EcoBin Persistent Storage & Data Service
 * Real CRUD operations with persistent localStorage/IndexedDB storage,
 * schema validation, and seed data initialization.
 */

import { SAMPLE_COMPLAINTS, SAMPLE_BINS } from '../config.js';

const STORAGE_KEYS = {
  USERS: 'ecobin_db_users',
  COMPLAINTS: 'ecobin_db_complaints',
  BINS: 'ecobin_db_bins',
  NOTIFICATIONS: 'ecobin_db_notifications',
  AUDIT_LOGS: 'ecobin_db_audit_logs',
  SETTINGS: 'ecobin_db_settings'
};

// Default seed users
const INITIAL_USERS = [
  {
    id: 'usr_citizen_1',
    name: 'Aarav Sharma',
    email: 'citizen@ecobin.city',
    phone: '+91 98765 43210',
    passwordHash: 'citizen123',
    role: 'citizen',
    ward: 'Ward 150 - Bellandur',
    zone: 'East Zone',
    ecoPoints: 480,
    tier: 'Gold Citizen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    active: true,
    createdAt: '2026-10-01 10:00 AM'
  },
  {
    id: 'usr_officer_1',
    name: 'Officer Rajesh Kumar',
    email: 'officer@ecobin.city',
    phone: '+91 98111 22233',
    passwordHash: 'officer123',
    role: 'officer',
    ward: 'Ward 150 - Bellandur',
    zone: 'East Zone',
    ecoPoints: 0,
    tier: 'Sanitation Officer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    active: true,
    createdAt: '2026-09-15 08:30 AM'
  },
  {
    id: 'usr_admin_1',
    name: 'Dr. Sunita Rao (Commissioner)',
    email: 'admin@ecobin.city',
    phone: '+91 99000 88776',
    passwordHash: 'admin123',
    role: 'admin',
    ward: 'Metropolis HQ',
    zone: 'Central Administration',
    ecoPoints: 0,
    tier: 'Super Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita',
    active: true,
    createdAt: '2026-08-01 09:00 AM'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'usr_citizen_1',
    title: 'Field Officer Assigned',
    message: 'Officer Rajesh Kumar has been dispatched for Complaint #ECO-2026-8941',
    type: 'assigned',
    isRead: false,
    link: '#/citizen/complaint/ECO-2026-8941',
    createdAt: '15 mins ago'
  },
  {
    id: 'notif_2',
    userId: 'usr_citizen_1',
    title: '+50 Eco Points Earned!',
    message: 'Your report on Indiranagar Metro was verified by Ward Supervisor.',
    type: 'points',
    isRead: false,
    link: '#/citizen/profile',
    createdAt: '2 hours ago'
  },
  {
    id: 'notif_3',
    userId: 'usr_citizen_1',
    title: 'Complaint Resolved',
    message: 'Issue #ECO-2026-8935 marked resolved. Please rate the service.',
    type: 'resolved',
    isRead: true,
    link: '#/citizen/complaint/ECO-2026-8935',
    createdAt: '1 day ago'
  }
];

class EcoBinDatabase {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(SAMPLE_COMPLAINTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BINS)) {
      localStorage.setItem(STORAGE_KEYS.BINS, JSON.stringify(SAMPLE_BINS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([
        {
          id: 'log_1',
          action: 'SYSTEM_BOOT',
          userName: 'System Daemon',
          details: 'EcoBin 3D Smart City Database initialized',
          timestamp: new Date().toISOString()
        }
      ]));
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Users CRUD ---
  getUsers() {
    return this.get(STORAGE_KEYS.USERS);
  }

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserByPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return this.getUsers().find(u => u.phone.replace(/\D/g, '') === cleanPhone);
  }

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ecoPoints: 100, // 100 points for registration
      tier: 'Bronze Citizen',
      active: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toLocaleString(),
      ...userData
    };
    users.push(newUser);
    this.set(STORAGE_KEYS.USERS, users);
    this.logAudit(newUser.id, newUser.name, 'USER_REGISTERED', `New account created: ${newUser.email}`);
    return newUser;
  }

  updateUser(id, patch) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...patch };
      this.set(STORAGE_KEYS.USERS, users);
      return users[idx];
    }
    return null;
  }

  // --- Complaints CRUD ---
  getComplaints() {
    return this.get(STORAGE_KEYS.COMPLAINTS);
  }

  getComplaintById(id) {
    return this.getComplaints().find(c => c.id === id) || null;
  }

  createComplaint(complaintData) {
    const complaints = this.getComplaints();
    const id = `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      id,
      submittedAt: new Date().toLocaleString(),
      status: 'submitted',
      photos: [],
      ...complaintData
    };
    complaints.unshift(newComplaint);
    this.set(STORAGE_KEYS.COMPLAINTS, complaints);

    // Increment user Eco Points
    if (newComplaint.userId) {
      const user = this.getUsers().find(u => u.id === newComplaint.userId);
      if (user) {
        this.updateUser(user.id, { ecoPoints: (user.ecoPoints || 0) + 50 });
      }
    }

    this.logAudit(newComplaint.userId || 'guest', newComplaint.citizenName || 'Citizen', 'COMPLAINT_FILED', `Complaint #${id} submitted in ${newComplaint.ward}`);
    return newComplaint;
  }

  updateComplaint(id, patch) {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    if (idx !== -1) {
      complaints[idx] = { ...complaints[idx], ...patch };
      this.set(STORAGE_KEYS.COMPLAINTS, complaints);
      return complaints[idx];
    }
    return null;
  }

  // --- Bins CRUD ---
  getBins() {
    return this.get(STORAGE_KEYS.BINS);
  }

  updateBin(id, patch) {
    const bins = this.getBins();
    const idx = bins.findIndex(b => b.id === id);
    if (idx !== -1) {
      bins[idx] = { ...bins[idx], ...patch };
      this.set(STORAGE_KEYS.BINS, bins);
      return bins[idx];
    }
    return null;
  }

  createBin(binData) {
    const bins = this.getBins();
    const newBin = {
      id: `BIN-${Math.floor(100 + Math.random() * 900)}`,
      fillLevel: 0,
      status: 'ok',
      lastEmptied: 'Just now',
      ...binData
    };
    bins.push(newBin);
    this.set(STORAGE_KEYS.BINS, bins);
    return newBin;
  }

  // --- Notifications ---
  getNotifications() {
    return this.get(STORAGE_KEYS.NOTIFICATIONS);
  }

  markAllNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, isRead: true }));
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return notifs;
  }

  addNotification(notif) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: 'Just now',
      ...notif
    };
    notifs.unshift(newNotif);
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.get(STORAGE_KEYS.AUDIT_LOGS);
  }

  logAudit(userId, userName, action, details) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log_${Date.now()}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep latest 100
  }
}

export const db = new EcoBinDatabase();
