/**
 * EcoBin 3D Card & KPI Card Component
 */

export function createCard({
  title = '',
  subtitle = '',
  content = '',
  badge = null,
  footer = '',
  className = '',
  style = '',
  onClick = null
} = {}) {
  const card = document.createElement('div');
  card.className = `depth-card ${className}`.trim();
  if (style) card.style.cssText = style;

  let html = '';
  if (title || badge) {
    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem 0.5rem 1.5rem;">
        <div>
          ${title ? `<h3 style="font-family: var(--font-family-display); font-size: 1.15rem; font-weight: 700; color: #ffffff;">${title}</h3>` : ''}
          ${subtitle ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">${subtitle}</p>` : ''}
        </div>
        ${badge ? `<div>${badge}</div>` : ''}
      </div>
    `;
  }

  html += `<div style="padding: 1rem 1.5rem;">${content}</div>`;

  if (footer) {
    html += `<div style="padding: 0.75rem 1.5rem; background: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.85rem; color: var(--text-muted);">${footer}</div>`;
  }

  card.innerHTML = html;

  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', onClick);
  }

  return card;
}

export function createKPICard({
  title,
  value,
  icon,
  trend = null, // e.g. { direction: 'up' | 'down', text: '+12% this week' }
  color = '#10b981'
}) {
  const card = document.createElement('div');
  card.className = 'depth-card kpi-card';

  card.innerHTML = `
    <div class="kpi-header">
      <span class="kpi-title">${title}</span>
      <div class="kpi-icon-badge" style="background: ${color}20; border-color: ${color}50; color: ${color};">
        ${icon}
      </div>
    </div>
    <div class="kpi-value">${value}</div>
    ${trend ? `
      <div class="kpi-subtext ${trend.direction === 'up' ? 'trend-up' : 'trend-down'}">
        <span>${trend.direction === 'up' ? '↑' : '↓'}</span>
        <span>${trend.text}</span>
      </div>
    ` : ''}
  `;

  return card;
}
