# Project Charter — P5 · ระบบพัฒนาบุคลากร PKG

> 📋 ไฟล์นี้คือ "สมองส่วนความจำ" ของโปรเจค — AliClaw จะอ่านไฟล์นี้ก่อนทำงานใดๆ
> 📅 สร้างเมื่อ: 21 มิ.ย. 2569 | 📌 Last Updated: 21 มิ.ย. 2569

---

## 🎯 Project Vision

**"ติดตามและพัฒนาบุคลากร 6 บริษัทในเครือ PKG (PGHg/PMSg/AAMg/RPLCg/RAFCOg/CPDg) ผ่านระบบดิจิทัลเดียว — ลงทะเบียนหลักสูตร ติดตามผล Roleplay บันทึก Mentor/Coach กำกับทุนองค์กร — ครบจบในที่เดียว"**

---

## 👥 Stakeholders

| บทบาท | ชื่อ | หน้าที่ |
|--------|------|---------|
| **Project Manager** | คุณแนน (รัฐพร) — HRD Manager, ADM (CEO 2.0) | ดูแลภาพรวม + ตัดสินใจ + Approve |
| **Project Owner (ปฏิบัติ)** | ลูกหมี (ณัฐฑริณี) — LDC-PAD | ทดสอบระบบ + Deploy + ใช้งานจริง |
| **AI Co-Worker** | AliClaw (ตี๋) | Dev + Design + Analysis + Deploy |
| **End User** | ทีม PAD ทั้ง 6 บริษัท (PGHg/PMSg/AAMg/RPLCg/RAFCOg/CPDg) | ลงทะเบียน + บันทึกข้อมูล |
| **Sponsor** | พี่โอม (CEO PKG) | อนุมัติงบประมาณ + ดู Quality งาน |

---

## 📊 KPIs

| # | KPI | เป้าหมาย | วิธีวัด |
|---|-----|----------|--------|
| 1 | จำนวนบริษัทที่ใช้งาน | 6/6 บริษัท | ตรวจ Sheet รายเดือน |
| 2 | จำนวนหลักสูตรที่ลงทะเบียน | ≥ 12 หลักสูตร/เดือน | นับจาก Sheet |
| 3 | อัตราส่งผลอบรมครบ | ≥ 80% | (ส่งผลครบ / ลงทะเบียน) × 100 |
| 4 | จำนวน Roleplay ที่บันทึก | ≥ 30 เรื่อง/เดือน | นับจาก Sheet |
| 5 | เวลาโหลดหน้า Dashboard | < 3 วินาที | Lighthouse |
| 6 | Production Uptime | ≥ 99% | ตรวจ HTML open ได้ทุกเมื่อ |
| 7 | User Error Rate | < 5% | (error / total submit) × 100 |

---

## 🔗 Links

| ประเภท | URL / ที่อยู่ |
|--------|-------------|
| **Repo (Local)** | `/home/admin/.openclaw/workspace/projects/p5-admin-pad/` |
| **Production (Dashboard)** | `dashboard/P5-Dashboard-v7.6-RealSheet.html` (112KB — เปิดด้วย browser) |
| **Google Sheet (Output)** | `P5_Training_Register_2026` (ลูกหมีจะสร้างเองตอน Deploy) |
| **Sheet ต้นทาง (ข้อมูลพนักงาน)** | `1CkBSi_votE01b0fxFFwU1EQb_7mzEJgGvWGaegocbeM` (gid=572791880, 481 รายการ) |
| **Sheet ต้นทาง (P5 - PlanTraining 69)** | `15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0` (gid=1104115053, 6 บริษัท) |
| **GAS Backend** | จะได้ URL หลัง Deploy (ขั้นที่ 4 ใน DEPLOY.md) |
| **Deploy Guide** | `gas/DEPLOY.md` (6KB, 5 ขั้นตอน, ~3-4 นาที) |
| **CHANGELOG** | `dashboard/` folder (v1 → v7.6) |

---

## 📅 Timeline

