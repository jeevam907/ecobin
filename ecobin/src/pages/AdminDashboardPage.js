/**
 * EcoBin Municipal Admin Dashboard & Operations Control (Phase 8)
 * KPI Aggregations, Sortable Table, Ward Filters, Bulk Assign/Resolve & CSV Export
 */

import { db } from '../services/db.js';
import { createSeverityBadge, createStatusPill } from '../components/ui/Badge.js';
import { toast } from '../components/ui/Toast.js';

export function renderAdminDashboardPage(container) {
  let complaints = db.getComplaints();
  const officers = db.getUsers().filter(u => u.role === 'officer' || u.role === 'supervisor');
  
  let filterStatus = 'all';
  let filterSeverity = 'all';
  let searchQuery = '';
  let selectedIds = new Set();
  let assignModalComplaintId = null;

  function getFilteredComplaints() {
    return complaints.filter(c => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterSeverity !== 'all' && c.severity !== filterSeverity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.id.toLowerCase().includes(q) ||
               c.category.toLowerCase().includes(q) ||
               c.ward.toLowerCase().includes(q) ||
               (c.address && c.address.toLowerCase().includes(q));
      }
      return true;
    });
  }

  function render() {
    const filtered = getFilteredComplaints();
    const openCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
    const totalCount = complaints.length;
    const resolutionRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : 0;

    container.innerHTML = `
      <div style="max-width: 1260px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem; margin-bottom: 2rem;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); background: rgba(14, 165, 233, 0.15); color: #38bdf8; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;">
              Metropolis Municipal Sanitation Division
            </div>
            <h1 style="font-family: var(--font-family-display); font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem;">
              Admin Operations Center
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">
              City-Wide SLA Compliance, Real-Time Field Dispatch & Citizen Complaint Oversight
            </p>
          </div>

          <!-- Tools -->
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="bulk-export-csv-btn" class="btn-3d btn-3d-outline" style="padding: 0.65rem 1.25rem; font-size: 0.88rem;">
              📥 Export CSV Report
            </button>
            <button type="button" id="broadcast-alert-btn" class="btn-3d btn-3d-primary" style="padding: 0.65rem 1.25rem; font-size: 0.88rem;">
              📢 Send City Alert
            </button>
          </div>
        </div>

        <!-- 4 KPI Summary Cards with 3D Depth -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
          <div class="depth-card kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Active Open Cases</span>
              <div class="kpi-icon-badge" style="color: #ef4444; background: rgba(239, 68, 68, 0.15);">🚨</div>
            </div>
            <div class="kpi-value">${openCount}</div>
            <div class="kpi-subtext trend-down"><span>↓</span> Strict 4h/12h SLA enforcement</div>
          </div>

          <div class="depth-card kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Resolution Rate</span>
              <div class="kpi-icon-badge" style="color: #10b981; background: rgba(16, 185, 129, 0.15);">⚡</div>
            </div>
            <div class="kpi-value">${resolutionRate}%</div>
            <div class="kpi-subtext trend-up"><span>↑</span> +4.2% vs target baseline</div>
          </div>

          <div class="depth-card kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Avg SLA Response</span>
              <div class="kpi-icon-badge" style="color: #38bdf8; background: rgba(14, 165, 233, 0.15);">⏱️</div>
            </div>
            <div class="kpi-value">4.2h</div>
            <div class="kpi-subtext trend-up"><span>↑</span> 1.8h faster than last month</div>
          </div>

          <div class="depth-card kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Active Field Officers</span>
              <div class="kpi-icon-badge" style="color: #bef264; background: rgba(132, 204, 22, 0.15);">👷</div>
            </div>
            <div class="kpi-value">${officers.length} <span style="font-size: 1rem; color: var(--text-muted);">on patrol</span></div>
            <div class="kpi-subtext" style="color: var(--color-lime-300);">Covering all 198 wards</div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="depth-card" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="admin-search-input" class="eco-input" placeholder="🔍 Search by ID, Category, Ward or Landmark..." value="${searchQuery}" style="padding: 0.65rem 1rem;" />
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <select id="filter-status-select" class="eco-select" style="width: auto; padding: 0.65rem 1rem;">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>Status: All</option>
              <option value="submitted" ${filterStatus === 'submitted' ? 'selected' : ''}>Submitted</option>
              <option value="assigned" ${filterStatus === 'assigned' ? 'selected' : ''}>Assigned</option>
              <option value="in_progress" ${filterStatus === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="resolved" ${filterStatus === 'resolved' ? 'selected' : ''}>Resolved</option>
              <option value="closed" ${filterStatus === 'closed' ? 'selected' : ''}>Closed</option>
            </select>

            <select id="filter-severity-select" class="eco-select" style="width: auto; padding: 0.65rem 1rem;">
              <option value="all" ${filterSeverity === 'all' ? 'selected' : ''}>Severity: All</option>
              <option value="critical" ${filterSeverity === 'critical' ? 'selected' : ''}>Critical</option>
              <option value="high" ${filterSeverity === 'high' ? 'selected' : ''}>High</option>
              <option value="medium" ${filterSeverity === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="low" ${filterSeverity === 'low' ? 'selected' : ''}>Low</option>
            </select>
          </div>
        </div>

        <!-- Bulk Action Bar (Visible when items selected) -->
        ${selectedIds.size > 0 ? `
          <div style="background: rgba(16, 185, 129, 0.2); border: 1.5px solid var(--color-emerald-400); padding: 0.85rem 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <strong style="color: #ffffff;">${selectedIds.size} complaint(s) selected</strong>
            <div style="display: flex; gap: 0.75rem;">
              <button type="button" id="bulk-resolve-btn" class="btn-3d btn-3d-primary" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
                ✓ Mark Selected Resolved
              </button>
              <button type="button" id="bulk-clear-btn" class="btn-3d btn-3d-outline" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
                Clear Selection
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Complaints Table -->
        <div class="depth-card" style="padding: 1.5rem; overflow: hidden;">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 1.5px solid rgba(52, 211, 153, 0.2); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
                  <th style="padding: 0.85rem 0.5rem; width: 40px; text-align: center;">
                    <input type="checkbox" id="select-all-checkbox" ${selectedIds.size === filtered.length && filtered.length > 0 ? 'checked' : ''} style="cursor: pointer;" />
                  </th>
                  <th style="padding: 0.85rem 1rem;">ID</th>
                  <th style="padding: 0.85rem 1rem;">Category</th>
                  <th style="padding: 0.85rem 1rem;">Ward / Location</th>
                  <th style="padding: 0.85rem 1rem;">Severity</th>
                  <th style="padding: 0.85rem 1rem;">Status</th>
                  <th style="padding: 0.85rem 1rem;">Assigned Crew</th>
                  <th style="padding: 0.85rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="8" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                      No complaints match the selected filter criteria.
                    </td>
                  </tr>
                ` : filtered.map(row => {
                  const isChecked = selectedIds.has(row.id);
                  return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); background: ${isChecked ? 'rgba(16,185,129,0.1)' : 'transparent'};">
                      <td style="padding: 0.85rem 0.5rem; text-align: center;">
                        <input type="checkbox" class="row-checkbox" data-id="${row.id}" ${isChecked ? 'checked' : ''} style="cursor: pointer;" />
                      </td>
                      <td style="padding: 1rem; font-family: var(--font-family-mono); font-weight: 700; color: var(--color-lime-300);">
                        ${row.id}
                      </td>
                      <td style="padding: 1rem; font-weight: 600; color: #ffffff;">
                        ${row.category}
                      </td>
                      <td style="padding: 1rem; color: var(--text-secondary); max-width: 220px;">
                        ${row.address}
                      </td>
                      <td style="padding: 1rem;">
                        ${createSeverityBadge(row.severity)}
                      </td>
                      <td style="padding: 1rem;">
                        ${createStatusPill(row.status)}
                      </td>
                      <td style="padding: 1rem; color: var(--text-secondary);">
                        ${row.assignedOfficer || '<span style="color: #ef4444; font-weight: 600;">Unassigned</span>'}
                      </td>
                      <td style="padding: 1rem; text-align: right;">
                        <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
                          <button type="button" class="btn-3d btn-3d-secondary assign-officer-btn" data-id="${row.id}" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">
                            Assign
                          </button>
                          <a href="#/admin/complaint/${row.id}" class="btn-3d btn-3d-outline" style="padding: 0.35rem 0.65rem; font-size: 0.78rem; text-decoration: none;">
                            Inspect
                          </a>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Assign Officer Modal -->
        ${assignModalComplaintId ? `
          <div style="position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
            <div class="depth-card" style="width: 100%; max-width: 460px; padding: 2rem; border: 2px solid var(--color-emerald-400); background: #0c201a;">
              <h3 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">
                Assign Field Officer
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">
                Select field sanitation officer for Complaint <strong>#${assignModalComplaintId}</strong>.
              </p>

              <div class="eco-form-group">
                <label class="eco-label">Available Field Officers</label>
                <select id="modal-select-officer" class="eco-select">
                  ${officers.map(off => `
                    <option value="${off.name}">${off.name} (${off.ward})</option>
                  `).join('')}
                  <option value="Sanitation Rapid Team #4">Sanitation Rapid Team #4</option>
                  <option value="Mechanical Sweeper Unit #2">Mechanical Sweeper Unit #2</option>
                </select>
              </div>

              <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
                <button type="button" id="close-assign-modal" class="btn-3d btn-3d-outline" style="padding: 0.65rem 1.25rem;">Cancel</button>
                <button type="button" id="confirm-assign-btn" class="btn-3d btn-3d-primary" style="padding: 0.65rem 1.4rem;">Confirm Assignment</button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // Hook search & filters
    const searchInput = container.querySelector('#admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    const statusSelect = container.querySelector('#filter-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        filterStatus = e.target.value;
        render();
      });
    }

    const sevSelect = container.querySelector('#filter-severity-select');
    if (sevSelect) {
      sevSelect.addEventListener('change', (e) => {
        filterSeverity = e.target.value;
        render();
      });
    }

    // Hook Row selection
    container.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-id');
        if (cb.checked) selectedIds.add(id);
        else selectedIds.delete(id);
        render();
      });
    });

    const selectAllCb = container.querySelector('#select-all-checkbox');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', () => {
        if (selectAllCb.checked) {
          filtered.forEach(f => selectedIds.add(f.id));
        } else {
          selectedIds.clear();
        }
        render();
      });
    }

    const clearBtn = container.querySelector('#bulk-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedIds.clear();
        render();
      });
    }

    // Hook Bulk Resolve
    const bulkResolveBtn = container.querySelector('#bulk-resolve-btn');
    if (bulkResolveBtn) {
      bulkResolveBtn.addEventListener('click', () => {
        selectedIds.forEach(id => {
          db.updateComplaint(id, {
            status: 'resolved',
            resolvedAt: new Date().toLocaleString()
          });
        });
        toast.success(`Marked ${selectedIds.size} complaints as resolved.`);
        selectedIds.clear();
        complaints = db.getComplaints();
        render();
      });
    }

    // Hook CSV Export
    const exportBtn = container.querySelector('#bulk-export-csv-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const rows = [
          ['Complaint ID', 'Category', 'Severity', 'Status', 'Ward', 'Address', 'Submitted At', 'Assigned Officer']
        ];
        complaints.forEach(c => {
          rows.push([c.id, c.category, c.severity, c.status, c.ward, c.address, c.submittedAt, c.assignedOfficer || '']);
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(i => `"${(i||'').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ecobin_complaints_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('CSV export generated and downloaded!');
      });
    }

    // Hook Broadcast
    const alertBtn = container.querySelector('#broadcast-alert-btn');
    if (alertBtn) {
      alertBtn.addEventListener('click', () => {
        const msg = prompt('Enter city-wide sanitation broadcast alert:');
        if (msg) {
          db.addNotification({
            userId: 'all',
            title: 'MUNICIPAL ADVISORY',
            message: msg,
            type: 'system',
            link: '#/citizen/dashboard'
          });
          toast.success('Broadcast alert transmitted to citizen notification feeds.');
        }
      });
    }

    // Hook Assign Modal
    container.querySelectorAll('.assign-officer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        assignModalComplaintId = btn.getAttribute('data-id');
        render();
      });
    });

    const closeAssign = container.querySelector('#close-assign-modal');
    if (closeAssign) {
      closeAssign.addEventListener('click', () => {
        assignModalComplaintId = null;
        render();
      });
    }

    const confirmAssign = container.querySelector('#confirm-assign-btn');
    if (confirmAssign) {
      confirmAssign.addEventListener('click', () => {
        const chosenOfficer = container.querySelector('#modal-select-officer').value;
        db.updateComplaint(assignModalComplaintId, {
          assignedOfficer: chosenOfficer,
          status: 'assigned'
        });
        toast.success(`Complaint #${assignModalComplaintId} assigned to ${chosenOfficer}!`);
        assignModalComplaintId = null;
        complaints = db.getComplaints();
        render();
      });
    }
  }

  render();
}
