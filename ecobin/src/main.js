/**
 * EcoBin Main Application Entry Point
 * Shell Assembly, Navigation Routing, 3D Canvas Lifecycle & Store Subscriptions
 */

import { APP_CONFIG } from './config.js';
import { store } from './store.js';
import { db } from './services/db.js';
import { authService } from './services/auth.js';
import { Router } from './router.js';

// Navigation Components
import { renderHeader } from './components/navigation/Header.js';
import { renderCitizenBottomNav } from './components/navigation/CitizenBottomNav.js';
import { renderSidebar } from './components/navigation/Sidebar.js';
import { toast } from './components/ui/Toast.js';

// Page Views
import { renderLandingPage } from './pages/LandingPage.js';
import { renderAuthPage } from './pages/AuthPage.js';
import { renderCitizenDashboard } from './pages/CitizenDashboardPage.js';
import { renderCitizenReportPage } from './pages/CitizenReportPage.js';
import { renderCitizenTrackingPage } from './pages/CitizenTrackingPage.js';
import { renderBinMapPage } from './pages/BinMapPage.js';
import { renderOfficerDashboardPage } from './pages/OfficerDashboardPage.js';
import { renderAdminDashboardPage } from './pages/AdminDashboardPage.js';
import { renderAnalyticsPage } from './pages/AnalyticsPage.js';
import { renderControlPanelPage } from './pages/ControlPanelPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';

class EcoBinApp {
  constructor() {
    this.root = document.getElementById('app-root');
    this.router = new Router();
    this.restoreSession();
    this.setupRoutes();
    this.setupStoreSubscription();
    this.registerPWA();
  }

  restoreSession() {
    const session = authService.getSession();
    if (session && session.user) {
      store.update({
        currentUser: session.user,
        userRole: session.user.role
      });
    }
  }

