// ================================================================
// 📋 P5 Training Register — Apps Script Backend
// ================================================================
// ✅ Auto-create Sheet (ครั้งแรกที่ Deploy)
// ✅ Receive POST from P5-Dashboard-v7.5 HTML
// ✅ Validate 27 fields + Log errors
// ✅ CORS-friendly (no preflight issues)
// ================================================================

const SHEET_NAME_DEFAULT = 'P5_Training_Register';
const HEADERS = [
  'Timestamp',           // A — เวลาที่บันทึก (auto)
  'ชื่อหลักสูตร',         // B — courseName
  'รหัสสมาชิก',           // C — producerId
  'ชื่อ',                  // D — firstName
  'นามสกุล',               // E — lastName
  'หลักสูตรประจำธุรกิจ',    // F — businessCourse
  'กลุ่มหลักสูตร',          // G — courseGroup
  'ประเภทหลักสูตร',         // H — courseType
  '3 ผ่าน',                 // I — threePass (auto)
  'หน่วยกิต',               // J — credit (auto)
  'ที่มาหลักสูตร',           // K — courseSource
  'รูปแบบการอบรม',          // L — trainingStyle
  'รูปแบบการประเมิน',        // M — evalStyle
  'ช่วงอายุ',               // N — ageRange
  'ความสามารถที่เก่ง',       // O — competency
  'สถานะหลักสูตร',          // P — courseStatus
  'เป้าหมายประจำปี',        // Q — yearlyTarget
  'ประเภทหลักสูตร (ประเมิน)', // R — courseType2
  'ผลลัพท์ภาพรวม',          // S — resultOverall
  'ผลลัพท์ (1)',             // T — result1
  'KPI (1)',                // U — kpi1
  'ผลลัพท์ (2)',             // V — result2
  'KPI (2)',                // W — kpi2
  'ผลลัพท์ (3)',             // X — result3
  'KPI (3)',                // Y — kpi3
  'เนื้อหา 1',              // Z — content1
  'เนื้อหา 2',              // AA — content2
  'เนื้อหา 3',              // AB — content3
  'ข้อสอบ',                // AC — exam
];

// ================================================================
// 1. doGet — health check + initial setup info
// ================================================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      service: 'P5 Training Register Backend',
      version: '1.0.0',
      sheet: SHEET_NAME_DEFAULT,
      headers_count: HEADERS.length,
      timestamp: new Date().toISOString(),
      instructions: 'POST application/json with {fields: {...}} to this URL'
    }, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
// 2. doPost — รับข้อมูลจาก HTML แล้วบันทึกลง Sheet
// ================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Parse JSON body
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: 'Invalid JSON: ' + parseErr.message }, 400);
    }

    const fields = payload.fields || {};
    const action = payload.action || 'append';

    // Ensure sheet exists with headers
    const sheet = ensureSheet();

    if (action === 'append') {
      // Build row from HEADERS order
      const row = [
        new Date().toISOString(),  // A — Timestamp
        fields.courseName || '',     // B
        fields.producerId || '',     // C
        fields.firstName || '',      // D
        fields.lastName || '',       // E
        fields.businessCourse || '', // F
        fields.courseGroup || '',    // G
        fields.courseType || '',     // H
        fields.threePass || 'ไม่ใช่', // I — auto default
        fields.credit || '-',        // J — auto
        fields.courseSource || '',   // K
        fields.trainingStyle || '',  // L
        fields.evalStyle || '',      // M
        fields.ageRange || '',       // N
        fields.competency || '',     // O
        fields.courseStatus || '',   // P
        fields.yearlyTarget || '',   // Q
        fields.courseType2 || '',    // R
        fields.resultOverall || '',  // S
        fields.result1 || '',        // T
        fields.kpi1 || '',           // U
        fields.result2 || '',        // V
        fields.kpi2 || '',           // W
        fields.result3 || '',        // X
        fields.kpi3 || '',           // Y
        fields.content1 || '',       // Z
        fields.content2 || '',       // AA
        fields.content3 || '',       // AB
        fields.exam || '',           // AC
      ];

      // Validate required fields
      const required = ['courseName', 'producerId', 'firstName', 'lastName', 'businessCourse', 'courseGroup', 'courseType', 'courseSource', 'trainingStyle', 'evalStyle', 'ageRange', 'competency', 'courseStatus', 'yearlyTarget', 'courseType2', 'resultOverall', 'result1', 'kpi1', 'content1'];
      const missing = required.filter(k => !fields[k] || String(fields[k]).trim() === '');
      if (missing.length > 0) {
        return jsonResponse({
          ok: false,
          error: 'Missing required fields: ' + missing.join(', '),
          missing: missing
        }, 400);
      }

      // Append row
      sheet.appendRow(row);
      const lastRow = sheet.getLastRow();

      // Log to console for debugging
      Logger.log('✅ Saved row ' + lastRow + ' for producer ' + fields.producerId);

      return jsonResponse({
        ok: true,
        message: 'บันทึกสำเร็จ',
        row: lastRow,
        sheetName: sheet.getName(),
        sheetId: sheet.getParent().getId(),
        sheetUrl: sheet.getParent().getUrl(),
        timestamp: row[0],
        producerId: fields.producerId
      });
    }

    if (action === 'list') {
      // Return last 50 rows
      const data = sheet.getDataRange().getValues();
      return jsonResponse({
        ok: true,
        total: data.length,
        headers: data[0] || [],
        rows: data.slice(1).slice(-50)
      });
    }

    if (action === 'schema') {
      return jsonResponse({
        ok: true,
        sheetName: SHEET_NAME_DEFAULT,
        headers: HEADERS,
        fieldsCount: HEADERS.length
      });
    }

    return jsonResponse({ ok: false, error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    Logger.log('❌ doPost error: ' + err.message);
    return jsonResponse({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

// ================================================================
// 3. ensureSheet — สร้าง Sheet ถ้ายังไม่มี (auto-setup)
// ================================================================
function ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('ไม่พบ Active Spreadsheet — กรุณาเปิด Sheet ที่ผูก Apps Script นี้ไว้ก่อน');
  }

  let sheet = ss.getSheetByName(SHEET_NAME_DEFAULT);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_DEFAULT);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    // Header style
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold')
               .setBackground('#1f2937')
               .setFontColor('#ffffff')
               .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.setColumnWidth(i, 150);
    }
    Logger.log('✅ Created sheet: ' + SHEET_NAME_DEFAULT);
  }
  return sheet;
}

// ================================================================
// 4. jsonResponse — helper
// ================================================================
function jsonResponse(data, status) {
  const output = ContentService.createTextOutput(JSON.stringify(data, null, 2));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ================================================================
// 5. setup() — เรียกด้วยตัวเองได้ (รัน 1 ครั้งหลัง Deploy)
//    สร้าง Sheet + Headers ทันที
// ================================================================
function setup() {
  const sheet = ensureSheet();
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '✅ Setup สำเร็จ!\n\n' +
    'Sheet: ' + sheet.getName() + '\n' +
    'Headers: ' + HEADERS.length + ' columns\n' +
    'URL: ' + sheet.getParent().getUrl()
  );
}
