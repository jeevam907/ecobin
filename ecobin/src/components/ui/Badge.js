/**
 * EcoBin Badges & Status Pills
 */

export function createStatusPill(status) {
  const statusConfig = {
    submitted: { label: 'Submitted', class: 'submitted' },
    assigned: { label: 'Assigned', class: 'assigned' },
    in_progress: { label: 'In Progress', class: 'in-progress' },
    resolved: { label: 'Resolved', class: 'resolved' },
    rejected: { label: 'Rejected', class: 'rejected' },
    closed: { label: 'Closed', class: 'resolved' }
  }[status.toLowerCase()] || { label: status, class: 'submitted' };

  return `
    <span class="status-pill ${statusConfig.class}">
      <span class="status-dot"></span>
      ${statusConfig.label}
    </span>
  `;
}

export function createSeverityBadge(severity) {
  const config = {
    low: { label: 'Low SLA', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', color: '#34d399' },
    medium: { label: 'Medium SLA', bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' },
    high: { label: 'High SLA (12h)', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' },
    critical: { label: 'Critical (4h)', bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.5)', color: '#f87171' }
  }[severity.toLowerCase()] || { label: severity, bg: 'rgba(255, 255, 255, 0.1)', border: '#888', color: '#fff' };

  return `
    <span style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; background: ${config.bg}; border: 1px solid ${config.border}; color: ${config.color}; box-shadow: var(--shadow-3d-sm);">
      ⚡ ${config.label}
    </span>
  `;
}

export function createEcoPointsBadge(points, tier = 'Citizen') {
  return `
    <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(132, 204, 22, 0.2) 100%); border: 1px solid rgba(245, 158, 11, 0.4); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); box-shadow: var(--shadow-3d-sm);">
      <span style="font-size: 1rem;">🌱</span>
      <span style="font-weight: 800; font-family: var(--font-family-display); color: #fde047;">${points} PTS</span>
      <span style="font-size: 0.72rem; color: var(--color-lime-300); text-transform: uppercase; letter-spacing: 0.05em;">${tier}</span>
    </div>
  `;
}