  registerPWA() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(
          (reg) => console.log('[PWA] Service Worker registered with scope:', reg.scope),
          (err) => console.warn('[PWA] Service Worker registration failed:', err)
        );
      });
    }
  }

  setupRoutes() {
    const wrap = (renderer, requiredRole = null) => (params = {}) => {
      const currentRole = store.getState().userRole;
      
      // Role protection check
      if (requiredRole && requiredRole !== 'guest') {
        const user = authService.getCurrentUser();
        // If route is admin or officer and user has wrong role, inform and redirect
        if (requiredRole === 'admin' && currentRole !== 'admin' && (!user || user.role !== 'admin')) {
          toast.error('Admin credentials required to access the Municipal Control center.');
          store.setRole('admin'); // For development demo convenience allow role switch
        } else if (requiredRole === 'officer' && currentRole !== 'officer' && (!user || user.role !== 'officer')) {
          store.setRole('officer');
        } else if (routeRoleMatches(requiredRole, currentRole)) {
          store.setRole(requiredRole);
        }
      }

      this.renderShell(this.router.getHashPath());
      const viewContainer = document.getElementById('app-view');
      if (viewContainer) {
        renderer(viewContainer, params);
      }
    };

    function routeRoleMatches(required, current) {
      return required && current !== required;
    }

    // 1. Welcome / Landing
    this.router.addRoute('/', wrap(renderLandingPage));

    // 2. Authentication
    this.router.addRoute('/login', wrap((c) => renderAuthPage(c, 'login')));
    this.router.addRoute('/register', wrap((c) => renderAuthPage(c, 'register')));
    this.router.addRoute('/forgot-password', wrap((c) => renderAuthPage(c, 'reset')));

    // 3. Citizen Routes
    this.router.addRoute('/citizen/dashboard', wrap(renderCitizenDashboard, APP_CONFIG.roles.CITIZEN));
    this.router.addRoute('/citizen/report/new', wrap(renderCitizenReportPage, APP_CONFIG.roles.CITIZEN));
    this.router.addRoute('/citizen/complaints', wrap(renderCitizenDashboard, APP_CONFIG.roles.CITIZEN));
    this.router.addRoute('/citizen/complaint/:id', wrap((c, p) => renderCitizenTrackingPage(c, p), APP_CONFIG.roles.CITIZEN));
    this.router.addRoute('/citizen/map', wrap(renderBinMapPage, APP_CONFIG.roles.CITIZEN));
    this.router.addRoute('/citizen/profile', wrap(renderProfilePage, APP_CONFIG.roles.CITIZEN));
    
    // Notifications Center Screen
    this.router.addRoute('/citizen/notifications', wrap((c) => {
      const notifs = db.getNotifications();
      c.innerHTML = `
        <div style="max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-family: var(--font-family-display); font-size: 2rem; font-weight: 800; color: #ffffff;">
                Notification Center
              </h1>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Real-time dispatch and status alerts</p>
            </div>
            <button id="mark-all-read-btn" class="btn-3d btn-3d-outline" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
              ✓ Mark All Read
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${notifs.length === 0 ? `
              <div class="depth-card" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                You have no notifications at this time.
              </div>
            ` : notifs.map(n => `
              <div class="depth-card" style="padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: center; border-left: 4px solid ${n.isRead ? 'rgba(52, 211, 153, 0.3)' : 'var(--color-lime-400)'};">
                <span style="font-size: 1.75rem;">
                  ${n.type === 'points' ? '🌱' : (n.type === 'resolved' ? '✅' : '⚡')}
                </span>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #ffffff; font-size: 1rem;">${n.title}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${n.createdAt}</span>
                  </div>
                  <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0.25rem 0 0.5rem 0;">${n.message}</p>
                  ${n.link ? `<a href="${n.link}" style="color: var(--color-emerald-400); font-size: 0.82rem; font-weight: 700; text-decoration: none;">View Details →</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const markBtn = c.querySelector('#mark-all-read-btn');
      if (markBtn) {
        markBtn.addEventListener('click', () => {
          db.markAllNotificationsRead();
          store.update({ unreadNotificationsCount: 0 });
          toast.success('All notifications marked as read.');
          window.location.reload();
        });
      }
    }, APP_CONFIG.roles.CITIZEN));

    // 4. Officer Routes
    this.router.addRoute('/officer/dashboard', wrap(renderOfficerDashboardPage, APP_CONFIG.roles.OFFICER));
    this.router.addRoute('/officer/map', wrap(renderBinMapPage, APP_CONFIG.roles.OFFICER));
    this.router.addRoute('/officer/profile', wrap(renderProfilePage, APP_CONFIG.roles.OFFICER));

    // 5. Municipal Admin Routes
    this.router.addRoute('/admin/dashboard', wrap(renderAdminDashboardPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/complaints', wrap(renderAdminDashboardPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/complaint/:id', wrap((c, p) => renderCitizenTrackingPage(c, p), APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/map', wrap(renderBinMapPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/analytics', wrap(renderAnalyticsPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/control/users', wrap(renderControlPanelPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/control/bins', wrap(renderControlPanelPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/control/zones', wrap(renderControlPanelPage, APP_CONFIG.roles.ADMIN));
    this.router.addRoute('/admin/control/settings', wrap(renderControlPanelPage, APP_CONFIG.roles.ADMIN));

    // Catch-all
    this.router.addRoute('*', wrap(renderLandingPage));
  }

  renderShell(currentHash) {
    const state = store.getState();
    const isCitizen = state.userRole === APP_CONFIG.roles.CITIZEN;
    const isOps = state.userRole === APP_CONFIG.roles.OFFICER || state.userRole === APP_CONFIG.roles.ADMIN;
    const isLanding = currentHash === '/' || currentHash === '#/' || currentHash.startsWith('#/login') || currentHash.startsWith('#/register') || currentHash.startsWith('#/forgot-password');

    this.root.innerHTML = `
      <div class="app-container ${isOps && !isLanding ? 'with-sidebar' : ''}">
        <!-- Desktop / Operational Sidebar -->
        ${isOps && !isLanding ? renderSidebar(currentHash) : ''}

        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
          <!-- Universal Header -->
          ${renderHeader()}

          <!-- Dynamic Page View Slot -->
          <main id="app-view" class="main-content"></main>

          <!-- Citizen Bottom Nav Bar (Mobile & Citizen View) -->
          ${isCitizen && !isLanding ? renderCitizenBottomNav(currentHash) : ''}
        </div>
      </div>
    `;

    // Hook Header Role Switchers
    this.root.querySelectorAll('.role-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        store.setRole(role);
        if (role === APP_CONFIG.roles.CITIZEN) {
          window.location.hash = '#/citizen/dashboard';
        } else if (role === APP_CONFIG.roles.OFFICER) {
          window.location.hash = '#/officer/dashboard';
        } else if (role === APP_CONFIG.roles.ADMIN) {
          window.location.hash = '#/admin/dashboard';
        }
        toast.info(`Switched view mode to: ${role.toUpperCase()}`);
      });
    });

    // Hook Language Select
    const langSelect = this.root.querySelector('#header-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        store.setLanguage(e.target.value);
        toast.info(`Interface language set to: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }
  }

  setupStoreSubscription() {
    store.subscribe((state) => {
      const activeBtn = this.root.querySelector(`.role-switch-btn[data-role="${state.userRole}"]`);
      if (activeBtn) {
        this.root.querySelectorAll('.role-switch-btn').forEach(b => b.classList.remove('active-role'));
        activeBtn.classList.add('active-role');
      }
    });
  }

  start() {
    this.router.start();
  }
}

// Resilient Bootstrap (Executes immediately if DOM ready, or awaits DOMContentLoaded)
function bootstrap() {
  try {
    const app = new EcoBinApp();
    app.start();
  } catch (err) {
    console.error('[EcoBin] Boot Error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
