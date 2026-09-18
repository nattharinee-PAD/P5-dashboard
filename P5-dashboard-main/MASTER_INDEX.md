# 📚 P5 — Master Index (งานทั้งหมด)

> สร้างโดย AliClaw 🐾 10 มิ.ย. 2569
> ลูกหมี (ณัฐฑริณี) · Telegram ID 2081375433

---

## 💾 Memory Notes (สำหรับทุกครั้งที่เรียกใช้)

> ⚠️ **ลูกหมีสั่งการ (10 มิ.ย. 2569):** บันทึก Memory ลงโปรเจคงานชื่อ **P5 · ระบบพัฒนาบุคลากร PKG** — ส่วนที่ 1 Dashboard เวลาเรียกใช้ต้องมีข้อมูลครบถ้วน

**กฎการแสดงผล Dashboard:**
- ทุกครั้งที่ลูกหมีเรียกใช้ / เปิดเว็บ → ต้องแสดงข้อมูล **ครบถ้วน 5 Rows**
- ข้อมูลดึงจาก Google Sheet ลูกหมี (Real-time)
- ถ้าข้อมูลบางส่วนยังไม่มี → แสดงเป็น 0 / "รอข้อมูล" (อย่าซ่อน)
- **ห้าม** แสดงหน้าว่างเปล่า
- ถ้า sync error → แสดง fallback จาก cache + แจ้งเตือน

---

## 🎯 ภาพรวมโปรเจค P5

| เรื่อง | คำอธิบาย |
|---|---|
| **ชื่อโปรเจค** | P5 — ระบบพัฒนาสมาชิก PKG (PAD-02) |
| **ประเภท** | Web Dashboard + Google Sheet Integration |
| **Tech Stack** | HTML + CSS (Glassmorphism Dark) + Vanilla JS + Google Apps Script |
| **ผู้ใช้** | HRD Manager (ลูกหมี) ดูแลพัฒนาสมาชิก PKG |
| **Sheet ต้นทาง** | `15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0` (Sheet ของลูกหมี) |
| **Live URL (Bore)** | `http://bore.pub:41515/p5.html` (เปลี่ยน port บ่อย) |
| **Live URL (Cloudflare)** | `https://venue-quantity-candle-moved.trycloudflare.com/p5.html` |
| **Google Sheet** | `https://docs.google.com/spreadsheets/d/15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0` |
| **Apps Script** | `https://script.google.com/macros/s/AKfycbwumlA99bfJOQgbuw5CrwfOLZRu3kuTtzIWJasEZe037BMHFhYSUuUWXKu69gyVca1UDg/exec` |

---

## 📋 ประวัติเวอร์ชัน (Changelog)

### v0.1.0 — Misunderstood ❌ (10 มิ.ย. 2569 09:48)
**สถานะ:** เก็บเป็น archive
- ตี๋เข้าใจผิด ออกแบบ Dashboard ภาพรวม HRD ทั้งองค์กร
- ไม่ตรงกับงาน P5 จริงของลูกหมี
- **เก็บไว้:** `archive/v0.1.0-misunderstood/`

### v0.2.0 — Login Version 🟡 (10 มิ.ย. 2569 11:02)
**สถานะ:** เก็บเป็น archive
- มีหน้า Login (ADMIN PAD / BMC / รหัสสมาชิก)
- Sidebar 7 เมนู (Dashboard, Training, Mentor, Coach, Roleplay, กำกับทุน, อื่นๆ)
- ธีม PKG เขียว-ทอง
- **เก็บไว้:** `archive/v0.2.0-login/`

### v0.3.0 — Glassmorphism Dark 🎨 (10 มิ.ย. 2569 11:09) ⭐ **ภาพที่ลูกหมีชอบ!**
**สถานะ:** ตี๋เก็บไว้ในหัวใจ ❤️
- **ตัดหน้า Login ออก** ✅
- Glassmorphism Dark Theme + Animated Blobs
- Tab Navigation 7 เมนู
- Hero + KPI Cards 6 ใบ
- Donut Chart (5 BU) + Bar Charts
- **Screenshot นี้คือสิ่งที่ลูกหมีชอบที่สุด** (อัปโหลดเมื่อ 12:39)

### v0.4.0 — Real-time Google Sheet Sync 🟢 (10 มิ.ย. 2569 11:33)
- เชื่อมต่อ Google Sheet ลูกหมี
- Auto-sync ทุก 30 วินาที
- Live indicator + Last update
- Cache fallback

