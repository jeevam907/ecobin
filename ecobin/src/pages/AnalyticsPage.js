/**
 * EcoBin Analytics & AI Insights Page (Phase 10)
 * Aggregated Telemetry, Interactive Charts, AI-Assisted Advisory Engine & Exportable Reports
 */

import { db } from '../services/db.js';
import { generateAIBriefing } from '../services/ai.js';
import { toast } from '../components/ui/Toast.js';

export function renderAnalyticsPage(container) {
  const complaints = db.getComplaints();
  const bins = db.getBins();

  // Aggregate Category breakdown
  const categoryCounts = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const total = complaints.length || 1;

  container.innerHTML = `
    <div style="max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); background: rgba(168, 85, 247, 0.15); color: #c084fc; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;">
            Intelligence & Trends
          </div>
          <h1 style="font-family: var(--font-family-display); font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem;">
            Municipal Analytics & AI Briefings
          </h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Predictive pattern detection, recurring hotspot identification, and executive briefs.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" id="print-report-btn" class="btn-3d btn-3d-outline" style="padding: 0.6rem 1.25rem; font-size: 0.85rem;">
            🖨️ Printable Executive Report
          </button>
          <button type="button" id="regenerate-ai-btn" class="btn-3d btn-3d-primary" style="padding: 0.6rem 1.25rem; font-size: 0.85rem;">
            ✨ Refresh AI Briefing
          </button>
        </div>
      </div>

      <!-- AI-Generated Advisory Card (GPT-4o / Heuristic) -->
      <div id="ai-briefing-card" class="depth-card" style="padding: 2.25rem; margin-bottom: 2.5rem; border: 1.5px solid rgba(168, 85, 247, 0.45); background: linear-gradient(135deg, rgba(32, 18, 52, 0.92) 0%, rgba(9, 23, 18, 0.98) 100%); box-shadow: var(--shadow-3d-lg), 0 0 35px rgba(168, 85, 247, 0.2);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-md); background: var(--grad-purple-accent); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: var(--glow-purple);">
              ✨
            </div>
            <div>
              <h3 style="font-family: var(--font-family-display); font-size: 1.35rem; font-weight: 800; color: #ffffff;">
                EcoBin Intelligent City Briefing
              </h3>
              <span id="ai-model-tag" style="font-size: 0.78rem; color: var(--color-purple-400); font-weight: 700;">
                Processing telemetry...
              </span>
            </div>
          </div>
          <span style="font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); background: rgba(168, 85, 247, 0.2); color: #ffffff;">
            Confidence: <strong id="ai-confidence">96.4%</strong>
          </span>
        </div>

        <p id="ai-briefing-text" style="color: var(--text-primary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.25rem;">
          Evaluating city-wide complaint distributions, repeat dumping coordinates, and smart bin telemetry...
        </p>

        <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.85rem; flex-wrap: wrap;">
          <span>Evaluated Complaints: <strong style="color: #ffffff;">${complaints.length}</strong></span>
          <span>Monitored Smart Bins: <strong style="color: #ffffff;">${bins.length}</strong></span>
          <span>Advisory Status: <strong style="color: var(--color-lime-300);">Actionable Dispatch Recommended</strong></span>
        </div>
      </div>

      <!-- Charts & Visual Breakdown Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.75rem; margin-bottom: 2.5rem;">
        
        <!-- Category Distribution -->
        <div class="depth-card" style="padding: 1.75rem;">
          <h3 style="font-family: var(--font-family-display); font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 1.5rem;">
            Complaint Volume by Category
          </h3>
          <div style="display: flex; flex-direction: column; gap: 1.1rem;">
            ${Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
                    <span style="color: #ffffff; font-weight: 600;">${cat}</span>
                    <strong style="color: var(--color-lime-300);">${count} (${pct}%)</strong>
                  </div>
                  <div style="height: 0.65rem; background: rgba(0,0,0,0.3); border-radius: 999px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #84cc16 100%); border-radius: 999px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Repeat Violation Hotspots -->
        <div class="depth-card" style="padding: 1.75rem;">
          <h3 style="font-family: var(--font-family-display); font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 1.25rem;">
            Top Recurring Violation Hotspots
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="padding: 0.85rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border-left: 3px solid #ef4444;">
              <strong style="color: #ffffff; font-size: 0.95rem;">Bellandur Central Plaza Bus Shelter</strong>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">4 complaints in last 72h • Commercial debris</div>
              <a href="#/citizen/map" style="font-size: 0.75rem; color: var(--color-emerald-400); font-weight: 600; text-decoration: none; display: inline-block; margin-top: 0.35rem;">View on Map →</a>
            </div>

            <div style="padding: 0.85rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border-left: 3px solid #f59e0b;">
              <strong style="color: #ffffff; font-size: 0.95rem;">Indiranagar Metro Pillar #42</strong>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">3 complaints in last 72h • Roadside dumping</div>
              <a href="#/citizen/map" style="font-size: 0.75rem; color: var(--color-emerald-400); font-weight: 600; text-decoration: none; display: inline-block; margin-top: 0.35rem;">View on Map →</a>
            </div>

            <div style="padding: 0.85rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border-left: 3px solid #10b981;">
              <strong style="color: #ffffff; font-size: 0.95rem;">HSR Sector 5 Main Road</strong>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">2 complaints in last 72h • Door-to-door delay</div>
              <a href="#/citizen/map" style="font-size: 0.75rem; color: var(--color-emerald-400); font-weight: 600; text-decoration: none; display: inline-block; margin-top: 0.35rem;">View on Map →</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Fetch AI Briefing
  async function loadAIBriefing() {
    const brief = await generateAIBriefing(complaints, bins);
    const textEl = container.querySelector('#ai-briefing-text');
    const tagEl = container.querySelector('#ai-model-tag');
    const confEl = container.querySelector('#ai-confidence');
    if (textEl && tagEl && confEl) {
      textEl.innerHTML = brief.text;
      tagEl.textContent = `Generated via ${brief.source}`;
      confEl.textContent = brief.confidence;
    }
  }

  loadAIBriefing();

  const regenBtn = container.querySelector('#regenerate-ai-btn');
  if (regenBtn) {
    regenBtn.addEventListener('click', () => {
      toast.info('Recalculating AI briefing...');
      loadAIBriefing();
    });
  }

  const printBtn = container.querySelector('#print-report-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
