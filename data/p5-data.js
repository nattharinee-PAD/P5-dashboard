/**
 * P5 v2.0 — Mock Data สำหรับ Dashboard 5 Rows
 * ใช้แสดงทันที (กันหน้าว่าง) + จะถูก override ด้วยข้อมูลจริงจาก Apps Script
 * สร้างโดย AliClaw 🐾 ตามคำสั่ง ลูกหมี (ณัฐฑริณี) 10 มิ.ย. 2569
 */

window.P5_DATA = {
  meta: {
    org: 'PKG Group (Tri Petch Isuzu Sales)',
    platform: 'P5 · ระบบพัฒนาบุคลากร PKG',
    period: 'Q2/2569 (เม.ย. - มิ.ย.)',
    okrGoal: 'พัฒนาสมาชิกตาม Core competency PKG',
    okrVision: 'สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU',
    okr: 'สมาชิกมีแผนและได้รับการพัฒนาศักยภาพตามแผนครบทุกคน',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0'
  },

  // ============================================================
  // TRAINING — 2 เดือน (ข้อมูลจริงจากลูกหมี)
  // ============================================================
  training: {
    months: [
      { month: 5, planned: 29, done: 27, pending: 0, members: 2663, cheerPct: 93.1, note: 'เดือน พ.ค. ผ่านดี' },
      { month: 6, planned: 8, done: 0, pending: 8, members: 602, cheerPct: 0.0, note: 'เดือน มิ.ย. เริ่มต้น' }
    ]
  },

  // ============================================================
  // ROLEPLAY — 55/55 (100%)
  // ============================================================
  roleplay: { total: 55, pass: 55, fail: 0, pct: 100, note: '' },

  // ============================================================
  // MENTOR — 32 คน
  // ============================================================
  mentor: {
    total: 32, pass: 0, fail: 32, pct: 0,
    note: 'เนื่องจากแต่ละคนมีรอบการวัดผลที่ไม่ได้เท่ากัน ข้อมูลตัดรอบ 20/10/68'
  },

  // ============================================================
  // COACH — 58/58 (100%)
  // ============================================================
  coach: { total: 58, pass: 58, fail: 0, pct: 100, note: '' },

  // ============================================================
  // COMMENTS — AP/BP/LL/II/XP/Daily (ว่างไว้ก่อน รอลูกหมีป้อน)
  // ============================================================
  comments: {
    AP: [], BP: [], LL: [], II: [], XP: [],
    '📝Daily Comments': []
  },

  // ============================================================
  // REPORT TABLE — ตารางรายงาน 6 BU (GID 1104115053)
  // ============================================================
  report: [
    { bu: 'PGHg',   members: 0,   complete44: 0,   incomplete: 0,   pctComplete: 0.00,    gpaPass: 0,   gpaFail: 0,   pctGpa: 0.00,    statusDone: 0,   statusPending: 0,   pctStatus: 0.00    },
    { bu: 'PMSg',   members: 173, complete44: 172, incomplete: 1,   pctComplete: 99.42,   gpaPass: 165, gpaFail: 8,   pctGpa: 95.38,   statusDone: 0,   statusPending: 0,   pctStatus: 0.00    },
    { bu: 'AAMg',   members: 100, complete44: 98,  incomplete: 2,   pctComplete: 98.00,   gpaPass: 100, gpaFail: 0,   pctGpa: 100.00,  statusDone: 0,   statusPending: 0,   pctStatus: 0.00    },
    { bu: 'RPLCg',  members: 31,  complete44: 13,  incomplete: 18,  pctComplete: 41.94,   gpaPass: 31,  gpaFail: 0,   pctGpa: 100.00,  statusDone: 0,   statusPending: 0,   pctStatus: 0.00    },
    { bu: 'RAFCOg', members: 22,  complete44: 3,   incomplete: 19,  pctComplete: 13.64,   gpaPass: 20,  gpaFail: 2,   pctGpa: 90.91,   statusDone: 0,   statusPending: 0,   pctStatus: 0.00    },
    { bu: 'CPDg',   members: 33,  complete44: 15,  incomplete: 18,  pctComplete: 45.45,   gpaPass: 26,  gpaFail: 7,   pctGpa: 78.79,   statusDone: 0,   statusPending: 0,   pctStatus: 0.00    }
  ],

  // ============================================================
  // KPI CARDS (auto-computed)
  // ============================================================
  get kpiCards() {
    const totalMembers = this.training.months.reduce((s, m) => s + m.members, 0);
    const totalPlanned = this.training.months.reduce((s, m) => s + m.planned, 0);
    const totalDone = this.training.months.reduce((s, m) => s + m.done, 0);
    const trainingPct = totalPlanned ? Math.round(totalDone / totalPlanned * 100) : 0;
    return [
      { icon: '👥', value: totalMembers.toLocaleString('th-TH'), label: 'สมาชิกที่มีแผน', color: 'green', sub: 'ทั้งหมดในระบบ P5' },
      { icon: '📚', value: trainingPct + '%', label: 'Training ตามแผน', color: trainingPct >= 80 ? 'green' : trainingPct >= 60 ? 'gold' : 'red', sub: totalDone + ' / ' + totalPlanned + ' หลักสูตร' },
      { icon: '👥', value: this.mentor.pct + '%', label: 'Mentor วินัย ≥ 90%', color: this.mentor.pct >= 80 ? 'green' : this.mentor.pct >= 60 ? 'gold' : 'red', sub: this.mentor.pass + ' / ' + this.mentor.total + ' คน' },
      { icon: '🎯', value: this.coach.pct + '%', label: 'Coach ตามเป้า', color: this.coach.pct >= 80 ? 'green' : this.coach.pct >= 60 ? 'gold' : 'red', sub: this.coach.pass + ' / ' + this.coach.total + ' คน' }
    ];
  }
};

console.log('✅ P5 Mock Data v2.0 loaded');
