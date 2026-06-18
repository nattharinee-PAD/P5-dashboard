/**
 * P5 v1.0 — Apps Script API Client
 * เรียก Google Apps Script Web App เพื่อ CRUD ข้อมูล
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIG
  // ============================================================
  const APPS_SCRIPT_KEY = 'p5_apps_script_url';
  const DEFAULT_URL = ''; // ลูกหมีจะใส่หลัง Deploy

  // ============================================================
  // HELPERS
  // ============================================================
  function getUrl() {
    try { return localStorage.getItem(APPS_SCRIPT_KEY) || DEFAULT_URL; }
    catch (e) { return DEFAULT_URL; }
  }
  function setUrl(url) {
    try { localStorage.setItem(APPS_SCRIPT_KEY, url); } catch (e) { /* ignore */ }
  }
  function hasUrl() { return !!getUrl(); }

  // ============================================================
  // API CALL
  // ============================================================
  async function call(action, payload = {}) {
    const url = getUrl();
    if (!url) throw new Error('Apps Script URL ยังไม่ได้ตั้งค่า — เปิด ⚙️ ตั้งค่า');

    // Apps Script doGet reads query string
    if (action === 'read' || action === 'ping') {
      const r = await fetch(url + (url.includes('?') ? '&' : '?') + 'action=' + action, {
        method: 'GET', redirect: 'follow'
      });
      return await r.json();
    }

    // doPost — use text/plain to avoid CORS preflight
    const body = JSON.stringify({ action, ...payload });
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow'
    });
    return await r.json();
  }

  // ============================================================
  // CRUD
  // ============================================================
  async function readAll()      { return call('read'); }
  async function add(tab, data) { return call('add', { tab, data }); }
  async function update(tab, rowIndex, data) { return call('update', { tab, rowIndex, data }); }
  async function remove(tab, rowIndex)       { return call('delete', { tab, rowIndex }); }
  async function ping()         { return call('ping'); }
  async function init()         { return call('init'); }

  // ============================================================
  // EXPOSE
  // ============================================================
  window.P5_API = {
    getUrl, setUrl, hasUrl,
    readAll, add, update, remove,
    ping, init,
    call
  };
  console.log('🔌 P5 API Client ready');
})();
