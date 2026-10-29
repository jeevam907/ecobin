/**
 * EcoBin Universal Top Navigation Header
 * Brand Logo, Role Switcher (Preview Mode), Language Selector, Live Status
 */

import { APP_CONFIG } from '../../config.js';
import { store } from '../../store.js';

export function renderHeader() {
  const state = store.getState();

  return `
    <header style="position: sticky; top: 0; z-index: 80; background: rgba(6, 17, 14, 0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(52, 211, 153, 0.18); padding: 0.75rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
      <!-- Brand Logo -->
      <a href="#/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none;">
        <div style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-md); background: var(--grad-hero); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5); border: 1px solid rgba(255, 255, 255, 0.4);">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <path d="M10 11v6M14 11v6"></path>
          </svg>
        </div>
        <div>
          <div style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.4rem;">
            Eco<span style="color: var(--color-lime-400);">Bin</span>
            <span style="font-size: 0.65rem; padding: 0.15rem 0.45rem; background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.4); border-radius: var(--radius-full); color: var(--color-emerald-300); font-weight: 700;">3D SMART</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-muted); display: none;" class="desktop-only-tagline">Report. Track. Clean.</div>
        </div>
      </a>

      <!-- Center: Role Switcher Toolbar (Crucial for Rapid Multi-Role Verification) -->
      <div style="display: flex; align-items: center; gap: 0.35rem; background: rgba(11, 29, 23, 0.8); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: var(--radius-full); padding: 0.25rem; box-shadow: var(--shadow-3d-sm);">
        <button class="role-switch-btn ${state.userRole === APP_CONFIG.roles.CITIZEN ? 'active-role' : ''}" data-role="citizen">Citizen</button>
        <button class="role-switch-btn ${state.userRole === APP_CONFIG.roles.OFFICER ? 'active-role' : ''}" data-role="officer">Officer</button>
        <button class="role-switch-btn ${state.userRole === APP_CONFIG.roles.ADMIN ? 'active-role' : ''}" data-role="admin">Admin</button>
      </div>

      <!-- Right Action Tools -->
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <!-- Online/Offline Indicator -->
        <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: ${state.isOnline ? '#34d399' : '#f87171'}; background: rgba(0,0,0,0.3); padding: 0.3rem 0.6rem; border-radius: var(--radius-full); border: 1px solid currentColor;">
          <span style="width: 0.45rem; height: 0.45rem; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px currentColor;"></span>
          <span style="font-weight: 600;">${state.isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <!-- Language Selector -->
        <select id="header-lang-select" style="background: rgba(11, 29, 23, 0.8); border: 1px solid rgba(52, 211, 153, 0.3); color: var(--text-primary); border-radius: var(--radius-md); padding: 0.35rem 0.6rem; font-size: 0.8rem; cursor: pointer;">
          ${APP_CONFIG.languages.map(l => `<option value="${l.code}" ${l.code === state.currentLanguage ? 'selected' : ''}>${l.label.split(' ')[0]}</option>`).join('')}
        </select>

        <!-- Quick Notifications Pill -->
        <a href="#/citizen/notifications" style="position: relative; width: 2.3rem; height: 2.3rem; border-radius: 50%; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.3); display: flex; align-items: center; justify-content: center; text-decoration: none; color: #ffffff;">
          🔔
          ${state.unreadNotificationsCount > 0 ? `
            <span style="position: absolute; top: -3px; right: -3px; width: 1.1rem; height: 1.1rem; background: #ef4444; border-radius: 50%; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg-app);">${state.unreadNotificationsCount}</span>
          ` : ''}
        </a>

        <!-- User Profile Avatar Pill -->
        <a href="#/citizen/profile" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 0.25rem 0.6rem 0.25rem 0.25rem; background: rgba(17, 41, 33, 0.6); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: var(--radius-full);">
          <img src="${state.currentUser.avatar}" alt="Avatar" style="width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #064e3b;" />
          <span style="font-size: 0.82rem; font-weight: 600; color: #ffffff; display: none;" class="desktop-only-username">${state.currentUser.name.split(' ')[0]}</span>
        </a>
      </div>
    </header>

    <style>
      .role-switch-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        padding: 0.35rem 0.85rem;
        border-radius: var(--radius-full);
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      .role-switch-btn:hover {
        color: #ffffff;
      }
      .role-switch-btn.active-role {
        background: var(--grad-eco-button);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
      }
      @media (min-width: 768px) {
        .desktop-only-tagline { display: block !important; }
        .desktop-only-username { display: inline !important; }
      }
    </style>
  `;
}
