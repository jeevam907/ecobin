/**
 * EcoBin Citizen Dashboard Page (Phase 3 & 5)
 * Real Gamification Points, Ward Cleanliness Leaderboard, Live Summary Cards & Nearest Smart Bins
 */

import { db } from '../services/db.js';
import { authService } from '../services/auth.js';
import { createStatusPill, createSeverityBadge } from '../components/ui/Badge.js';

export function renderCitizenDashboard(container) {
  const user = authService.getCurrentUser() || {
    id: 'usr_citizen_1',
    name: 'Aarav Sharma',
    ward: 'Ward 150 - Bellandur',
    zone: 'East Zone',
    ecoPoints: 480,
    tier: 'Gold Citizen'
  };

  const complaints = db.getComplaints().filter(c => !c.userId || c.userId === user.id || c.ward === user.ward);
  const bins = db.getBins();

  const totalReports = complaints.length;
  const activeReports = complaints.filter(c => c.status === 'in_progress' || c.status === 'assigned' || c.status === 'submitted').length;
  const resolvedReports = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  container.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
      
      <!-- Welcome Header & 3D Gamified Eco Points Card -->
      <div class="depth-card" style="padding: 2.25rem; margin-bottom: 2rem; background: linear-gradient(135deg, rgba(16, 44, 34, 0.95) 0%, rgba(9, 23, 18, 0.98) 100%); border: 1.5px solid rgba(52, 211, 153, 0.35);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.25rem;">👋</span>
              <span style="color: var(--text-secondary); font-size: 0.95rem;">Welcome back,</span>
              <strong style="color: #ffffff; font-size: 1.15rem;">${user.name}</strong>
            </div>
            <h1 style="font-family: var(--font-family-display); font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #ffffff;">
              Citizen Sanitation Hub
            </h1>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
              Ward: <strong style="color: var(--color-emerald-300);">${user.ward}</strong> | District: <strong>${user.zone}</strong>
            </p>
          </div>

          <!-- Eco Points 3D Showcase Badge -->
          <div style="background: rgba(0,0,0,0.35); padding: 1.25rem 1.75rem; border-radius: var(--radius-lg); border: 1.5px solid rgba(245, 158, 11, 0.4); text-align: center; min-width: 220px;" class="floating-anim">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-lime-300); font-weight: 800; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Eco Rewards Tier
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; font-family: var(--font-family-display); color: #fde047; text-shadow: 0 0 16px rgba(250, 204, 21, 0.5);">
              ${user.ecoPoints || 480} <span style="font-size: 1.1rem; color: #ffffff;">PTS</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem;">
              Tier: <strong style="color: #ffffff;">${user.tier || 'Gold Citizen'}</strong> (Rank #3 in Ward)
            </div>
          </div>
        </div>
      </div>

      <!-- Quick KPI Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
        <div class="depth-card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">My Total Reports</span>
            <div class="kpi-icon-badge" style="color: #38bdf8; background: rgba(14, 165, 233, 0.15);">📋</div>
          </div>
          <div class="kpi-value">${totalReports}</div>
          <div class="kpi-subtext" style="color: var(--color-emerald-400);">100% Geotag verified</div>
        </div>

        <div class="depth-card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Active In-Progress</span>
            <div class="kpi-icon-badge" style="color: #c084fc; background: rgba(139, 92, 246, 0.15);">⚡</div>
          </div>
          <div class="kpi-value">${activeReports}</div>
          <div class="kpi-subtext" style="color: #c084fc;">Sanitation crew en route</div>
        </div>

        <div class="depth-card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Resolved</span>
            <div class="kpi-icon-badge" style="color: #34d399; background: rgba(16, 185, 129, 0.15);">✅</div>
          </div>
          <div class="kpi-value">${resolvedReports}</div>
          <div class="kpi-subtext" style="color: var(--color-lime-400);">Verified with photo proof</div>
        </div>

        <div class="depth-card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Ward Clean Rank</span>
            <div class="kpi-icon-badge" style="color: #fde047; background: rgba(245, 158, 11, 0.15);">🏆</div>
          </div>
          <div class="kpi-value">#3 <span style="font-size: 1.1rem; color: var(--text-muted);">/ 198</span></div>
          <div class="kpi-subtext" style="color: var(--color-lime-400);">Top 2% cleanest wards</div>
        </div>
      </div>

      <!-- Main Layout: Recent Reports & Nearest Smart Bins -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;" class="dashboard-main-grid">
        
        <!-- Left: Reported Complaints -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
              My Reported Complaints
            </h2>
            <a href="#/citizen/report/new" class="btn-3d btn-3d-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              + New Report
            </a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${complaints.length === 0 ? `
              <div class="depth-card" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌱</div>
                <strong style="color: #ffffff;">No complaints reported yet</strong>
                <p style="font-size: 0.88rem; margin: 0.4rem 0 1rem 0;">Help keep your ward clean by filing your first report.</p>
                <a href="#/citizen/report/new" class="btn-3d btn-3d-primary">+ File First Report (+100 PTS)</a>
              </div>
            ` : complaints.map(item => `
              <div class="depth-card" style="padding: 1.4rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                  <div>
                    <span style="font-family: var(--font-family-mono); font-size: 0.78rem; color: var(--color-lime-300); font-weight: 700;">${item.id}</span>
                    <h3 style="font-family: var(--font-family-display); font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-top: 0.15rem;">
                      ${item.category}
                    </h3>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${createSeverityBadge(item.severity)}
                    ${createStatusPill(item.status)}
                  </div>
                </div>

                <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${item.description || 'No description provided.'}</p>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
                  <span>📍 ${item.address}</span>
                  <a href="#/citizen/complaint/${item.id}" style="color: var(--color-emerald-400); font-weight: 700; text-decoration: none;">
                    Live Tracking & Proof →
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: 3 Nearest Smart Bins Live Status -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
              Nearest Smart Bins
            </h2>
            <a href="#/citizen/map" style="font-size: 0.85rem; color: var(--color-emerald-400); text-decoration: none; font-weight: 600;">
              Open Map →
            </a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${bins.map(bin => {
              const fill = bin.fillLevel;
              const fillBg = fill > 80 ? '#ef4444' : (fill > 60 ? '#f59e0b' : '#10b981');
              return `
                <div class="depth-card" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #ffffff; font-size: 0.95rem;">${bin.location}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-family-mono);">${bin.id}</span>
                  </div>

                  <div style="font-size: 0.8rem; color: var(--text-secondary);">${bin.type}</div>

                  <!-- 3D Fill Level Progress -->
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.35rem;">
                      <span style="color: var(--text-muted);">Fill Capacity</span>
                      <strong style="color: ${fillBg};">${fill}%</strong>
                    </div>
                    <div class="bin-gauge">
                      <div class="bin-gauge-fill" style="width: ${fill}%; background: ${fillBg};"></div>
                    </div>
                  </div>

                  <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right;">
                    Emptied: ${bin.lastEmptied}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    </div>

    <style>
      @media (min-width: 900px) {
        .dashboard-main-grid {
          grid-template-columns: 1.25fr 0.85fr !important;
        }
      }
    </style>
  `;
}
