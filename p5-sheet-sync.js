/**
 * P5 v1.0 — Sheet Sync Engine (Single-Call Mode สำหรับ Apps Script version เก่า)
 * ดึงข้อมูลจาก Apps Script doGet ?action=read
 * Response: { ok, meta, training, roleplay, ... } (มี headers + data ในแต่ละ tab)
 */

(function () {
  'use strict';

  const DEFAULT_SHEET_ID = '15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0';
  const DEFAULT_APPS_URL = 'https://script.google.com/macros/s/AKfycbwumlA99bfJOQgbuw5CrwfOLZRu3kuTtzIWJasEZe037BMHFhYSUuUWXKu69gyVca1UDg/exec';
  const CACHE_KEY = '***';
  const CACHE_TS_KEY = '***';
  const CONFIG_KEY = '***';
  const REFRESH_MS = 30 * 1000;

  const SHEET_ID_KEY = 'p5_sheet_id';
  const APPS_URL_KEY = 'p5_apps_url';

  function getSheetId() {
    try { return localStorage.getItem(SHEET_ID_KEY) || DEFAULT_SHEET_ID; }
    catch (e) { return DEFAULT_SHEET_ID; }
  }
  function getAppsUrl() {
    try { return localStorage.getItem(APPS_URL_KEY) || DEFAULT_APPS_URL; }
    catch (e) { return DEFAULT_APPS_URL; }
  }
  function setAppsUrl(url) {
    try { localStorage.setItem(APPS_URL_KEY, url); } catch (e) {}
  }
  function setSheetId(id) {
    try { localStorage.setItem(SHEET_ID_KEY, id); } catch (e) {}
  }

  function makeRequest(url, redirects = 0) {
    return new Promise((resolve, reject) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      // ใช้ fetch ใน browser context เท่านั้น (ไม่ใช้ require เพราะ browser ไม่มี)
      if (typeof fetch !== 'undefined') {
        fetch(url, { redirect: 'follow' })
          .then(r => r.text().then(body => resolve({ status: r.status, body })))
          .catch(reject);
      } else {
        reject(new Error('No fetch available'));
      }
    });
  }

  async function call(action, params = {}) {
    const url = getAppsUrl();
    const searchParams = new URLSearchParams();
    searchParams.set('action', action);
    for (const k in params) {
      if (params[k] !== null && params[k] !== undefined) {
        searchParams.set(k, String(params[k]));
      }
    }
    const fullUrl = url + (url.includes('?') ? '&' : '?') + searchParams.toString();
    const res = await makeRequest(fullUrl);
    if (res.status !== 200) throw new Error('HTTP ' + res.status);
    try { return JSON.parse(res.body); }
    catch (e) { return { ok: false, error: 'Invalid JSON' }; }
  }

  // ============================================================
  // PARSE Apps Script version เก่า → P5_DATA structure
  // ============================================================
  function buildP5Data(rawResponse) {
    // rawResponse shape: { ok, meta, training, roleplay, mentor, coach, ap, bp, ll, ii, xp, daily_comments }
    // แต่ละ tab = { headers: [...], data: [{...}, ...] }
    const D = rawResponse;
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${getSheetId()}/edit`;

    // Helper: parse tab → { headers, rows }
    // Apps Script returns either {data: {tabname: ...}} or {tabname: ...}
    const getTab = (raw, name) => {
      if (raw.data && raw.data[name]) return raw.data[name];
      if (raw.data && raw.data[name.toLowerCase()]) return raw.data[name.toLowerCase()];
      if (raw.data && raw.data[name.toUpperCase()]) return raw.data[name.toUpperCase()];
      if (raw[name]) return raw[name];
      if (raw[name.toLowerCase()]) return raw[name.toLowerCase()];
      if (raw[name.toUpperCase()]) return raw[name.toUpperCase()];
      return {};
    };
    const tab = (name) => {
      const t = getTab(D, name);
      return {
        headers: t.headers || [],
        rows: t.data || t.rows || []
      };
    };

    // META → key/value pairs
    const meta = {};
    const metaTab = tab('meta');
    metaTab.rows.forEach(r => {
      if (r.key) meta[r.key] = r.value;
    });

    // TRAINING → months array
    const training = { months: [] };
    tab('training').rows.forEach(r => {
      if (r.Month) {
        training.months.push({
          month: parseInt(r.Month) || 0,
          planned: parseFloat(r.Planned) || 0,
          done: parseFloat(r.Done) || 0,
          pending: parseFloat(r.Pending) || 0,
          members: parseFloat(r.Members) || 0,
          cheerPct: parseFloat(r.CheerPct) || 0,
          note: r.Note || ''
        });
      }
    });

    // ROLEPLAY / MENTOR / COACH → { total, pass, fail, pct, note }
    const parseMetric = (name) => {
      const t = tab(name);
      const out = { total: 0, pass: 0, fail: 0, pct: 0, note: '' };
      t.rows.forEach(r => {
        const m = (r.Metric || '').toLowerCase();
        const v = parseFloat(r.Value) || 0;
        if (m.includes('total')) out.total = v;
        else if (m.includes('pass')) out.pass = v;
        else if (m.includes('fail')) out.fail = v;
        else if (m.startsWith('cheer') || m.includes('cheer')) out.pct = v;
        else if (m === 'note') out.note = r.Value;
      });
      return out;
    };
    const roleplay = parseMetric('roleplay');
    const mentor   = parseMetric('mentor');
    const coach    = parseMetric('coach');

    // AP / BP / LL / II / XP → comments arrays
    const parseComments = (name) => tab(name).rows;

    const comments = {
      AP:    parseComments('ap'),
      BP:    parseComments('bp'),
      LL:    parseComments('ll'),
      II:    parseComments('ii'),
      XP:    parseComments('xp'),
      '📝Daily Comments': parseComments('daily_comments')
    };

    // KPI cards
    const totalMembers = training.months.reduce((s, m) => s + m.members, 0);
    const totalCourses = training.months.reduce((s, m) => s + m.planned, 0);
    const totalDone    = training.months.reduce((s, m) => s + m.done, 0);
    const lastMonth = training.months[training.months.length - 1] || {};

    return {
      meta: {
        org: meta.org || 'PKG Group',
        platform: meta.platform || 'P5',
        period: meta.period || 'Q2/2569',
        sheetUrl,
        lastUpdate: new Date().toISOString(),
        cached: false
      },
      training, roleplay, mentor, coach, comments,
      kpiCards: [
        { icon: '👥', value: fmt(totalMembers), label: 'สมาชิกมีแผนอบรม', color: 'green', sub: training.months.length + ' เดือน' },
        { icon: '📚', value: fmt(totalCourses), label: 'หลักสูตรตามแผน',  color: 'green', sub: totalDone + ' เปิดแล้ว' },
        { icon: '🎯', value: fmt(coach.pass),    label: 'Coach ผ่านเป้า',   color: 'green', sub: coach.pct + '%' },
        { icon: '🎭', value: fmt(roleplay.pass), label: 'Roleplay ผ่าน',    color: 'green', sub: roleplay.pct + '%' },
        { icon: '👥', value: fmt(mentor.total),  label: 'อยู่ในระบบ Mentor', color: 'gold',  sub: mentor.pct + '% วินัย' },
        { icon: '📈', value: (lastMonth.cheerPct || 0).toFixed(1) + '%', label: 'Cheer up ' + (lastMonth.month || ''), color: 'green', sub: (lastMonth.done || 0) + '/' + (lastMonth.planned || 0) + ' หลักสูตร' }
      ]
    };
  }

  function fmt(n) {
    return new Intl.NumberFormat('th-TH').format(n || 0);
  }

  // ============================================================
  // SYNC
  // ============================================================
  async function sync(onUpdate) {
    try {
      const data = await call('read');

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TS_KEY, new Date().toISOString());
      } catch (e) { /* ignore */ }

      const p5Data = buildP5Data(data);
      window.P5_DATA = p5Data;
      if (typeof onUpdate === 'function') onUpdate(p5Data, false);
      console.log('🔄 P5 synced:', p5Data.training.months.length, 'months,', p5Data.roleplay.pass, 'roleplay,', p5Data.coach.pass, 'coach');
      return p5Data;
    } catch (err) {
      console.warn('⚠️ Sheet sync failed:', err.message);
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          const p5Data = buildP5Data(data);
          p5Data.meta.cached = true;
          window.P5_DATA = p5Data;
          if (typeof onUpdate === 'function') onUpdate(p5Data, true);
          return p5Data;
        }
      } catch (e) {}
      throw err;
    }
  }

  function startAutoSync(onUpdate) {
    sync(onUpdate);
    setInterval(() => sync(onUpdate), REFRESH_MS);
  }

  function getCacheAge() {
    try {
      const ts = localStorage.getItem(CACHE_TS_KEY);
      if (!ts) return null;
      return Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    } catch (e) { return null; }
  }

  function getConfig() {
    return {
      sheetId: getSheetId(),
      appsUrl: getAppsUrl()
    };
  }

  function setConfig(cfg) {
    if (cfg.sheetId) setSheetId(cfg.sheetId);
    if (cfg.appsUrl) setAppsUrl(cfg.appsUrl);
  }

  // ============================================================
  // GET REPORT DATA (GID 1104115053 - direct fetch from Google Sheet)
  // ============================================================
  async function getReport() {
    const url = `https://docs.google.com/spreadsheets/d/${getSheetId()}/gviz/tq?tqx=out:csv&gid=1104115053&t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const csv = await res.text();
    return parseCSV(csv);
  }

  // Expose
  window.P5_SHEET = {
    sync, startAutoSync, getCacheAge,
    getConfig, setConfig,
    getReport,
    DEFAULT_SHEET_ID, DEFAULT_APPS_URL
  };
  console.log('📊 P5 Sheet Sync ready (Single-Call Mode)');
})();
