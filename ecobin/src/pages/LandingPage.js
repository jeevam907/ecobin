/**
 * EcoBin Landing Page (3D Premium Hero, Interactive 3D Bin, Pillars & Impact)
 */

import { EcoBin3DCanvas } from '../components/3d/EcoBin3DCanvas.js';
import { renderIsometricCity } from '../components/3d/IsometricCity.js';

export function renderLandingPage(container) {
  container.innerHTML = `
    <div class="landing-page-wrapper">
      <!-- 3D HERO SECTION -->
      <section style="position: relative; min-height: 88vh; display: flex; align-items: center; justify-content: center; padding: 4rem 1.5rem 3rem 1.5rem; overflow: hidden;">
        <!-- Ambient Glowing Orbs -->
        <div style="position: absolute; top: 10%; left: 8%; width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%); filter: blur(50px); pointer-events: none;" class="pulse-glow"></div>
        <div style="position: absolute; bottom: 15%; right: 5%; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 70%); filter: blur(60px); pointer-events: none;"></div>
        <div style="position: absolute; top: 30%; right: 25%; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%); filter: blur(40px); pointer-events: none;"></div>

        <div style="max-width: 1240px; width: 100%; display: grid; grid-template-columns: 1fr; gap: 3.5rem; align-items: center; position: relative; z-index: 10;" class="hero-grid">
          <!-- Left: Hero Headline & Action Hub -->
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.4rem 1rem; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(52, 211, 153, 0.35); box-shadow: var(--shadow-3d-sm); margin-bottom: 1.5rem;">
              <span style="font-size: 1.1rem;">🌱</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-lime-300); letter-spacing: 0.05em; text-transform: uppercase;">
                Next-Gen Smart Waste Management
              </span>
            </div>

            <h1 style="font-family: var(--font-family-display); font-size: clamp(2.5rem, 5.5vw, 4.2rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: #ffffff; margin-bottom: 1.5rem;">
              Spot the Waste.<br/>
              <span style="background: var(--grad-hero); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Report in Seconds.</span><br/>
              Track Until Clean.
            </h1>

            <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--text-secondary); line-height: 1.6; max-width: 36rem; margin-bottom: 2.25rem;">
              Empowering citizens and municipal sanitation crews with geotagged photo reporting, live IoT bin sensors, and verified transparent resolution.
            </p>

            <!-- CTA Action Buttons with 3D Depth -->
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;">
              <a href="#/citizen/report/new" class="btn-3d btn-3d-primary" style="padding: 0.9rem 1.8rem; font-size: 1.05rem;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <span>Report Waste Now</span>
              </a>

              <a href="#/citizen/map" class="btn-3d btn-3d-secondary" style="padding: 0.9rem 1.6rem; font-size: 1.05rem;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                <span>Live Bin Map</span>
              </a>

              <a href="#/citizen/complaints" class="btn-3d btn-3d-outline" style="padding: 0.9rem 1.5rem; font-size: 1.05rem;">
                <span>Track Complaint →</span>
              </a>
            </div>

            <!-- Quick Trust Badges -->
            <div style="display: flex; align-items: center; gap: 1.5rem; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="color: var(--color-emerald-400);">✔</span> 100% Geotagged GPS
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="color: var(--color-emerald-400);">✔</span> 4h Critical SLA
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="color: var(--color-emerald-400);">✔</span> PWA Offline Sync
              </div>
            </div>
          </div>

          <!-- Right: Interactive 3D Smart Bin Showcase Card -->
          <div style="display: flex; justify-content: center;">
            <div class="depth-card" style="width: 100%; max-width: 440px; padding: 1.75rem; text-align: center; border: 1.5px solid rgba(52, 211, 153, 0.35); background: linear-gradient(180deg, rgba(16, 44, 34, 0.85) 0%, rgba(9, 23, 18, 0.98) 100%);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 0.6rem; height: 0.6rem; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
                  <span style="font-size: 0.82rem; font-weight: 700; color: #ffffff; text-transform: uppercase;">Smart Bin #B-104</span>
                </div>
                <span style="font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: var(--radius-full); background: rgba(52, 211, 153, 0.2); color: var(--color-lime-300); font-weight: 600;">Interactive 3D Demo</span>
              </div>

              <!-- Canvas 3D Bin Mount Point -->
              <div id="hero-3d-bin-container" style="width: 100%; height: 320px; cursor: grab;" title="Drag to rotate 3D Bin"></div>

              <div style="margin-top: 0.75rem; background: rgba(0,0,0,0.3); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.4rem;">
                  <span style="color: var(--text-secondary);">Simulated Fill Level</span>
                  <span id="demo-fill-label" style="font-weight: 700; color: var(--color-lime-400);">68% (Filling)</span>
                </div>
                <input type="range" id="demo-fill-slider" min="5" max="100" value="68" style="width: 100%; accent-color: var(--color-emerald-400); cursor: pointer;" />
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">
                  Drag slider or drag the 3D model to test angle & fill telemetry
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ISOMETRIC SMART CITY SECTION -->
      <section style="padding: 4rem 1.5rem; background: rgba(6, 20, 16, 0.5); border-top: 1px solid rgba(52, 211, 153, 0.15); border-bottom: 1px solid rgba(52, 211, 153, 0.15);">
        <div style="max-width: 1240px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 2.5rem;">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-teal-400); text-transform: uppercase; letter-spacing: 0.08em;">Connected Sanitation Infrastructure</span>
            <h2 style="font-family: var(--font-family-display); font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800; color: #ffffff; margin-top: 0.5rem;">
              Smart Municipal Grid in Real Time
            </h2>
            <p style="color: var(--text-secondary); max-width: 36rem; margin: 0.75rem auto 0 auto; font-size: 1rem;">
              Every bin, garbage truck, and sanitation worker is connected to our city-wide operational mesh.
            </p>
          </div>

          <div id="isometric-city-container"></div>
        </div>
      </section>

      <!-- 4 CORE PILLARS SECTION -->
      <section style="padding: 5rem 1.5rem; max-width: 1240px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-lime-400); text-transform: uppercase; letter-spacing: 0.08em;">Why EcoBin Works</span>
          <h2 style="font-family: var(--font-family-display); font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800; color: #ffffff; margin-top: 0.5rem;">
            Engineered for Clean, Livable Cities
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.75rem;">
          <!-- Pillar 1 -->
          <div class="depth-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.15); border: 1.5px solid rgba(52, 211, 153, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: var(--shadow-3d-sm);">
              📸
            </div>
            <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff;">Geotagged Photo Reports</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Snap up to 5 photos from device camera or gallery. Reverse geocoding detects your ward & address automatically.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="depth-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); background: rgba(14, 165, 233, 0.15); border: 1.5px solid rgba(14, 165, 233, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: var(--shadow-3d-sm);">
              🛰️
            </div>
            <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff;">Live Smart Bins Map</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Find the nearest green bin before leaving home. Color-coded markers show real-time capacity and last collection time.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="depth-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); background: rgba(139, 92, 246, 0.15); border: 1.5px solid rgba(139, 92, 246, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: var(--shadow-3d-sm);">
              ⏱️
            </div>
            <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff;">Strict SLA & Photo Proof</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Field officers must upload before-and-after photo evidence to mark complaints resolved. Rate performance or reopen in 48h.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="depth-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.15); border: 1.5px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: var(--shadow-3d-sm);">
              🏆
            </div>
            <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff;">Gamified Eco Points</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Earn Eco Points with every verified report. Unlock Gold Citizen status and see your ward top the cleanliness leaderboard.
            </p>
          </div>
        </div>
      </section>

      <!-- IMPACT METRICS -->
      <section style="padding: 3.5rem 1.5rem; background: linear-gradient(180deg, rgba(16, 44, 34, 0.4) 0%, rgba(9, 23, 18, 0.8) 100%); border-top: 1px solid rgba(52, 211, 153, 0.15);">
        <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
          <div>
            <div style="font-family: var(--font-family-display); font-size: 3rem; font-weight: 800; color: #ffffff;">14,820+</div>
            <div style="color: var(--color-lime-400); font-weight: 600; font-size: 0.95rem; margin-top: 0.25rem;">Complaints Resolved</div>
          </div>
          <div>
            <div style="font-family: var(--font-family-display); font-size: 3rem; font-weight: 800; color: #ffffff;">94.2%</div>
            <div style="color: var(--color-emerald-400); font-weight: 600; font-size: 0.95rem; margin-top: 0.25rem;">SLA Resolution Rate</div>
          </div>
          <div>
            <div style="font-family: var(--font-family-display); font-size: 3rem; font-weight: 800; color: #ffffff;">1,250</div>
            <div style="color: var(--color-teal-400); font-weight: 600; font-size: 0.95rem; margin-top: 0.25rem;">Smart IoT Bins Online</div>
          </div>
          <div>
            <div style="font-family: var(--font-family-display); font-size: 3rem; font-weight: 800; color: #ffffff;">4.8h</div>
            <div style="color: var(--color-sky-400); font-weight: 600; font-size: 0.95rem; margin-top: 0.25rem;">Average Response Time</div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer style="padding: 3rem 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          <a href="#/" style="color: var(--text-secondary); text-decoration: none;">Home</a>
          <a href="#/citizen/dashboard" style="color: var(--text-secondary); text-decoration: none;">Citizen Dashboard</a>
          <a href="#/officer/dashboard" style="color: var(--text-secondary); text-decoration: none;">Field Officer Tasks</a>
          <a href="#/admin/dashboard" style="color: var(--text-secondary); text-decoration: none;">Admin Control Panel</a>
          <a href="#/login" style="color: var(--text-secondary); text-decoration: none;">Sign In</a>
        </div>
        <div>EcoBin Smart Waste Platform © 2026. Built for sustainable smart cities.</div>
      </footer>
    </div>

    <style>
      @media (min-width: 900px) {
        .hero-grid {
          grid-template-columns: 1.15fr 0.85fr !important;
        }
      }
    </style>
  `;

  // Initialize Interactive 3D Bin in Hero
  const binContainer = container.querySelector('#hero-3d-bin-container');
  if (binContainer) {
    const binCanvas = new EcoBin3DCanvas(binContainer, { fillLevel: 68, interactive: true });

    // Hook demo slider
    const slider = container.querySelector('#demo-fill-slider');
    const label = container.querySelector('#demo-fill-label');
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        binCanvas.setFillLevel(val);
        const statusText = val > 80 ? 'Critical Overflow' : (val > 60 ? 'Filling' : 'Normal');
        label.textContent = `${val}% (${statusText})`;
        label.style.color = val > 80 ? '#ef4444' : (val > 60 ? '#f59e0b' : '#34d399');
      });
    }
  }

  // Render Isometric City
  const isoContainer = container.querySelector('#isometric-city-container');
  if (isoContainer) {
    renderIsometricCity(isoContainer);
  }
}
