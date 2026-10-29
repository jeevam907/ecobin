# EcoBin — 3D Smart Waste Management & Sanitation Platform

> **"Spot the Waste. Report in Seconds. Track Until Clean."**

EcoBin is a complete, progressive, high-performance, mobile-first 3D smart-city sanitation application. It unites citizens, field sanitation crews, and municipal administrators with real-time IoT bin monitoring, geotagged complaints, and verified resolution workflows.

---

## 🏗️ 12-Phase Development Architecture Completed

| Phase | Milestone | Implemented Capabilities |
|---|---|---|
| **Phase 1** | **Foundation & 3D Design** | Emerald/Lime/Turquoise/Purple palette, CSS 3D transforms, depth shadows, reusable UI components (`Button`, `Card`, `Badge`, `Toast`, `Skeleton`), responsive navigation shells, and client-side router. |
| **Phase 2** | **Backend & Authentication** | Persistent database layer (`db.js`), Supabase client bridge (`supabase.js`), validation, persistent JWT sessions, 7-day expiry, 6-digit OTP reset flow, and role-based permissions (`citizen`, `officer`, `admin`). |
| **Phase 3** | **Citizen Hub & Profile** | Gamified Eco Points (+50 per verified report), tier roadmap (Bronze ➔ Silver ➔ Gold ➔ Platinum), ward rankings, real-time avatar customization, profile editing, and multilingual localization (`i18n.js` in English, Hindi, Kannada, Tamil). |
| **Phase 4** | **Complaint Wizard & Offline** | Multi-photo camera/gallery upload with in-browser image compression, auto-GPS geotagging with reverse geocoding, 3D category tiles, SLA countdowns, 500-char counter, AI category advisor, and IndexedDB offline drafts store (`offline.js`). |
| **Phase 5** | **Tracking & Citizen Rating** | Real-time status timeline (Submitted ➔ Assigned ➔ In Progress ➔ Resolved ➔ Closed), officer after-clean photo proof, 48-hour reopen mechanism, interactive 5-star rating with bonus points, and WhatsApp sharing. |
| **Phase 6** | **Live Smart Bins Map** | Leaflet.js interactive canvas with CartoDB Dark Matter tiles, 3D glowing markers (Green, Yellow, Red), ultrasonic fill telemetry, search filter, and "Report at this bin" prefill. |
| **Phase 7** | **Field Officer Dispatch** | Priority/SLA assignment queue, on-site status toggle (`in_progress`), turn-by-turn GPS route trigger, resolution photo upload modal, work notes, and real-time status sync. |
| **Phase 8** | **Municipal Admin Control** | City-wide KPI cards, sortable/searchable priority complaints table, bulk actions (Bulk Assign, Bulk Resolve), CSV report export, emergency city-wide citizen alert broadcast, and officer assignment modal. |
| **Phase 9** | **Admin Control Panel** | User management (activate/deactivate staff, add officer), Smart Bins hardware registry (force empty, register new IoT bin), Ward boundary polygons, configurable SLA hours (Critical 4h, High 12h, Medium 24h, Low 72h), and immutable audit logs. |
| **Phase 10** | **Analytics & AI Insights** | Real data aggregations (volume by category, repeat violation hotspots), OpenAI GPT-4o advisory engine with intelligent statistical heuristic fallback, and printable municipal executive report view. |
| **Phase 11** | **Notifications, PWA & Sync** | In-app notification center with unread counts and mark-all-read action, PWA `manifest.json`, Service Worker `sw.js` for offline asset caching, and background sync for queued reports. |
| **Phase 12** | **Testing, Security & Release** | End-to-end automated test runner (`test-all-phases.ps1`), AST token syntax validation, zero hardcoded secrets verification, WCAG AA contrast compliance, and production release guide. |

---

## ⚡ Quick Test Credentials

Click **"Sign In"** or use the topbar Role Switcher with these pre-seeded accounts:
- **Citizen Account:** `citizen@ecobin.city` / Password: `citizen123`
- **Field Officer Account:** `officer@ecobin.city` / Password: `officer123`
- **Municipal Admin Account:** `admin@ecobin.city` / Password: `admin123`

---

## 🚀 How to Run Locally

### Option A: Zero-Dependency PowerShell Server (Recommended)
```powershell
cd C:\Users\Jeevan\Downloads\ecobin
.\serve.ps1
```
Your default browser will automatically open at **`http://localhost:5000`**.

### Option B: Direct Browser Access
Because EcoBin is built using native browser ES modules, you can also double-click `index.html` or open:
```
file:///C:/Users/Jeevan/Downloads/ecobin/index.html
```

### Option C: With Node.js / Vite
```bash
npm install
npm run dev
```

---

## 🧪 Running Automated Tests

Run the comprehensive 12-phase verification script anytime in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-all-phases.ps1
```
Result: **All 31 modules, 20 routes, design tokens, security scans, and PWA assets verified with 0 errors.**
