/**
 * EcoBin Universal Standalone Bundle
 * Zero-dependency self-contained distribution for both file:/// and http:// protocols.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIG & SEED DATA
  // ==========================================================================
  const APP_CONFIG = {
    name: 'EcoBin',
    tagline: 'Spot the Waste. Report in Seconds. Track Until Clean.',
    version: '1.0.0-release',
    defaultLanguage: 'en',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'hi', label: 'हिंदी (Hindi)' },
      { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
      { code: 'ta', label: 'தமிழ் (Tamil)' }
    ],
    roles: {
      GUEST: 'guest',
      CITIZEN: 'citizen',
      OFFICER: 'officer',
      ADMIN: 'admin'
    },
    categories: [
      { id: 'uncollected', name: 'Uncollected Garbage', color: '#0ea5e9' },
      { id: 'overflowing', name: 'Overflowing Smart Bin', color: '#f59e0b' },
      { id: 'dumping', name: 'Illegal Roadside Dumping', color: '#ef4444' },
      { id: 'drain_blocked', name: 'Blocked Drain with Waste', color: '#06b6d4' },
      { id: 'hazardous', name: 'Hazardous / E-Waste', color: '#a855f7' },
      { id: 'other', name: 'Other Sanitation Issue', color: '#10b981' }
    ],
    severities: [
      { id: 'low', name: 'Low Priority', slaHours: 72, color: '#10b981' },
      { id: 'medium', name: 'Medium Priority', slaHours: 24, color: '#38bdf8' },
      { id: 'high', name: 'High Priority', slaHours: 12, color: '#f59e0b' },
      { id: 'critical', name: 'Critical Emergency', slaHours: 4, color: '#ef4444' }
    ],
    statuses: [
      { id: 'submitted', label: 'Submitted', color: '#38bdf8' },
      { id: 'assigned', label: 'Assigned', color: '#fbbf24' },
      { id: 'in_progress', label: 'In Progress', color: '#c084fc' },
      { id: 'resolved', label: 'Resolved', color: '#34d399' },
      { id: 'closed', label: 'Closed & Verified', color: '#10b981' }
    ]
  };

  const SAMPLE_COMPLAINTS = [
    {
      id: 'ECO-2026-8941',
      category: 'Overflowing Smart Bin',
      severity: 'critical',
      status: 'in_progress',
      address: '4th Cross, Green Glen Layout, Bellandur Ward 150',
      ward: 'Ward 150 - Bellandur',
      submittedAt: '2026-10-29 08:30 AM',
      assignedOfficer: 'Officer Rajesh Kumar',
      etaHours: 2,
      photos: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'],
      description: 'Smart Bin #B-104 is overflowing onto the pedestrian pathway. Sensor reported 98% full.',
      lat: 12.9260,
      lng: 77.6762
    },
    {
      id: 'ECO-2026-8940',
      category: 'Illegal Roadside Dumping',
      severity: 'high',
      status: 'assigned',
      address: 'Near Indiranagar Metro Pillar #42',
      ward: 'Ward 72 - Indiranagar',
      submittedAt: '2026-10-29 09:15 AM',
      assignedOfficer: 'Officer Sarah Chen',
      etaHours: 8,
      photos: ['https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80'],
      description: 'Commercial debris dumped overnight near the metro staircase.',
      lat: 12.9784,
      lng: 77.6408
    },
    {
      id: 'ECO-2026-8935',
      category: 'Uncollected Garbage',
      severity: 'medium',
      status: 'resolved',
      address: '12th Main, 5th Sector, HSR Layout',
      ward: 'Ward 174 - HSR Layout',
      submittedAt: '2026-10-28 02:40 PM',
      resolvedAt: '2026-10-29 11:10 AM',
      assignedOfficer: 'Officer Ramesh Patel',
      rating: 5,
      photos: ['https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80'],
      description: 'Door-to-door collection missed block 5 yesterday.',
      lat: 12.9121,
      lng: 77.6446
    }
  ];

  const SAMPLE_BINS = [
    {
      id: 'BIN-101',
      zone: 'East Zone',
      ward: 'Ward 150',
      location: 'Central Plaza Bus Shelter',
      type: 'Smart Recyclable (Dry)',
      fillLevel: 35,
      status: 'ok',
      lat: 12.9345,
      lng: 77.6821,
      lastEmptied: '2 hours ago'
    },
    {
      id: 'BIN-102',
      zone: 'East Zone',
      ward: 'Ward 150',
      location: 'EcoPark South Gate',
      type: 'Organic (Wet)',
      fillLevel: 78,
      status: 'warning',
      lat: 12.9310,
      lng: 77.6790,
      lastEmptied: '6 hours ago'
    },
    {
      id: 'BIN-103',
      zone: 'East Zone',
      ward: 'Ward 150',
      location: 'Tech Park Metro Entrance',
      type: 'Mixed Solid Waste',
      fillLevel: 94,
      status: 'critical',
      lat: 12.9280,
      lng: 77.6740,
      lastEmptied: '14 hours ago'
    }
  ];

  // ==========================================================================
  // 2. MULTILINGUAL LOCALIZATION (i18n)
  // ==========================================================================
  const TRANSLATIONS = {
    en: {
      tagline: 'Spot the Waste. Report in Seconds. Track Until Clean.',
      reportWaste: 'Report Waste Now',
      liveMap: 'Live Bin Map',
      trackComplaint: 'Track Complaint'
    },
    hi: {
      tagline: 'कचरा पहचानें। सेकंडों में रिपोर्ट करें। सफाई तक ट्रैक करें।',
      reportWaste: 'अभी कचरा रिपोर्ट करें',
      liveMap: 'लाइव बिन मैप',
      trackComplaint: 'शिकायत ट्रैक करें'
    },
    kn: {
      tagline: 'ಕಸವನ್ನು ಗುರುತಿಸಿ. ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ವರದಿ ಮಾಡಿ. ಸ್ವಚ್ಛವಾಗುವವರೆಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
      reportWaste: 'ಈಗಲೇ ಕಸದ ವರದಿ ನೀಡಿ',
      liveMap: 'ಲೈವ್ ಬಿನ್ ನಕ್ಷೆ',
      trackComplaint: 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ'
    },
    ta: {
      tagline: 'குப்பையைக் கண்டறியுங்கள். நொடிகளில் புகாரளிக்கவும். சுத்தமாகும் வரை கண்காணிக்கவும்.',
      reportWaste: 'குப்பையைப் புகாரளிக்கவும்',
      liveMap: 'நேரடி குப்பைத்தொட்டி வரைபடம்',
      trackComplaint: 'புகாரைக் கண்காணிக்கவும்'
    }
  };

  function t(key, lang = 'en') {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  // ==========================================================================
  // 3. PERSISTENT STORAGE (db)
  // ==========================================================================
  const STORAGE_KEYS = {
    USERS: 'ecobin_db_users',
    COMPLAINTS: 'ecobin_db_complaints',
    BINS: 'ecobin_db_bins',
    NOTIFICATIONS: 'ecobin_db_notifications',
    AUDIT_LOGS: 'ecobin_db_audit_logs'
  };

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
      message: 'Officer Rajesh Kumar dispatched for Complaint #ECO-2026-8941',
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
    }
  ];

  class EcoBinDatabase {
    constructor() {
      this.init();
    }
    init() {
      try {
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
            { id: 'log_1', action: 'BOOT', userName: 'System', details: 'EcoBin 3D Storage active', timestamp: new Date().toISOString() }
          ]));
        }
      } catch (e) {
        console.warn('Storage init fallback:', e);
      }
    }
    get(k) {
      try {
        const d = localStorage.getItem(k);
        return d ? JSON.parse(d) : [];
      } catch { return []; }
    }
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
    }
    getUsers() { return this.get(STORAGE_KEYS.USERS); }
    findUserByEmail(e) {
      return this.getUsers().find(u => u.email.toLowerCase() === e.toLowerCase());
    }
    findUserByPhone(p) {
      const cp = p.replace(/\D/g, '');
      return this.getUsers().find(u => u.phone.replace(/\D/g, '') === cp);
    }
    createUser(u) {
      const users = this.getUsers();
      const n = {
        id: `usr_${Date.now()}`,
        ecoPoints: 100,
        tier: 'Bronze Citizen',
        active: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        createdAt: new Date().toLocaleString(),
        ...u
      };
      users.push(n);
      this.set(STORAGE_KEYS.USERS, users);
      return n;
    }
    updateUser(id, p) {
      const users = this.getUsers();
      const i = users.findIndex(u => u.id === id);
      if (i !== -1) {
        users[i] = { ...users[i], ...p };
        this.set(STORAGE_KEYS.USERS, users);
        return users[i];
      }
      return null;
    }
    getComplaints() { return this.get(STORAGE_KEYS.COMPLAINTS); }
    getComplaintById(id) {
      return this.getComplaints().find(c => c.id === id) || null;
    }
    createComplaint(c) {
      const complaints = this.getComplaints();
      const id = `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const n = {
        id,
        submittedAt: new Date().toLocaleString(),
        status: 'submitted',
        photos: [],
        ...c
      };
      complaints.unshift(n);
      this.set(STORAGE_KEYS.COMPLAINTS, complaints);
      return n;
    }
    updateComplaint(id, p) {
      const complaints = this.getComplaints();
      const i = complaints.findIndex(c => c.id === id);
      if (i !== -1) {
        complaints[i] = { ...complaints[i], ...p };
        this.set(STORAGE_KEYS.COMPLAINTS, complaints);
        return complaints[i];
      }
      return null;
    }
    getBins() { return this.get(STORAGE_KEYS.BINS); }
    updateBin(id, p) {
      const bins = this.getBins();
      const i = bins.findIndex(b => b.id === id);
      if (i !== -1) {
        bins[i] = { ...bins[i], ...p };
        this.set(STORAGE_KEYS.BINS, bins);
        return bins[i];
      }
      return null;
    }
    createBin(b) {
      const bins = this.getBins();
      const n = { id: `BIN-${Math.floor(100 + Math.random() * 900)}`, fillLevel: 0, status: 'ok', lastEmptied: 'Just now', ...b };
      bins.push(n);
      this.set(STORAGE_KEYS.BINS, bins);
      return n;
    }
    getNotifications() { return this.get(STORAGE_KEYS.NOTIFICATIONS); }
    markAllNotificationsRead() {
      const n = this.getNotifications().map(x => ({ ...x, isRead: true }));
      this.set(STORAGE_KEYS.NOTIFICATIONS, n);
      return n;
    }
    addNotification(notif) {
      const n = this.getNotifications();
      n.unshift({ id: `notif_${Date.now()}`, isRead: false, createdAt: 'Just now', ...notif });
      this.set(STORAGE_KEYS.NOTIFICATIONS, n);
    }
    getAuditLogs() { return this.get(STORAGE_KEYS.AUDIT_LOGS); }
    logAudit(userId, userName, action, details) {
      const logs = this.getAuditLogs();
      logs.unshift({ id: `log_${Date.now()}`, userId, userName, action, details, timestamp: new Date().toISOString() });
      this.set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
    }
  }

  const db = new EcoBinDatabase();

  // ==========================================================================
  // 4. REACTIVE STORE
  // ==========================================================================
  class EcoBinStore {
    constructor() {
      this.state = {
        userRole: APP_CONFIG.roles.CITIZEN,
        currentUser: INITIAL_USERS[0],
        unreadNotificationsCount: 2,
        currentLanguage: 'en',
        isOnline: navigator.onLine !== undefined ? navigator.onLine : true
      };
      this.listeners = new Set();
      window.addEventListener('online', () => this.update({ isOnline: true }));
      window.addEventListener('offline', () => this.update({ isOnline: false }));
    }
    getState() { return this.state; }
    subscribe(l) { this.listeners.add(l); return () => this.listeners.delete(l); }
    notify() { for (const l of this.listeners) l(this.state); }
    update(patch) { this.state = { ...this.state, ...patch }; this.notify(); }
    setRole(role) { if (Object.values(APP_CONFIG.roles).includes(role)) this.update({ userRole: role }); }
    setLanguage(lang) { this.update({ currentLanguage: lang }); }
  }

  const store = new EcoBinStore();

  // ==========================================================================
  // 5. AUTHENTICATION SERVICE
  // ==========================================================================
  const authService = {
    getSession() {
      try {
        const s = localStorage.getItem('ecobin_session');
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    },
    getCurrentUser() {
      const s = this.getSession();
      return s ? s.user : store.getState().currentUser;
    },
    saveSession(user) {
      const session = {
        user,
        token: `jwt_ecobin_${Date.now()}`,
        expiresAt: Date.now() + 7 * 86400000
      };
      localStorage.setItem('ecobin_session', JSON.stringify(session));
      store.update({ currentUser: user, userRole: user.role });
      return session;
    },
    logout() {
      localStorage.removeItem('ecobin_session');
      store.setRole('citizen');
    },
    async register(data) {
      if (!data.name || data.name.trim().length < 2) return { success: false, error: 'Full name required' };
      if (!data.email || !data.email.includes('@')) return { success: false, error: 'Valid email required' };
      if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be 6+ chars' };
      if (db.findUserByEmail(data.email)) return { success: false, error: 'Email already registered' };
      const u = db.createUser(data);
      this.saveSession(u);
      return { success: true, user: u };
    },
    async login({ identity, password, roleHint = 'citizen' }) {
      const clean = identity.trim().toLowerCase();
      let u = db.findUserByEmail(clean) || db.findUserByPhone(clean);
      if (!u) return { success: false, error: 'No account found for this contact' };
      if (u.passwordHash !== password) return { success: false, error: 'Incorrect password' };
      if (roleHint === 'admin' && u.role !== 'admin' && u.role !== 'officer') {
        return { success: false, error: 'Citizen accounts cannot access staff portal' };
      }
      this.saveSession(u);
      return { success: true, user: u };
    },
    async requestPasswordReset(id) {
      return { success: true, message: `OTP sent to ${id}. (Demo OTP: 123456)` };
    },
    async resetPassword({ identity, otp, newPassword }) {
      if (otp !== '123456') return { success: false, error: 'Invalid 6-digit OTP' };
      const u = db.findUserByEmail(identity) || db.findUserByPhone(identity);
      if (u) {
        db.updateUser(u.id, { passwordHash: newPassword });
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    }
  };

  // ==========================================================================
  // 6. TOAST NOTIFICATION MANAGER
  // ==========================================================================
  class ToastManager {
    show(msg, type = 'info', duration = 3500) {
      let c = document.querySelector('.toast-container');
      if (!c) {
        c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
      }
      const t = document.createElement('div');
      t.className = `toast toast-${type}`;
      t.innerHTML = `<span>${type === 'success' ? '🌿' : (type === 'error' ? '⚠️' : 'ℹ️')}</span><div style="flex:1;">${msg}</div><button style="background:none;border:none;color:#aaa;cursor:pointer;">&times;</button>`;
      const dismiss = () => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        setTimeout(() => t.remove(), 250);
      };
      t.querySelector('button').addEventListener('click', dismiss);
      c.appendChild(t);
      if (duration > 0) setTimeout(dismiss, duration);
    }
    success(m) { this.show(m, 'success'); }
    error(m) { this.show(m, 'error'); }
    info(m) { this.show(m, 'info'); }
  }
  const toast = new ToastManager();

  // ==========================================================================
  // 7. 3D BADGES & PILLS
  // ==========================================================================
  function createStatusPill(status) {
    const s = (status || '').toLowerCase();
    const config = {
      submitted: { label: 'Submitted', class: 'submitted' },
      assigned: { label: 'Assigned', class: 'assigned' },
      in_progress: { label: 'In Progress', class: 'in-progress' },
      resolved: { label: 'Resolved', class: 'resolved' },
      closed: { label: 'Closed', class: 'resolved' }
    }[s] || { label: status, class: 'submitted' };

    return `<span class="status-pill ${config.class}"><span class="status-dot"></span>${config.label}</span>`;
  }

  function createSeverityBadge(sev) {
    const s = (sev || '').toLowerCase();
    const c = {
      low: { l: 'Low SLA (72h)', color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
      medium: { l: 'Medium SLA (24h)', color: '#38bdf8', bg: 'rgba(14,165,233,0.15)' },
      high: { l: 'High SLA (12h)', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
      critical: { l: 'Critical (4h)', color: '#f87171', bg: 'rgba(239,68,68,0.2)' }
    }[s] || { l: sev, color: '#fff', bg: 'rgba(255,255,255,0.1)' };

    return `<span style="display:inline-flex;align-items:center;padding:0.25rem 0.65rem;border-radius:999px;font-size:0.75rem;font-weight:700;color:${c.color};background:${c.bg};border:1px solid ${c.color}50;">⚡ ${c.l}</span>`;
  }

  // ==========================================================================
  // 8. INTERACTIVE 3D CANVAS SMART BIN
  // ==========================================================================
  class EcoBin3DCanvas {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      if (!this.container) return;
      this.options = { fillLevel: 68, interactive: true, autoRotate: true, ...options };
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.container.innerHTML = '';
      this.container.appendChild(this.canvas);
      this.rotation = 0.4;
      this.pitch = 0.25;
      this.isDragging = false;
      this.lastX = 0;
      this.lastY = 0;

      this.particles = Array.from({ length: 18 }, () => ({
        x: (Math.random() - 0.5) * 260,
        y: (Math.random() - 0.5) * 260,
        z: (Math.random() - 0.5) * 180,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * 6.28,
        rotSpeed: (Math.random() - 0.5) * 0.04
      }));

      this.resize();
      this.setupListeners();
      this.animate();
    }
    resize() {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.width = rect.width || 320;
      this.height = rect.height || 320;
      this.canvas.width = this.width * (window.devicePixelRatio || 1);
      this.canvas.height = this.height * (window.devicePixelRatio || 1);
      this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    setupListeners() {
      window.addEventListener('resize', () => this.resize());
      const down = (x, y) => { this.isDragging = true; this.lastX = x; this.lastY = y; };
      const move = (x, y) => {
        if (!this.isDragging) return;
        this.rotation += (x - this.lastX) * 0.012;
        this.pitch = Math.max(-0.35, Math.min(0.5, this.pitch + (y - this.lastY) * 0.008));
        this.lastX = x; this.lastY = y;
      };
      const up = () => { this.isDragging = false; };

      this.canvas.addEventListener('mousedown', (e) => down(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
      window.addEventListener('mouseup', up);
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) down(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchend', up);
    }
    setFillLevel(l) { this.options.fillLevel = Math.max(0, Math.min(100, l)); }
    project(x, y, z) {
      const cosY = Math.cos(this.rotation), sinY = Math.sin(this.rotation);
      const cosX = Math.cos(this.pitch), sinX = Math.sin(this.pitch);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;
      const fov = 400;
      const scale = fov / (fov + z2 + 160);
      return { x: this.width / 2 + x1 * scale, y: this.height / 2 + y2 * scale, scale, depth: z2 };
    }
    animate() {
      this.render();
      if (this.options.autoRotate && !this.isDragging) this.rotation += 0.008;
      requestAnimationFrame(() => this.animate());
    }
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Shadow
      const fp = this.project(0, 85, 0);
      const sg = ctx.createRadialGradient(fp.x, fp.y, 8, fp.x, fp.y, 80 * fp.scale);
      sg.addColorStop(0, 'rgba(0,0,0,0.6)');
      sg.addColorStop(0.6, 'rgba(16,185,129,0.12)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.ellipse(fp.x, fp.y, 75 * fp.scale, 30 * fp.scale, 0, 0, 6.28);
      ctx.fill();

      // Cylinder Mesh
      const segments = 24, topR = 56, botR = 44, topY = -60, botY = 65;
      const faces = [];
      for (let i = 0; i < segments; i++) {
        const t1 = (i / segments) * 6.28, t2 = ((i + 1) / segments) * 6.28;
        const p1T = { x: Math.cos(t1) * topR, y: topY, z: Math.sin(t1) * topR };
        const p2T = { x: Math.cos(t2) * topR, y: topY, z: Math.sin(t2) * topR };
        const p1B = { x: Math.cos(t1) * botR, y: botY, z: Math.sin(t1) * botR };
        const p2B = { x: Math.cos(t2) * botR, y: botY, z: Math.sin(t2) * botR };

        const pr1T = this.project(p1T.x, p1T.y, p1T.z);
        const pr2T = this.project(p2T.x, p2T.y, p2T.z);
        const pr1B = this.project(p1B.x, p1B.y, p1B.z);
        const pr2B = this.project(p2B.x, p2B.y, p2B.z);

        const avgZ = (pr1T.depth + pr2T.depth + pr1B.depth + pr2B.depth) / 4;
        const normX = Math.cos((t1 + t2) / 2), normZ = Math.sin((t1 + t2) / 2);
        const rotNormX = normX * Math.cos(this.rotation) - normZ * Math.sin(this.rotation);
        const light = Math.max(0.12, rotNormX * 0.6 + 0.45);

        faces.push({ pts: [pr1T, pr2T, pr2B, pr1B], depth: avgZ, light });
      }

      faces.sort((a, b) => b.depth - a.depth);
      for (const f of faces) {
        ctx.beginPath();
        ctx.moveTo(f.pts[0].x, f.pts[0].y);
        for (let j = 1; j < 4; j++) ctx.lineTo(f.pts[j].x, f.pts[j].y);
        ctx.closePath();
        const r = Math.floor(16 * f.light), g = Math.floor(185 * f.light), b = Math.floor(129 * f.light);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(52,211,153,${0.12 * f.light})`;
        ctx.stroke();
      }

      // Lid
      const lp = this.project(0, topY - 6, 0);
      const lg = ctx.createRadialGradient(lp.x, lp.y, 4, lp.x, lp.y, topR * lp.scale);
      lg.addColorStop(0, '#34d399');
      lg.addColorStop(0.7, '#065f46');
      lg.addColorStop(1, '#022c22');
      ctx.beginPath();
      ctx.ellipse(lp.x, lp.y, topR * lp.scale, topR * 0.35 * lp.scale, 0, 0, 6.28);
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // IoT LED Sensor Dome
      const sp = this.project(0, topY - 12, 0);
      const fill = this.options.fillLevel;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 5 * sp.scale, 0, 6.28);
      ctx.fillStyle = fill > 80 ? '#ef4444' : (fill > 60 ? '#f59e0b' : '#10b981');
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particles
      for (const p of this.particles) {
        p.y -= p.speedY;
        p.rotation += p.rotSpeed;
        if (p.y < -130) p.y = 130;
        const pp = this.project(p.x, p.y, p.z);
        ctx.save();
        ctx.translate(pp.x, pp.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = 'rgba(163,230,53,0.7)';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * pp.scale);
        ctx.quadraticCurveTo(p.size * pp.scale, 0, 0, p.size * pp.scale);
        ctx.quadraticCurveTo(-p.size * pp.scale, 0, 0, -p.size * pp.scale);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ==========================================================================
  // 9. ISOMETRIC CITY ILLUSTRATION
  // ==========================================================================
  function renderIsometricCity(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="position:relative;width:100%;height:360px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <svg viewBox="0 0 800 480" style="width:100%;height:100%;max-width:700px;filter:drop-shadow(0 20px 30px rgba(0,0,0,0.5));">
          <polygon points="400,80 720,240 400,400 80,240" fill="#0b1d17" stroke="rgba(52,211,153,0.3)" stroke-width="2" />
          <polygon points="80,240 400,400 400,425 80,265" fill="#031610" />
          <polygon points="720,240 400,400 400,425 720,265" fill="#02100b" />
          <polygon points="400,140 600,240 400,340 200,240" fill="#142c23" stroke="rgba(20,184,166,0.2)" stroke-width="1.5" />
          <line x1="400" y1="140" x2="400" y2="340" stroke="rgba(250,204,21,0.5)" stroke-width="2" stroke-dasharray="10 8" />
          <line x1="200" y1="240" x2="600" y2="240" stroke="rgba(250,204,21,0.5)" stroke-width="2" stroke-dasharray="10 8" />
          
          <!-- Tower -->
          <polygon points="260,110 320,140 320,220 260,190" fill="#065f46" />
          <polygon points="320,140 380,110 380,190 320,220" fill="#10b981" />
          <polygon points="320,80 380,110 320,140 260,110" fill="#34d399" />
          <circle cx="320" cy="110" r="8" fill="#bef264" />

          <!-- Smart Bin Pins -->
          <g transform="translate(250, 260)">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.8" />
            <rect x="-6" y="-12" width="12" height="18" rx="2" fill="#10b981" />
          </g>
          <g transform="translate(530, 275)">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.8" />
            <rect x="-6" y="-12" width="12" height="18" rx="2" fill="#f59e0b" />
          </g>
          <g transform="translate(380, 310)">
            <circle cx="0" cy="0" r="16" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.9" />
            <rect x="-7" y="-14" width="14" height="20" rx="3" fill="#ef4444" />
          </g>
        </svg>
      </div>
    `;
  }

  // ==========================================================================
  // 10. CLIENT ROUTER
  // ==========================================================================
  class Router {
    constructor(routes = {}) {
      this.routes = routes;
      window.addEventListener('hashchange', () => this.handle());
      window.addEventListener('popstate', () => this.handle());
    }
    add(p, h) { this.routes[p] = h; }
    getHash() {
      let h = window.location.hash.slice(1);
      if (!h || h === '') h = '/';
      const q = h.indexOf('?');
      return q !== -1 ? h.slice(0, q) : h;
    }
    match(path) {
      for (const [p, h] of Object.entries(this.routes)) {
        const re = '^' + p.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)') + '$';
        const m = path.match(new RegExp(re));
        if (m) {
          const names = (p.match(/:([a-zA-Z0-9_]+)/g) || []).map(x => x.slice(1));
          const params = {};
          names.forEach((n, i) => params[n] = m[i + 1]);
          return { handler: h, params };
        }
      }
      return null;
    }
    handle() {
      const p = this.getHash();
      const m = this.match(p);
      if (m) {
        m.handler(m.params);
      } else if (this.routes['*']) {
        this.routes['*']();
      } else {
        window.location.hash = '#/';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    start() { this.handle(); }
  }

  // ==========================================================================
  // 11. APPLICATION SHELL & PAGES
  // ==========================================================================
  function renderHeader() {
    const s = store.getState();
    return `
      <header style="position:sticky;top:0;z-index:80;background:rgba(6,17,14,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(52,211,153,0.18);padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;">
        <a href="#/" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;">
          <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:var(--grad-hero);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(16,185,129,0.5);font-size:1.2rem;">
            🌱
          </div>
          <div style="font-family:var(--font-family-display);font-size:1.2rem;font-weight:800;color:#fff;">
            Eco<span style="color:var(--color-lime-400);">Bin</span>
            <span style="font-size:0.65rem;padding:0.15rem 0.45rem;background:rgba(52,211,153,0.2);border:1px solid rgba(52,211,153,0.4);border-radius:999px;color:var(--color-emerald-300);">3D SMART</span>
          </div>
        </a>

        <!-- Fast Role Switcher -->
        <div style="display:flex;gap:0.3rem;background:rgba(11,29,23,0.8);border:1px solid rgba(52,211,153,0.25);border-radius:999px;padding:0.25rem;">
          <button class="role-btn ${s.userRole === 'citizen' ? 'active-role' : ''}" data-role="citizen">Citizen</button>
          <button class="role-btn ${s.userRole === 'officer' ? 'active-role' : ''}" data-role="officer">Officer</button>
          <button class="role-btn ${s.userRole === 'admin' ? 'active-role' : ''}" data-role="admin">Admin</button>
        </div>

        <div style="display:flex;align-items:center;gap:0.75rem;">
          <a href="#/citizen/notifications" style="position:relative;width:2.2rem;height:2.2rem;border-radius:50%;background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.3);display:flex;align-items:center;justify-content:center;text-decoration:none;">
            🔔
            ${s.unreadNotificationsCount > 0 ? `<span style="position:absolute;top:-2px;right:-2px;width:1rem;height:1rem;border-radius:50%;background:#ef4444;font-size:0.65rem;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;">${s.unreadNotificationsCount}</span>` : ''}
          </a>
          <a href="#/citizen/profile" style="display:flex;align-items:center;gap:0.4rem;text-decoration:none;padding:0.2rem 0.5rem 0.2rem 0.2rem;background:rgba(17,41,33,0.6);border-radius:999px;">
            <img src="${s.currentUser.avatar}" alt="User" style="width:1.8rem;height:1.8rem;border-radius:50%;" />
            <span style="font-size:0.8rem;color:#fff;font-weight:600;display:none;" class="desktop-name">${s.currentUser.name.split(' ')[0]}</span>
          </a>
        </div>
      </header>
      <style>
        .role-btn{background:transparent;border:none;color:var(--text-muted);padding:0.3rem 0.8rem;border-radius:999px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all var(--transition-fast);}
        .role-btn:hover{color:#fff;}
        .role-btn.active-role{background:var(--grad-eco-button);color:#fff;box-shadow:0 2px 8px rgba(16,185,129,0.4);}
        @media(min-width:768px){.desktop-name{display:inline!important;}}
      </style>
    `;
  }

  function renderBottomNav(path) {
    return `
      <nav class="citizen-bottom-nav">
        <a href="#/citizen/dashboard" class="nav-item ${path.includes('dashboard') ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span>Home</span>
        </a>
        <a href="#/citizen/map" class="nav-item ${path.includes('map') ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
          <span>Bins</span>
        </a>
        <div class="nav-fab-slot">
          <a href="#/citizen/report/new" class="nav-fab-btn" title="Report Waste">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </a>
        </div>
        <a href="#/citizen/complaints" class="nav-item ${path.includes('complaint') ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
          <span>History</span>
        </a>
        <a href="#/citizen/profile" class="nav-item ${path.includes('profile') ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Profile</span>
        </a>
      </nav>
    `;
  }

  function renderSidebar(path) {
    const role = store.getState().userRole;
    const adminLinks = [
      { l: 'Admin Dashboard', p: '#/admin/dashboard', i: '📊' },
      { l: 'Complaints Feed', p: '#/admin/complaints', i: '📋' },
      { l: 'Live City Map', p: '#/admin/map', i: '🗺️' },
      { l: 'Analytics & AI', p: '#/admin/analytics', i: '📈' },
      { l: 'User Directory', p: '#/admin/control/users', i: '👥' },
      { l: 'Bins Registry', p: '#/admin/control/bins', i: '🗑️' },
      { l: 'SLA Settings', p: '#/admin/control/settings', i: '⚙️' }
    ];
    const offLinks = [
      { l: 'My Assigned Tasks', p: '#/officer/dashboard', i: '⚡' },
      { l: 'Field Map', p: '#/officer/map', i: '🧭' },
      { l: 'Officer Profile', p: '#/officer/profile', i: '👤' }
    ];
    const links = role === 'officer' ? offLinks : adminLinks;

    return `
      <aside class="desktop-sidebar">
        <div class="sidebar-brand">
          <div style="width:2rem;height:2rem;border-radius:8px;background:var(--grad-hero);display:flex;align-items:center;justify-content:center;font-size:1.1rem;">⚡</div>
          <div>
            <div style="font-weight:800;color:#fff;">EcoBin <span style="color:var(--color-lime-400);font-size:0.8rem;">OPS</span></div>
            <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">${role.toUpperCase()} PORTAL</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${links.map(x => `<a href="${x.p}" class="sidebar-link ${path === x.p ? 'active' : ''}"><span>${x.i}</span><span>${x.l}</span></a>`).join('')}
        </nav>
        <div style="padding-top:1rem;border-top:1px solid rgba(255,255,255,0.08);">
          <a href="#/login" class="sidebar-link" style="color:#f87171;"><span>🚪</span><span>Sign Out</span></a>
        </div>
      </aside>
    `;
  }

  // ==========================================================================
  // 12. BOOTSTRAP APP CLASS
  // ==========================================================================
  class EcoBinApp {
    constructor() {
      this.root = document.getElementById('app-root');
      this.router = new Router();
      this.init();
    }

    renderShell(path) {
      const s = store.getState();
      const isOps = s.userRole === 'officer' || s.userRole === 'admin';
      const isLanding = path === '/' || path === '#/' || path.includes('/login') || path.includes('/register') || path.includes('/forgot-password');

      this.root.innerHTML = `
        <div class="app-container ${isOps && !isLanding ? 'with-sidebar' : ''}">
          ${isOps && !isLanding ? renderSidebar(path) : ''}
          <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
            ${renderHeader()}
            <main id="app-view" class="main-content"></main>
            ${!isOps && !isLanding ? renderBottomNav(path) : ''}
          </div>
        </div>
      `;

      this.root.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const r = btn.getAttribute('data-role');
          store.setRole(r);
          if (r === 'citizen') window.location.hash = '#/citizen/dashboard';
          else if (r === 'officer') window.location.hash = '#/officer/dashboard';
          else if (r === 'admin') window.location.hash = '#/admin/dashboard';
          toast.info(`Switched to: ${r.toUpperCase()}`);
        });
      });
    }

    init() {
      const wrap = (renderFn, requiredRole = null) => (params = {}) => {
        if (requiredRole && store.getState().userRole !== requiredRole) {
          store.setRole(requiredRole);
        }
        const hash = this.router.getHash();
        this.renderShell(hash);
        const view = document.getElementById('app-view');
        if (view) renderFn(view, params);
      };

      // 1. Landing Page
      this.router.add('/', wrap((container) => {
        container.innerHTML = `
          <div class="landing-page-wrapper">
            <section style="min-height:86vh;display:flex;align-items:center;justify-content:center;padding:4rem 1.5rem;position:relative;overflow:hidden;">
              <div style="max-width:1240px;width:100%;display:grid;grid-template-columns:1fr;gap:3rem;align-items:center;position:relative;z-index:10;" class="hero-grid">
                <div>
                  <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 1rem;border-radius:999px;background:rgba(16,185,129,0.15);border:1px solid rgba(52,211,153,0.35);margin-bottom:1.5rem;">
                    <span>🌱</span><span style="font-size:0.85rem;font-weight:700;color:var(--color-lime-300);text-transform:uppercase;">Next-Gen 3D Smart Waste Platform</span>
                  </div>
                  <h1 style="font-family:var(--font-family-display);font-size:clamp(2.4rem,5.2vw,4rem);font-weight:800;line-height:1.1;letter-spacing:-0.03em;color:#fff;margin-bottom:1.5rem;">
                    Spot the Waste.<br/>
                    <span style="background:var(--grad-hero);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Report in Seconds.</span><br/>
                    Track Until Clean.
                  </h1>
                  <p style="font-size:1.15rem;color:var(--text-secondary);line-height:1.6;max-width:36rem;margin-bottom:2.25rem;">
                    Empowering citizens and municipal sanitation crews with geotagged photo reporting, live IoT bin telemetry, and verified transparent resolution.
                  </p>
                  <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:2.5rem;">
                    <a href="#/citizen/report/new" class="btn-3d btn-3d-primary" style="padding:0.9rem 1.8rem;font-size:1.05rem;">📸 Report Waste Now</a>
                    <a href="#/citizen/map" class="btn-3d btn-3d-secondary" style="padding:0.9rem 1.6rem;font-size:1.05rem;">🗺️ Live Bin Map</a>
                    <a href="#/citizen/complaints" class="btn-3d btn-3d-outline" style="padding:0.9rem 1.5rem;font-size:1.05rem;">Track Complaint →</a>
                  </div>
                </div>

                <div style="display:flex;justify-content:center;">
                  <div class="depth-card" style="width:100%;max-width:440px;padding:1.75rem;text-align:center;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                      <strong style="color:#fff;">Smart Bin #B-104</strong>
                      <span style="font-size:0.75rem;padding:0.2rem 0.6rem;border-radius:999px;background:rgba(52,211,153,0.2);color:var(--color-lime-300);">Interactive 3D Demo</span>
                    </div>
                    <div id="hero-3d-bin" style="width:100%;height:320px;cursor:grab;" title="Drag to rotate 3D Bin"></div>
                    <div style="margin-top:0.75rem;background:rgba(0,0,0,0.3);padding:0.85rem;border-radius:12px;">
                      <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:0.4rem;">
                        <span style="color:var(--text-secondary);">Simulated Fill Level</span>
                        <strong id="demo-fill-label" style="color:var(--color-lime-400);">68% (Filling)</strong>
                      </div>
                      <input type="range" id="demo-fill-slider" min="5" max="100" value="68" style="width:100%;accent-color:var(--color-emerald-400);cursor:pointer;" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section style="padding:4rem 1.5rem;background:rgba(6,20,16,0.5);border-top:1px solid rgba(52,211,153,0.15);">
              <div style="max-width:1240px;margin:0 auto;text-align:center;">
                <span style="font-size:0.85rem;font-weight:700;color:var(--color-teal-400);text-transform:uppercase;">Connected Sanitation Grid</span>
                <h2 style="font-family:var(--font-family-display);font-size:2.4rem;font-weight:800;color:#fff;margin-top:0.5rem;">Smart Municipal Mesh</h2>
                <div id="iso-city-slot" style="margin-top:2rem;"></div>
              </div>
            </section>
          </div>
          <style>@media(min-width:900px){.hero-grid{grid-template-columns:1.2fr 0.8fr!important;}}</style>
        `;

        const binEl = container.querySelector('#hero-3d-bin');
        if (binEl) {
          const canvas3d = new EcoBin3DCanvas(binEl, { fillLevel: 68 });
          const slider = container.querySelector('#demo-fill-slider');
          const label = container.querySelector('#demo-fill-label');
          if (slider && label) {
            slider.addEventListener('input', (e) => {
              const val = parseInt(e.target.value, 10);
              canvas3d.setFillLevel(val);
              label.textContent = `${val}% (${val > 80 ? 'Critical' : (val > 60 ? 'Filling' : 'Normal')})`;
              label.style.color = val > 80 ? '#ef4444' : (val > 60 ? '#f59e0b' : '#34d399');
            });
          }
        }
        renderIsometricCity(container.querySelector('#iso-city-slot'));
      }));

      // 2. Auth Page
      this.router.add('/login', wrap((c) => this.renderAuth(c, 'login')));
      this.router.add('/register', wrap((c) => this.renderAuth(c, 'register')));
      this.router.add('/forgot-password', wrap((c) => this.renderAuth(c, 'reset')));

      // 3. Citizen Pages
      this.router.add('/citizen/dashboard', wrap((c) => this.renderDashboard(c), 'citizen'));
      this.router.add('/citizen/complaints', wrap((c) => this.renderDashboard(c), 'citizen'));
      this.router.add('/citizen/report/new', wrap((c) => this.renderReport(c), 'citizen'));
      this.router.add('/citizen/complaint/:id', wrap((c, p) => this.renderTracking(c, p), 'citizen'));
      this.router.add('/citizen/map', wrap((c) => this.renderMap(c), 'citizen'));
      this.router.add('/citizen/profile', wrap((c) => this.renderProfile(c), 'citizen'));
      this.router.add('/citizen/notifications', wrap((c) => this.renderNotifications(c), 'citizen'));

      // 4. Officer Pages
      this.router.add('/officer/dashboard', wrap((c) => this.renderOfficer(c), 'officer'));
      this.router.add('/officer/map', wrap((c) => this.renderMap(c), 'officer'));
      this.router.add('/officer/profile', wrap((c) => this.renderProfile(c), 'officer'));

      // 5. Admin Pages
      this.router.add('/admin/dashboard', wrap((c) => this.renderAdmin(c), 'admin'));
      this.router.add('/admin/complaints', wrap((c) => this.renderAdmin(c), 'admin'));
      this.router.add('/admin/complaint/:id', wrap((c, p) => this.renderTracking(c, p), 'admin'));
      this.router.add('/admin/map', wrap((c) => this.renderMap(c), 'admin'));
      this.router.add('/admin/analytics', wrap((c) => this.renderAnalytics(c), 'admin'));
      this.router.add('/admin/control/users', wrap((c) => this.renderControl(c, 'users'), 'admin'));
      this.router.add('/admin/control/bins', wrap((c) => this.renderControl(c, 'bins'), 'admin'));
      this.router.add('/admin/control/zones', wrap((c) => this.renderControl(c, 'zones'), 'admin'));
      this.router.add('/admin/control/settings', wrap((c) => this.renderControl(c, 'sla'), 'admin'));

      this.router.add('*', wrap((c) => window.location.hash = '#/'));

      this.router.start();
    }

    renderAuth(container, mode) {
      container.innerHTML = `
        <div style="min-height:85vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;">
          <div class="depth-card" style="width:100%;max-width:480px;padding:2.25rem;">
            <div style="text-align:center;margin-bottom:1.5rem;">
              <div style="width:3.5rem;height:3.5rem;border-radius:12px;background:var(--grad-hero);margin:0 auto 1rem auto;display:flex;align-items:center;justify-content:center;font-size:1.75rem;">🌱</div>
              <h1 style="font-family:var(--font-family-display);font-size:1.8rem;font-weight:800;color:#fff;">
                ${mode === 'register' ? 'Join EcoBin' : (mode === 'reset' ? 'Password Reset' : 'Sign In')}
              </h1>
            </div>
            <form id="auth-form" style="display:flex;flex-direction:column;gap:1rem;">
              ${mode === 'register' ? `
                <div class="eco-form-group"><label class="eco-label">Full Name</label><input type="text" id="name" class="eco-input" required /></div>
                <div class="eco-form-group"><label class="eco-label">Ward</label><input type="text" id="ward" class="eco-input" value="Ward 150 - Bellandur" required /></div>
              ` : ''}
              <div class="eco-form-group"><label class="eco-label">Email / Phone</label><input type="text" id="identity" class="eco-input" value="citizen@ecobin.city" required /></div>
              ${mode !== 'reset' ? `<div class="eco-form-group"><label class="eco-label">Password</label><input type="password" id="password" class="eco-input" value="citizen123" required /></div>` : ''}
              <button type="submit" class="btn-3d btn-3d-primary" style="padding:0.9rem;width:100%;margin-top:0.5rem;">
                ${mode === 'register' ? 'Register Account (+100 PTS)' : (mode === 'reset' ? 'Send OTP Code' : 'Sign In')}
              </button>
            </form>
            <div style="margin-top:1.25rem;background:rgba(0,0,0,0.3);padding:0.75rem;border-radius:10px;font-size:0.78rem;">
              <strong style="color:var(--color-lime-300);">Demo Logins:</strong>
              <div style="color:var(--text-secondary);margin-top:0.25rem;">
                citizen@ecobin.city (citizen123) • officer@ecobin.city (officer123) • admin@ecobin.city (admin123)
              </div>
            </div>
          </div>
        </div>
      `;
      container.querySelector('#auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const ident = container.querySelector('#identity').value;
        const pass = container.querySelector('#password') ? container.querySelector('#password').value : '';
        authService.login({ identity: ident, password: pass }).then(res => {
          if (res.success) {
            toast.success(`Welcome, ${res.user.name}!`);
            window.location.hash = res.user.role === 'admin' ? '#/admin/dashboard' : (res.user.role === 'officer' ? '#/officer/dashboard' : '#/citizen/dashboard');
          } else {
            toast.error(res.error);
          }
        });
      });
    }

    renderDashboard(container) {
      const u = authService.getCurrentUser();
      const complaints = db.getComplaints();
      const bins = db.getBins();

      container.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <div class="depth-card" style="padding:2rem;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem;">
            <div>
              <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;">
                Hello, ${u.name} 👋
              </h1>
              <p style="color:var(--text-secondary);">${u.ward} • Cleanliness Rank #3</p>
            </div>
            <div style="background:rgba(0,0,0,0.4);padding:1rem 1.5rem;border-radius:14px;border:1.5px solid rgba(245,158,11,0.4);text-align:center;">
              <div style="font-size:0.75rem;color:var(--color-lime-300);text-transform:uppercase;font-weight:800;">Eco Rewards Tier</div>
              <div style="font-size:2rem;font-weight:900;color:#fde047;">${u.ecoPoints || 480} <span style="font-size:1rem;color:#fff;">PTS</span></div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${u.tier || 'Gold Citizen'}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-bottom:2.5rem;">
            <div class="depth-card kpi-card"><div class="kpi-header"><span class="kpi-title">My Reports</span><div class="kpi-icon-badge">📋</div></div><div class="kpi-value">${complaints.length}</div></div>
            <div class="depth-card kpi-card"><div class="kpi-header"><span class="kpi-title">In Progress</span><div class="kpi-icon-badge" style="color:#c084fc;">⚡</div></div><div class="kpi-value">${complaints.filter(c=>c.status!=='resolved'&&c.status!=='closed').length}</div></div>
            <div class="depth-card kpi-card"><div class="kpi-header"><span class="kpi-title">Resolved</span><div class="kpi-icon-badge" style="color:#34d399;">✅</div></div><div class="kpi-value">${complaints.filter(c=>c.status==='resolved'||c.status==='closed').length}</div></div>
          </div>

          <div style="display:grid;grid-template-columns:1fr;gap:2rem;" class="dash-grid">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
                <h2 style="font-family:var(--font-family-display);font-size:1.35rem;font-weight:700;color:#fff;">Recent Complaints</h2>
                <a href="#/citizen/report/new" class="btn-3d btn-3d-primary" style="padding:0.5rem 1rem;font-size:0.85rem;">+ New Report</a>
              </div>
              <div style="display:flex;flex-direction:column;gap:1rem;">
                ${complaints.map(item => `
                  <div class="depth-card" style="padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                      <div>
                        <span style="font-family:var(--font-family-mono);color:var(--color-lime-300);font-size:0.8rem;font-weight:700;">${item.id}</span>
                        <h3 style="font-size:1.1rem;color:#fff;font-weight:700;margin-top:0.2rem;">${item.category}</h3>
                      </div>
                      <div style="display:flex;gap:0.4rem;">${createSeverityBadge(item.severity)}${createStatusPill(item.status)}</div>
                    </div>
                    <p style="font-size:0.9rem;color:var(--text-secondary);">${item.description || ''}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:0.6rem;font-size:0.8rem;">
                      <span>📍 ${item.address}</span>
                      <a href="#/citizen/complaint/${item.id}" style="color:var(--color-emerald-400);font-weight:700;text-decoration:none;">Track Timeline →</a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <h2 style="font-family:var(--font-family-display);font-size:1.35rem;font-weight:700;color:#fff;margin-bottom:1.25rem;">Nearest Smart Bins</h2>
              <div style="display:flex;flex-direction:column;gap:1rem;">
                ${bins.map(bin => `
                  <div class="depth-card" style="padding:1.25rem;display:flex;flex-direction:column;gap:0.6rem;">
                    <div style="display:flex;justify-content:space-between;"><strong style="color:#fff;">${bin.location}</strong><span style="font-size:0.75rem;color:var(--text-muted);">${bin.id}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;"><span style="color:var(--text-muted);">Capacity</span><strong>${bin.fillLevel}%</strong></div>
                    <div class="bin-gauge"><div class="bin-gauge-fill" style="width:${bin.fillLevel}%;background:${bin.fillLevel>80?'#ef4444':(bin.fillLevel>60?'#f59e0b':'#10b981')};"></div></div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <style>@media(min-width:900px){.dash-grid{grid-template-columns:1.25fr 0.75fr!important;}}</style>
      `;
    }

    renderReport(container) {
      container.innerHTML = `
        <div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">
            File a Waste Complaint
          </h1>
          <form id="new-report-form" class="depth-card" style="padding:2rem;display:flex;flex-direction:column;gap:1.5rem;">
            <div class="eco-form-group">
              <label class="eco-label">Select Category</label>
              <select id="rep-cat" class="eco-select">
                ${APP_CONFIG.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="eco-form-group">
              <label class="eco-label">Priority Severity</label>
              <select id="rep-sev" class="eco-select">
                ${APP_CONFIG.severities.map(s => `<option value="${s.id}">${s.name} (${s.slaHours}h SLA)</option>`).join('')}
              </select>
            </div>
            <div class="eco-form-group">
              <label class="eco-label">Location Landmark / Address</label>
              <input type="text" id="rep-addr" class="eco-input" value="Near Metro Pillar #42, Indiranagar Ward 72" required />
            </div>
            <div class="eco-form-group">
              <label class="eco-label">Remarks & Details</label>
              <textarea id="rep-desc" class="eco-textarea" rows="3" placeholder="Provide extra landmarks for the crew...">Commercial debris spilled onto the walkway.</textarea>
            </div>
            <button type="submit" class="btn-3d btn-3d-primary" style="padding:1rem;font-size:1.05rem;">
              🚀 Submit Verified Report (+50 PTS)
            </button>
          </form>
        </div>
      `;
      container.querySelector('#new-report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const created = db.createComplaint({
          category: container.querySelector('#rep-cat').value,
          severity: container.querySelector('#rep-sev').value,
          address: container.querySelector('#rep-addr').value,
          ward: 'Ward 72 - Indiranagar',
          description: container.querySelector('#rep-desc').value,
          photos: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80']
        });
        toast.success(`Complaint #${created.id} filed! +50 Eco Points earned!`);
        setTimeout(() => window.location.hash = `#/citizen/complaint/${created.id}`, 500);
      });
    }

    renderTracking(container, params) {
      const id = params.id || (db.getComplaints()[0] && db.getComplaints()[0].id) || 'ECO-2026-8941';
      const c = db.getComplaintById(id) || db.getComplaints()[0];

      container.innerHTML = `
        <div style="max-width:880px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <a href="#/citizen/dashboard" style="color:var(--color-emerald-400);text-decoration:none;font-weight:700;">← Back to Complaints</a>
          <div class="depth-card" style="padding:2rem;margin:1.5rem 0;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
              <div>
                <span style="font-family:var(--font-family-mono);color:var(--color-lime-300);font-weight:700;">${c.id}</span>
                <h1 style="font-family:var(--font-family-display);font-size:1.8rem;color:#fff;font-weight:800;margin-top:0.25rem;">${c.category}</h1>
                <p style="color:var(--text-secondary);">📍 ${c.address}</p>
              </div>
              <div>${createStatusPill(c.status)}</div>
            </div>
            <p style="margin-top:1rem;color:#ddd;line-height:1.6;">${c.description}</p>
          </div>

          <div class="depth-card" style="padding:2rem;">
            <h2 style="font-family:var(--font-family-display);font-size:1.4rem;color:#fff;margin-bottom:1.5rem;">Resolution Timeline</h2>
            <div class="eco-timeline">
              <div class="timeline-step completed"><div class="timeline-dot">✓</div><div class="timeline-content"><strong>1. Report Submitted</strong><p style="font-size:0.85rem;color:#aaa;">GPS verified.</p></div></div>
              <div class="timeline-step ${c.status !== 'submitted' ? 'completed' : 'active'}"><div class="timeline-dot">✓</div><div class="timeline-content"><strong>2. Dispatched</strong><p style="font-size:0.85rem;color:#aaa;">Officer assigned: ${c.assignedOfficer || 'Sanitation Team'}</p></div></div>
              <div class="timeline-step ${c.status === 'resolved' || c.status === 'closed' ? 'completed' : 'active'}"><div class="timeline-dot">•</div><div class="timeline-content"><strong>3. Clean-up & Verification</strong><p style="font-size:0.85rem;color:#aaa;">Target SLA: within 4 hours</p></div></div>
            </div>
          </div>
        </div>
      `;
    }

    renderMap(container) {
      const bins = db.getBins();
      container.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Live Smart Bins Map</h1>
          <div class="depth-card" style="height:380px;display:flex;align-items:center;justify-content:center;background:#061712;margin-bottom:2rem;position:relative;">
            <div style="text-align:center;">
              <div style="font-size:3rem;">🗺️</div>
              <h3 style="color:#fff;margin-top:0.5rem;">Connected Smart Bins Grid</h3>
              <p style="color:var(--text-secondary);">${bins.length} IoT Ultrasonic sensors active</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;">
            ${bins.map(b => `
              <div class="depth-card" style="padding:1.25rem;border-left:4px solid ${b.fillLevel>80?'#ef4444':(b.fillLevel>60?'#f59e0b':'#10b981')};">
                <strong style="color:#fff;font-size:1.05rem;">${b.location}</strong>
                <div style="color:var(--text-secondary);font-size:0.85rem;margin:0.25rem 0;">Type: ${b.type}</div>
                <div style="font-weight:700;color:var(--color-lime-300);">Sensor Fill: ${b.fillLevel}%</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderOfficer(container) {
      const tasks = db.getComplaints();
      container.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Officer Task Queue</h1>
          <div style="display:flex;flex-direction:column;gap:1.25rem;">
            ${tasks.map(t => `
              <div class="depth-card" style="padding:1.5rem;display:flex;flex-direction:column;gap:0.75rem;">
                <div style="display:flex;justify-content:space-between;"><strong style="color:#fff;font-size:1.15rem;">${t.category}</strong>${createStatusPill(t.status)}</div>
                <p style="color:var(--text-secondary);">${t.address}</p>
                <div style="display:flex;gap:0.75rem;margin-top:0.5rem;">
                  <button class="btn-3d btn-3d-primary officer-resolve-btn" data-id="${t.id}">Upload Proof & Resolve</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.querySelectorAll('.officer-resolve-btn').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          db.updateComplaint(id, { status: 'resolved' });
          toast.success(`Complaint #${id} marked as resolved!`);
          this.renderOfficer(container);
        });
      });
    }

    renderAdmin(container) {
      const complaints = db.getComplaints();
      container.innerHTML = `
        <div style="max-width:1240px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Admin Operations</h1>
          <div class="depth-card" style="padding:1.5rem;overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid rgba(52,211,153,0.3);color:var(--text-muted);font-size:0.8rem;">
                  <th style="padding:0.75rem;">ID</th><th>Category</th><th>Ward</th><th>Severity</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${complaints.map(c => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                    <td style="padding:0.75rem;color:var(--color-lime-300);font-family:var(--font-family-mono);">${c.id}</td>
                    <td style="color:#fff;">${c.category}</td>
                    <td style="color:var(--text-secondary);">${c.ward}</td>
                    <td>${createSeverityBadge(c.severity)}</td>
                    <td>${createStatusPill(c.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    renderAnalytics(container) {
      container.innerHTML = `
        <div style="max-width:1240px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Analytics & AI Briefing</h1>
          <div class="depth-card" style="padding:2rem;background:linear-gradient(135deg,rgba(32,18,52,0.9) 0%,rgba(9,23,18,0.98) 100%);border:1.5px solid rgba(168,85,247,0.45);">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
              <span style="font-size:1.5rem;">✨</span>
              <h3 style="color:#fff;font-size:1.3rem;">AI Municipal Health Briefing</h3>
            </div>
            <p style="color:#fff;line-height:1.7;">
              Analysis indicates a <strong>34% surge in smart bin fill rates</strong> across Ward 150 (Bellandur). Recommend re-deploying EV Patrol #12 for scheduled evening run before 6:30 PM.
            </p>
          </div>
        </div>
      `;
    }

    renderControl(container, tab) {
      const bins = db.getBins();
      container.innerHTML = `
        <div style="max-width:1240px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Control Panel: ${tab.toUpperCase()}</h1>
          <div class="depth-card" style="padding:2rem;">
            ${bins.map(b => `<div style="padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><strong style="color:#fff;">${b.location}</strong><span style="color:var(--color-lime-300);">${b.fillLevel}% Fill</span></div>`).join('')}
          </div>
        </div>
      `;
    }

    renderProfile(container) {
      const u = authService.getCurrentUser();
      container.innerHTML = `
        <div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">User Profile</h1>
          <div class="depth-card" style="padding:2rem;display:flex;flex-direction:column;gap:1rem;">
            <div style="display:flex;align-items:center;gap:1.5rem;">
              <img src="${u.avatar}" alt="Avatar" style="width:5rem;height:5rem;border-radius:50%;border:2px solid var(--color-emerald-400);" />
              <div><h2 style="color:#fff;">${u.name}</h2><p style="color:var(--text-secondary);">${u.email} • ${u.ward}</p></div>
            </div>
            <button id="prof-logout-btn" class="btn-3d btn-3d-outline" style="align-self:flex-start;color:#f87171;border-color:rgba(239,68,68,0.4);margin-top:1rem;">Sign Out</button>
          </div>
        </div>
      `;
      container.querySelector('#prof-logout-btn').addEventListener('click', () => {
        authService.logout();
        toast.info('Signed out.');
        window.location.hash = '#/login';
      });
    }

    renderNotifications(container) {
      const n = db.getNotifications();
      container.innerHTML = `
        <div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;">
          <h1 style="font-family:var(--font-family-display);font-size:2rem;font-weight:800;color:#fff;margin-bottom:1.5rem;">Notifications</h1>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            ${n.map(x => `<div class="depth-card" style="padding:1.25rem;"><strong style="color:#fff;">${x.title}</strong><p style="color:var(--text-secondary);margin-top:0.25rem;">${x.message}</p></div>`).join('')}
          </div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 13. RESILIENT BOOTSTRAP (Runs immediately if ready, or on DOMContentLoaded)
  // ==========================================================================
  function bootstrap() {
    try {
      new EcoBinApp();
      console.log('[EcoBin 3D] Application mounted successfully.');
    } catch (err) {
      console.error('[EcoBin 3D] Mount Error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
