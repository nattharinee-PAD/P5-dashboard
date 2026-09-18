# 🚀 P5 — Google Apps Script Deploy Guide

> Backend สำหรับเว็บ P5 (PAD-02)
> สร้างโดย AliClaw 🐾 10 มิ.ย. 2569

---

## 📋 สิ่งที่ต้องเตรียม

1. ✅ Google Account (ของลูกหมี)
2. ✅ Google Sheet `15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0` (มีอยู่แล้ว)
3. ✅ ไฟล์ `Code.gs` (ในโฟลเดอร์นี้)

---

## 🚀 ขั้นตอน Deploy (5 นาที)

### ขั้นที่ 1: เปิด Apps Script
1. เปิด Google Sheet: https://docs.google.com/spreadsheets/d/15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0
2. เมนู **Extensions** → **Apps Script**
3. จะเปิดหน้า Editor ของ Apps Script

### ขั้นที่ 2: ใส่โค้ด
1. ลบโค้ดเดิมในไฟล์ `Code.gs` ทั้งหมด
2. **Copy โค้ดทั้งหมด** จากไฟล์ `Code.gs` ในโฟลเดอร์นี้
3. **Paste** ลงใน Editor
4. **💾 Save** (Ctrl+S)

### ขั้นที่ 3: Deploy เป็น Web App
1. คลิก **Deploy** (มุมบนขวา) → **New deployment**
2. คลิกไอคอน ⚙️ (齿轮) ข้าง "Select type" → เลือก **Web app**
3. ตั้งค่า:
   - **Description:** `P5 Backend v1.0`
   - **Execute as:** `Me` (ลูกหมี)
   - **Who has access:** `Anyone` ⚠️ **สำคัญ!**
4. คลิก **Deploy**
5. **Authorize access** → เลือก Google Account ลูกหมี → Allow
6. **Copy Web App URL** (ฟอร์แมท: `https://script.google.com/macros/s/AKfycb.../exec`)

### ขั้นที่ 4: ทดสอบ
เปิด URL ใน browser → จะเห็น JSON response:
```json
{
  "ok": true,
  "meta": {"lastSync": "2026-06-10T..."},
  "meta": {...},
  "training": {...},
  "roleplay": {...},
  ...
}
```

### ขั้นที่ 5: ใส่ URL ในเว็บ P5
1. เปิดเว็บ P5
2. คลิก **⚙️ ตั้งค่า** ที่ Hero
3. ใส่ **Apps Script URL** ในช่อง
4. Save & Sync

---

## 🧪 ทดสอบ API

### Read (GET)
```
https://script.google.com/macros/s/AKfycb.../exec?action=read
```

### Ping (GET) — ตรวจว่า URL ใช้ได้
```
https://script.google.com/macros/s/AKfycb.../exec?action=ping
```
→ Returns: `{"ok": true, "ts": "..."}`

### Add Row (POST)
```bash
curl -X POST "https://script.google.com/macros/s/AKfycb.../exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"add","tab":"01_TRAINING","data":{"Month":7,"Planned":15,"Done":0,"Pending":15,"Members":500,"CheerPct":0,"Note":"เดือน ก.ค."}}'
```

### Update Row (POST)
```bash
curl -X POST "https://script.google.com/macros/s/AKfycb.../exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"update","tab":"01_TRAINING","rowIndex":2,"data":{"Done":10}}'
```

### Delete Row (POST)
```bash
curl -X POST "https://script.google.com/macros/s/AKfycb.../exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","tab":"01_TRAINING","rowIndex":3}'
```

### Initialize Sheet (POST) — สร้าง 11 tabs
```bash
curl -X POST "https://script.google.com/macros/s/AKfycb.../exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"init"}'
```

---

## 📋 โครงสร้าง Tab ที่ Apps Script จัดการ

| Tab Key | Sheet Name | Header | ใช้กับ |
|---|---|---|---|
| `META` | `00_META` | key, value, note | Metadata |
| `TRAINING` | `01_TRAINING` | Month, Planned, Done, Pending, Members, CheerPct, Note | หลักสูตรอบรม |
| `ROLEPLAY` | `02_ROLEPLAY` | Metric, Value, Unit, Note | Roleplay |
| `MENTOR` | `03_MENTOR` | Metric, Value, Unit, Note | Mentor |
| `COACH` | `04_COACH` | Metric, Value, Unit, Note | Coach |
| `AP` | `05_AP` | No, Action, Owner, Status, DueDate, UpdatedDate | Action Plan |
| `BP` | `06_BP` | No, BestPractice, Owner, Status, UpdatedDate | Best Practice |
| `LL` | `07_LL` | No, LessonLearned, Owner, Status, UpdatedDate | Lesson Learned |
| `II` | `08_II` | No, Innovation, Owner, Status, UpdatedDate | Innovation |
| `XP` | `09_XP` | No, Experience, Owner, Status, UpdatedDate | eXperience |
| `DAILY_COMMENTS` | `10_DAILY_COMMENTS` | Date, Author, Comment, Category | บันทึกประจำวัน |

---

## 🔐 Security Notes

- **Execute as: Me** = Apps Script ทำงานในนามลูกหมี (มีสิทธิ์แก้ Sheet)
- **Who has access: Anyone** = ใครก็เรียก URL ได้ (แต่ทำได้แค่ในนามลูกหมี)
- ⚠️ **URL นี้ควรเก็บเป็นความลับ** — ใครได้ URL ก็แก้ Sheet ได้
- 💡 ถ้าต้องการความปลอดภัยเพิ่ม: ใส่ API Key check ใน doGet/doPost

---

## 🐛 Troubleshooting

### ❌ "Script function not found: doGet"
- ตรวจสอบว่า Save โค้ดแล้ว
- ลอง Deploy ใหม่ (Deploy → Manage deployments → ✏️ → New version)

### ❌ "You do not have permission"
- ตรวจสอบ "Who has access" = `Anyone`
- ตรวจสอบ "Execute as" = `Me`

### ❌ "Tab not found"
- รัน `initializeSheet()` ใน Apps Script Editor (Run ▶️)
- หรือเรียก API: `{"action":"init"}` ผ่าน POST

### ❌ CORS Error เวลาเรียกจากเว็บ
- Apps Script Web App ไม่มี CORS — แต่ Apps Script ตั้ง `ContentService.MimeType.JSON` ให้แล้ว
- ใช้ `mode: 'no-cors'` ใน fetch หรือส่งแบบ text/plain

---

## 🎯 Features ที่ได้

✅ **Read All** — ดึงข้อมูล 11 tabs พร้อมกัน
✅ **Add Row** — เพิ่มข้อมูล (เช่น เพิ่มเดือนใหม่ใน Training)
✅ **Update Row** — แก้ไขข้อมูล (เช่น เปลี่ยน Done จาก 27 → 30)
✅ **Delete Row** — ลบข้อมูล
✅ **Initialize** — สร้าง 11 tabs อัตโนมัติ (พร้อม header)
✅ **Real-time** — แก้ในเว็บ → Sheet อัปเดตทันที
✅ **Concurrent Safe** — ใช้ LockService ป้องกัน race condition

---

**สร้างโดย AliClaw 🐾** — Deploy เสร็จแล้วส่ง URL กลับมาให้ตี๋เชื่อมต่อครับ! 💜
