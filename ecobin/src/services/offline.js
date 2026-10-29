/**
 * EcoBin IndexedDB Offline Drafts & Background Sync Engine
 * Caches reports offline, compresses images, and syncs automatically upon reconnection.
 */

import { db } from './db.js';
import { toast } from '../components/ui/Toast.js';

const DB_NAME = 'ecobin_offline_db';
const DB_VERSION = 1;
const STORE_DRAFTS = 'drafts';
const STORE_QUEUE = 'queued_reports';

class OfflineManager {
  constructor() {
    this.db = null;
    this.initIDB();
    this.setupSyncListener();
  }

  async initIDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('[OfflineManager] IndexedDB not available in this environment.');
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(STORE_DRAFTS)) {
          idb.createObjectStore(STORE_DRAFTS, { keyPath: 'id' });
        }
        if (!idb.objectStoreNames.contains(STORE_QUEUE)) {
          idb.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => {
        console.error('[OfflineManager] IDB Open Error:', e);
        resolve(null);
      };
    });
  }

  setupSyncListener() {
    window.addEventListener('online', () => {
      console.log('[OfflineManager] Network online. Triggering background sync...');
      this.syncQueuedReports();
    });
  }

  async saveDraft(draft) {
    await this.initIDB();
    const item = {
      id: draft.id || `draft_${Date.now()}`,
      updatedAt: new Date().toLocaleString(),
      ...draft
    };

    if (this.db) {
      const tx = this.db.transaction(STORE_DRAFTS, 'readwrite');
      tx.objectStore(STORE_DRAFTS).put(item);
    } else {
      // LocalStorage fallback
      const drafts = JSON.parse(localStorage.getItem('ecobin_drafts') || '[]');
      const filtered = drafts.filter(d => d.id !== item.id);
      filtered.unshift(item);
      localStorage.setItem('ecobin_drafts', JSON.stringify(filtered));
    }
    return item;
  }

  async getDrafts() {
    await this.initIDB();
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction(STORE_DRAFTS, 'readonly');
        const req = tx.objectStore(STORE_DRAFTS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } else {
      return JSON.parse(localStorage.getItem('ecobin_drafts') || '[]');
    }
  }

  async deleteDraft(id) {
    await this.initIDB();
    if (this.db) {
      const tx = this.db.transaction(STORE_DRAFTS, 'readwrite');
      tx.objectStore(STORE_DRAFTS).delete(id);
    } else {
      const drafts = JSON.parse(localStorage.getItem('ecobin_drafts') || '[]');
      localStorage.setItem('ecobin_drafts', JSON.stringify(drafts.filter(d => d.id !== id)));
    }
  }

  async queueReport(report) {
    await this.initIDB();
    const queuedItem = {
      id: `queue_${Date.now()}`,
      queuedAt: new Date().toISOString(),
      report
    };

    if (this.db) {
      const tx = this.db.transaction(STORE_QUEUE, 'readwrite');
      tx.objectStore(STORE_QUEUE).put(queuedItem);
    } else {
      const q = JSON.parse(localStorage.getItem('ecobin_queue') || '[]');
      q.push(queuedItem);
      localStorage.setItem('ecobin_queue', JSON.stringify(q));
    }
    return queuedItem;
  }

  async syncQueuedReports() {
    await this.initIDB();
    let queued = [];
    if (this.db) {
      queued = await new Promise((resolve) => {
        const tx = this.db.transaction(STORE_QUEUE, 'readonly');
        const req = tx.objectStore(STORE_QUEUE).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } else {
      queued = JSON.parse(localStorage.getItem('ecobin_queue') || '[]');
    }

    if (queued.length === 0) return;

    for (const item of queued) {
      try {
        const created = db.createComplaint(item.report);
        db.addNotification({
          userId: item.report.userId || 'usr_citizen_1',
          title: 'Offline Report Synced',
          message: `Your queued complaint #${created.id} was uploaded and assigned.`,
          type: 'submitted',
          link: `#/citizen/complaint/${created.id}`
        });

        // Remove from queue
        if (this.db) {
          const tx = this.db.transaction(STORE_QUEUE, 'readwrite');
          tx.objectStore(STORE_QUEUE).delete(item.id);
        }
      } catch (err) {
        console.error('[OfflineManager] Sync failed for item:', item, err);
      }
    }

    if (!this.db) {
      localStorage.removeItem('ecobin_queue');
    }

    toast.success(`Synced ${queued.length} offline waste reports to municipal cloud!`);
  }

  /**
   * Compress image file in-browser before storing
   */
  async compressImage(file, maxWidth = 1200, quality = 0.75) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

export const offlineManager = new OfflineManager();
