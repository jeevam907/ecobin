/**
 * EcoBin Field Officer Dashboard & Dispatch Desk (Phase 7)
 * Priority SLA Assignments, On-Site Status Toggle, Before/After Photo Resolution Modal
 */

import { db } from '../services/db.js';
import { authService } from '../services/auth.js';
import { createSeverityBadge, createStatusPill } from '../components/ui/Badge.js';
import { toast } from '../components/ui/Toast.js';

export function renderOfficerDashboardPage(container) {
  const officer = authService.getCurrentUser() || { name: 'Officer Rajesh Kumar', ward: 'Ward 150 - Bellandur' };
  let complaints = db.getComplaints();
  let activeModalTaskId = null;

  function render() {
    // Sort tasks: In Progress first, then Assigned, then by severity priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const sortedTasks = [...complaints].sort((a, b) => {
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
      if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
      return (priorityOrder[b.severity] || 0) - (priorityOrder[a.severity] || 0);
    });

    const activeCount = sortedTasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;
    const resolvedCount = sortedTasks.filter(t => t.status === 'resolved' || t.status === 'closed').length;

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Officer Dispatch Header -->
        <div class="depth-card" style="padding: 2rem; margin-bottom: 2rem; border-left: 5px solid var(--color-lime-400); background: linear-gradient(135deg, rgba(16, 44, 34, 0.95) 0%, rgba(9, 23, 18, 0.98) 100%);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); background: rgba(132, 204, 22, 0.2); color: var(--color-lime-300); font-size: 0.78rem; font-weight: 800; text-transform: uppercase;">
                ⚡ Field Duty Active
              </div>
              <h1 style="font-family: var(--font-family-display); font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">
                Sanitation Field Operations Desk
              </h1>
              <p style="color: var(--text-secondary); font-size: 0.92rem;">
                Officer: <strong style="color: #ffffff;">${officer.name}</strong> | Truck: <strong>EV-Patrol #12</strong> | Ward: <strong>${officer.ward}</strong>
              </p>
            </div>

            <!-- Stats -->
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <div style="background: rgba(0,0,0,0.4); padding: 0.85rem 1.4rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); text-align: center;">
                <div style="font-size: 1.75rem; font-weight: 800; color: #fde047;">${activeCount}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Pending Tasks</div>
              </div>
              <div style="background: rgba(0,0,0,0.4); padding: 0.85rem 1.4rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); text-align: center;">
                <div style="font-size: 1.75rem; font-weight: 800; color: #34d399;">${resolvedCount}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Resolved Today</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Queue List -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.4rem; font-weight: 700; color: #ffffff;">
            Priority Tasks Queue (${sortedTasks.length})
          </h2>
          <span style="font-size: 0.8rem; color: var(--color-emerald-400); display: flex; align-items: center; gap: 0.35rem;">
            <span style="width: 0.45rem; height: 0.45rem; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px currentColor;"></span>
            Auto-Synced via Municipal Dispatch
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${sortedTasks.map(task => {
            const isTaskResolved = task.status === 'resolved' || task.status === 'closed';
            return `
              <div class="depth-card" style="padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; border-left: 4px solid ${task.severity === 'critical' ? '#ef4444' : (task.severity === 'high' ? '#f59e0b' : '#10b981')};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
                  <div>
                    <span style="font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-lime-300); font-weight: 700;">${task.id}</span>
                    <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-top: 0.15rem;">
                      ${task.category}
                    </h3>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${createSeverityBadge(task.severity)}
                    ${createStatusPill(task.status)}
                  </div>
                </div>

                <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5;">${task.description || 'No description'}</p>

                <div style="background: rgba(0,0,0,0.3); padding: 0.85rem 1.1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; font-size: 0.88rem;">
                  <span>📍 <strong>Location:</strong> ${task.address}</span>
                  <span style="color: var(--color-lime-300); font-weight: 600;">⏱️ SLA: ${task.etaHours || 4}h response window</span>
                </div>

                <!-- Citizen Reported Photos Thumbnail -->
                ${(task.photos && task.photos.length > 0) ? `
                  <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Citizen Evidence:</span>
                    ${task.photos.map(p => `
                      <img src="${p}" alt="Evidence" style="width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.2);" />
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Actions for Field Officer -->
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;">
                  <button type="button" class="btn-3d btn-3d-secondary nav-directions-btn" data-lat="${task.lat || 12.926}" data-lng="${task.lng || 77.676}" data-address="${encodeURIComponent(task.address)}" style="padding: 0.65rem 1.25rem; font-size: 0.88rem;">
                    🧭 Open GPS Route
                  </button>

                  ${task.status === 'assigned' ? `
                    <button type="button" class="btn-3d btn-3d-outline mark-progress-btn" data-id="${task.id}" style="padding: 0.65rem 1.25rem; font-size: 0.88rem; color: #c084fc; border-color: rgba(139, 92, 246, 0.4);">
                      ⚡ Mark On-Site (In Progress)
                    </button>
                  ` : ''}

                  ${!isTaskResolved ? `
                    <button type="button" class="btn-3d btn-3d-primary open-resolve-modal-btn" data-id="${task.id}" style="padding: 0.65rem 1.4rem; font-size: 0.88rem;">
                      📸 Complete & Upload Proof
                    </button>
                  ` : `
                    <span style="font-size: 0.85rem; color: var(--color-emerald-400); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
                      ✅ Task Completed & Verified
                    </span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Resolution Modal Dialog (When Triggered) -->
        ${activeModalTaskId ? `
          <div style="position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
            <div class="depth-card" style="width: 100%; max-width: 520px; padding: 2rem; border: 2px solid var(--color-emerald-400); background: #0c201a;">
              <h3 style="font-family: var(--font-family-display); font-size: 1.4rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">
                Submit Clean-up Resolution Proof
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.25rem;">
                Attach after-cleaning photo and notes for Complaint <strong>#${activeModalTaskId}</strong>.
              </p>

              <form id="resolve-modal-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <label class="eco-label">📸 After-Clean Photo Evidence *</label>
                  <input type="text" id="modal-proof-url" class="eco-input" value="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80" />
                </div>

                <div class="eco-form-group">
                  <label class="eco-label">📝 Officer Work Notes *</label>
                  <textarea id="modal-officer-notes" class="eco-textarea" rows="3" required placeholder="Describe sanitation action taken (e.g. 2 tons removed, smart bin emptied and sprayed with disinfectant)...">Area fully cleared and smart bin sanitized. Verified clear for pedestrians.</textarea>
                </div>

                <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem;">
                  <button type="button" id="close-modal-btn" class="btn-3d btn-3d-outline" style="padding: 0.75rem 1.25rem;">Cancel</button>
                  <button type="submit" class="btn-3d btn-3d-primary" style="padding: 0.75rem 1.5rem;">Verify & Mark Resolved</button>
                </div>
              </form>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // Hook Directions
    container.querySelectorAll('.nav-directions-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lat = btn.getAttribute('data-lat');
        const lng = btn.getAttribute('data-lng');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
      });
    });

    // Hook Mark In Progress
    container.querySelectorAll('.mark-progress-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        db.updateComplaint(id, {
          status: 'in_progress',
          assignedOfficer: officer.name
        });
        toast.info(`Task #${id} marked In Progress. Crew on-site.`);
        complaints = db.getComplaints();
        render();
      });
    });

    // Hook Open Modal
    container.querySelectorAll('.open-resolve-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeModalTaskId = btn.getAttribute('data-id');
        render();
      });
    });

    // Hook Modal Close
    const closeBtn = container.querySelector('#close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        activeModalTaskId = null;
        render();
      });
    }

    // Hook Modal Form Submit
    const modalForm = container.querySelector('#resolve-modal-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const photoUrl = container.querySelector('#modal-proof-url').value;
        const notes = container.querySelector('#modal-officer-notes').value;

        const updated = db.updateComplaint(activeModalTaskId, {
          status: 'resolved',
          resolvedAt: new Date().toLocaleString(),
          resolutionPhoto: photoUrl,
          resolutionNotes: notes
        });

        db.addNotification({
          userId: updated.userId || 'usr_citizen_1',
          title: 'Issue Resolved!',
          message: `Your complaint #${updated.id} has been cleaned by Officer ${officer.name}.`,
          type: 'resolved',
          link: `#/citizen/complaint/${updated.id}`
        });

        toast.success(`Complaint #${activeModalTaskId} resolved with photo proof!`);
        activeModalTaskId = null;
        complaints = db.getComplaints();
        render();
      });
    }
  }

  render();
}
