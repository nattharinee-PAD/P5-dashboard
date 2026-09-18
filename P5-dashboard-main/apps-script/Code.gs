/**
 * P5 v1.0 — Google Apps Script Web App
 * Backend Proxy สำหรับเว็บ P5 (PAD-02)
 * 
 * วิธี Deploy:
 * 1. เปิด https://sheets.new สร้าง Sheet "P5 — ระบบพัฒนาสมาชิก PKG (PAD-02)"
 * 2. Extensions → Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด → วางโค้ดนี้
 * 4. แก้ SPREADSHEET_ID ด้านล่าง (ID จาก URL ของ Sheet)
 * 5. Save → Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL ใส่เว็บ P5
 */

// ============================================================
// CONFIG — แก้ SPREADSHEET_ID เป็นของลูกหมี
// ============================================================
const SPREADSHEET_ID = '15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0';
const TAB_NAMES = {
  META:           '00_META',
  TRAINING:       '01_TRAINING',
  ROLEPLAY:       '02_ROLEPLAY',
  MENTOR:         '03_MENTOR',
  COACH:          '04_COACH',
  AP:             '05_AP',
  BP:             '06_BP',
  LL:             '07_LL',
  II:             '08_II',
  XP:             '09_XP',
  DAILY_COMMENTS: '10_DAILY_COMMENTS'
};

// ============================================================
// MAIN HANDLERS
// ============================================================
function doGet(e) {
  return handleRequest('GET', e);
}

function doPost(e) {
  return handleRequest('POST', e);
}

function handleRequest(method, e) {
  try {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    let action = null;
    let payload = {};

    if (method === 'GET') {
      action = (e && e.parameter && e.parameter.action) || 'read';
    } else if (method === 'POST') {
      // Apps Script POST body comes as JSON string in e.postData.contents
      const body = e && e.postData && e.postData.contents;
      if (body) {
        try { payload = JSON.parse(body); } catch (err) { payload = {}; }
      }
      action = payload.action || 'read';
    }

    let result;
    switch (action) {
      case 'read':        result = readAll(); break;
      case 'add':         result = addRow(payload.tab, payload.data); break;
      case 'update':      result = updateRow(payload.tab, payload.rowIndex, payload.data); break;
      case 'delete':      result = deleteRow(payload.tab, payload.rowIndex); break;
      case 'init':        result = initializeSheet(); break;
      case 'ping':        result = { ok: true, ts: new Date().toISOString() }; break;
      default:            result = { ok: false, error: 'Unknown action: ' + action };
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString(), stack: err.stack });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// READ ALL TABS
// ============================================================
function readAll() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const out = { ok: true, meta: { lastSync: new Date().toISOString() } };

  for (const key in TAB_NAMES) {
    const tabName = TAB_NAMES[key];
    const sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      out[key.toLowerCase()] = { headers: [], data: [], exists: false };
      continue;
    }
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow === 0 || lastCol === 0) {
      out[key.toLowerCase()] = { headers: [], data: [], exists: true };
      continue;
    }
    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const headers = values[0].map(h => String(h).trim());
    const data = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = String(row[i] || '').trim(); });
      return obj;
    });
    out[key.toLowerCase()] = { headers, data, exists: true };
  }
  return out;
}

// ============================================================
// ADD ROW
// ============================================================
function addRow(tabKey, data) {
  if (!tabKey || !data) return { ok: false, error: 'Missing tab or data' };
  const tabName = TAB_NAMES[tabKey] || TAB_NAMES[tabKey.toUpperCase()];
  if (!tabName) return { ok: false, error: 'Unknown tab: ' + tabKey };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) return { ok: false, error: 'Tab not found: ' + tabName };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const row = headers.map(h => data[h] !== undefined ? data[h] : '');
  sheet.appendRow(row);

  return { ok: true, action: 'add', tab: tabName, rowIndex: sheet.getLastRow(), data: data };
}

// ============================================================
// UPDATE ROW
// ============================================================
function updateRow(tabKey, rowIndex, data) {
  if (!tabKey || !rowIndex || !data) return { ok: false, error: 'Missing params' };
  const tabName = TAB_NAMES[tabKey] || TAB_NAMES[tabKey.toUpperCase()];
  if (!tabName) return { ok: false, error: 'Unknown tab: ' + tabKey };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) return { ok: false, error: 'Tab not found' };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const row = headers.map(h => data[h] !== undefined ? data[h] : sheet.getRange(rowIndex, headers.indexOf(h) + 1).getValue());
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);

  return { ok: true, action: 'update', tab: tabName, rowIndex, data };
}

// ============================================================
// DELETE ROW
// ============================================================
function deleteRow(tabKey, rowIndex) {
  if (!tabKey || !rowIndex) return { ok: false, error: 'Missing params' };
  const tabName = TAB_NAMES[tabKey] || TAB_NAMES[tabKey.toUpperCase()];
  if (!tabName) return { ok: false, error: 'Unknown tab: ' + tabKey };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) return { ok: false, error: 'Tab not found' };

  sheet.deleteRow(rowIndex);
  return { ok: true, action: 'delete', tab: tabName, rowIndex };
}

// ============================================================
// INITIALIZE — สร้าง 11 tabs พร้อม header
// ============================================================
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const created = [];

  const schemas = {
    '00_META':           ['key', 'value', 'note'],
    '01_TRAINING':       ['Month', 'Planned', 'Done', 'Pending', 'Members', 'CheerPct', 'Note'],
    '02_ROLEPLAY':       ['Metric', 'Value', 'Unit', 'Note'],
    '03_MENTOR':         ['Metric', 'Value', 'Unit', 'Note'],
    '04_COACH':          ['Metric', 'Value', 'Unit', 'Note'],
    '05_AP':             ['No', 'Action', 'Owner', 'Status', 'DueDate', 'UpdatedDate'],
    '06_BP':             ['No', 'BestPractice', 'Owner', 'Status', 'UpdatedDate'],
    '07_LL':             ['No', 'LessonLearned', 'Owner', 'Status', 'UpdatedDate'],
    '08_II':             ['No', 'Innovation', 'Owner', 'Status', 'UpdatedDate'],
    '09_XP':             ['No', 'Experience', 'Owner', 'Status', 'UpdatedDate'],
    '10_DAILY_COMMENTS': ['Date', 'Author', 'Comment', 'Category']
  };

  for (const tabName in schemas) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
      created.push(tabName);
    }
    // Always set header row
    sheet.getRange(1, 1, 1, schemas[tabName].length).setValues([schemas[tabName]]);
    // Format header
    sheet.getRange(1, 1, 1, schemas[tabName].length)
      .setFontWeight('bold')
      .setBackground('#7c5cff')
      .setFontColor('#ffffff');
  }

  return { ok: true, created: created, message: 'Tabs initialized' };
}

// ============================================================
// TEST (run manually to verify setup)
// ============================================================
function testRead() {
  Logger.log(JSON.stringify(readAll(), null, 2));
}
