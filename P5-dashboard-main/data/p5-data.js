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
    ],
    pages: [
      { id: '2.1', title: 'ลงทะเบียนหลักสูตร', goal: 'ค้นหา/ลงทะเบียนผู้เรียนตามแผนราย BU', status: 'planned' },
      { id: '2.2', title: 'ขอเปิดอบรม ภายใน/ภายนอก', goal: 'รวมคำขอเปิดอบรม ตรวจความพร้อม และส่งอนุมัติ', status: 'prototype' },
      { id: '2.3', title: 'ส่งผลอบรม ภายใน/ภายนอก', goal: 'บันทึกผล อัปโหลดหลักฐาน และปิดรอบอบรม', status: 'planned' },
      { id: '2.4', title: 'รายงานการอบรมภายนอก', goal: 'ติดตามค่าใช้จ่าย provider และผลลัพธ์หลังอบรม', status: 'planned' },
      { id: '2.5', title: 'ตารางการอบรม', goal: 'มุมมองปฏิทินหลักสูตร/ห้อง/วิทยากร', status: 'planned' }
    ],
    openRequests: [
      {
        id: 'TR-2569-022',
        course: 'Core Competency: Ownership in Action',
        type: 'ภายใน',
        bu: 'PMSg',
        owner: 'ณัฐฑริณี',
        requester: 'HRD PAD',
        trainer: 'ทีม LDC-PAD',
        dateRange: '24-25 มิ.ย. 2569',
        venue: 'Training Room A / Online backup',
        learners: 42,
        budget: 0,
        priority: 'สูง',
        status: 'รออนุมัติ',
        readiness: 86,
        objective: 'ยกระดับพฤติกรรม Ownership และการส่งมอบงานข้ามทีม',
        blockers: ['รอยืนยันรายชื่อ PMSg รอบสุดท้าย', 'รออนุมัติ agenda จากผู้จัดการสายงาน'],
        checklist: ['หลักสูตรพร้อม', 'วิทยากรพร้อม', 'รายชื่อผู้เรียน 90%', 'ห้องอบรมพร้อม', 'แบบประเมินพร้อม']
      },
      {
        id: 'TR-2569-023',
        course: 'GPA Coaching for Frontline Leader',
        type: 'ภายนอก',
        bu: 'AAMg',
        owner: 'ธนภูมิ',
        requester: 'AAMg HRBP',
        trainer: 'External Provider: SkillLab',
        dateRange: '28 มิ.ย. 2569',
        venue: 'SkillLab Bangkok',
        learners: 28,
        budget: 84000,
        priority: 'กลาง',
        status: 'รอตรวจงบ',
        readiness: 64,
        objective: 'เตรียมหัวหน้างานให้ coach สมาชิกที่ GPA ต่ำกว่าเป้าหมาย',
        blockers: ['รอใบเสนอราคา signed copy', 'รอ cost center จาก BU'],
        checklist: ['หลักสูตรพร้อม', 'วิทยากรพร้อม', 'รายชื่อผู้เรียน 70%', 'งบประมาณรอตรวจ', 'แบบประเมินร่างแล้ว']
      },
      {
        id: 'TR-2569-024',
        course: 'Safety Mindset for Roleplay Team',
        type: 'ภายใน',
        bu: 'RPLCg',
        owner: 'วิไลรัตน์',
        requester: 'RPLCg Manager',
        trainer: 'Internal SME',
        dateRange: '2 ก.ค. 2569',
        venue: 'RPLC Plant / Room 2',
        learners: 18,
        budget: 0,
        priority: 'สูง',
        status: 'พร้อมเปิด',
        readiness: 96,
        objective: 'เติมทักษะ safety conversation ก่อนประเมิน Roleplay รอบใหม่',
        blockers: [],
        checklist: ['หลักสูตรพร้อม', 'วิทยากรพร้อม', 'รายชื่อผู้เรียนครบ', 'ห้องอบรมพร้อม', 'แบบประเมินพร้อม']
      },
      {
        id: 'TR-2569-025',
        course: 'Data Literacy for PAD Dashboard Users',
        type: 'ภายนอก',
        bu: 'CPDg',
        owner: 'ปาริชาติ',
        requester: 'CPDg HR',
        trainer: 'Data Academy',
        dateRange: '8-9 ก.ค. 2569',
        venue: 'Online live',
        learners: 35,
        budget: 125000,
        priority: 'ต่ำ',
        status: 'แบบร่าง',
        readiness: 38,
        objective: 'ให้ผู้ใช้ dashboard อ่าน KPI และ action insight ได้ตรงกัน',
        blockers: ['รอสรุป scope จาก provider', 'รอรายชื่อกลุ่มเป้าหมาย'],
        checklist: ['หลักสูตรร่าง', 'รอวิทยากรยืนยัน', 'รายชื่อผู้เรียน 40%', 'ไม่ต้องจองห้อง', 'ยังไม่มีแบบประเมิน']
      }
    ]
  },

  // ============================================================
  // ROLEPLAY — 55/55 (100%)
  // ============================================================
  roleplay: {
    total: 55, pass: 55, fail: 0, pct: 100, note: '',
    testRounds: [
      { round: 'มิ.ย. W3', bu: 'PMSg', teams: 14, pass: 14, owner: 'สุภาภรณ์' },
      { round: 'มิ.ย. W4', bu: 'RPLCg', teams: 8, pass: 8, owner: 'วิทยา' },
      { round: 'ก.ค. W1', bu: 'CPDg', teams: 6, pass: 6, owner: 'ปาริชาติ' }
    ]
  },

  // ============================================================
  // MENTOR — 32 คน
  // ============================================================
  mentor: {
    total: 32, pass: 0, fail: 32, pct: 0,
    note: 'เนื่องจากแต่ละคนมีรอบการวัดผลที่ไม่ได้เท่ากัน ข้อมูลตัดรอบ 20/10/68',
    testPairs: [
      { mentee: '6407049', mentor: '5004066', bu: 'PMSg', stage: 'ติดตามเดือน 1', disciplinePct: 82 },
      { mentee: '6607239', mentor: '5707120', bu: 'AAMg', stage: 'ติดตามเดือน 2', disciplinePct: 88 },
      { mentee: '6811054', mentor: '5409132', bu: 'CPDg', stage: 'รอรายงาน', disciplinePct: 76 }
    ]
  },

  // ============================================================
  // COACH — 58/58 (100%)
  // ============================================================
  coach: {
    total: 58, pass: 58, fail: 0, pct: 100, note: '',
    testSessions: [
      { coach: 'หัวหน้า PMSg-A', coachee: 12, topic: 'GPA Recovery', progress: 100 },
      { coach: 'หัวหน้า AAMg-B', coachee: 9, topic: 'Ownership Habit', progress: 100 },
      { coach: 'หัวหน้า RAFCOg-C', coachee: 7, topic: 'Work Standard', progress: 100 }
    ]
  },

  // ============================================================
  // COMMENTS — AP/BP/LL/II/XP/Daily (ว่างไว้ก่อน รอลูกหมีป้อน)
  // ============================================================
  comments: {
    AP: [
      { no: 'AP-01', action: 'ปิดรายชื่อผู้เรียนหลักสูตร 2.2 ก่อนส่งอนุมัติ', owner: 'PAD', status: 'In Progress', dueDate: '2569-06-21' },
      { no: 'AP-02', action: 'ทำ checklist เอกสาร provider สำหรับอบรมภายนอก', owner: 'HRBP', status: 'Active', dueDate: '2569-06-24' }
    ],
    BP: [
      { no: 'BP-01', bestPractice: 'ใช้ readiness score ก่อนเปิดรุ่นอบรม ลดงานตามแก้หลังอนุมัติ', owner: 'LDC-PAD', status: 'Active' }
    ],
    LL: [
      { no: 'LL-01', lessonLearned: 'คำขอภายนอกต้องเห็นงบและ cost center ในหน้าเดียวกับ agenda', owner: 'PAD', status: 'Done' }
    ],
    II: [
      { no: 'II-01', innovation: 'ทำ training request cockpit รวม approval, budget, checklist และ risk', owner: 'AliClaw', status: 'Prototype' }
    ],
    XP: [
      { no: 'XP-01', experience: 'ผู้จัดการต้องการเห็นจำนวนผู้เรียนและวันอบรมเป็นสัญญาณแรก', owner: 'LDC-PAD', status: 'Active' }
    ],
    '📝Daily Comments': [
      { date: '2569-06-18', author: 'ลูกหมี', comment: 'ขอเริ่ม UI หน้า 2.2 ก่อน แล้วค่อยต่อหน้าที่เหลือ', category: 'Training' }
    ]
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

window.P5_TEST_DATA = window.P5_DATA;
console.log('✅ P5 Mock Data v2.0 loaded');
