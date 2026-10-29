/**
 * EcoBin Profile & Preferences Page (Phase 3 & 11)
 * User Profile Editing, Eco Points Gamification Tier Roadmap, Notification Preferences & Sign Out
 */

import { db } from '../services/db.js';
import { authService } from '../services/auth.js';
import { toast } from '../components/ui/Toast.js';

export function renderProfilePage(container) {
  let user = authService.getCurrentUser() || {
    id: 'usr_citizen_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    ward: 'Ward 150 - Bellandur',
    zone: 'East Zone',
    ecoPoints: 480,
    tier: 'Gold Citizen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
  };

  function render() {
    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Profile Identity Card -->
        <div class="depth-card" style="padding: 2.25rem; border: 1.5px solid rgba(52, 211, 153, 0.35); margin-bottom: 2rem; background: linear-gradient(135deg, rgba(16, 44, 34, 0.95) 0%, rgba(9, 23, 18, 0.98) 100%);">
          <div style="display: flex; align-items: center; gap: 1.75rem; flex-wrap: wrap;">
            <div style="position: relative;">
              <img src="${user.avatar}" alt="Avatar" style="width: 5.5rem; height: 5.5rem; border-radius: 50%; border: 3px solid var(--color-emerald-400); box-shadow: var(--shadow-3d-md); background: #064e3b;" />
              <button type="button" id="refresh-avatar-btn" style="position: absolute; bottom: 0; right: 0; width: 1.8rem; height: 1.8rem; border-radius: 50%; background: var(--grad-hero); border: 2px solid var(--bg-app); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;" title="Randomize Avatar">🎲</button>
            </div>
            
            <div style="flex: 1;">
              <h1 style="font-family: var(--font-family-display); font-size: 1.9rem; font-weight: 800; color: #ffffff;">
                ${user.name}
              </h1>
              <div style="color: var(--text-secondary); font-size: 0.92rem; margin-top: 0.25rem;">
                ${user.email} | ${user.phone}
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.6rem; flex-wrap: wrap;">
                <span style="font-size: 0.82rem; padding: 0.25rem 0.75rem; border-radius: 999px; background: rgba(132, 204, 22, 0.2); color: var(--color-lime-300); font-weight: 800;">
                  🌱 ${user.tier || 'Gold Citizen'} (${user.ecoPoints || 480} PTS)
                </span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${user.ward}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gamification Tier Roadmap -->
        <div class="depth-card" style="padding: 2rem; margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-bottom: 1.25rem;">
            🏆 Eco Rewards Tier Progression
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; text-align: center;">
            <div style="padding: 1rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 1.5rem;">🥉</div>
              <div style="font-weight: 700; color: #ffffff; margin-top: 0.25rem;">Bronze</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">0 - 199 PTS</div>
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 1.5rem;">🥈</div>
              <div style="font-weight: 700; color: #ffffff; margin-top: 0.25rem;">Silver</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">200 - 399 PTS</div>
            </div>
            <div style="padding: 1rem; background: rgba(16, 185, 129, 0.15); border-radius: var(--radius-md); border: 1.5px solid var(--color-emerald-400); box-shadow: var(--shadow-3d-sm);">
              <div style="font-size: 1.5rem;">🥇</div>
              <div style="font-weight: 800; color: var(--color-lime-300); margin-top: 0.25rem;">Gold (Current)</div>
              <div style="font-size: 0.75rem; color: #bef264;">400 - 699 PTS</div>
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 1.5rem;">💎</div>
              <div style="font-weight: 700; color: #ffffff; margin-top: 0.25rem;">Platinum</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">700+ PTS</div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <form id="edit-profile-form" class="depth-card" style="padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
            Account Details
          </h2>

          <div class="eco-form-group">
            <label class="eco-label">Full Name</label>
            <input type="text" id="prof-name" class="eco-input" value="${user.name}" required />
          </div>

          <div class="eco-form-group">
            <label class="eco-label">Mobile Number</label>
            <input type="tel" id="prof-phone" class="eco-input" value="${user.phone || ''}" required />
          </div>

          <div class="eco-form-group">
            <label class="eco-label">Assigned Ward</label>
            <select id="prof-ward" class="eco-select">
              <option value="Ward 150 - Bellandur" ${user.ward && user.ward.includes('150') ? 'selected' : ''}>Ward 150 - Bellandur</option>
              <option value="Ward 174 - HSR Layout" ${user.ward && user.ward.includes('174') ? 'selected' : ''}>Ward 174 - HSR Layout</option>
              <option value="Ward 72 - Indiranagar" ${user.ward && user.ward.includes('72') ? 'selected' : ''}>Ward 72 - Indiranagar</option>
              <option value="Ward 84 - Koramangala" ${user.ward && user.ward.includes('84') ? 'selected' : ''}>Ward 84 - Koramangala</option>
            </select>
          </div>

          <button type="submit" class="btn-3d btn-3d-primary" style="align-self: flex-start; padding: 0.75rem 1.6rem;">
            Save Account Updates
          </button>
        </form>

        <!-- Notification & Offline Preferences -->
        <div class="depth-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
            Notification & Offline Preferences
          </h2>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <strong style="color: #ffffff; font-size: 0.95rem;">Push Status Notifications</strong>
              <div style="color: var(--text-muted); font-size: 0.8rem;">Real-time status alerts as your complaint moves through stages</div>
            </div>
            <input type="checkbox" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--color-emerald-400);" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <strong style="color: #ffffff; font-size: 0.95rem;">SMS Dispatch Alerts</strong>
              <div style="color: var(--text-muted); font-size: 0.8rem;">Receive officer name and truck arrival time via SMS</div>
            </div>
            <input type="checkbox" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--color-emerald-400);" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <strong style="color: #ffffff; font-size: 0.95rem;">IndexedDB Offline Draft Auto-Sync</strong>
              <div style="color: var(--text-muted); font-size: 0.8rem;">Automatically submit queued offline photos upon network restore</div>
            </div>
            <input type="checkbox" checked style="width: 1.25rem; height: 1.25rem; accent-color: var(--color-emerald-400);" />
          </div>

          <!-- Sign Out Action -->
          <div style="margin-top: 1rem;">
            <button type="button" id="logout-btn" class="btn-3d btn-3d-outline" style="padding: 0.75rem 1.5rem; color: #f87171; border-color: rgba(239, 68, 68, 0.4);">
              🚪 Sign Out of EcoBin
            </button>
          </div>
        </div>

      </div>
    `;

    // Hook Avatar Randomize
    const avatarBtn = container.querySelector('#refresh-avatar-btn');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', () => {
        const seed = Math.random().toString(36).substring(7);
        user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        db.updateUser(user.id, { avatar: user.avatar });
        authService.saveSession(user);
        render();
        toast.info('New avatar generated!');
      });
    }

    // Hook Form Submit
    const form = container.querySelector('#edit-profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#prof-name').value;
        const phone = container.querySelector('#prof-phone').value;
        const ward = container.querySelector('#prof-ward').value;

        const updated = db.updateUser(user.id, { name, phone, ward });
        if (updated) {
          user = updated;
          authService.saveSession(user);
          toast.success('Profile details saved successfully.');
          render();
        }
      });
    }

    // Hook Logout
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authService.logout();
        toast.info('Signed out successfully.');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 500);
      });
    }
  }

  render();
}
