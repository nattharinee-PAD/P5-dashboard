/**
 * ⚠️ ข้อมูลทดสอบสังเคราะห์ — ไม่ใช่ข้อมูลจริงของ PKG
 * สร้างโดย test-data/gen.mjs (seed คงที่) · อย่า merge ไฟล์นี้กลับ main
 */
window.P5_DATA = {
  "meta": {
    "org": "PKG Group (TEST DATA — ไม่ใช่ข้อมูลจริง)",
    "platform": "P5 · ระบบพัฒนาบุคลากร PKG",
    "period": "Q2/2569 (เม.ย. - มิ.ย.) · TEST",
    "okrGoal": "พัฒนาสมาชิกตาม Core competency PKG",
    "okrVision": "สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU",
    "okr": "สมาชิกมีแผนและได้รับการพัฒนาศักยภาพตามแผนครบทุกคน",
    "sheetUrl": ""
  },
  "training": {
    "months": [
      {
        "month": 5,
        "planned": 17,
        "done": 5,
        "pending": 12,
        "members": 1642,
        "cheerPct": 29.41,
        "note": "ข้อมูลทดสอบ"
      },
      {
        "month": 6,
        "planned": 11,
        "done": 7,
        "pending": 4,
        "members": 1339,
        "cheerPct": 63.64,
        "note": "ข้อมูลทดสอบ"
      },
      {
        "month": 7,
        "planned": 21,
        "done": 10,
        "pending": 11,
        "members": 2245,
        "cheerPct": 47.62,
        "note": "ข้อมูลทดสอบ"
      },
      {
        "month": 8,
        "planned": 16,
        "done": 7,
        "pending": 9,
        "members": 1637,
        "cheerPct": 43.75,
        "note": "ข้อมูลทดสอบ"
      }
    ],
    "pages": [
      {
        "id": "2.1",
        "title": "ลงทะเบียนหลักสูตร",
        "goal": "ค้นหา/ลงทะเบียนผู้เรียนตามแผนราย BU",
        "status": "planned"
      },
      {
        "id": "2.2",
        "title": "ขอเปิดอบรม ภายใน/ภายนอก",
        "goal": "รวมคำขอเปิดอบรม ตรวจความพร้อม และส่งอนุมัติ",
        "status": "prototype"
      },
      {
        "id": "2.3",
        "title": "ส่งผลอบรม ภายใน/ภายนอก",
        "goal": "บันทึกผล อัปโหลดหลักฐาน และปิดรอบอบรม",
        "status": "planned"
      },
      {
        "id": "2.4",
        "title": "รายงานการอบรมภายนอก",
        "goal": "ติดตามค่าใช้จ่าย provider และผลลัพธ์หลังอบรม",
        "status": "planned"
      },
      {
        "id": "2.5",
        "title": "ตารางการอบรม",
        "goal": "มุมมองปฏิทินหลักสูตร/ห้อง/วิทยากร",
        "status": "planned"
      }
    ],
    "openRequests": [
      {
        "id": "TR-2569-100",
        "course": "Service Excellence Clinic (TEST 1)",
        "type": "ภายใน",
        "bu": "CPDg",
        "owner": "ปรีภูมิ",
        "trainer": "Data Academy (test)",
        "dateRange": "1 ส.ค. 2569",
        "venue": "Plant Hall 1",
        "learners": 62,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 69,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันรายชื่อผู้เรียน"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 70%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-101",
        "course": "Data Literacy Basics (TEST 2)",
        "type": "ภายใน",
        "bu": "CPDg",
        "owner": "ฤทรัต",
        "trainer": "ทีม LDC-PAD",
        "dateRange": "2-3 ก.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 71,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 60,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอ cost center",
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 80%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-102",
        "course": "Digital Tools for PAD (TEST 3)",
        "type": "ภายนอก",
        "bu": "PGHg",
        "owner": "วรมาศ",
        "trainer": "External Provider: TestLab",
        "dateRange": "14 มิ.ย. 2569",
        "venue": "Hybrid (Room A + Zoom)",
        "learners": 61,
        "budget": 150000,
        "status": "รอตรวจงบ",
        "readiness": 68,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รออนุมัติ agenda",
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 80%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PGHg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-103",
        "course": "Service Excellence Clinic (TEST 4)",
        "type": "ภายใน",
        "bu": "PGHg",
        "owner": "สมยา",
        "trainer": "Data Academy (test)",
        "dateRange": "12 มิ.ย. 2569",
        "venue": "Training Room A",
        "learners": 26,
        "budget": 0,
        "status": "แบบร่าง",
        "readiness": 47,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอ cost center",
          "รอใบเสนอราคา"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PGHg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-104",
        "course": "Ownership in Action (TEST 5)",
        "type": "ภายนอก",
        "bu": "RPLCg",
        "owner": "ธนรัต",
        "trainer": "External Provider: TestLab",
        "dateRange": "18-19 มิ.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 41,
        "budget": 30000,
        "status": "รอตรวจงบ",
        "readiness": 59,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 80%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "RPLCg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-105",
        "course": "Lean Daily Management (TEST 6)",
        "type": "ภายนอก",
        "bu": "RAFCOg",
        "owner": "ธนยา",
        "trainer": "External Provider: TestLab",
        "dateRange": "19 มิ.ย. 2569",
        "venue": "Training Room A",
        "learners": 67,
        "budget": 145000,
        "status": "แบบร่าง",
        "readiness": 51,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอใบเสนอราคา"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "RAFCOg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-106",
        "course": "Presentation for Leaders (TEST 7)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "ธนสอบ",
        "trainer": "External Provider: TestLab",
        "dateRange": "3 ก.ค. 2569",
        "venue": "Training Room A",
        "learners": 79,
        "budget": 120000,
        "status": "รอตรวจงบ",
        "readiness": 78,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอใบเสนอราคา",
          "รอยืนยันรายชื่อผู้เรียน"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 60%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-107",
        "course": "Digital Tools for PAD (TEST 8)",
        "type": "ภายใน",
        "bu": "RAFCOg",
        "owner": "กลรัต",
        "trainer": "External Provider: TestLab",
        "dateRange": "5-6 ก.ย. 2569",
        "venue": "Online live",
        "learners": 26,
        "budget": 0,
        "status": "พร้อมเปิด",
        "readiness": 91,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 70%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "RAFCOg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-108",
        "course": "Ownership in Action (TEST 9)",
        "type": "ภายใน",
        "bu": "AAMg",
        "owner": "อรรัต",
        "trainer": "ทีม HRBP",
        "dateRange": "2-3 มิ.ย. 2569",
        "venue": "Hybrid (Room A + Zoom)",
        "learners": 27,
        "budget": 0,
        "status": "รอตรวจงบ",
        "readiness": 56,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอ cost center"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "AAMg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-109",
        "course": "Presentation for Leaders (TEST 10)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "ฤทลักษณ์",
        "trainer": "External Provider: TestLab",
        "dateRange": "26 ก.ย. 2569",
        "venue": "Training Room B",
        "learners": 41,
        "budget": 105000,
        "status": "พร้อมเปิด",
        "readiness": 89,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 80%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-110",
        "course": "Presentation for Leaders (TEST 11)",
        "type": "ภายนอก",
        "bu": "PGHg",
        "owner": "ทดนัน",
        "trainer": "External Provider: TestLab",
        "dateRange": "17 ก.ย. 2569",
        "venue": "Online live",
        "learners": 73,
        "budget": 30000,
        "status": "แบบร่าง",
        "readiness": 25,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอ cost center",
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PGHg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-111",
        "course": "Data Literacy Basics (TEST 12)",
        "type": "ภายนอก",
        "bu": "RPLCg",
        "owner": "ปรียา",
        "trainer": "External Provider: TestLab",
        "dateRange": "26 มิ.ย. 2569",
        "venue": "Hybrid (Room A + Zoom)",
        "learners": 16,
        "budget": 110000,
        "status": "พร้อมเปิด",
        "readiness": 90,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 70%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "RPLCg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-112",
        "course": "Presentation for Leaders (TEST 13)",
        "type": "ภายใน",
        "bu": "PMSg",
        "owner": "วรพร",
        "trainer": "ทีม LDC-PAD",
        "dateRange": "9-10 ก.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 38,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 82,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันห้องอบรม",
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-113",
        "course": "Feedback that Works (TEST 14)",
        "type": "ภายนอก",
        "bu": "CPDg",
        "owner": "กลภูมิ",
        "trainer": "External Provider: TestLab",
        "dateRange": "2 ก.ค. 2569",
        "venue": "Training Room A",
        "learners": 52,
        "budget": 105000,
        "status": "พร้อมเปิด",
        "readiness": 91,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-114",
        "course": "Feedback that Works (TEST 15)",
        "type": "ภายใน",
        "bu": "CPDg",
        "owner": "สมรัต",
        "trainer": "ทีม HRBP",
        "dateRange": "19 มิ.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 30,
        "budget": 0,
        "status": "พร้อมเปิด",
        "readiness": 93,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-115",
        "course": "Safety Mindset Workshop (TEST 16)",
        "type": "ภายใน",
        "bu": "PMSg",
        "owner": "จินภูมิ",
        "trainer": "ทีม HRBP",
        "dateRange": "24 ก.ย. 2569",
        "venue": "Online live",
        "learners": 67,
        "budget": 0,
        "status": "พร้อมเปิด",
        "readiness": 98,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-116",
        "course": "Ownership in Action (TEST 17)",
        "type": "ภายนอก",
        "bu": "PGHg",
        "owner": "ฤทรัต",
        "trainer": "External Provider: TestLab",
        "dateRange": "2 มิ.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 69,
        "budget": 30000,
        "status": "รอตรวจงบ",
        "readiness": 78,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PGHg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-117",
        "course": "Frontline Coaching Lab (TEST 18)",
        "type": "ภายใน",
        "bu": "PGHg",
        "owner": "ทดชัย",
        "trainer": "ทีม HRBP",
        "dateRange": "22 มิ.ย. 2569",
        "venue": "Training Room A",
        "learners": 33,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 65,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอ cost center",
          "รอ cost center"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PGHg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-118",
        "course": "Lean Daily Management (TEST 19)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "นฤภูมิ",
        "trainer": "External Provider: TestLab",
        "dateRange": "27-28 ก.ย. 2569",
        "venue": "Provider Site",
        "learners": 34,
        "budget": 120000,
        "status": "แบบร่าง",
        "readiness": 53,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 80%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-119",
        "course": "Digital Tools for PAD (TEST 20)",
        "type": "ภายนอก",
        "bu": "AAMg",
        "owner": "ปรีนัน",
        "trainer": "External Provider: TestLab",
        "dateRange": "23-24 มิ.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 62,
        "budget": 25000,
        "status": "พร้อมเปิด",
        "readiness": 93,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "AAMg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-120",
        "course": "Data Literacy Basics (TEST 21)",
        "type": "ภายใน",
        "bu": "PMSg",
        "owner": "ชญดา",
        "trainer": "Data Academy (test)",
        "dateRange": "5-6 ก.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 48,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 85,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รออนุมัติ agenda",
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-121",
        "course": "Feedback that Works (TEST 22)",
        "type": "ภายนอก",
        "bu": "CPDg",
        "owner": "ชญลักษณ์",
        "trainer": "External Provider: TestLab",
        "dateRange": "26-27 ส.ค. 2569",
        "venue": "Training Room A",
        "learners": 56,
        "budget": 60000,
        "status": "พร้อมเปิด",
        "readiness": 98,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-122",
        "course": "Presentation for Leaders (TEST 23)",
        "type": "ภายนอก",
        "bu": "CPDg",
        "owner": "ธนพร",
        "trainer": "External Provider: TestLab",
        "dateRange": "3-4 ก.ย. 2569",
        "venue": "Training Room A",
        "learners": 64,
        "budget": 105000,
        "status": "แบบร่าง",
        "readiness": 55,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอใบเสนอราคา"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "CPDg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-123",
        "course": "Feedback that Works (TEST 24)",
        "type": "ภายใน",
        "bu": "AAMg",
        "owner": "ทดชัย",
        "trainer": "Data Academy (test)",
        "dateRange": "15 มิ.ย. 2569",
        "venue": "Plant Hall 1",
        "learners": 68,
        "budget": 0,
        "status": "แบบร่าง",
        "readiness": 55,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "AAMg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-124",
        "course": "Service Excellence Clinic (TEST 25)",
        "type": "ภายนอก",
        "bu": "RAFCOg",
        "owner": "ปรีกุล",
        "trainer": "External Provider: TestLab",
        "dateRange": "2-3 ก.ค. 2569",
        "venue": "Online live",
        "learners": 64,
        "budget": 85000,
        "status": "รออนุมัติ",
        "readiness": 63,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอใบเสนอราคา"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "RAFCOg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-125",
        "course": "Frontline Coaching Lab (TEST 26)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "สมยา",
        "trainer": "External Provider: TestLab",
        "dateRange": "3 ก.ย. 2569",
        "venue": "Provider Site",
        "learners": 24,
        "budget": 55000,
        "status": "พร้อมเปิด",
        "readiness": 91,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "ต่ำ"
      },
      {
        "id": "TR-2569-126",
        "course": "Frontline Coaching Lab (TEST 27)",
        "type": "ภายใน",
        "bu": "RAFCOg",
        "owner": "ทดชัย",
        "trainer": "ทีม HRBP",
        "dateRange": "3-4 มิ.ย. 2569",
        "venue": "Training Room B",
        "learners": 25,
        "budget": 0,
        "status": "รออนุมัติ",
        "readiness": 70,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันรายชื่อผู้เรียน",
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "RAFCOg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-127",
        "course": "Feedback that Works (TEST 28)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "พันศรี",
        "trainer": "External Provider: TestLab",
        "dateRange": "18 ก.ค. 2569",
        "venue": "Training Room B",
        "learners": 26,
        "budget": 140000,
        "status": "พร้อมเปิด",
        "readiness": 89,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 40%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "สูง"
      },
      {
        "id": "TR-2569-128",
        "course": "Lean Daily Management (TEST 29)",
        "type": "ภายใน",
        "bu": "PMSg",
        "owner": "ฤททิพ",
        "trainer": "ทีม HRBP",
        "dateRange": "25 ก.ค. 2569",
        "venue": "Training Room B",
        "learners": 43,
        "budget": 0,
        "status": "รอตรวจงบ",
        "readiness": 65,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รอยืนยันห้องอบรม"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 90%",
          "ห้องอบรมพร้อม",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "กลาง"
      },
      {
        "id": "TR-2569-129",
        "course": "Presentation for Leaders (TEST 30)",
        "type": "ภายนอก",
        "bu": "PMSg",
        "owner": "นฤพร",
        "trainer": "External Provider: TestLab",
        "dateRange": "2-3 ก.ค. 2569",
        "venue": "Training Room A",
        "learners": 31,
        "budget": 75000,
        "status": "รออนุมัติ",
        "readiness": 82,
        "objective": "ข้อมูลทดสอบ · ใช้ตรวจ layout และการกรองของหน้า 2.2 เท่านั้น",
        "blockers": [
          "รออนุมัติ agenda",
          "รออนุมัติ agenda"
        ],
        "checklist": [
          "หลักสูตรพร้อม",
          "วิทยากรพร้อม",
          "รายชื่อผู้เรียน 50%",
          "งบประมาณรอตรวจ",
          "แบบประเมินพร้อม"
        ],
        "requester": "PMSg HR",
        "priority": "กลาง"
      }
    ]
  },
  "roleplay": {
    "total": 62,
    "pass": 38,
    "fail": 24,
    "pct": 61.29,
    "note": "ข้อมูลทดสอบ",
    "testRounds": [
      {
        "round": "ก.ย. W3",
        "bu": "RAFCOg",
        "teams": 10,
        "pass": 8,
        "owner": "ศิรดา"
      },
      {
        "round": "ก.ค. W1",
        "bu": "RAFCOg",
        "teams": 14,
        "pass": 7,
        "owner": "นฤภูมิ"
      },
      {
        "round": "ส.ค. W2",
        "bu": "AAMg",
        "teams": 6,
        "pass": 5,
        "owner": "วรดา"
      },
      {
        "round": "มิ.ย. W3",
        "bu": "RPLCg",
        "teams": 9,
        "pass": 5,
        "owner": "กลรัต"
      },
      {
        "round": "ก.ค. W2",
        "bu": "AAMg",
        "teams": 4,
        "pass": 3,
        "owner": "วรทิพ"
      },
      {
        "round": "ก.ย. W2",
        "bu": "RPLCg",
        "teams": 18,
        "pass": 1,
        "owner": "ทดลักษณ์"
      }
    ]
  },
  "mentor": {
    "total": 33,
    "pass": 2,
    "fail": 31,
    "pct": 6.06,
    "note": "ข้อมูลทดสอบ",
    "testPairs": [
      {
        "mentee": "T9000045",
        "mentor": "T9001811",
        "bu": "RPLCg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 77
      },
      {
        "mentee": "T9002983",
        "mentor": "T9003000",
        "bu": "RAFCOg",
        "stage": "ติดตามเดือน 3",
        "disciplinePct": 80
      },
      {
        "mentee": "T9001078",
        "mentor": "T9002268",
        "bu": "AAMg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 63
      },
      {
        "mentee": "T9000669",
        "mentor": "T9001333",
        "bu": "PGHg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 82
      },
      {
        "mentee": "T9001666",
        "mentor": "T9000776",
        "bu": "RAFCOg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 72
      },
      {
        "mentee": "T9002403",
        "mentor": "T9001040",
        "bu": "PGHg",
        "stage": "ติดตามเดือน 1",
        "disciplinePct": 63
      },
      {
        "mentee": "T9002608",
        "mentor": "T9001137",
        "bu": "RAFCOg",
        "stage": "รอรายงาน",
        "disciplinePct": 74
      },
      {
        "mentee": "T9001885",
        "mentor": "T9001405",
        "bu": "CPDg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 93
      },
      {
        "mentee": "T9001764",
        "mentor": "T9000021",
        "bu": "RPLCg",
        "stage": "ติดตามเดือน 1",
        "disciplinePct": 93
      },
      {
        "mentee": "T9000751",
        "mentor": "T9002087",
        "bu": "RAFCOg",
        "stage": "ติดตามเดือน 1",
        "disciplinePct": 81
      },
      {
        "mentee": "T9001329",
        "mentor": "T9000768",
        "bu": "RPLCg",
        "stage": "ติดตามเดือน 2",
        "disciplinePct": 56
      },
      {
        "mentee": "T9002444",
        "mentor": "T9001117",
        "bu": "PMSg",
        "stage": "รอรายงาน",
        "disciplinePct": 85
      }
    ]
  },
  "coach": {
    "total": 76,
    "pass": 71,
    "fail": 5,
    "pct": 93.42,
    "note": "ข้อมูลทดสอบ",
    "testSessions": [
      {
        "coach": "หัวหน้า PMSg-A",
        "coachee": 7,
        "topic": "GPA Recovery",
        "progress": 77
      },
      {
        "coach": "หัวหน้า PMSg-D",
        "coachee": 5,
        "topic": "Ownership Habit",
        "progress": 36
      },
      {
        "coach": "หัวหน้า AAMg-D",
        "coachee": 10,
        "topic": "Work Standard",
        "progress": 36
      },
      {
        "coach": "หัวหน้า PGHg-D",
        "coachee": 14,
        "topic": "Ownership Habit",
        "progress": 81
      },
      {
        "coach": "หัวหน้า RAFCOg-A",
        "coachee": 4,
        "topic": "Work Standard",
        "progress": 26
      },
      {
        "coach": "หัวหน้า RPLCg-A",
        "coachee": 13,
        "topic": "Work Standard",
        "progress": 80
      },
      {
        "coach": "หัวหน้า PMSg-C",
        "coachee": 13,
        "topic": "Ownership Habit",
        "progress": 67
      },
      {
        "coach": "หัวหน้า PMSg-A",
        "coachee": 6,
        "topic": "GPA Recovery",
        "progress": 63
      },
      {
        "coach": "หัวหน้า AAMg-A",
        "coachee": 12,
        "topic": "Safety Talk",
        "progress": 85
      },
      {
        "coach": "หัวหน้า AAMg-A",
        "coachee": 14,
        "topic": "GPA Recovery",
        "progress": 96
      }
    ]
  },
  "comments": {
    "AP": [
      {
        "no": "AP-01",
        "action": "รายการทดสอบ 1",
        "owner": "PGHg",
        "status": "Active",
        "dueDate": "2569-07-20"
      },
      {
        "no": "AP-02",
        "action": "รายการทดสอบ 2",
        "owner": "RPLCg",
        "status": "Done",
        "dueDate": "2569-09-21"
      },
      {
        "no": "AP-03",
        "action": "รายการทดสอบ 3",
        "owner": "AAMg",
        "status": "Active",
        "dueDate": "2569-07-07"
      },
      {
        "no": "AP-04",
        "action": "รายการทดสอบ 4",
        "owner": "PMSg",
        "status": "In Progress",
        "dueDate": "2569-09-11"
      },
      {
        "no": "AP-05",
        "action": "รายการทดสอบ 5",
        "owner": "RPLCg",
        "status": "Done",
        "dueDate": "2569-07-10"
      }
    ],
    "BP": [
      {
        "no": "BP-01",
        "bestPractice": "ตัวอย่าง best practice ทดสอบ 1",
        "owner": "LDC-PAD",
        "status": "Active"
      },
      {
        "no": "BP-02",
        "bestPractice": "ตัวอย่าง best practice ทดสอบ 2",
        "owner": "LDC-PAD",
        "status": "Active"
      },
      {
        "no": "BP-03",
        "bestPractice": "ตัวอย่าง best practice ทดสอบ 3",
        "owner": "LDC-PAD",
        "status": "Active"
      }
    ],
    "LL": [
      {
        "no": "LL-01",
        "lessonLearned": "บทเรียนทดสอบ 1",
        "owner": "PAD",
        "status": "Active"
      },
      {
        "no": "LL-02",
        "lessonLearned": "บทเรียนทดสอบ 2",
        "owner": "PAD",
        "status": "Active"
      },
      {
        "no": "LL-03",
        "lessonLearned": "บทเรียนทดสอบ 3",
        "owner": "PAD",
        "status": "Done"
      }
    ],
    "II": [
      {
        "no": "II-01",
        "innovation": "ไอเดียทดสอบ 1",
        "owner": "PAD",
        "status": "Prototype"
      },
      {
        "no": "II-02",
        "innovation": "ไอเดียทดสอบ 2",
        "owner": "PAD",
        "status": "Prototype"
      }
    ],
    "XP": [
      {
        "no": "XP-01",
        "experience": "ประสบการณ์ทดสอบ 1",
        "owner": "LDC-PAD",
        "status": "Active"
      },
      {
        "no": "XP-02",
        "experience": "ประสบการณ์ทดสอบ 2",
        "owner": "LDC-PAD",
        "status": "Active"
      }
    ],
    "📝Daily Comments": [
      {
        "date": "2569-09-07",
        "author": "สมสอบ",
        "comment": "คอมเมนต์ทดสอบ",
        "category": "Roleplay"
      },
      {
        "date": "2569-07-10",
        "author": "พันสอบ",
        "comment": "คอมเมนต์ทดสอบ",
        "category": "Training"
      },
      {
        "date": "2569-09-02",
        "author": "จินชัย",
        "comment": "คอมเมนต์ทดสอบ",
        "category": "Coach"
      },
      {
        "date": "2569-07-01",
        "author": "มนนัน",
        "comment": "คอมเมนต์ทดสอบ",
        "category": "Training"
      },
      {
        "date": "2569-09-18",
        "author": "กลยา",
        "comment": "คอมเมนต์ทดสอบ",
        "category": "Mentor"
      }
    ]
  },
  "report": [
    {
      "bu": "PGHg",
      "members": 221,
      "complete44": 163,
      "incomplete": 58,
      "pctComplete": 73.76,
      "gpaPass": 151,
      "gpaFail": 70,
      "pctGpa": 68.33,
      "statusDone": 5,
      "statusPending": 19,
      "pctStatus": 20.83
    },
    {
      "bu": "PMSg",
      "members": 418,
      "complete44": 324,
      "incomplete": 94,
      "pctComplete": 77.51,
      "gpaPass": 346,
      "gpaFail": 72,
      "pctGpa": 82.78,
      "statusDone": 2,
      "statusPending": 31,
      "pctStatus": 6.06
    },
    {
      "bu": "AAMg",
      "members": 254,
      "complete44": 122,
      "incomplete": 132,
      "pctComplete": 48.03,
      "gpaPass": 254,
      "gpaFail": 0,
      "pctGpa": 100,
      "statusDone": 18,
      "statusPending": 30,
      "pctStatus": 37.5
    },
    {
      "bu": "RPLCg",
      "members": 45,
      "complete44": 16,
      "incomplete": 29,
      "pctComplete": 35.56,
      "gpaPass": 33,
      "gpaFail": 12,
      "pctGpa": 73.33,
      "statusDone": 11,
      "statusPending": 32,
      "pctStatus": 25.58
    },
    {
      "bu": "RAFCOg",
      "members": 319,
      "complete44": 289,
      "incomplete": 30,
      "pctComplete": 90.6,
      "gpaPass": 273,
      "gpaFail": 46,
      "pctGpa": 85.58,
      "statusDone": 37,
      "statusPending": 17,
      "pctStatus": 68.52
    },
    {
      "bu": "CPDg",
      "members": 240,
      "complete44": 88,
      "incomplete": 152,
      "pctComplete": 36.67,
      "gpaPass": 184,
      "gpaFail": 56,
      "pctGpa": 76.67,
      "statusDone": 19,
      "statusPending": 3,
      "pctStatus": 86.36
    },
    {
      "bu": "รวม",
      "members": 1497,
      "complete44": 1002,
      "incomplete": 495,
      "pctComplete": 66.93,
      "gpaPass": 1241,
      "gpaFail": 256,
      "pctGpa": 82.9,
      "statusDone": 92,
      "statusPending": 132,
      "pctStatus": 41.07
    }
  ]
};
window.P5_TEST_DATA = window.P5_DATA;
