/**
 * P5 v0.5.0 — Multi-Tab Google Sheet Sync Engine
 * รองรับ 11 tabs แยกกัน · Auto-fetch ทุก 30 วินาที · Cache ใน localStorage
 *
 * Sheet Structure (แนะนำ):
 * - 00_META           : key, value, note
 * - 01_TRAINING       : Month, Planned, Done, Pending, Members, CheerPct, Note
 * - 02_ROLEPLAY       : Metric, Value, Unit, Note
 * - 03_MENTOR         : Metric, Value, Unit, Note
 * - 04_COACH          : Metric, Value, Unit, Note
 * - 05_AP             : No, Action, Owner, Status, DueDate, UpdatedDate
 * - 06_BP             : No, BestPractice, Owner, Status, UpdatedDate
 * - 07_LL             : No, LessonLearned, Owner, Status, UpdatedDate
 * - 08_II             : No, Innovation, Owner, Status, UpdatedDate
 * - 09_XP             : No, Experience, Owner, Status, UpdatedDate
 * - 10_DAILY_COMMENTS : Date, Author, Comment, Category
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIG
  // ============================================================
  // ลูกหมีจะแก้ค่านี้เมื่อ import template เสร็จ
  const SHEET_CONFIG = {
    // GID ของแต่ละ tab (ลำดับตาม template)
    // เริ่มต้น: ดึง tab เดียว (backward compatible)
    gids: {
      '00_META':           0,    // GID แรกสุด (default)
      '01_TRAINING':       null, // รอลูกหมีส่ง URL ใหม่
      '02_ROLEPLAY':       null,
      '03_MENTOR':         null,
      '04_COACH':          null,
      '05_AP':             null,
      '06_BP':             null,
      '07_LL':             null,
      '08_II':             null,
      '09_XP':             null,
      '10_DAILY_COMMENTS': null
    }
  };

  // Default Sheet (single-tab mode สำหรับ backward compatibility)
  const DEFAULT_SHEET_ID = '15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0';
  const DEFAULT_GID = '245123772';

  const CACHE_KEY = 'p5_data_v5';
  const CACHE_TS_KEY = 'p5_data_v5_ts';
  const CONFIG_KEY = 'p5_sheet_config';
  const REFRESH_MS = 30 * 1000; // 30 วินาที

  // ============================================================
  // LOAD CONFIG
  // ============================================================
  function loadConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gids) SHEET_CONFIG.gids = { ...SHEET_CONFIG.gids, ...parsed.gids };
        if (parsed.sheetId) SHEET_CONFIG.sheetId = parsed.sheetId;
      }
    } catch (e) { /* ignore */ }
    if (!SHEET_CONFIG.sheetId) SHEET_CONFIG.sheetId = DEFAULT_SHEET_ID;
  }

  function saveConfig() {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({
        sheetId: SHEET_CONFIG.sheetId,
        gids: SHEET_CONFIG.gids
      }));
    } catch (e) { /* ignore */ }
  }

  // ============================================================
  // CSV PARSER (handles quoted fields with commas/newlines)
  // ============================================================
  function parseCSV(text) {
    const rows = [];
    let cur = [], field = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (inQ) {
        if (c === '"' && n === '"') { field += '"'; i++; }
        else if (c === '"') { inQ = false; }
        else { field += c; }
      } else {
        if (c === '"') inQ = true;
        else if (c === ',') { cur.push(field); field = ''; }
        else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
        else if (c === '\r') { /* skip */ }
        else { field += c; }
      }
    }
    if (field || cur.length) { cur.push(field); rows.push(cur); }
    return rows.filter(r => r.some(c => c && c.trim() !== ''));
  }

  // ============================================================
  // PARSE TABLE → ARRAY OF OBJECTS (with header row)
  // ============================================================
  function parseTable(rows) {
    if (!rows.length) return { headers: [], data: [] };
    const headers = rows[0].map(h => (h || '').trim());
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
      return obj;
    });
    return { headers, data };
  }

  function rowsToKV(rows) {
    // For META-like tabs: key/value/note
    if (!rows.length) return {};
    const headers = rows[0].map(h => (h || '').trim().toLowerCase());
    const ki = headers.indexOf('key');
    const vi = headers.indexOf('value');
    const ni = headers.indexOf('note');
    const out = {};
    if (ki < 0 || vi < 0) return out;
    for (let i = 1; i < rows.length; i++) {
      const k = (rows[i][ki] || '').trim();
      if (!k) continue;
      out[k] = {
        value: (rows[i][vi] || '').trim(),
        note:  ni >= 0 ? (rows[i][ni] || '').trim() : ''
      };
    }
    return out;
  }

  // ============================================================
  // FETCH SINGLE TAB
  // ============================================================
  async function fetchTab(gid) {
    if (!gid && gid !== 0) return null;
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_CONFIG.sheetId}/gviz/tq?tqx=out:csv&gid=${gid}&t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Tab ${gid}: HTTP ${res.status}`);
    return parseCSV(await res.text());
  }

  // ============================================================
  // FETCH ALL TABS
  // ============================================================
  async function fetchAllTabs() {
    const tasks = Object.entries(SHEET_CONFIG.gids)
      .filter(([_, gid]) => gid !== null && gid !== undefined)
      .map(async ([name, gid]) => {
        try {
          const rows = await fetchTab(gid);
          return { name, gid, rows, ok: true };
        } catch (err) {
          return { name, gid, ok: false, error: err.message };
        }
      });
    return Promise.all(tasks);
  }

  // ============================================================
  // BUILD P5_DATA
  // ============================================================
  function buildP5Data(results) {
    const byName = {};
    for (const r of results) byName[r.name] = r;

    // ============ META ============
    const meta = {};
    if (byName['00_META']?.ok) {
      const kv = rowsToKV(byName['00_META'].rows);
      for (const k in kv) meta[k] = kv[k].value;
    }
    // Fallback meta
    if (!meta.org) meta.org = 'PKG Group (Tri Petch Isuzu Sales)';
    if (!meta.platform) meta.platform = 'P5 — ระบบพัฒนาสมาชิก';
    if (!meta.period) meta.period = 'Q2/2569';
    meta.sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_CONFIG.sheetId}/edit`;
    meta.lastUpdate = new Date().toISOString();

    // ============ TRAINING ============
    const training = { months: [] };
    if (byName['01_TRAINING']?.ok) {
      const t = parseTable(byName['01_TRAINING'].rows);
      training.months = t.data.map(r => ({
        month:    parseInt(r.Month) || 0,
        planned:  parseFloat((r.Planned || '0').replace(/,/g, '')) || 0,
        done:     parseFloat((r.Done || '0').replace(/,/g, '')) || 0,
        pending:  parseFloat((r.Pending || '0').replace(/,/g, '')) || 0,
        members:  parseFloat((r.Members || '0').replace(/,/g, '')) || 0,
        cheerPct: parseFloat(r.CheerPct) || 0,
        note:     r.Note || ''
      }));
    }

    // ============ ROLEPLAY / MENTOR / COACH ============
    const roleplay = parseMetricTab(byName['02_ROLEPLAY']);
    const mentor   = parseMetricTab(byName['03_MENTOR']);
    const coach    = parseMetricTab(byName['04_COACH']);

    // ============ AP / BP / LL / II / XP ============
    const comments = {
      AP: parseCommentTab(byName['05_AP'], 'Action'),
      BP: parseCommentTab(byName['06_BP'], 'BestPractice'),
      LL: parseCommentTab(byName['07_LL'], 'LessonLearned'),
      II: parseCommentTab(byName['08_II'], 'Innovation'),
      XP: parseCommentTab(byName['09_XP'], 'Experience'),
      '📝Daily Comments': parseDailyComments(byName['10_DAILY_COMMENTS'])
    };

    // ============ KPI CARDS ============
    const totalMembers = training.months.reduce((s, m) => s + m.members, 0);
    const totalCourses = training.months.reduce((s, m) => s + m.planned, 0);
    const totalDone    = training.months.reduce((s, m) => s + m.done, 0);
    const lastMonth = training.months[training.months.length - 1] || {};

    return {
      meta,
      training, roleplay, mentor, coach, comments,
      kpiCards: [
        { icon: '👥', value: fmt(totalMembers), label: 'สมาชิกมีแผนอบรม', color: 'green', sub: training.months.length + ' เดือน' },
        { icon: '📚', value: fmt(totalCourses), label: 'หลักสูตรตามแผน',  color: 'green', sub: totalDone + ' เปิดแล้ว' },
        { icon: '🎯', value: fmt(coach.pass),    label: 'Coach ผ่านเป้า',   color: 'green', sub: coach.pct + '%' },
        { icon: '🎭', value: fmt(roleplay.pass), label: 'Roleplay ผ่าน',    color: 'green', sub: roleplay.pct + '%' },
        { icon: '👥', value: fmt(mentor.total),  label: 'อยู่ในระบบ Mentor', color: 'gold', sub: mentor.pct + '% วินัย' },
        { icon: '📈', value: (lastMonth.cheerPct || 0).toFixed(1) + '%', label: 'Cheer up ' + (meta.period || 'ล่าสุด'), color: 'green', sub: (lastMonth.done || 0) + '/' + (lastMonth.planned || 0) + ' หลักสูตร' }
      ]
    };
  }

  function parseMetricTab(tab) {
    const out = { total: 0, pass: 0, fail: 0, pct: 0, note: '' };
    if (!tab?.ok) return out;
    const t = parseTable(tab.rows);
    for (const r of t.data) {
      const m = (r.Metric || '').toLowerCase();
      const v = parseFloat((r.Value || '0').replace(/,/g, '')) || 0;
      if (m.includes('total') || m.includes('อยู่ในระบบ') || m.includes('สรุปจำนวนทีม')) out.total = v;
      else if (m.includes('pass') || m.includes('ผ่าน') || m.includes('ตามเป้าหมาย') || m.includes('มากกว่า 90%')) out.pass = v;
      else if (m.includes('fail') || m.includes('ไม่') || m.includes('น้อยกว่า') || m.includes('ยังไม่')) out.fail = v;
      else if (m.startsWith('cheer') || m.includes('cheer')) out.pct = v;
      else if (m === 'note' && r.Value) out.note = r.Value;
    }
    return out;
  }

  function parseCommentTab(tab, textCol) {
    if (!tab?.ok) return [];
    const t = parseTable(tab.rows);
    return t.data
      .filter(r => r[textCol] || r.No)
      .map(r => ({
        no:     r.No || '',
        text:   r[textCol] || '',
        owner:  r.Owner || '',
        status: r.Status || '',
        dueDate: r.DueDate || '',
        updated: r.UpdatedDate || ''
      }));
  }

  function parseDailyComments(tab) {
    if (!tab?.ok) return [];
    const t = parseTable(tab.rows);
    return t.data
      .filter(r => r.Comment)
      .map(r => ({
        date:     r.Date || '',
        author:   r.Author || '',
        text:     r.Comment || '',
        category: r.Category || ''
      }));
  }

  function fmt(n) {
    return new Intl.NumberFormat('th-TH').format(n || 0);
  }

  // ============================================================
  // SYNC ORCHESTRATOR
  // ============================================================
  async function sync(onUpdate) {
    loadConfig();
    try {
      const results = await fetchAllTabs();
      const data = buildP5Data(results);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TS_KEY, new Date().toISOString());
      } catch (e) { /* ignore */ }

      window.P5_DATA = data;
      if (typeof onUpdate === 'function') onUpdate(data, false);
      console.log('🔄 P5 synced from', results.filter(r => r.ok).length, 'tabs');
      return data;
    } catch (err) {
      console.warn('⚠️ Sheet sync failed:', err.message);
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          data.meta.cached = true;
          window.P5_DATA = data;
          if (typeof onUpdate === 'function') onUpdate(data, true);
          return data;
        }
      } catch (e) { /* ignore */ }
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

  function setSheetId(id) {
    SHEET_CONFIG.sheetId = id;
    saveConfig();
  }

  function setTabGid(tabName, gid) {
    SHEET_CONFIG.gids[tabName] = gid;
    saveConfig();
  }

  function getConfig() { return { ...SHEET_CONFIG }; }

  // Auto-load
  loadConfig();

  // Expose
  window.P5_SHEET = {
    sync, startAutoSync, getCacheAge,
    setSheetId, setTabGid, getConfig,
    DEFAULT_SHEET_ID, DEFAULT_GID
  };
  console.log('📊 P5 v0.5.0 Multi-Tab Sync ready · Sheet:', SHEET_CONFIG.sheetId);
})();
