/**
 * EcoBin Authentication Page (Login / Registration / Reset Password)
 * Connected to real authService with field validation, persistent session, and role redirection.
 */

import { authService } from '../services/auth.js';
import { toast } from '../components/ui/Toast.js';

export function renderAuthPage(container, mode = 'login') {
  let activeRoleTab = mode === 'admin' ? 'admin' : 'citizen';
  let resetStep = 'request'; // 'request' | 'verify'
  let resetIdentity = '';

  function render() {
    container.innerHTML = `
      <div style="min-height: 85vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">
        <div class="depth-card" style="width: 100%; max-width: 480px; padding: 2.25rem; border: 1.5px solid rgba(52, 211, 153, 0.35); background: linear-gradient(180deg, rgba(16, 44, 34, 0.92) 0%, rgba(9, 23, 18, 0.98) 100%);">
          
          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 1.75rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); background: var(--grad-hero); margin: 0 auto 1rem auto; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-3d-md); font-size: 1.75rem;" class="floating-anim">
              🌱
            </div>
            <h1 style="font-family: var(--font-family-display); font-size: 1.8rem; font-weight: 800; color: #ffffff;">
              ${mode === 'register' ? 'Create EcoBin Account' : (mode === 'reset' ? 'Reset Password' : 'Sign In to EcoBin')}
            </h1>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.35rem;">
              ${mode === 'register' 
                ? 'Join your neighbors in smart waste reporting (+100 Eco Points)' 
                : (mode === 'reset' ? 'We will send a 6-digit OTP code to your device' : 'Access your citizen reporting or municipal ops portal')}
            </p>
          </div>

          <!-- Role Toggle Tabs (Citizen vs Municipal Staff) -->
          ${mode !== 'reset' ? `
            <div style="display: flex; gap: 0.5rem; background: rgba(0,0,0,0.35); padding: 0.35rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.06);">
              <button type="button" id="tab-citizen" class="btn-3d ${activeRoleTab === 'citizen' ? 'btn-3d-primary' : 'btn-3d-outline'}" style="flex: 1; padding: 0.5rem; font-size: 0.82rem;">
                🌱 Citizen Portal
              </button>
              <button type="button" id="tab-admin" class="btn-3d ${activeRoleTab === 'admin' ? 'btn-3d-primary' : 'btn-3d-outline'}" style="flex: 1; padding: 0.5rem; font-size: 0.82rem;">
                ⚡ Municipal Staff
              </button>
            </div>
          ` : ''}

          <!-- Error Alert Banner -->
          <div id="auth-error-banner" style="display: none; background: rgba(239, 68, 68, 0.18); border: 1.5px solid rgba(239, 68, 68, 0.5); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #fca5a5; margin-bottom: 1.25rem;">
          </div>

          <!-- LOGIN / REGISTER / RESET FORM -->
          <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
            ${mode === 'register' ? `
              <div class="eco-form-group">
                <label class="eco-label">Full Name *</label>
                <input type="text" id="reg-name" class="eco-input" placeholder="e.g. Priya Sharma" required />
              </div>

              <div class="eco-form-group">
                <label class="eco-label">Email Address *</label>
                <input type="email" id="reg-email" class="eco-input" placeholder="priya@example.com" required />
              </div>

              <div class="eco-form-group">
                <label class="eco-label">Mobile Number (For SMS OTP) *</label>
                <input type="tel" id="reg-phone" class="eco-input" placeholder="+91 98765 43210" required />
              </div>

              <div class="eco-form-group">
                <label class="eco-label">Municipal Ward *</label>
                <select id="reg-ward" class="eco-select">
                  <option value="Ward 150 - Bellandur">Ward 150 - Bellandur</option>
                  <option value="Ward 174 - HSR Layout">Ward 174 - HSR Layout</option>
                  <option value="Ward 72 - Indiranagar">Ward 72 - Indiranagar</option>
                  <option value="Ward 84 - Koramangala">Ward 84 - Koramangala</option>
                  <option value="Ward 102 - Whitefield">Ward 102 - Whitefield</option>
                </select>
              </div>

              <div class="eco-form-group">
                <label class="eco-label">Create Password (min 6 characters) *</label>
                <input type="password" id="reg-password" class="eco-input" placeholder="••••••••" required />
              </div>
            ` : (mode === 'reset' ? `
              ${resetStep === 'request' ? `
                <div class="eco-form-group">
                  <label class="eco-label">Registered Email or Mobile Number</label>
                  <input type="text" id="reset-identity-input" class="eco-input" placeholder="you@example.com or mobile" required />
                </div>
              ` : `
                <div class="eco-form-group">
                  <label class="eco-label">6-Digit Verification Code (Sent to device)</label>
                  <input type="text" id="reset-otp-input" class="eco-input" placeholder="123456" maxlength="6" style="letter-spacing: 0.3em; font-size: 1.2rem; text-align: center; font-family: var(--font-family-mono);" required />
                  <span style="font-size: 0.75rem; color: var(--color-lime-400); margin-top: 0.2rem;">Demo verification OTP is 123456</span>
                </div>
                <div class="eco-form-group">
                  <label class="eco-label">Set New Password</label>
                  <input type="password" id="reset-new-password" class="eco-input" placeholder="••••••••" required />
                </div>
              `}
            ` : `
              <!-- Sign In Fields -->
              <div class="eco-form-group">
                <label class="eco-label">Email or Mobile Number</label>
                <input type="text" id="login-identity" class="eco-input" placeholder="${activeRoleTab === 'admin' ? 'admin@ecobin.city or officer@ecobin.city' : 'citizen@ecobin.city or mobile'}" required />
              </div>

              <div class="eco-form-group">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="eco-label">Password</label>
                  <a href="#/forgot-password" style="font-size: 0.78rem; color: var(--color-emerald-400); text-decoration: none;">Forgot password?</a>
                </div>
                <input type="password" id="login-password" class="eco-input" placeholder="••••••••" required />
              </div>
            `)}

            <button type="submit" id="submit-auth-btn" class="btn-3d btn-3d-primary" style="width: 100%; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
              <span id="btn-text">
                ${mode === 'register' 
                  ? 'Complete Registration (+100 Eco Points)' 
                  : (mode === 'reset' ? (resetStep === 'request' ? 'Send Reset OTP' : 'Update Password') : 'Sign In')}
              </span>
            </button>
          </form>

          <!-- Demo Quick Fill Helpers -->
          <div style="margin-top: 1.25rem; background: rgba(0,0,0,0.3); border: 1px dashed rgba(52, 211, 153, 0.3); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.78rem;">
            <div style="color: var(--color-lime-300); font-weight: 700; margin-bottom: 0.35rem;">⚡ Quick Test Credentials:</div>
            <div style="display: flex; flex-direction: column; gap: 0.25rem; color: var(--text-secondary);">
              <div><strong style="color: #fff;">Citizen:</strong> citizen@ecobin.city / citizen123</div>
              <div><strong style="color: #fff;">Officer:</strong> officer@ecobin.city / officer123</div>
              <div><strong style="color: #fff;">Admin:</strong> admin@ecobin.city / admin123</div>
            </div>
          </div>

          <!-- Bottom Navigation Links -->
          <div style="text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-secondary);">
            ${mode === 'register' ? `
              Already registered? <a href="#/login" style="color: var(--color-lime-400); font-weight: 600; text-decoration: none;">Sign in here</a>
            ` : `
              New to EcoBin? <a href="#/register" style="color: var(--color-lime-400); font-weight: 600; text-decoration: none;">Create Citizen Account</a>
            `}
          </div>

        </div>
      </div>
    `;

    // Hook tab switches
    const tabCitizen = container.querySelector('#tab-citizen');
    const tabAdmin = container.querySelector('#tab-admin');
    if (tabCitizen && tabAdmin) {
      tabCitizen.addEventListener('click', () => {
        activeRoleTab = 'citizen';
        render();
      });
      tabAdmin.addEventListener('click', () => {
        activeRoleTab = 'admin';
        render();
      });
    }

    // Hook Form Submission
    const form = container.querySelector('#auth-form');
    const errorBanner = container.querySelector('#auth-error-banner');
    const btn = container.querySelector('#submit-auth-btn');
    const btnText = container.querySelector('#btn-text');

    function showError(msg) {
      errorBanner.textContent = msg;
      errorBanner.style.display = 'block';
    }

    function hideError() {
      errorBanner.style.display = 'none';
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();
        btn.disabled = true;
        btnText.textContent = 'Verifying...';

        try {
          if (mode === 'register') {
            const name = container.querySelector('#reg-name').value;
            const email = container.querySelector('#reg-email').value;
            const phone = container.querySelector('#reg-phone').value;
            const ward = container.querySelector('#reg-ward').value;
            const password = container.querySelector('#reg-password').value;

            const res = await authService.register({ name, email, phone, ward, password });
            if (!res.success) {
              showError(res.error);
              btn.disabled = false;
              btnText.textContent = 'Complete Registration (+100 Eco Points)';
              return;
            }

            toast.success(`Welcome to EcoBin, ${res.user.name}! +100 Eco Points awarded.`);
            setTimeout(() => { window.location.hash = '#/citizen/dashboard'; }, 500);

          } else if (mode === 'reset') {
            if (resetStep === 'request') {
              resetIdentity = container.querySelector('#reset-identity-input').value;
              const res = await authService.requestPasswordReset(resetIdentity);
              if (!res.success) {
                showError(res.error);
                btn.disabled = false;
                btnText.textContent = 'Send Reset OTP';
                return;
              }
              toast.info(res.message);
              resetStep = 'verify';
              render();
            } else {
              const otp = container.querySelector('#reset-otp-input').value;
              const newPassword = container.querySelector('#reset-new-password').value;
              const res = await authService.resetPassword({ identity: resetIdentity, otp, newPassword });
              if (!res.success) {
                showError(res.error);
                btn.disabled = false;
                btnText.textContent = 'Update Password';
                return;
              }
              toast.success('Password updated successfully! Please sign in with your new credentials.');
              setTimeout(() => { window.location.hash = '#/login'; }, 800);
            }

          } else {
            // Sign in
            const identity = container.querySelector('#login-identity').value;
            const password = container.querySelector('#login-password').value;

            const res = await authService.login({ identity, password, roleHint: activeRoleTab });
            if (!res.success) {
              showError(res.error);
              btn.disabled = false;
              btnText.textContent = 'Sign In';
              return;
            }

            toast.success(`Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`);
            setTimeout(() => {
              if (res.user.role === 'admin' || res.user.role === 'supervisor') {
                window.location.hash = '#/admin/dashboard';
              } else if (res.user.role === 'officer') {
                window.location.hash = '#/officer/dashboard';
              } else {
                window.location.hash = '#/citizen/dashboard';
              }
            }, 600);
          }
        } catch (err) {
          showError('Unexpected authentication error: ' + err.message);
          btn.disabled = false;
          btnText.textContent = 'Try Again';
        }
      });
    }
  }

  render();
}
