#!/usr/bin/env node
/**
 * Bulk Insert ข้อมูลทุก Tab เข้า Apps Script
 * ใช้ HTTP module พร้อม follow redirect
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwumlA99bfJOQgbuw5CrwfOLZRu3kuTtzIWJasEZe037BMHFhYSUuUWXKu69gyVca1UDg/exec';

// ข้อมูลทั้งหมด
const DATA = {
  'META': [
    { key: 'org', value: 'PKG Group (Tri Petch Isuzu Sales)', note: 'ชื่อองค์กร' },
    { key: 'platform', value: 'P5 — ระบบพัฒนาบุคลากร (PAD-02)', note: 'ชื่อระบบ' },
    { key: 'period', value: 'Q2/2569 (เม.ย. - มิ.ย.)', note: 'งวดปัจจุบัน' },
    { key: 'version', value: '1.0.0', note: 'เวอร์ชัน' },
    { key: 'lastUpdate', value: '2026-06-10', note: 'วันที่อัปเดต' },
    { key: 'sheetOwner', value: 'ณัฐฑริณี (ลูกหมี)', note: 'ผู้ดูแล' },
    { key: 'okrGoal', value: 'พัฒนาสมาชิกตาม Core competency PKG', note: 'จุดมุ่งหมาย' },
    { key: 'okrVision', value: 'สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU', note: 'ภาพความสำเร็จ' }
  ],
  'TRAINING': [
    { Month: '5', Planned: '29', Done: '27', Pending: '0', Members: '2663', CheerPct: '93.1', Note: 'เดือน พ.ค. ผ่านดี' },
    { Month: '6', Planned: '8', Done: '0', Pending: '8', Members: '602', CheerPct: '0.0', Note: 'เดือน มิ.ย. เริ่มต้น' }
  ],
  'ROLEPLAY': [
    { Metric: 'TotalTeams', Value: '55', Unit: 'ทีม', Note: 'จำนวนทีม Roleplay ทั้งหมด' },
    { Metric: 'Pass', Value: '55', Unit: 'ทีม', Note: 'Roleplay ผ่าน' },
    { Metric: 'Fail', Value: '0', Unit: 'ทีม', Note: 'ยังไม่บรรลุ' },
    { Metric: 'CheerPct', Value: '100', Unit: '%', Note: 'Cheer up' }
  ],
  'MENTOR': [
    { Metric: 'Total', Value: '32', Unit: 'คน', Note: 'อยู่ในระบบ Mentor' },
    { Metric: 'Pass', Value: '0', Unit: 'คน', Note: 'วินัย ≥ 90%' },
    { Metric: 'Fail', Value: '32', Unit: 'คน', Note: 'วินัย < 90%' },
    { Metric: 'CheerPct', Value: '0', Unit: '%', Note: 'Cheer up' },
    { Metric: 'Note', Value: 'เนื่องจากแต่ละคนมีรอบการวัดผลที่ไม่ได้เท่ากัน ข้อมูลตัดรอบ 20/10/68', Unit: '', Note2: 'หมายเหตุ' }
  ],
  'COACH': [
    { Metric: 'Total', Value: '58', Unit: 'คน', Note: 'อยู่ในระบบ Coach' },
    { Metric: 'Pass', Value: '58', Unit: 'คน', Note: 'วินัย Coach ตามเป้าหมาย' },
    { Metric: 'Fail', Value: '0', Unit: 'คน', Note: 'วินัย Coach น้อยกว่าเป้าหมาย' },
    { Metric: 'CheerPct', Value: '100', Unit: '%', Note: 'Cheer up' }
  ],
  'AP': [
    { No: '1', Action: 'คอยติดตามวิทยากร ทำการขอเปิดหลักสูตร ตามแผนอบรมส่วนกลางก่อนถึงกำหนดเปิดอบรมในแต่ละเดือน', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '2', Action: 'ย้ำเตือนการสอบแต่ละหลักสูตร ในแต่ละเดือนส่งให้ตัวแทนในการติดตาม', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '3', Action: 'ติดตามวิทยากรส่งผลอบรมตามกำหนด', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '4', Action: 'สมัครอบรม และทำจ่ายค่าอบรมภายนอก', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '5', Action: 'สำหรับหลักสูตรอบรมภายนอกที่ไปอบรมมาแล้ว ต้องนำใบประกาศไปขึ้นทะเบียนกับหน่วยงานภายนอก', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '6', Action: 'BCT ขอเปิดอบรม แยกข้อมูล แสดงหลังจากวิทยากรขอเปิดอบรมมาแล้วใครบ้างที่ต้องเข้าอบรมตามแผน', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '7', Action: 'ทบทวนหลักสูตรที่มีการลงทะเบียนล่วงหน้าตามแผนประจำปี กับทีมวิทยากร', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' },
    { No: '8', Action: 'สมัครอบรมหลักสูตรเจ้าหน้าที่ความปลอดภัยในการทำงาน ระดับบริหาร ในกลุ่ม PMG', Owner: 'ลูกหมี', Status: 'Done', DueDate: '2026-05-06', UpdatedDate: '2026-06-10' },
    { No: '9', Action: 'ปรับปรุง Sheet F1_ใบลงทะเบียนอบรม ให้จ่าย MSP อัตโนมัติ', Owner: 'ลูกหมี', Status: 'In Progress', DueDate: '2026-06-30', UpdatedDate: '2026-06-10' }
  ],
  'BP': [
    { No: '1', BestPractice: 'การนำระบบความรับผิดชอบต่อผลมาใช้ เช่น การวัดวินัยการส่งรายงานของน้องเลี้ยง หากไม่ได้สัดส่วนตามมาตรฐาน จะมีผลต่อคะแนนประเมินทดลองงาน', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' },
    { No: '2', BestPractice: 'การให้น้องเลี้ยงสรุปความรู้ที่ได้จากการ Coach นำมาส่งในรายงานตนเอง ถือว่าเป็นการทำ 1 ได้ 2 อย่าง', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' }
  ],
  'LL': [
    { No: '1', LessonLearned: 'ตัวเลขการส่งผล Roleplay จะขยับในวันสุดท้ายของเวลาที่กำหนด', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' },
    { No: '2', LessonLearned: 'ตัวเลขการส่งผลการอบรม จะขยับในวันสุดท้ายของเวลาที่กำหนด', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' },
    { No: '3', LessonLearned: 'วินัยการส่งรายงานสมาชิก ต้องคอยย้ำเตือน สมาชิกกลุ่มโอนย้ายจะไม่ค่อยได้ดูรายละเอียด บางคนจึงไม่ได้ตรวจสอบของตัวเอง', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' }
  ],
  'II': [
    { No: '1', Innovation: 'เปลี่ยนงานให้เป็นเกมส์ นำเรื่องผ่านที่ 3 มาเป็นผลการของเวทีแข่งขันทักษะด้านการขายและบริการหลังการขาย', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' }
  ],
  'XP': [
    { No: '1', Experience: 'ตั้งเป้าหมายผ่านที่ 3 ให้กับผู้ที่ต้องขับเคลื่อนงานต่างๆ ที่มุ่งให้สำเร็จ', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' },
    { No: '2', Experience: 'ใช้เวที LG ในการขับเคลื่อนเป้าหมายด้านการพัฒนาบุคคลากร', Owner: 'ลูกหมี', Status: 'Active', UpdatedDate: '2026-06-10' }
  ],
  'DAILY_COMMENTS': [
    { Date: '2026-06-10', Author: 'ลูกหมี', Comment: '📝 Coach :: คอยย้ำ หาหลักสูตรกฏหมายป้องกันการฟอกเงินให้กับทนายเจี๊ยบสำหรับใช้กับ start up', Category: 'Coach' },
    { Date: '2026-06-10', Author: 'ลูกหมี', Comment: '📝 Coach :: สำหรับ AGS และ 21CT แนะนำให้ทำหลักสูตรที่ต้องใช้ความสามารถเพิ่มเติม โดยใช้หลักสูตรจาก futureskill ก่อน', Category: 'Coach' },
    { Date: '2026-06-10', Author: 'ลูกหมี', Comment: '📝 Coach :: สมาชิกทีม AGS กำหนดหลักสูตรจากภายนอกได้ 2 แหล่ง 1) Stackskill มี certificate 2) futureskill ใช้กับการสอบ level ได้', Category: 'Coach' },
    { Date: '2026-06-10', Author: 'ลูกหมี', Comment: '📝 Coach :: ส่ง Future Skill ให้กับสมาชิกทีม OBM เรียบร้อยแล้ว ติดตามการอบรมและผ่านที่ 3 จากครูฝึกบัญชีในเวที L&G ได้เลย 🙏ขอบคุณค่ะ🙏', Category: 'Coach' }
  ]
};

function makeRequest(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; P5-Loader/1.0)' } }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const location = res.headers.location;
        if (location) {
          const newUrl = location.startsWith('http') ? location : new URL(location, url).toString();
          console.log(`   ↪️ Redirect → ${newUrl.slice(0, 60)}...`);
          res.resume();
          return resolve(makeRequest(newUrl, redirects + 1));
        }
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, finalUrl: url }));
    }).on('error', reject);
  });
}

async function insertRow(tabKey, row) {
  const params = new URLSearchParams();
  params.set('action', 'add');
  params.set('tab', tabKey);
  for (const k in row) {
    if (row[k] !== null && row[k] !== undefined && row[k] !== '') {
      params.set(k, String(row[k]));
    }
  }
  const url = APPS_SCRIPT_URL + '?' + params.toString();
  try {
    const res = await makeRequest(url);
    if (res.status === 200) {
      try {
        const json = JSON.parse(res.body);
        if (json.ok) return { ok: true, row: json.rowIndex || json.row };
        return { ok: false, error: json.error || 'unknown' };
      } catch (e) {
        return { ok: false, error: 'Invalid JSON: ' + res.body.slice(0, 100) };
      }
    }
    return { ok: false, error: 'HTTP ' + res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('🚀 Bulk Insert เริ่มแล้ว (follow redirects)\n');
  let total = 0, success = 0, failed = 0;

  for (const tabKey of Object.keys(DATA)) {
    console.log(`\n📋 ${tabKey} (${DATA[tabKey].length} rows):`);
    const rows = DATA[tabKey];
    for (const row of rows) {
      total++;
      const result = await insertRow(tabKey, row);
      if (result.ok) {
        success++;
        console.log(`  ✅ Row ${result.row}`);
      } else {
        failed++;
        console.log(`  ❌ ${result.error}`);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n\n📊 สรุป:`);
  console.log(`   ✅ สำเร็จ: ${success}/${total}`);
  console.log(`   ❌ ล้มเหลว: ${failed}/${total}`);
}

main().catch(console.error);