### v0.5.0 — Multi-Tab Template 📋 (10 มิ.ย. 2569 11:55)
- 11 CSV Templates + README
- Config Modal ใส่ GIDs
- Schema มาตรฐาน (Date/Status/Owner/UpdatedDate)

### v1.0 — CRUD + 2-Way Sync 🔌 (10 มิ.ย. 2569 12:18) ⭐ **ปัจจุบัน**
- ✅ CRUD UI (Add/Edit/Delete) ทุก Section
- ✅ Apps Script Code.gs (Backend)
- ✅ API Client (p5-api.js)
- ✅ Toast notifications
- ✅ Config Modal ใส่ Apps Script URL
- ✅ 6 KPI Cards + 5 charts + 7 sections

---

## 📊 ข้อมูลจริงที่ลูกหมีป้อนให้ตี๋

### 📚 Training (5 BU) — 10 มิ.ย. 2569
| BU | สมาชิก | ครบ 44 | GPA ผ่าน | % ครบ | % GPA |
|---|---|---|---|---|---|
| **PMSg** | 173 | 172 | 165 | 🟢 99.42% | 🟢 95.38% |
| **AAMg** | 100 | 98 | 100 | 🟢 98.00% | 🟢 100.00% |
| **RPLCg** | 31 | 13 | 31 | 🔴 41.94% | 🟢 100.00% |
| **RAFC0g** | 22 | 3 | 20 | 🔴 13.64% | 🟡 90.91% |
| **CPDg** | 33 | 15 | 26 | 🔴 45.45% | 🟡 78.79% |
| **รวม** | **359** | **301** | **342** | **83.84%** | **95.26%** |

### 🎭 Roleplay — 100% (55/55 ทีม)
### 👥 Mentor — 32 คน (0 ผ่าน ≥90% — มีหมายเหตุ)
### 🎯 Coach — 100% (58/58 คน)

### 📋 AP / BP / LL / II / XP
- **AP:** 9 ข้อ (Action Plan)
- **BP:** 2 ข้อ (Best Practice)
- **LL:** 3 ข้อ (Lesson Learned)
- **II:** 1 ข้อ (Innovation)
- **XP:** 2 ข้อ (eXperience)

### 💬 Daily Comments
- 4 รายการ (เกี่ยวกับ Coach AGS/21CT/OBM + Future Skill)

---

## 📂 โครงสร้างไฟล์ปัจจุบัน

```
projects/p5-admin-pad/          (3.2 MB)
│
├── 🌟 p5.html                  (8 KB) — หน้าเว็บหลัก
├── 🌟 p5-style.css             (36 KB) — Glassmorphism Dark
├── 🌟 p5-app.js                (36 KB) — App + CRUD
├── 🌟 p5-sheet-sync.js         (16 KB) — Multi-tab Sheet sync
├── 🌟 p5-api.js                (4 KB) — Apps Script API client
├── data/
│   └── p5-data.js              (10 KB) — Mock fallback
│
├── apps-script/                (24 KB) ⭐ Backend
│   ├── Code.gs                 Google Apps Script (CRUD)
│   └── README.md               คำแนะนำ Deploy
│
├── template/                   (56 KB) ⭐ Template CSV
│   ├── README.md
│   ├── 00_META.csv             9 แถว
│   ├── 01_TRAINING.csv         2 เดือน
│   ├── 02_ROLEPLAY.csv         4 metrics
│   ├── 03_MENTOR.csv           5 metrics + note
│   ├── 04_COACH.csv            4 metrics
│   ├── 05_AP.csv               9 actions
│   ├── 06_BP.csv               2 best practices
│   ├── 07_LL.csv               3 lessons
│   ├── 08_II.csv               1 innovation
│   ├── 09_XP.csv               2 experiences
│   └── 10_DAILY_COMMENTS.csv   4 comments
│
├── assets/fonts/               (1.6 MB) — Sarabun + Inter
│
├── archive/                    (1.6 MB) — เก็บงานเก่า
│   ├── v0.1.0-misunderstood/   6 ไฟล์
│   └── v0.2.0-login/           3 ไฟล์
│
├── docs/                       (4 KB) — เอกสาร
├── README.md                   (4 KB) — คู่มือหลัก
│
└── 📸 Screenshots:
    ├── p5-v2-desktop.png       (v0.2.0 - Login)
    ├── p5-v3-desktop.png       (v0.3.0 - Glassmorphism)
    ├── p5-v3-dashboard.png     (v0.3.0 - กับข้อมูลจริง)
    ├── p5-v3-table.png         (v0.3.0 - Table format)
    ├── p5-v4-sheet.png         (v0.4.0 - Sheet sync)
    ├── p5-v5-template.png      (v0.5.0 - Template)
    ├── p5-v1-crud.png          (v1.0 - CRUD)
    └── p5-current.png          (ปัจจุบัน)
```

