/**
 * EcoBin Isometric City Illustration Component
 * High-Detail Scalable Isometric SVG Vector for Smart City & Operations
 */

export function renderIsometricCity(containerId) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  container.innerHTML = `
    <div class="isometric-container" style="position: relative; width: 100%; height: 380px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
      <svg viewBox="0 0 800 500" class="isometric-svg" style="width: 100%; height: 100%; max-width: 720px; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));">
        <defs>
          <linearGradient id="isoGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b1d17" />
            <stop offset="100%" stop-color="#042017" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#142c23" />
            <stop offset="100%" stop-color="#0d1e17" />
          </linearGradient>
          <linearGradient id="bldgGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#064e3b" />
          </linearGradient>
          <linearGradient id="bldgGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#065f46" />
            <stop offset="100%" stop-color="#022c22" />
          </linearGradient>
          <linearGradient id="bldgGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Base Isometric Island (Diamond) -->
        <polygon points="400,80 720,240 400,400 80,240" fill="url(#isoGridGrad)" stroke="rgba(52, 211, 153, 0.3)" stroke-width="2" />
        <polygon points="80,240 400,400 400,430 80,270" fill="#031610" />
        <polygon points="720,240 400,400 400,430 720,270" fill="#02100b" />

        <!-- Smart Roadways -->
        <polygon points="400,140 600,240 400,340 200,240" fill="url(#roadGrad)" stroke="rgba(20, 184, 166, 0.2)" stroke-width="1.5" />
        <line x1="400" y1="140" x2="400" y2="340" stroke="rgba(250, 204, 21, 0.5)" stroke-width="2" stroke-dasharray="10 8" />
        <line x1="200" y1="240" x2="600" y2="240" stroke="rgba(250, 204, 21, 0.5)" stroke-width="2" stroke-dasharray="10 8" />

        <!-- Eco Innovation Tower (Left) -->
        <!-- Left Face -->
        <polygon points="260,110 320,140 320,220 260,190" fill="url(#bldgGrad2)" stroke="rgba(52, 211, 153, 0.2)" />
        <!-- Right Face -->
        <polygon points="320,140 380,110 380,190 320,220" fill="url(#bldgGrad1)" stroke="rgba(52, 211, 153, 0.4)" />
        <!-- Top Face (Green Roof with solar panels) -->
        <polygon points="320,80 380,110 320,140 260,110" fill="url(#bldgGradTop)" />
        <circle cx="320" cy="110" r="14" fill="#84cc16" opacity="0.8" />
        <circle cx="320" cy="110" r="6" fill="#ffffff" />

        <!-- Smart Sorting Facility (Right) -->
        <polygon points="460,170 520,200 520,250 460,220" fill="#044332" />
        <polygon points="520,200 580,170 580,220 520,250" fill="#0d9488" />
        <polygon points="520,140 580,170 520,200 460,170" fill="#2dd4bf" />
        <text x="500" y="175" fill="#022c22" font-size="10" font-weight="bold">ECO-HUB</text>

        <!-- Connected Smart Bins with Active Radar Beacons -->
        <!-- Bin 1 (Green / Optimal) -->
        <g transform="translate(250, 260)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.6">
            <animate attributeName="r" values="8;24" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <rect x="-6" y="-12" width="12" height="18" rx="3" fill="#10b981" stroke="#ffffff" stroke-width="1" />
          <circle cx="0" cy="-14" r="3" fill="#bef264" filter="url(#neonGlow)" />
        </g>

        <!-- Bin 2 (Amber / Filling) -->
        <g transform="translate(530, 275)">
          <circle cx="0" cy="0" r="16" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.6">
            <animate attributeName="r" values="8;22" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <rect x="-6" y="-12" width="12" height="18" rx="3" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
          <circle cx="0" cy="-14" r="3" fill="#fde047" filter="url(#neonGlow)" />
        </g>

        <!-- Bin 3 (Red / Critical Overflow) -->
        <g transform="translate(380, 310)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.8">
            <animate attributeName="r" values="8;28" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <rect x="-7" y="-14" width="14" height="20" rx="3" fill="#ef4444" stroke="#ffffff" stroke-width="1" />
          <circle cx="0" cy="-16" r="3.5" fill="#fca5a5" filter="url(#neonGlow)" />
        </g>

        <!-- Electric Sanitation Truck (Autonomous) -->
        <g transform="translate(340, 225)">
          <polygon points="0,0 24,-12 48,0 24,12" fill="#38bdf8" />
          <polygon points="0,0 24,12 24,24 0,12" fill="#0284c7" />
          <polygon points="48,0 24,12 24,24 48,12" fill="#0369a1" />
          <text x="12" y="8" fill="#ffffff" font-size="8" font-weight="bold">EV</text>
        </g>

        <!-- Smart Sensor Signals Linking City Hub to Central Cloud -->
        <path d="M250,248 Q320,180 320,110" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" values="0;-16" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M530,263 Q480,200 320,110" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" values="0;-16" dur="1s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  `;
}
