/**
 * EcoBin Live Smart Bins Map Page (Phase 6)
 * Real Leaflet.js Interactive Canvas with Dark Matter Tile Shading,
 * Custom 3D Glowing SVG Markers, Ultrasonic Fill Telemetry & "Report Here" Prefill.
 */

import { db } from '../services/db.js';
import { toast } from '../components/ui/Toast.js';

export function renderBinMapPage(container) {
  const bins = db.getBins();
  let activeFilter = 'all';
  let searchQuery = '';
  let mapInstance = null;

  function filterBins() {
    return bins.filter(b => {
      const matchesSearch = b.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === 'ok') return b.fillLevel <= 60;
      if (activeFilter === 'warning') return b.fillLevel > 60 && b.fillLevel <= 80;
      if (activeFilter === 'critical') return b.fillLevel > 80;
      return true;
    });
  }

  function render() {
    const filtered = filterBins();

    container.innerHTML = `
      <div style="max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Header & Search Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h1 style="font-family: var(--font-family-display); font-size: 2.2rem; font-weight: 800; color: #ffffff;">
              Live Smart Bins Map
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem;">
              IoT ultrasonic fill sensors reporting in real-time across municipal ward locations.
            </p>
          </div>

          <!-- Controls -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-3d ${activeFilter === 'all' ? 'btn-3d-primary' : 'btn-3d-outline'} map-filter-btn" data-filter="all" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;">All Bins (${bins.length})</button>
            <button class="btn-3d ${activeFilter === 'ok' ? 'btn-3d-primary' : 'btn-3d-outline'} map-filter-btn" data-filter="ok" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: #34d399;">Green (&lt;60%)</button>
            <button class="btn-3d ${activeFilter === 'warning' ? 'btn-3d-primary' : 'btn-3d-outline'} map-filter-btn" data-filter="warning" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: #fbbf24;">Yellow (60-80%)</button>
            <button class="btn-3d ${activeFilter === 'critical' ? 'btn-3d-primary' : 'btn-3d-outline'} map-filter-btn" data-filter="critical" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: #f87171;">Red (&gt;80%)</button>
          </div>
        </div>

        <!-- Search Bar -->
        <div style="margin-bottom: 1.5rem;">
          <input type="text" id="map-search-input" class="eco-input" placeholder="🔍 Search by Bin ID, Ward or Landmark (e.g. Bellandur, Metro, BIN-101)..." value="${searchQuery}" />
        </div>

        <!-- Leaflet Map Mount Container -->
        <div class="depth-card" style="position: relative; border: 1.5px solid rgba(52, 211, 153, 0.35); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2rem;">
          <div id="leaflet-map-canvas" style="width: 100%; height: 420px; background: #061712;"></div>
          
          <!-- Map Overlay Legend -->
          <div style="position: absolute; bottom: 1rem; left: 1rem; z-index: 1000; background: rgba(9, 23, 18, 0.85); backdrop-filter: blur(12px); padding: 0.6rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(52, 211, 153, 0.25); display: flex; align-items: center; gap: 1rem; font-size: 0.78rem;">
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 0.65rem; height: 0.65rem; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
              <span>Optimal</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 0.65rem; height: 0.65rem; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px #f59e0b;"></span>
              <span>Filling</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 0.65rem; height: 0.65rem; border-radius: 50%; background: #ef4444; box-shadow: 0 0 6px #ef4444;"></span>
              <span>Critical Full</span>
            </div>
          </div>
        </div>

        <!-- Filtered Cards List -->
        <h2 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 700; color: #ffffff; margin-bottom: 1.25rem;">
          Smart Bins in Active View (${filtered.length})
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${filtered.map(bin => {
            const fill = bin.fillLevel;
            const color = fill > 80 ? '#ef4444' : (fill > 60 ? '#f59e0b' : '#10b981');
            return `
              <div class="depth-card" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; border-left: 4px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-lime-300); font-weight: 700;">${bin.id}</span>
                  <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 999px; background: ${color}20; color: ${color}; font-weight: 700;">
                    ${fill > 80 ? 'CRITICAL FULL' : (fill > 60 ? 'FILLING' : 'OPTIMAL')}
                  </span>
                </div>

                <h3 style="font-family: var(--font-family-display); font-size: 1.05rem; font-weight: 700; color: #ffffff;">
                  ${bin.location}
                </h3>

                <div style="font-size: 0.82rem; color: var(--text-secondary);">
                  Type: <strong>${bin.type}</strong> | Ward: ${bin.ward}
                </div>

                <!-- 3D Progress -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.35rem;">
                    <span style="color: var(--text-muted);">Sensor Fill Telemetry</span>
                    <strong style="color: ${color}; font-size: 0.9rem;">${fill}%</strong>
                  </div>
                  <div class="bin-gauge">
                    <div class="bin-gauge-fill" style="width: ${fill}%; background: ${color};"></div>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem; pt: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 0.75rem; color: var(--text-muted);">Emptied: ${bin.lastEmptied}</span>
                  <a href="#/citizen/report/new" style="font-size: 0.82rem; color: var(--color-emerald-400); font-weight: 600; text-decoration: none;">
                    Report Here →
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Filter Buttons
    container.querySelectorAll('.map-filter-btn').forEach(b => {
      b.addEventListener('click', () => {
        activeFilter = b.getAttribute('data-filter');
        render();
      });
    });

    // Search Input
    const searchInput = container.querySelector('#map-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    // Initialize Leaflet Map or Fallback
    initMap(filtered);
  }

  function initMap(binsToMap) {
    const mapEl = container.querySelector('#leaflet-map-canvas');
    if (!mapEl) return;

    if (window.L) {
      try {
        if (mapInstance) {
          mapInstance.remove();
        }
        // Center around Bangalore Ward 150 Bellandur
        mapInstance = window.L.map(mapEl).setView([12.9310, 77.6780], 14);

        // CartoDB Dark Matter tiles for 3D cyberpunk aesthetic
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19
        }).addTo(mapInstance);

        // Add custom 3D SVG markers
        binsToMap.forEach(bin => {
          const color = bin.fillLevel > 80 ? '#ef4444' : (bin.fillLevel > 60 ? '#f59e0b' : '#10b981');
          const customIcon = window.L.divIcon({
            className: 'custom-bin-marker',
            html: `
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 0 16px ${color}; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;">
                🗑️
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = window.L.marker([bin.lat || 12.931, bin.lng || 77.678], { icon: customIcon }).addTo(mapInstance);
          marker.bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #022c22; padding: 4px;">
              <strong style="font-size: 14px; display: block;">${bin.location}</strong>
              <div style="font-size: 12px; margin: 4px 0;"><strong>ID:</strong> ${bin.id} | <strong>Fill:</strong> ${bin.fillLevel}%</div>
              <div style="font-size: 11px; color: #555;">${bin.type}</div>
              <a href="#/citizen/report/new" style="display: inline-block; margin-top: 8px; font-weight: bold; color: #059669; text-decoration: none;">+ Report Issue at this Bin</a>
            </div>
          `);
        });

      } catch (err) {
        console.warn('Leaflet initialization fallback:', err);
        renderFallbackMap(mapEl, binsToMap);
      }
    } else {
      renderFallbackMap(mapEl, binsToMap);
    }
  }

  function renderFallbackMap(mapEl, binsToMap) {
    mapEl.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(rgba(52, 211, 153, 0.2) 1.5px, transparent 1.5px); background-size: 24px 24px;">
        <div style="text-align: center; padding: 2rem; position: relative; z-index: 10;">
          <div style="font-size: 3rem;" class="floating-anim">🗺️</div>
          <h3 style="font-family: var(--font-family-display); font-size: 1.4rem; color: #ffffff; font-weight: 700; margin-top: 0.5rem;">
            Smart Bins Geographic Mesh
          </h3>
          <p style="color: var(--text-secondary); max-width: 32rem; margin: 0.4rem auto; font-size: 0.9rem;">
            ${binsToMap.length} IoT Ultrasonic sensors active across East Zone wards.
          </p>
          <div style="display: flex; justify-content: center; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap;">
            ${binsToMap.map(b => `
              <span style="padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); color: #fff;">
                📍 ${b.id}: ${b.fillLevel}% Full
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  render();
}
