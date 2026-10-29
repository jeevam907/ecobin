/**
 * EcoBin Sidebar Component for Municipal Admin and Field Officers
 */

import { APP_CONFIG } from '../../config.js';
import { store } from '../../store.js';

export function renderSidebar(currentPath = '#/admin/dashboard') {
  const role = store.getState().userRole;

  const adminLinks = [
    { label: 'Admin Dashboard', path: '#/admin/dashboard', icon: '📊' },
    { label: 'Complaints Feed', path: '#/admin/complaints', icon: '📋' },
    { label: 'Live City Map', path: '#/admin/map', icon: '🗺️' },
    { label: 'Analytics & AI', path: '#/admin/analytics', icon: '📈' },
    { label: 'User Directory', path: '#/admin/control/users', icon: '👥' },
    { label: 'Smart Bins Registry', path: '#/admin/control/bins', icon: '🗑️' },
    { label: 'Wards & Zones', path: '#/admin/control/zones', icon: '📍' },
    { label: 'System Settings', path: '#/admin/control/settings', icon: '⚙️' }
  ];

  const officerLinks = [
    { label: 'My Assigned Tasks', path: '#/officer/dashboard', icon: '⚡' },
    { label: 'Field Navigation Map', path: '#/officer/map', icon: '🧭' },
    { label: 'Officer Profile', path: '#/officer/profile', icon: '👤' }
  ];

  const links = role === APP_CONFIG.roles.OFFICER ? officerLinks : adminLinks;

  return `
    <aside class="desktop-sidebar" aria-label="Operational Navigation">
      <div class="sidebar-brand">
        <div style="width: 2.2rem; height: 2.2rem; border-radius: var(--radius-md); background: var(--grad-hero); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
          ⚡
        </div>
        <div>
          <div style="font-weight: 800; font-family: var(--font-family-display); color: #ffffff; font-size: 1rem;">
            EcoBin <span style="color: var(--color-lime-400); font-size: 0.8rem;">OPS</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
            ${role === APP_CONFIG.roles.OFFICER ? 'Field Officer Portal' : 'Municipal Control'}
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${links.map(item => `
          <a href="${item.path}" class="sidebar-link ${currentPath === item.path ? 'active' : ''}">
            <span style="font-size: 1.15rem;">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div style="padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 0.5rem;">
        <a href="#/login" class="sidebar-link" style="color: #f87171;">
          <span>🚪</span>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  `;
}
