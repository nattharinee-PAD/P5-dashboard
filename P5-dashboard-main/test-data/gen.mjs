/**
 * Synthetic test-data generator for the P5 dashboard.
 * ข้อมูลทั้งหมดเป็นของปลอม สร้างจาก seed คงที่ — ไม่ใช่ข้อมูลจริงของ PKG
 *
 * รัน:  node test-data/gen.mjs        (จาก P5-dashboard-main/)
 * ผลลัพธ์: test-data/*.csv + data/p5-data.js + pkg-employee.csv
 *          และ patch ค่าคงที่ใน dashboard/P5-Dashboard-v7.7-LayoutFont.html ให้ชี้ CSV ปลอม
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const V77 = join(ROOT, 'dashboard', 'P5-Dashboard-v7.7-LayoutFont.html');

// --- seeded RNG (mulberry32) so every run produces the same fake data ---
let _s = 20260918;
const rnd = () => { _s |= 0; _s = _s + 0x6D2B79F5 | 0; let t = Math.imul(_s ^ _s >>> 15, 1 | _s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const pct = (a, b) => b ? +(a / b * 100).toFixed(2) : 0;

const BUS = ['PGHg', 'PMSg', 'AAMg', 'RPLCg', 'RAFCOg', 'CPDg'];

// --- fake Thai-ish names (syllable soup — ตั้งใจให้ไม่ตรงกับชื่อคนจริง) ---
const S1 = ['ทด', 'สม', 'จิน', 'พัน', 'กล', 'วร', 'นฤ', 'ศิร', 'ธน', 'ปรี', 'อร', 'ภัท', 'ชญ', 'มน', 'ฤท'];
const S2 = ['สอบ', 'ทิพ', 'ดา', 'รัต', 'พร', 'ชัย', 'นัน', 'วดี', 'ภูมิ', 'ยา', 'กุล', 'ศรี', 'มาศ', 'ลักษณ์'];
const S3 = ['กิจ', 'วงศ์', 'พงษ์', 'ชาญ', 'ธรรม', 'เจริญ', 'สกุล', 'รุ่ง', 'ไพศาล', 'มงคล'];
const fakeFirst = () => pick(S1) + pick(S2);
const fakeLast = () => pick(S1) + pick(S2) + pick(S3);

// --- employees (~3,000 คน ปลอมล้วน) ---
const EMP_N = 3000;
const employees = Array.from({ length: EMP_N }, (_, i) => ({
  id: 'T' + String(9000001 + i),          // T-prefix = test id, ชนกับรหัสจริงไม่ได้
  first: fakeFirst(),
  last: fakeLast(),
  bu: BUS[i % BUS.length]
}));

const q = s => `"${String(s).replace(/"/g, '""')}"`;
const csv = rows => rows.map(r => r.map(q).join(',')).join('\n') + '\n';

// --- summary per BU (SHEET_URL shape: 2 header rows, then rows) ---
const buStats = BUS.map(bu => {
  const members = int(40, 600);
  const trainingGoal = int(20, 60);
  const trainingDone = int(0, trainingGoal);
  const creditDone = int(Math.floor(members * 0.3), members);
  const gpaPass = int(Math.floor(members * 0.5), members);
  return {
    name: bu, members,
    training_goal: trainingGoal, training_done: trainingDone, training_remain: trainingGoal - trainingDone,
    credit_done: creditDone, credit_remain: members - creditDone,
    gpa_pass: gpaPass, gpa_fail: members - gpaPass
  };
});
const totalRow = buStats.reduce((t, c) => ({
  name: 'รวม',
  members: t.members + c.members,
  training_goal: t.training_goal + c.training_goal, training_done: t.training_done + c.training_done,
  training_remain: t.training_remain + c.training_remain,
  credit_done: t.credit_done + c.credit_done, credit_remain: t.credit_remain + c.credit_remain,
  gpa_pass: t.gpa_pass + c.gpa_pass, gpa_fail: t.gpa_fail + c.gpa_fail
}), { members: 0, training_goal: 0, training_done: 0, training_remain: 0, credit_done: 0, credit_remain: 0, gpa_pass: 0, gpa_fail: 0 });

// คอลัมน์: A ชื่อ, B เป้าอบรม, C เสร็จ, D รออบรม, E %อบรม, F สมาชิก,
//          G ครบ44, H ยังไม่ครบ, I %ครบ, J GPAผ่าน, K GPAไม่ผ่าน, L %GPA
const sumRow = c => [c.name, c.training_goal, c.training_done, c.training_remain,
  pct(c.training_done, c.training_goal) + '%', c.members, c.credit_done, c.credit_remain,
  pct(c.credit_done, c.members) + '%', c.gpa_pass, c.gpa_fail, pct(c.gpa_pass, c.members) + '%'];

writeFileSync(join(HERE, 'summary.csv'), csv([
  ['บริษัท', 'เป้าหมายอบรม', 'แล้วเสร็จ', 'รออบรม', '% อบรม', 'จำนวนสมาชิก', 'ครบ 44', 'ยังไม่ครบ', '% ครบ', 'GPA ผ่าน', 'GPA ไม่ผ่าน', '% GPA'],
  ['(ข้อมูลทดสอบ - ไม่ใช่ข้อมูลจริง)', '', '', '', '', '', '', '', '', '', '', ''],
  ...buStats.map(sumRow), sumRow(totalRow)
]));

// --- 4 KPI sheets (label,value,unit) ---
const kpiCsv = rows => csv([['รายการ', 'จำนวน', 'หน่วย'], ...rows]);

const trPlan = int(30, 60), trOpened = int(10, trPlan), trWait = trPlan - trOpened;
writeFileSync(join(HERE, 'training.csv'), kpiCsv([
  ['แผนหลักสูตรทั้งหมด', trPlan, 'หลักสูตร'],
  ['เปิดอบรมแล้ว', trOpened, 'หลักสูตร'],
  ['รอส่งผล', trWait, 'หลักสูตร'],
  ['สมาชิกที่เข้าอบรม', int(800, 2500), 'คน'],
  ['Cheer up', pct(trOpened, trPlan), '%']
]));

const rpTeams = int(40, 90), rpPass = int(Math.floor(rpTeams * 0.6), rpTeams);
writeFileSync(join(HERE, 'roleplay.csv'), kpiCsv([
  ['สรุปจำนวนทีม Roleplay', rpTeams, 'ทีม'],
  ['Roleplay ผ่าน', rpPass, 'ทีม'],
  ['ยังไม่บรรลุ', rpTeams - rpPass, 'ทีม'],
  ['Cheer up', pct(rpPass, rpTeams), '%']
]));

const mtTotal = int(25, 80), mtGood = int(0, mtTotal);
writeFileSync(join(HERE, 'mentor.csv'), kpiCsv([
  ['อยู่ในระบบ Mentor', mtTotal, 'คู่'],
  ['วินัยมากกว่า 90%', mtGood, 'คู่'],
  ['วินัยน้อยกว่า 90%', mtTotal - mtGood, 'คู่'],
  ['Cheer up', pct(mtGood, mtTotal), '%']
]));

const cTotal = int(40, 90), cGood = int(Math.floor(cTotal * 0.5), cTotal);
writeFileSync(join(HERE, 'coach.csv'), kpiCsv([
  ['อยู่ในระบบมอบหมาย Coach', cTotal, 'คน'],
  ['ตามเป้าหมาย', cGood, 'คน'],
  ['น้อยกว่าเป้าหมาย', cTotal - cGood, 'คน'],
  ['Cheer up', pct(cGood, cTotal), '%']
]));

// --- Learning & Growth (capital, PKG, 6 BU, รวม, อ้างอิง) ---
const CAPITALS = ['ทุนมนุษย์', 'ทุนสารสนเทศ', 'ทุนองค์กร', 'ทุนความรู้', 'ทุนนวัตกรรม'];
const lgRows = CAPITALS.map(cap => {
  const vals = [int(5, 40), ...BUS.map(() => int(0, 30))];
  return [cap, ...vals, vals.reduce((a, b) => a + b, 0), 'TEST'];
});
writeFileSync(join(HERE, 'lg.csv'), csv([
  ['Capital', 'PKG', ...BUS.map(b => b + 'r'), 'รวม', 'อ้างอิง'], ...lgRows
]));

// --- employee CSV (รหัส, ชื่อ, นามสกุล) ---
const empCsv = csv([['รหัสสมาชิก ', 'ชื่อ ', 'นามสกุล '], ...employees.map(e => [e.id, e.first, e.last])]);
writeFileSync(join(HERE, 'employee.csv'), empCsv);
writeFileSync(join(ROOT, 'pkg-employee.csv'), empCsv);

// --- 2.2 training requests (30 คำขอปลอม) ---
const COURSES = ['Ownership in Action', 'Frontline Coaching Lab', 'Safety Mindset Workshop', 'Data Literacy Basics',
  'Service Excellence Clinic', 'Lean Daily Management', 'Digital Tools for PAD', 'Feedback that Works',
  'Problem Solving A3', 'Presentation for Leaders'];
const VENUES = ['Training Room A', 'Training Room B', 'Online live', 'Plant Hall 1', 'Provider Site', 'Hybrid (Room A + Zoom)'];
const TRAINERS = ['ทีม LDC-PAD', 'Internal SME', 'External Provider: TestLab', 'Data Academy (test)', 'ทีม HRBP'];
const STATUSES = ['รออนุมัติ', 'รอตรวจงบ', 'พร้อมเปิด', 'แบบร่าง'];
const BLOCKERS = ['รอยืนยันรายชื่อผู้เรียน', 'รออนุมัติ agenda', 'รอใบเสนอราคา', 'รอ cost center', 'รอยืนยันห้องอบรม'];
const MONTHS = ['มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];

const requests = Array.from({ length: 30 }, (_, i) => {
  const type = rnd() < 0.55 ? 'ภายใน' : 'ภายนอก';
  const status = pick(STATUSES);
  const readiness = status === 'พร้อมเปิด' ? int(88, 100) : status === 'แบบร่าง' ? int(20, 55) : int(56, 87);
  const owner = fakeFirst();
  const d = int(1, 27);
  return {
    id: `TR-2569-${String(100 + i)}`,
    course: `${pick(COURSES)} (TEST ${i + 1})`,
    type, bu: pick(BUS), owner,
    trainer: type === 'ภายนอก' ? 'External Provider: TestLab' : pick(TRAINERS),
    dateRange: rnd() < 0.4 ? `${d}-${d + 1} ${pick(MONTHS)} 2569` : `${d} ${pick(MONTHS)} 2569`,
    venue: pick(VENUES),
    learners: int(8, 80),
    budget: type === 'ภายนอก' ? int(2, 30) * 5000 : 0,
    status, readiness,
    objective: 'ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น',
    blockers: status === 'พร้อมเปิด' ? [] : Array.from({ length: int(1, 2) }, () => pick(BLOCKERS)),
    checklist: ['หลักสูตรพร้อม', 'วิทยากรพร้อม', `รายชื่อผู้เรียน ${int(4, 10) * 10}%`,
      type === 'ภายนอก' ? 'งบประมาณรอตรวจ' : 'ห้องอบรมพร้อม', 'แบบประเมินพร้อม']
  };
});

// --- data/p5-data.js (ใช้โดย p5.html) ---
const months = [5, 6, 7, 8].map(m => {
  const planned = int(5, 30), done = int(0, planned);
  return { month: m, planned, done, pending: planned - done, members: int(200, 2800), cheerPct: pct(done, planned), note: 'ข้อมูลทดสอบ' };
});
const p5data = {
  meta: {
    org: 'PKG Group (TEST DATA — ไม่ใช่ข้อมูลจริง)',
    platform: 'P5 · ระบบพัฒนาบุคลากร PKG',
    period: 'Q2/2569 (เม.ย. - มิ.ย.) · TEST',
    okrGoal: 'พัฒนาสมาชิกตาม Core competency PKG',
    okrVision: 'สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU',
    okr: 'สมาชิกมีแผนและได้รับการพัฒนาศักยภาพตามแผนครบทุกคน',
    sheetUrl: ''
  },
  training: {
    months,
    pages: [
      { id: '2.1', title: 'ลงทะเบียนหลักสูตร', goal: 'ค้นหา/ลงทะเบียนผู้เรียนตามแผนราย BU', status: 'planned' },
      { id: '2.2', title: 'ขอเปิดอบรม ภายใน/ภายนอก', goal: 'รวมคำขอเปิดอบรม ตรวจความพร้อม และส่งอนุมัติ', status: 'prototype' },
      { id: '2.3', title: 'ส่งผลอบรม ภายใน/ภายนอก', goal: 'บันทึกผล อัปโหลดหลักฐาน และปิดรอบอบรม', status: 'planned' },
      { id: '2.4', title: 'รายงานการอบรมภายนอก', goal: 'ติดตามค่าใช้จ่าย provider และผลลัพธ์หลังอบรม', status: 'planned' },
      { id: '2.5', title: 'ตารางการอบรม', goal: 'มุมมองปฏิทินหลักสูตร/ห้อง/วิทยากร', status: 'planned' }
    ],
    openRequests: requests.map(r => ({ ...r, requester: r.bu + ' HR', priority: pick(['สูง', 'กลาง', 'ต่ำ']) }))
  },
  roleplay: {
    total: rpTeams, pass: rpPass, fail: rpTeams - rpPass, pct: pct(rpPass, rpTeams), note: 'ข้อมูลทดสอบ',
    testRounds: Array.from({ length: 6 }, () => {
      const teams = int(4, 18), p = int(0, teams);
      return { round: `${pick(MONTHS)} W${int(1, 4)}`, bu: pick(BUS), teams, pass: p, owner: fakeFirst() };
    })
  },
  mentor: {
    total: mtTotal, pass: mtGood, fail: mtTotal - mtGood, pct: pct(mtGood, mtTotal), note: 'ข้อมูลทดสอบ',
    testPairs: Array.from({ length: 12 }, () => ({
      mentee: pick(employees).id, mentor: pick(employees).id, bu: pick(BUS),
      stage: pick(['ติดตามเดือน 1', 'ติดตามเดือน 2', 'ติดตามเดือน 3', 'รอรายงาน']), disciplinePct: int(50, 100)
    }))
  },
  coach: {
    total: cTotal, pass: cGood, fail: cTotal - cGood, pct: pct(cGood, cTotal), note: 'ข้อมูลทดสอบ',
    testSessions: Array.from({ length: 10 }, () => ({
      coach: `หัวหน้า ${pick(BUS)}-${pick(['A', 'B', 'C', 'D'])}`, coachee: int(3, 15),
      topic: pick(['GPA Recovery', 'Ownership Habit', 'Work Standard', 'Safety Talk']), progress: int(20, 100)
    }))
  },
  comments: {
    AP: Array.from({ length: 5 }, (_, i) => ({ no: `AP-${String(i + 1).padStart(2, '0')}`, action: 'รายการทดสอบ ' + (i + 1), owner: pick(BUS), status: pick(['Active', 'In Progress', 'Done']), dueDate: `2569-0${int(6, 9)}-${String(int(1, 28)).padStart(2, '0')}` })),
    BP: Array.from({ length: 3 }, (_, i) => ({ no: `BP-0${i + 1}`, bestPractice: 'ตัวอย่าง best practice ทดสอบ ' + (i + 1), owner: 'LDC-PAD', status: 'Active' })),
    LL: Array.from({ length: 3 }, (_, i) => ({ no: `LL-0${i + 1}`, lessonLearned: 'บทเรียนทดสอบ ' + (i + 1), owner: 'PAD', status: pick(['Done', 'Active']) })),
    II: Array.from({ length: 2 }, (_, i) => ({ no: `II-0${i + 1}`, innovation: 'ไอเดียทดสอบ ' + (i + 1), owner: 'PAD', status: 'Prototype' })),
    XP: Array.from({ length: 2 }, (_, i) => ({ no: `XP-0${i + 1}`, experience: 'ประสบการณ์ทดสอบ ' + (i + 1), owner: 'LDC-PAD', status: 'Active' })),
    '📝Daily Comments': Array.from({ length: 5 }, () => ({ date: `2569-0${int(6, 9)}-${String(int(1, 28)).padStart(2, '0')}`, author: fakeFirst(), comment: 'คอมเมนต์ทดสอบ', category: pick(['Training', 'Mentor', 'Coach', 'Roleplay']) }))
  },
  report: [...buStats, totalRow].map(c => ({
    bu: c.name, members: c.members, complete44: c.credit_done, incomplete: c.credit_remain,
    pctComplete: pct(c.credit_done, c.members), gpaPass: c.gpa_pass, gpaFail: c.gpa_fail,
    pctGpa: pct(c.gpa_pass, c.members), statusDone: c.training_done, statusPending: c.training_remain,
    pctStatus: pct(c.training_done, c.training_goal)
  }))
};

writeFileSync(join(ROOT, 'data', 'p5-data.js'),
  `/**\n * ⚠️ ข้อมูลทดสอบสังเคราะห์ — ไม่ใช่ข้อมูลจริงของ PKG\n * สร้างโดย test-data/gen.mjs (seed คงที่) · อย่า merge ไฟล์นี้กลับ main\n */\nwindow.P5_DATA = ${JSON.stringify(p5data, null, 2)};\nwindow.P5_TEST_DATA = window.P5_DATA;\n`);

// --- patch v7.7: ชี้ CSV ปลอม + แทน request/employee ที่ฝังในไฟล์ ---
let html = readFileSync(V77, 'utf8');
const swap = (re, to, what) => {
  if (!re.test(html)) throw new Error('patch failed (no match): ' + what);
  html = html.replace(re, to);
};
const LOCAL = {
  SHEET_URL: 'summary.csv', TRAINING_URL: 'training.csv', ROLEPLAY_URL: 'roleplay.csv',
  MENTOR_URL: 'mentor.csv', COACH_URL: 'coach.csv', LG_URL: 'lg.csv'
};
for (const [name, file] of Object.entries(LOCAL)) {
  swap(new RegExp(`const ${name} = '[^']*';`), `const ${name} = '../test-data/${file}';`, name);
}
swap(/const EMPLOYEE_SHEET_CSV = '[^']*';/, "const EMPLOYEE_SHEET_CSV = '../test-data/employee.csv';", 'EMPLOYEE_SHEET_CSV');
swap(/const EMPLOYEE_SHEET_CSV_FALLBACK = [^\n]*;/, "const EMPLOYEE_SHEET_CSV_FALLBACK = '../test-data/employee.csv';", 'EMPLOYEE_SHEET_CSV_FALLBACK');
swap(/const EMPLOYEE_EMBEDDED_CSV = "[\s\S]*?";\n/, 'const EMPLOYEE_EMBEDDED_CSV = ' + JSON.stringify(empCsv) + ';\n', 'EMPLOYEE_EMBEDDED_CSV');
swap(/window\.TR22_REQUESTS = \[[\s\S]*?\n\];/, 'window.TR22_REQUESTS = ' + JSON.stringify(requests, null, 2) + ';', 'TR22_REQUESTS');
// ป้ายเตือนว่าเป็นข้อมูลปลอม (ทั้ง label แหล่งข้อมูล และแบนเนอร์บนสุด)
html = html.replace(/✅ Live · Google Sheet[^`]*/g, '🧪 TEST DATA · ข้อมูลสังเคราะห์ ไม่ใช่ข้อมูลจริง');
const BANNER = '<div style="position:sticky;top:0;z-index:9999;background:#EF4444;color:#fff;font:600 14px/1.6 Sarabun,sans-serif;text-align:center;padding:6px">🧪 TEST DATA — ข้อมูลทั้งหมดในหน้านี้เป็นของปลอม (branch test-data)</div>';
if (!html.includes('TEST DATA — ข้อมูล')) swap(/<body[^>]*>/, m => m + BANNER, 'banner');

writeFileSync(V77, html);

console.log(`ok — ${employees.length} employees, ${requests.length} requests, ${BUS.length} BU`);
