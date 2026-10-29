/**
 * EcoBin 3D Button Component
 */

export function createButton({
  label = '',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon = null,
  onClick = null,
  type = 'button',
  fullWidth = false,
  className = '',
  id = ''
} = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  if (id) btn.id = id;

  const variantClass = `btn-3d-${variant}`;
  const sizeClasses = {
    sm: 'padding: 0.5rem 0.9rem; font-size: 0.85rem;',
    md: 'padding: 0.75rem 1.4rem; font-size: 0.95rem;',
    lg: 'padding: 1rem 2rem; font-size: 1.1rem;'
  }[size] || '';

  btn.className = `btn-3d ${variantClass} ${className}`.trim();
  if (sizeClasses) btn.style.cssText = sizeClasses + (fullWidth ? ' width: 100%;' : '');

  let content = '';
  if (icon) {
    content += `<span class="btn-icon" aria-hidden="true">${icon}</span>`;
  }
  content += `<span class="btn-label">${label}</span>`;
  btn.innerHTML = content;

  if (onClick) {
    btn.addEventListener('click', (e) => {
      // Subtle tactile vibration on supported mobile devices
      if (navigator.vibrate) navigator.vibrate(12);
      onClick(e);
    });
  }

  return btn;
}
