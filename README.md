# P5 Admin Pad — ระบบพัฒนาบุคลากร PKG

Dashboard สำหรับทีม PAD ในการติดตามผลการฝึกอบรม 6 บริษัท (PGHg/PMSg/AAMg/RPLCg/RAFCOg/CPDg) — **Single-file HTML** เปิดดูได้ทันที

## 📁 ไฟล์หลัก

| ไฟล์ | คำอธิบาย |
|---|---|
| `dashboard/P5-Dashboard-v7-Open-Direct.html` | **Production** — embed ข้อมูลจริงทั้งหมด ไม่ต้อง web server |
| `dashboard/data.json` | ข้อมูลดิบจาก Google Sheet |
| `dashboard/update.sh` | Script ดึงข้อมูลจาก Google Sheet → อัปเดต `data.json` + `index.html` |
| `dashboard/index-standalone.html` | เวอร์ชันเก่า (ใช้สำหรับ dev เท่านั้น) |

## ✨ Features

- 🎨 **Rainbow Palette** 5 สี (Orange/Green/Blue/Purple/Pink)
- 🕐 **Real-time clock** — เวลามาตรฐานไทย (Asia/Bangkok) อัปเดตทุกวินาที
- 🍔 **Dynamic Menu** — เพิ่ม/ลดเมนูที่ `window.MENU_CONFIG` ได้
- 🔑 **Permission-based Rendering** — 3 ระดับ (Admin/Manager/Member)
- 🌓 **Light theme** + Sidebar dark indigo (contrast สูง)
- 📊 **6 Sections**: Dashboard / Training / Roleplay / Mentor / Coach / LG Matrix
- 📱 **Mobile-responsive**

## 🚀 วิธีใช้

### 1. เปิดดูข้อมูล (ผู้ใช้ทั่วไป)
1. โหลด `dashboard/P5-Dashboard-v7-Open-Direct.html`
2. Double-click เปิดด้วย browser (Chrome/Edge/Firefox)
3. เห็นข้อมูลทันที ไม่ต้อง Python/web server/CORS

### 2. อัปเดตข้อมูล (Admin)
```bash
cd dashboard
bash update.sh
# → ดึง CSV จาก Google Sheet + สร้าง HTML ใหม่
```

## 📋 โครงสร้างเมนู (Dynamic)

- 📊 **Dashboard** (ทุก role)
- 🎓 **Training** (Admin/Manager)
  - 2.1 ลงทะเบียนหลักสูตร
  - 2.2 ขอเปิดอบรม ภายใน/ภายนอก
  - 2.3 ส่งผลอบรม ภายใน/ภายนอก
  - 2.4 รายงานการอบรมภายนอก
- 👥 **Mentor** (Admin/Manager)
  - 3.1 Set ระบบพี่เลี้ยงน้องเลี้ยง
  - 3.2 แบบ From การส่งรายงานน้องเลี้ยง PKG
- 🎯 **Coach** (Admin/Manager)
  - 4.1 Menter Coach เชื่อมสมุดพก
  - 4.2 อื่นๆ
- 🎭 **Roleplay** (ทุก role)
  - 5.1 รายงานการ Roleplay
  - 5.2 แบบ From ส่ง Roleplay
- 💰 **กำกับทุนองค์กร** (Admin เท่านั้น)
  - 6.1 รายงานการอบรม
  - 6.2 อื่นๆ

## 🔐 Permissions

```js
window.PERMISSIONS = {
  admin:   [/* 18 เมนู ทั้งหมด */],
  manager: [/* 16 เมนู ไม่มี กำกับทุน */],
  member:  [/* 5 เมนู Dashboard + Roleplay */]
};
```

## 🛠️ แก้ไข

แก้ที่ `window.MENU_CONFIG` (เพิ่ม/ลด/แก้เมนู) → render อัตโนมัติ

## 📊 แหล่งข้อมูล

- Google Sheet: `1CkBSi_votE01b0fxFFwU1EQb_7mzEJgGvWGaegocbeM`
- 6 บริษัท: PGHg/PMSg/AAMg/RPLCg/RAFCOg/CPDg
- แผนก: PKG, Team: AWG PAC

## 📜 Version

- **v7** (18 มิ.ย. 2569) — Dynamic Menu + Permission + Real-time Clock + Rainbow Palette
- **v6** — Glass dark theme (เก่า)
- **v5** — Basic HTML

## 🐻 สร้างโดย

AliClaw AI Co-Worker — ตาม CEO Contract คุณแนน
