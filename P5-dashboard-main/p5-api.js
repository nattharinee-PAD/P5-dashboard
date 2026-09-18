/**
 * P5 v1.0 — Apps Script API Client
 * เรียก Google Apps Script Web App ผ่าน GET (Apps Script POST redirect issue)
 * Data ส่งผ่าน query string
 */

(function () {
  'use strict';

  const APPS_SCRIPT_KEY = 'p5_app…_url';
  const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbwumlA99bfJOQgbuw5CrwfOLZRu3kuTtzIWJasEZe037BMHFhYSUuUWXKu69gyVca1UDg/exec';

  function getUrl() {
    try {
      const stored = localStorage.getItem(APPS_SCRIPT_KEY);
      return stored || DEFAULT_URL;
    } catch (e) { return DEFAULT_URL; }
  }
  function setUrl(url) {
    try { localStorage.setItem(APPS_SCRIPT_KEY, url); } catch (e) { /* ignore */ }
  }
  function hasUrl() { return !!getUrl(); }

  /**
   * เรียก API ด้วย GET — flatten data object เป็น query params
   * รองรับทั้ง data.No, data.Action, etc. (Apps Script ใหม่)
   * และ data_No, data_Action, etc. (Apps Script เดิม)
   */
  async function call(action, payload = {}) {
    const url = getUrl();
    if (!url) throw new Error('Apps Script URL ยังไม่ได้ตั้งค่า');

    const params = new URLSearchParams();
    params.set('action', action);
    for (const key in payload) {
      const val = payload[key];
      if (val === null || val === undefined || val === '') continue;
      if (typeof val === 'object') {
        for (const subKey in val) {
          if (val[subKey] !== null && val[subKey] !== undefined && val[subKey] !== '') {
            params.set(subKey, String(val[subKey]));
          }
        }
      } else {
        params.set(key, String(val));
      }
    }

    const fullUrl = url + (url.includes('?') ? '&' : '?') + params.toString();
    const res = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }

  async function readAll()      { return call('read'); }
  async function add(tab, data) {
    return call('add', { tab, ...data });
  }
  async function update(tab, rowIndex, data) {
    return call('update', { tab, rowIndex, ...data });
  }
  async function remove(tab, rowIndex)       { return call('delete', { tab, rowIndex }); }
  async function ping()         { return call('ping'); }
  async function init()         { return call('init'); }

  window.P5_API = {
    getUrl, setUrl, hasUrl,
    readAll, add, update, remove,
    ping, init,
    call
  };
  console.log('🔌 P5 API Client ready (GET mode — Apps Script doGet)');
})();
