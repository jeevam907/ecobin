/**
 * EcoBin Shimmer Skeletons & Empty States
 */

export function createSkeletonCard() {
  return `
    <div class="depth-card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="skeleton" style="width: 45%; height: 1.5rem;"></div>
        <div class="skeleton" style="width: 25%; height: 1.25rem; border-radius: 999px;"></div>
      </div>
      <div class="skeleton" style="width: 100%; height: 4rem;"></div>
      <div style="display: flex; gap: 0.5rem;">
        <div class="skeleton" style="width: 30%; height: 1rem;"></div>
        <div class="skeleton" style="width: 40%; height: 1rem;"></div>
      </div>
    </div>
  `;
}

export function createEmptyState({
  title = 'No reports found',
  description = 'Everything in this ward is currently clean and monitored.',
  icon = '🌱',
  actionBtn = null
}) {
  return `
    <div class="depth-card" style="text-align: center; padding: 3.5rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
      <div style="width: 5rem; height: 5rem; border-radius: 50%; background: rgba(16, 185, 129, 0.12); border: 2px solid rgba(52, 211, 153, 0.3); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; box-shadow: var(--shadow-3d-md);" class="floating-anim">
        ${icon}
      </div>
      <h3 style="font-family: var(--font-family-display); font-size: 1.35rem; color: #ffffff; font-weight: 700;">${title}</h3>
      <p style="color: var(--text-muted); max-width: 28rem; font-size: 0.95rem;">${description}</p>
      ${actionBtn ? `<div style="margin-top: 0.5rem;">${actionBtn}</div>` : ''}
    </div>
  `;
}
