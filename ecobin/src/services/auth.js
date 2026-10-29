/**
 * EcoBin Authentication Service
 * Validation, Session Retention, Role-Based Access Guards, OTP Workflow & Supabase Bridge
 */

import { db } from './db.js';
import { supabaseAuth, SUPABASE_CONFIG } from './supabase.js';
import { store } from '../store.js';

const SESSION_KEY = 'ecobin_session';

export const authService = {
  /**
   * Get current authenticated session from storage
   */
  getSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  },

  isAuthenticated() {
    const session = this.getSession();
    if (!session || !session.expiresAt) return false;
    return new Date().getTime() < session.expiresAt;
  },

  /**
   * Set user session with 7-day expiry
   */
  saveSession(user) {
    const session = {
      user,
      token: `jwt_ecobin_${btoa(user.id + ':' + Date.now())}`,
      expiresAt: new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    store.update({
      currentUser: user,
      userRole: user.role
    });
    return session;
  },

  /**
   * Clear session
   */
  logout() {
    const user = this.getCurrentUser();
    if (user) {
      db.logAudit(user.id, user.name, 'USER_LOGOUT', 'User signed out');
    }
    localStorage.removeItem(SESSION_KEY);
    store.setRole('citizen');
  },

  /**
   * Register Citizen Account
   */
  async register({ name, email, phone, ward, zone = 'East Zone', password }) {
    // Validation
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter a valid full name (at least 2 characters).' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: 'Please provide a valid 10-digit mobile number for SMS OTP.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check duplicate
    if (db.findUserByEmail(email)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }
    if (db.findUserByPhone(phone)) {
      return { success: false, error: 'An account with this phone number already exists.' };
    }

    // Try Supabase Auth if connected
    if (SUPABASE_CONFIG.isConfigured()) {
      const cloudRes = await supabaseAuth.signUp({
        email,
        password,
        metadata: { name, phone, ward, role: 'citizen' }
      });
      if (cloudRes.error && cloudRes.error !== 'SUPABASE_NOT_CONFIGURED') {
        return { success: false, error: cloudRes.error };
      }
    }

    // Save to database
    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ward,
      zone,
      passwordHash: password, // In production hashed server-side
      role: 'citizen'
    });

    this.saveSession(newUser);
    return { success: true, user: newUser };
  },

  /**
   * Sign In with Email/Mobile & Password
   */
  async login({ identity, password, roleHint = 'citizen' }) {
    if (!identity || !identity.trim()) {
      return { success: false, error: 'Please enter your email or mobile number.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const cleanIdentity = identity.trim().toLowerCase();
    let user = db.findUserByEmail(cleanIdentity);
    if (!user) {
      user = db.findUserByPhone(cleanIdentity);
    }

    if (!user) {
      return { success: false, error: 'No account found matching this email or mobile number.' };
    }

    if (!user.active) {
      return { success: false, error: 'Your account has been deactivated by the municipal administrator.' };
    }

    // Check password
    if (user.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Role check if logging into admin staff portal
    if (roleHint === 'admin' && user.role !== 'admin' && user.role !== 'officer' && user.role !== 'supervisor') {
      return { success: false, error: 'Access denied: Citizen accounts cannot access the Municipal Staff portal.' };
    }

    this.saveSession(user);
    db.logAudit(user.id, user.name, 'USER_LOGIN', `User signed in as ${user.role}`);
    return { success: true, user };
  },

  /**
   * Reset Password Request
   */
  async requestPasswordReset(identity) {
    if (!identity) {
      return { success: false, error: 'Please enter your email or mobile phone.' };
    }
    const user = db.findUserByEmail(identity) || db.findUserByPhone(identity);
    if (!user) {
      return { success: false, error: 'No account found with this contact detail.' };
    }
    // Simulate sending 6-digit OTP
    return { success: true, message: `OTP sent to ${identity}. (Use demo OTP: 123456)` };
  },

  /**
   * Verify Reset OTP and update password
   */
  async resetPassword({ identity, otp, newPassword }) {
    if (otp !== '123456' && otp !== '999999') {
      return { success: false, error: 'Invalid 6-digit verification code.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    const user = db.findUserByEmail(identity) || db.findUserByPhone(identity);
    if (user) {
      db.updateUser(user.id, { passwordHash: newPassword });
      db.logAudit(user.id, user.name, 'PASSWORD_RESET', 'Password successfully updated via OTP');
      return { success: true };
    }
    return { success: false, error: 'User not found.' };
  },

  /**
   * Role Access Guard for Routes
   */
  checkAccess(requiredRole, currentPath) {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (requiredRole === 'admin') {
      return user.role === 'admin' || user.role === 'supervisor';
    }
    if (requiredRole === 'officer') {
      return user.role === 'officer' || user.role === 'admin';
    }
    return true;
  }
};
