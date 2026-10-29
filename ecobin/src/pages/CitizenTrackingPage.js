/**
 * EcoBin Complaint Tracking & Feedback Page (Phase 5)
 * 3D Timeline Tree, Officer Proof Photos, 48-Hour Reopen, Interactive 5-Star Rating & WhatsApp Sharing
 */

import { db } from '../services/db.js';
import { authService } from '../services/auth.js';
import { createStatusPill, createSeverityBadge } from '../components/ui/Badge.js';
import { toast } from '../components/ui/Toast.js';

export function renderCitizenTrackingPage(container, params = {}) {
  const user = authService.getCurrentUser() || { id: 'usr_citizen_1', name: 'Aarav Sharma' };
  const complaints = db.getComplaints();
  const complaintId = params.id || (complaints[0] && complaints[0].id) || 'ECO-2026-8941';
  let complaint = db.getComplaintById(complaintId) || complaints[0];

  if (!complaint) {
    container.innerHTML = `
      <div style="max-width: 800px; margin: 4rem auto; text-align: center; padding: 2rem;">
        <h2 style="font-family: var(--font-family-display); font-size: 1.8rem; color: #ffffff;">Complaint Not Found</h2>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem 0;">We could not locate complaint #${complaintId}.</p>
        <a href="#/citizen/dashboard" class="btn-3d btn-3d-primary">Return to Dashboard</a>
      </div>
    `;
    return;
  }

  let userRating = complaint.rating || 0;

  function render() {
    const isResolved = complaint.status === 'resolved' || complaint.status === 'closed';

    container.innerHTML = `
      <div style="max-width: 920px; margin: 0 auto; padding: 2rem 1.5rem 6rem 1.5rem;">
        
        <!-- Header & Action Shortcuts -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
          <a href="#/citizen/dashboard" style="display: inline-flex; align-items: center; gap: 0.4rem; color: var(--color-emerald-400); font-size: 0.88rem; font-weight: 600; text-decoration: none;">
            ← Back to All Complaints
          </a>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button id="whatsapp-share-btn" class="btn-3d btn-3d-outline" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: #25D366; border-color: rgba(37, 211, 102, 0.4);">
              💬 WhatsApp Share
            </button>
            <button id="copy-link-btn" class="btn-3d btn-3d-outline" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;">
              🔗 Copy Link
            </button>
            ${isResolved ? `
              <button id="reopen-btn" class="btn-3d btn-3d-outline" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; color: #f87171; border-color: rgba(239, 68, 68, 0.4);">
                🔄 Reopen (Within 48h)
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 3D Complaint Overview Card -->
        <div class="depth-card" style="padding: 2rem; margin-bottom: 2rem; border: 1.5px solid rgba(52, 211, 153, 0.35);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-family: var(--font-family-mono); font-size: 0.85rem; color: var(--color-lime-300); font-weight: 800; background: rgba(132, 204, 22, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">
                  ${complaint.id}
                </span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${complaint.submittedAt}</span>
              </div>
              <h1 style="font-family: var(--font-family-display); font-size: 1.85rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">
                ${complaint.category}
              </h1>
              <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem;">
                📍 ${complaint.address}
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.6rem;">
              ${createSeverityBadge(complaint.severity)}
              ${createStatusPill(complaint.status)}
            </div>
          </div>

          <!-- Description Box -->
          <div style="background: rgba(0,0,0,0.3); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06); margin-bottom: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">
              Report Description
            </div>
            <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6;">
              ${complaint.description || 'No description provided.'}
            </p>
          </div>

          <!-- Citizen Evidence Photos -->
          <div>
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.6rem;">
              Citizen Submitted Photos (${(complaint.photos || []).length})
            </div>
            <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
              ${(complaint.photos || []).map((p, i) => `
                <div style="width: 120px; height: 120px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid rgba(52, 211, 153, 0.4); flex: none; box-shadow: var(--shadow-3d-sm);">
                  <img src="${p}" alt="Photo ${i+1}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3D Resolution Timeline -->
        <div class="depth-card" style="padding: 2.25rem; margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-family-display); font-size: 1.4rem; font-weight: 700; color: #ffffff; margin-bottom: 1.75rem;">
            Live Municipal Status Timeline
          </h2>

          <div class="eco-timeline">
            <!-- 1. Submitted -->
            <div class="timeline-step completed">
              <div class="timeline-dot">✓</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #ffffff; font-size: 1rem;">1. Report Submitted & Geotagged</strong>
                  <span style="font-size: 0.75rem; color: var(--color-emerald-300);">${complaint.submittedAt}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">
                  Assigned to Municipal Ward: <strong>${complaint.ward}</strong>. GPS verified.
                </div>
              </div>
            </div>

            <!-- 2. Assigned -->
            <div class="timeline-step ${complaint.status !== 'submitted' ? 'completed' : 'active'}">
              <div class="timeline-dot">${complaint.status !== 'submitted' ? '✓' : '•'}</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #ffffff; font-size: 1rem;">2. Field Officer Dispatched</strong>
                  <span style="font-size: 0.75rem; color: var(--color-lime-300);">
                    ${complaint.status !== 'submitted' ? 'Assigned' : 'Awaiting Crew'}
                  </span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">
                  Assigned to: <strong style="color: #ffffff;">${complaint.assignedOfficer || 'Officer Rajesh Kumar (Sanitation Crew #12)'}</strong>
                </div>
              </div>
            </div>

            <!-- 3. In Progress -->
            <div class="timeline-step ${complaint.status === 'in_progress' ? 'active' : (isResolved ? 'completed' : 'pending')}">
              <div class="timeline-dot">${isResolved ? '✓' : '•'}</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #ffffff; font-size: 1rem;">3. Crew On-Site & Sanitation Work</strong>
                  <span style="font-size: 0.75rem; color: #c084fc;">
                    ${complaint.status === 'in_progress' ? 'Active On-Site' : (isResolved ? 'Completed' : 'Pending')}
                  </span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">
                  Sanitation truck dispatched with waste clearing tools.
                </div>
              </div>
            </div>

            <!-- 4. Resolved -->
            <div class="timeline-step ${isResolved ? 'completed' : 'pending'}">
              <div class="timeline-dot">${isResolved ? '✓' : '•'}</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #ffffff; font-size: 1rem;">4. Resolved & Verified with Photo Proof</strong>
                  <span style="font-size: 0.75rem; color: var(--color-emerald-400);">
                    ${isResolved ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">
                  ${isResolved 
                    ? `Resolved by officer. Cleanup photos and notes submitted.` 
                    : `Estimated SLA resolution time: within ${complaint.etaHours || 4} hours.`}
                </div>
                ${complaint.resolutionPhoto ? `
                  <div style="margin-top: 0.75rem;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem;">Officer Photo Evidence:</div>
                    <img src="${complaint.resolutionPhoto}" alt="Resolution Proof" style="width: 140px; height: 100px; object-fit: cover; border-radius: var(--radius-md); border: 2px solid var(--color-emerald-400);" />
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Star Citizen Rating & Feedback Section (When Resolved) -->
        ${isResolved ? `
          <div class="depth-card" style="padding: 2rem; border: 1.5px solid rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, rgba(20, 40, 30, 0.9) 0%, rgba(10, 20, 15, 0.95) 100%);">
            <h3 style="font-family: var(--font-family-display); font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">
              ⭐ Rate the Sanitation Service
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">
              Your feedback impacts the ward supervisor's rating and unlocks bonus Eco Points.
            </p>

            <!-- Star Rating Buttons -->
            <div style="display: flex; gap: 0.75rem; font-size: 2rem; cursor: pointer; margin-bottom: 1.25rem;" id="stars-row">
              ${[1, 2, 3, 4, 5].map(star => `
                <span class="star-icon" data-star="${star}" style="color: ${star <= userRating ? '#fde047' : 'rgba(255,255,255,0.2)'}; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='none'">★</span>
              `).join('')}
            </div>

            <textarea id="feedback-notes" class="eco-textarea" rows="2" placeholder="Leave remarks for the municipal crew (optional)...">${complaint.feedback || ''}</textarea>

            <button type="button" id="submit-rating-btn" class="btn-3d btn-3d-primary" style="margin-top: 1rem; padding: 0.75rem 1.5rem;">
              Submit Rating & Feedback
            </button>
          </div>
        ` : ''}

      </div>
    `;

    // Hook Share buttons
    const copyBtn = container.querySelector('#copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          toast.success('Complaint link copied to clipboard!');
        }
      });
    }

    const waBtn = container.querySelector('#whatsapp-share-btn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const text = encodeURIComponent(`Check the live status of waste complaint #${complaint.id} on EcoBin: ${window.location.href}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      });
    }

    // Hook Reopen button
    const reopenBtn = container.querySelector('#reopen-btn');
    if (reopenBtn) {
      reopenBtn.addEventListener('click', () => {
        complaint = db.updateComplaint(complaint.id, {
          status: 'in_progress',
          reopenedAt: new Date().toLocaleString()
        });
        db.addNotification({
          userId: user.id,
          title: 'Complaint Reopened',
          message: `Complaint #${complaint.id} was reopened by citizen. Crew notified.`,
          type: 'assigned',
          link: `#/citizen/complaint/${complaint.id}`
        });
        toast.info('Complaint reopened! Field supervisor re-alerted for immediate cleaning.');
        render();
      });
    }

    // Hook Rating
    const starIcons = container.querySelectorAll('.star-icon');
    starIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        userRating = parseInt(icon.getAttribute('data-star'), 10);
        render();
      });
    });

    const submitRatingBtn = container.querySelector('#submit-rating-btn');
    if (submitRatingBtn) {
      submitRatingBtn.addEventListener('click', () => {
        const notes = container.querySelector('#feedback-notes').value;
        complaint = db.updateComplaint(complaint.id, {
          rating: userRating,
          feedback: notes,
          status: 'closed'
        });
        toast.success(`Thank you! Rated ${userRating} stars. +25 Bonus Eco Points awarded.`);
        render();
      });
    }
  }

  render();
}
