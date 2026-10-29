/**
 * EcoBin 3D Toast Notification System
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.ensureContainer();
  }

  ensureContainer() {
    if (!this.container) {
      let el = document.querySelector('.toast-container');
      if (!el) {
        el = document.createElement('div');
        el.className = 'toast-container';
        document.body.appendChild(el);
      }
      this.container = el;
    }
  }

  show(message, type = 'info', duration = 4000) {
    this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '🌿',
      error: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${icons[type] || 'ℹ️'}</span>
      <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
      <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; padding: 0 0.2rem;">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%) scale(0.9)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', dismiss);
    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(msg, duration) {
    this.show(msg, 'success', duration);
  }

  error(msg, duration) {
    this.show(msg, 'error', duration);
  }

  info(msg, duration) {
    this.show(msg, 'info', duration);
  }
}

export const toast = new ToastManager();