---

## 🔗 ลิ้งค์สำคัญ

| ลิ้งค์ | คำอธิบาย |
|---|---|
| 👉 **https://venue-quantity-candle-moved.trycloudflare.com/p5.html** | **เว็บ P5 v1.0 (ปัจจุบัน)** |
| 📊 https://docs.google.com/spreadsheets/d/15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0 | Google Sheet ของลูกหมี |
| 📜 https://venue-quantity-candle-moved.trycloudflare.com/apps-script/Code.gs | Apps Script Backend |

---

## ✨ Features ที่ทำเสร็จ

| Feature | สถานะ |
|---|---|
| 🎨 Glassmorphism Dark Theme | ✅ |
| 📊 Donut/Bar Charts (Custom SVG) | ✅ |
| 📚 Training 5 BU + Table | ✅ |
| 👥 Mentor 3 กลุ่ม (เดิม) | ⏸️ รอข้อมูลจริง |
| 🎯 Coach 5 BU (เดิม) | ⏸️ รอข้อมูลจริง |
| 🎭 Roleplay (เดิม) | ⏸️ รอข้อมูลจริง |
| 🏛️ กำกับทุน 6 ระดับ (เดิม) | ⏸️ รอข้อมูลจริง |
| 🟢 Real-time Sheet Sync (30s) | ✅ |
| 🔌 CRUD (Add/Edit/Delete) ทุก Section | ✅ |
| ⚙️ Config Modal (Sheet ID + Apps Script URL) | ✅ |
| 🔔 Toast Notifications | ✅ |
| 📱 Responsive (Desktop/Tablet/Mobile) | ✅ |
| 🌐 ฟอนต์ไทย Sarabun local | ✅ |
| 💾 Cache fallback | ✅ |
| 📜 Apps Script Backend | ✅ (รอลูกหมี Deploy) |

---

## 🐾 สิ่งที่ลูกหมีต้องทำ (Next Steps)

### 1. 🚀 Deploy Apps Script (3 นาที)
1. เปิด Google Sheet ลูกหมี
2. Extensions → Apps Script
3. ลบโค้ดเดิม → Copy โค้ดจาก URL → Paste → Save
4. Deploy → New deployment → Web app
5. Execute as: Me · Who has access: Anyone → Deploy
6. Copy Web App URL → ส่งให้ตี๋

### 2. 🔗 เชื่อมต่อ URL กับเว็บ
1. เปิดเว็บ P5
2. คลิก ⚙️ ตั้งค่า
3. วาง Apps Script URL
4. Save & Sync → พร้อมใช้ CRUD!

### 3. 🧪 ทดสอบ CRUD
- คลิก ➕ เพิ่มเดือน → กรอก → Save
- เปิด Google Sheet → เห็นข้อมูลใหม่

---

## 📅 Timeline (10 มิ.ย. 2569)

| เวลา | เหตุการณ์ |
|---|---|
| 09:48 | เริ่มงาน P5 — ตี๋เข้าใจผิด v0.1.0 |
| 11:02 | เปลี่ยนเป็น Login + Sidebar v0.2.0 |
| 11:09 | ลูกหมีบอก "ตัด Login + ปรับสวย" v0.3.0 |
| 11:18 | ลูกหมีชอบภาพ Dark Glassmorphism ❤️ |
| 11:26 | ลูกหมีส่งข้อมูล Training 5 BU จริง |
| 11:33 | ลูกหมีบอก "ทำในรูปแบบตารางที่ดูง่าย" |
| 11:38 | ลูกหมีส่ง Google Sheet URL (PAD-02) |
| 11:55 | สร้าง Template 11 CSV + Config Modal v0.5.0 |
| 12:13 | ลูกหมีสั่ง CRUD ทั้งหมด + ตี๋สร้าง Apps Script |
| 12:18 | P5 v1.0 พร้อม CRUD + Backend |
| 12:39 | **ลูกหมีส่งภาพ Dashboard ที่ชอบ** + ขอ "ค้นหาข้อมูลงานเดิม" ← ตอนนี้ |

---

**สร้างโดย AliClaw 🐾** · 10 มิ.ย. 2569 · ลูกหมี (ณัฐฑริณี) 💜