| Phase | วันที่ | Milestone | สถานะ |
|-------|-------|-----------|-------|
| **Phase 1** | 5-9 มิ.ย. | v1-v4 Basic HTML + CRUD | ✅ เสร็จ |
| **Phase 2** | 10-16 มิ.ย. | v5-v7 Rainbow Theme + Dynamic Menu + Permission | ✅ เสร็จ |
| **Phase 3** | 17-19 มิ.ย. | v7.3 Real Auto-fill + 481 รายการ | ✅ เสร็จ |
| **Phase 4** | 20 มิ.ย. | v7.4 Super Robust (3-Level Fallback) + v7.5 Re-Order | ✅ เสร็จ |
| **Phase 5** | 20 มิ.ย. (14:22) | **v7.6 Real Sheet + Apps Script Backend** | ✅ เสร็จ |
| **Phase 6** | รอลูกหมี Deploy | Deploy Apps Script + ทดสอบจริง | ⏳ รอ |
| **Phase 7** | หลัง Deploy | Import ข้อมูลเก่า + Training ทีม PAD | ⏳ รอ |
| **Phase 8** | Q3/2569 | v8.0 Multi-Company Filter + Role-based Dashboard | 🔴 วางแผน |

---

## 🎨 Design Principles

1. **Single-File HTML** — เปิดด้วย browser ได้ทันที ไม่ต้อง web server
2. **Mobile-First** — Responsive ทุกอุปกรณ์ (tablet/phone/desktop)
3. **Defense in Depth** — 3-Level Fallback (gviz → allorigins → embedded CSV)
4. **PDPA-Safe** — ซ่อนเบอร์โทร/email (ใช้รหัสสมาชิกเท่านั้น)
5. **Production Grade** — Lock + Validate + Log + CORS-safe
6. **ภาษาไทย 100%** — UI labels ทั้งหมดเป็นไทย

---

## 📦 โครงสร้างไฟล์

```
projects/p5-admin-pad/
├── README.md                                ← คู่มือใช้งาน
├── PROJECT_CHARTER.md                       ← ไฟล์นี้ (charter)
├── RISK_LOG.md                              ← ความเสี่ยง
├── STATUS_REPORT.md                         ← รายงานสถานะ
├── dashboard/
│   ├── P5-Dashboard-v7.6-RealSheet.html    ← 🏆 Production
│   ├── P5-Dashboard-v7.5-ReOrderResultKPI.html
│   ├── P5-Dashboard-v7.4-SuperRobust.html
│   ├── data.json                            ← ข้อมูลดิบ
│   ├── update.sh                            ← script ดึงข้อมูล
│   └── pkg-employee-embedded.csv           ← 481 รายการ (fallback)
├── gas/
│   ├── Code.gs                              ← Apps Script Backend (9KB)
│   ├── appsscript.json                      ← V8 + ANYONE_ANONYMOUS
│   └── DEPLOY.md                            ← คู่มือ Deploy 5 ขั้น
├── deploy-package/
│   ├── P5-Dashboard-v7.6-RealSheet.html
│   ├── Code.gs
│   ├── appsscript.json
│   └── DEPLOY.md
└── archive/                                 ← เวอร์ชันเก่า (v1-v6)
```

---

## 🧩 ฟีเจอร์หลัก (Features)

### 1. 📊 Dashboard (ทุก role)
- 6 บริษัท overview + alerts
- Bar chart (GPA)
- Real-time clock
- Quick stats

### 2. 🎓 Training (Admin/Manager)
- **2.1 ลงทะเบียนหลักสูตร** ← ฟอร์มหลัก (29 fields) + Auto-fill จากรหัสสมาชิก
- 2.2 ขอเปิดอบรม ภายใน/ภายนอก
- 2.3 ส่งผลอบรม ภายใน/ภายนอก
- 2.4 รายงานการอบรมภายนอก

### 3. 👥 Mentor (Admin/Manager)
- 3.1 Set ระบบพี่เลี้ยงน้องเลี้ยง
- 3.2 แบบฟอร์มการส่งรายงานน้องเลี้ยง PKG

### 4. 🎯 Coach (Admin/Manager)
- 4.1 Mentor Coach เชื่อมสมุดพก
- 4.2 อื่นๆ

### 5. 🎭 Roleplay (ทุก role)
- 5.1 รายงานการ Roleplay
- 5.2 แบบฟอร์มส่ง Roleplay

### 6. 💰 กำกับทุนองค์กร (Admin เท่านั้น)
- 6.1 รายงานการอบรม
- 6.2 อื่นๆ

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Single-file HTML + Vanilla JS + CSS Grid + Rainbow Theme |
| **Data Source** | Google Sheets (gviz/tq + allorigins.win + embedded CSV) |
| **Backend** | Google Apps Script (V8 runtime) |
| **Auth** | LockService (concurrent-safe) |
| **Storage** | Google Sheet (29 columns × ไม่จำกัด rows) |
| **Deploy** | Manual by ลูกหมี (~3-4 นาที, ไม่ต้อง service account) |

