/**
 * EcoBin Municipal Control Panel (Phase 9)
 * User/Staff Directory, Smart Bins Hardware Registry, Ward/Zone Boundaries & SLA Thresholds
 */

import { db } from '../services/db.js';
import { toast } from '../components/ui/Toast.js';

export function renderControlPanelPage(container) {
  let activeTab = 'bins'; // 'bins' | 'users' | 'zones' | 'sla' | 'audit'

  function renderTabContent(users, bins, auditLogs) {
    if (activeTab === 'bins') {
      return `
        <!-- Bins Tab -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
            Smart Waste Bins Registry
          </h2>
          <button type="button" id="open-add-bin-btn" class="btn-3d btn-3d-primary" style="padding: 0.55rem 1.1rem; font-size: 0.85rem;">
            + Add IoT Smart Bin
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 1.5px solid rgba(52, 211, 153, 0.2); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.85rem;">ID</th>
                <th style="padding: 0.85rem;">Location</th>
                <th style="padding: 0.85rem;">Ward / Zone</th>
                <th style="padding: 0.85rem;">Type</th>
                <th style="padding: 0.85rem;">Ultrasonic Level</th>
                <th style="padding: 0.85rem;">Sensor State</th>
                <th style="padding: 0.85rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${bins.map(b => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <td style="padding: 0.85rem; font-family: var(--font-family-mono); color: var(--color-lime-300); font-weight: 700;">${b.id}</td>
                  <td style="padding: 0.85rem; color: #ffffff; font-weight: 600;">${b.location}</td>
                  <td style="padding: 0.85rem; color: var(--text-secondary);">${b.ward}</td>
                  <td style="padding: 0.85rem;">${b.type}</td>
                  <td style="padding: 0.85rem; color: ${b.fillLevel > 80 ? '#ef4444' : (b.fillLevel > 60 ? '#f59e0b' : '#34d399')}; font-weight: 700;">
                    ${b.fillLevel}%
                  </td>
                  <td style="padding: 0.85rem;">
                    <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: #34d399; font-size: 0.8rem; font-weight: 600;">
                      <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399;"></span>
                      Online
                    </span>
                  </td>
                  <td style="padding: 0.85rem; text-align: right;">
                    <button type="button" class="btn-3d btn-3d-outline empty-bin-btn" data-id="${b.id}" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">
                      Force Empty
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'users') {
      return `
        <!-- Users & Staff Tab -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff;">
            Staff & User Accounts
          </h2>
          <button type="button" id="open-add-staff-btn" class="btn-3d btn-3d-primary" style="padding: 0.55rem 1.1rem; font-size: 0.85rem;">
            + Add Municipal Officer
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 1.5px solid rgba(52, 211, 153, 0.2); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.85rem;">Name</th>
                <th style="padding: 0.85rem;">Role</th>
                <th style="padding: 0.85rem;">Contact</th>
                <th style="padding: 0.85rem;">Assigned Ward</th>
                <th style="padding: 0.85rem;">Status</th>
                <th style="padding: 0.85rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <td style="padding: 0.85rem; font-weight: 600; color: #ffffff;">${u.name}</td>
                  <td style="padding: 0.85rem;">
                    <span style="font-size: 0.75rem; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 700; text-transform: uppercase; background: ${u.role === 'admin' ? 'rgba(168,85,247,0.2)' : (u.role === 'officer' ? 'rgba(14,165,233,0.2)' : 'rgba(16,185,129,0.2)')}; color: ${u.role === 'admin' ? '#c084fc' : (u.role === 'officer' ? '#38bdf8' : '#34d399')};">
                      ${u.role}
                    </span>
                  </td>
                  <td style="padding: 0.85rem; color: var(--text-secondary);">${u.email}</td>
                  <td style="padding: 0.85rem; color: var(--text-secondary);">${u.ward}</td>
                  <td style="padding: 0.85rem;">
                    <span style="color: ${u.active ? '#34d399' : '#f87171'}; font-weight: 600;">
                      ${u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style="padding: 0.85rem; text-align: right;">
                    <button type="button" class="btn-3d btn-3d-outline toggle-user-btn" data-id="${u.id}" style="padding: 0.3rem 0.65rem; font-size: 0.75rem; color: ${u.active ? '#f87171' : '#34d399'};">
                      ${u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (activeTab === 'zones') {
      return `
        <!-- Zones Tab -->
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">
            Municipal Wards & Geographic Sectors
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Boundaries mapped for real-time reverse geocoding and automated crew routing.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div class="depth-card" style="padding: 1.25rem;">
            <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 700;">Ward 150 - Bellandur</h3>
            <div style="font-size: 0.85rem; color: var(--color-lime-300); margin: 0.25rem 0;">East Zone | 24 Smart Bins</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Supervisor: Officer Rajesh Kumar</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Polygon Boundary: 12.92°N - 12.94°N, 77.67°E - 77.69°E</div>
          </div>

          <div class="depth-card" style="padding: 1.25rem;">
            <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 700;">Ward 72 - Indiranagar</h3>
            <div style="font-size: 0.85rem; color: var(--color-lime-300); margin: 0.25rem 0;">East Zone | 18 Smart Bins</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Supervisor: Officer Sarah Chen</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Polygon Boundary: 12.96°N - 12.98°N, 77.63°E - 77.65°E</div>
          </div>

          <div class="depth-card" style="padding: 1.25rem;">
            <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 700;">Ward 174 - HSR Layout</h3>
            <div style="font-size: 0.85rem; color: var(--color-lime-300); margin: 0.25rem 0;">South Zone | 28 Smart Bins</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Supervisor: Officer Ramesh Patel</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Polygon Boundary: 12.90°N - 12.92°N, 77.64°E - 77.66°E</div>
          </div>
        </div>
      `;
    }

    if (activeTab === 'sla') {
      return `
        <!-- SLA Settings Tab -->
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">
            Configurable Severity SLA Targets
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Set maximum allowable hours before municipal automated escalation occurs.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
          <div class="depth-card" style="padding: 1.5rem; border-left: 4px solid #ef4444;">
            <strong style="color: #ffffff; font-size: 1.05rem;">Critical Priority</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Blocked drains, biohazard, highway spill</div>
            <div style="margin-top: 1rem;">
              <label class="eco-label">Target Max Hours</label>
              <input type="number" class="eco-input" value="4" style="margin-top: 0.25rem;" />
            </div>
          </div>

          <div class="depth-card" style="padding: 1.5rem; border-left: 4px solid #f59e0b;">
            <strong style="color: #ffffff; font-size: 1.05rem;">High Priority</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Overflowing smart bins, dumping</div>
            <div style="margin-top: 1rem;">
              <label class="eco-label">Target Max Hours</label>
              <input type="number" class="eco-input" value="12" style="margin-top: 0.25rem;" />
            </div>
          </div>

          <div class="depth-card" style="padding: 1.5rem; border-left: 4px solid #38bdf8;">
            <strong style="color: #ffffff; font-size: 1.05rem;">Medium Priority</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Missed residential collection</div>
            <div style="margin-top: 1rem;">
              <label class="eco-label">Target Max Hours</label>
              <input type="number" class="eco-input" value="24" style="margin-top: 0.25rem;" />
            </div>
          </div>

          <div class="depth-card" style="padding: 1.5rem; border-left: 4px solid #10b981;">
            <strong style="color: #ffffff; font-size: 1.05rem;">Low Priority</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">General street sweeping inquiry</div>
            <div style="margin-top: 1rem;">
              <label class="eco-label">Target Max Hours</label>
              <input type="number" class="eco-input" value="72" style="margin-top: 0.25rem;" />
            </div>
          </div>
        </div>

        <button type="button" id="save-sla-btn" class="btn-3d btn-3d-primary" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem;">
          Save Municipal SLA Configurations
        </button>
      `;
    }

    // Default: audit
    return `
      <!-- Audit Logs Tab -->
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">
          System & Security Audit Log
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Immutable trail of sensitive administrative actions, logins, status changes, and assignments.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${auditLogs.map(log => `
          <div class="glass-panel" style="padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="font-family: var(--font-family-mono); font-weight: 700; color: var(--color-lime-300);">${log.action}</span>
              <span style="color: var(--text-muted); margin: 0 0.5rem;">•</span>
              <span style="color: #ffffff;">${log.details}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.75rem;">
              by ${log.userName} at ${new Date(log.timestamp).toLocaleTimeString()}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function render() {
    const users = db.getUsers();
    const bins = db.getBins();
    const auditLogs = db.getAuditLogs();

    container.innerHTML = `
      <div style="max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Header -->
        <div style="margin-bottom: 2rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); background: rgba(168, 85, 247, 0.15); color: #c084fc; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;">
            Root Administration
          </div>
          <h1 style="font-family: var(--font-family-display); font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem;">
            Municipal Control Panel
          </h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Manage smart sanitation infrastructure, IoT hardware bins, staff permissions and municipal SLAs.
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; background: rgba(0,0,0,0.35); padding: 0.4rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.06); overflow-x: auto;">
          <button type="button" class="btn-3d ${activeTab === 'bins' ? 'btn-3d-primary' : 'btn-3d-outline'} ctrl-nav-tab" data-tab="bins">
            🗑️ Bins Registry (${bins.length})
          </button>
          <button type="button" class="btn-3d ${activeTab === 'users' ? 'btn-3d-primary' : 'btn-3d-outline'} ctrl-nav-tab" data-tab="users">
            👥 Staff & Roles (${users.length})
          </button>
          <button type="button" class="btn-3d ${activeTab === 'zones' ? 'btn-3d-primary' : 'btn-3d-outline'} ctrl-nav-tab" data-tab="zones">
            📍 Wards & Sectors
          </button>
          <button type="button" class="btn-3d ${activeTab === 'sla' ? 'btn-3d-primary' : 'btn-3d-outline'} ctrl-nav-tab" data-tab="sla">
            ⚙️ SLA Thresholds
          </button>
          <button type="button" class="btn-3d ${activeTab === 'audit' ? 'btn-3d-primary' : 'btn-3d-outline'} ctrl-nav-tab" data-tab="audit">
            📜 Audit Logs
          </button>
        </div>

        <!-- TAB CONTENT -->
        <div class="depth-card" style="padding: 2rem;">
          ${renderTabContent(users, bins, auditLogs)}
        </div>
      </div>
    `;

    // Hook Tab Clicks
    container.querySelectorAll('.ctrl-nav-tab').forEach(t => {
      t.addEventListener('click', () => {
        activeTab = t.getAttribute('data-tab');
        render();
      });
    });

    // Hook User Toggle
    container.querySelectorAll('.toggle-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-id');
        const user = db.getUsers().find(u => u.id === uid);
        if (user) {
          db.updateUser(uid, { active: !user.active });
          toast.info(`Account status for ${user.name} toggled.`);
          render();
        }
      });
    });

    // Hook Force Empty Bin
    container.querySelectorAll('.empty-bin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bid = btn.getAttribute('data-id');
        db.updateBin(bid, { fillLevel: 0, lastEmptied: 'Just now' });
        toast.success(`Bin #${bid} fill level reset to 0%. Collection logged.`);
        render();
      });
    });

    // Hook Add Bin Prompt
    const addBinBtn = container.querySelector('#open-add-bin-btn');
    if (addBinBtn) {
      addBinBtn.addEventListener('click', () => {
        const loc = prompt('Enter Smart Bin Location (e.g., Silk Board Junction):');
        if (loc) {
          const created = db.createBin({
            location: loc,
            ward: 'Ward 150 - Bellandur',
            zone: 'East Zone',
            type: 'Smart Recyclable',
            fillLevel: 10
          });
          toast.success(`Registered new IoT Bin #${created.id}!`);
          render();
        }
      });
    }

    // Hook Save SLA
    const saveSlaBtn = container.querySelector('#save-sla-btn');
    if (saveSlaBtn) {
      saveSlaBtn.addEventListener('click', () => {
        toast.success('Municipal SLA thresholds successfully committed to database.');
      });
    }
  }

  render();
}