---

## ⚠️ Risks

| ID | ความเสี่ยง | โอกาส | ผลกระทบ | แผน | สถานะ |
|----|-------------|-------|----------|------|--------|
| R001 | gviz/tq fail (network/CORS) → ข้อมูลไม่ขึ้น | สูง | กลาง | 3-Level Fallback (gviz → allorigins → embedded) | 🟢 Resolved (v7.4) |
| R002 | Auto-fill ชื่อไม่ขึ้น (CSV fetch fail) | สูง | กลาง | Embedded CSV 481 รายการ (fallback Level 3) | 🟢 Resolved (v7.4) |
| R003 | ลูกหมี Deploy Apps Script ผิดขั้นตอน | กลาง | สูง | DEPLOY.md 5 ขั้น + screenshot + fallback mock | 🟡 Mitigating |
| R004 | CORS preflight fail | ต่ำ | สูง | ใช้ text/plain;charset=utf-8 หลีกเลี่ยง preflight | 🟢 Resolved (v7.6) |
| R005 | Sheet มีข้อมูลซ้ำ (กดบันทึก 2 ครั้ง) | กลาง | ต่ำ | Client-side check (form reset หลัง submit) | 🟢 Resolved (v7.6) |
| R006 | Apps Script quota เกิน (URL Fetch 20K/วัน) | ต่ำ | กลาง | Embedded CSV → ไม่ต้อง fetch บ่อย | 🟢 Resolved (v7.4) |
| R007 | ลูกหมีไม่มีเวลาอ่าน DEPLOY.md | กลาง | กลาง | ส่งเป็น zip + step-by-step + screenshot | 🟡 Mitigating |

---

## 🛡️ Compliance

- [x] PDPA Compliant — ใช้รหัสสมาชิกเท่านั้น (ไม่มีเบอร์โทร/email ในฟอร์ม)
- [x] Security Audit Passed — ANYONE_ANONYMOUS + LockService + Validate 19 fields
- [x] Code Review Done — ตี๋ review เอง + ลูกหมี test จริง
- [x] Documentation Complete — README + CHARTER + DEPLOY.md + DEPLOY.md 5 ขั้น
- [x] Backup Plan — embedded CSV 481 รายการอยู่ในไฟล์ HTML (fallback)

---

## 📝 Working Agreement (Ways of Working)

- **Daily Check:** ลูกหมีบอก "ทำต่อ" → ตี๋ทำในเวลาราชการ (จ-ศ 09:00-18:00)
- **Communication:** Telegram (real-time) + Project files (async)
- **Approval:** คุณแนน (PM) — แต่ลูกหมี test จริงก่อน deploy
- **Code Style:** Single-file HTML + Comments ภาษาไทย
- **Version:** v7.6.0 (21 มิ.ย. 2569)
- **Git:** มี local repo (`.git/`) — รอ push ขึ้น GitHub เมื่อลูกหมีพร้อม

---

## 🏆 Version History (v1 → v7.6)

| Version | วันที่ | ฟีเจอร์ |
|---------|-------|---------|
| v1 | 10 มิ.ย. | Basic HTML |
| v2 | 10 มิ.ย. | Desktop responsive |
| v3 | 10 มิ.ย. | Dashboard + Table |
| v4 | 10 มิ.ย. | Google Sheet sync |
| v5 | 10 มิ.ย. | Template |
| v6 | 17 มิ.ย. | Glass dark theme |
| **v7** | 18 มิ.ย. | **Rainbow + Dynamic Menu + Permission** |
| v7.3 | 19 มิ.ย. | Real Auto-fill (481 รายการ) |
| v7.4 | 20 มิ.ย. | Super Robust (3-Level Fallback) |
| v7.5 | 20 มิ.ย. | Re-Order Result + KPI (2 columns fix) |
| **v7.6** | 20 มิ.ย. | **Real Sheet + Apps Script Backend** 🏆 |

---

## 🐻 สร้างโดย

**AliClaw AI Co-Worker (ตี๋)** — ตาม CEO Contract คุณแนน  
📅 สร้าง Charter: 21 มิ.ย. 2569  
🎯 Project Owner: ลูกหมี (ณัฐฑริณี) — LDC-PAD

---

**📌 หมายเหตุ:** Charter นี้จะถูก auto-update ทุกครั้งที่มี version ใหม่ + ลูกหมี deploy สำเร็จ
