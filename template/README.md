# 📊 P5 Template — Google Sheet for ลูกหมี

> สร้างโดย AliClaw 🐾 10 มิ.ย. 2569
> ใช้สำหรับ import เข้า Google Sheet เพื่อเชื่อมต่อกับเว็บ P5 Real-time

---

## 🚀 วิธี Import (3 ขั้นตอน)

### ขั้นที่ 1: สร้าง Google Sheet ใหม่
1. เปิด https://sheets.new
2. ตั้งชื่อ: **P5 — ระบบพัฒนาสมาชิก PKG (PAD-02)**

### ขั้นที่ 2: Import แต่ละ Tab
ทำซ้ำ 11 ครั้ง (1 tab ต่อไฟล์ CSV):

1. **คลิกขวา** ที่ Tab ด้านล่าง → **Rename** ตามชื่อ
2. **File → Import → Upload** เลือกไฟล์ CSV ที่ตรงกัน
3. **Import location:** `Replace current sheet`
4. **Separator type:** `Comma`
5. **คลิก Import data**

### ขั้นที่ 3: เชื่อมต่อกับเว็บ P5
1. **Share** → Anyone with the link can **View**
2. **Copy URL** ส่งให้ตี๋
3. ตี๋จะอัปเดต `p5-sheet-sync.js` ให้ดึงจาก 11 tabs แยกกัน

---

## 📋 รายการ 11 Tabs (ตามลำดับ)

| # | Tab Name | ไฟล์ | Header | แถว |
|---|---|---|---|---|
| 0 | **00_META** | `00_META.csv` | key, value, note | 9 |
| 1 | **01_TRAINING** | `01_TRAINING.csv` | Month, Planned, Done, Pending, Members, CheerPct, Note | 2 |
| 2 | **02_ROLEPLAY** | `02_ROLEPLAY.csv` | Metric, Value, Unit, Note | 4 |
| 3 | **03_MENTOR** | `03_MENTOR.csv` | Metric, Value, Unit, Note | 5 |
| 4 | **04_COACH** | `04_COACH.csv` | Metric, Value, Unit, Note | 4 |
| 5 | **05_AP** | `05_AP.csv` | No, Action, Owner, Status, DueDate, UpdatedDate | 9 |
| 6 | **06_BP** | `06_BP.csv` | No, BestPractice, Owner, Status, UpdatedDate | 2 |
| 7 | **07_LL** | `07_LL.csv` | No, LessonLearned, Owner, Status, UpdatedDate | 3 |
| 8 | **08_II** | `08_II.csv` | No, Innovation, Owner, Status, UpdatedDate | 1 |
| 9 | **09_XP** | `09_XP.csv` | No, Experience, Owner, Status, UpdatedDate | 2 |
| 10 | **10_DAILY_COMMENTS** | `10_DAILY_COMMENTS.csv` | Date, Author, Comment, Category | 4 |

**Total: 45 แถวข้อมูล** (import ง่าย ไม่หลุด)

---

## 🎨 Schema Details

### 📐 Column Standards (ใช้ร่วมกัน)

| Column | Type | ใช้ใน Tab | คำอธิบาย |
|---|---|---|---|
| `Date` | YYYY-MM-DD | Comments, AP/BP/LL/II/XP | วันที่บันทึก |
| `No` | 1, 2, 3... | AP, BP, LL, II, XP | ลำดับข้อ |
| `Status` | In Progress / Done / Active | AP, BP, LL, II, XP | สถานะปัจจุบัน |
| `Owner` | ชื่อคน | AP, BP, LL, II, XP | ผู้รับผิดชอบ |
| `UpdatedDate` | YYYY-MM-DD | ทุก Tab | วันที่อัปเดตล่าสุด |
| `Note` | ข้อความ | META, ROLEPLAY, MENTOR | หมายเหตุเพิ่มเติม |

### 🎯 ประโยชน์ของ Schema ใหม่

1. ✅ **มี Header row** ทุก Tab — ดึงข้อมูลด้วย column name ได้
2. ✅ **มี Date/Status/Owner** — filter & sort ได้
3. ✅ **Type ชัดเจน** — Number, Text, Date
4. ✅ **ง่ายต่อการแก้** — ลูกหมีแก้แค่ cell ไม่ต้องนั่ง parse ข้อความ
5. ✅ **Audit Trail** — รู้ว่าใครอัปเดตเมื่อไหร่

---

## 🤖 หลัง Import เสร็จ

### ลูกหมีส่ง URL Sheet ใหม่ → ตี๋จะ:
1. ✅ อัปเดต `p5-sheet-sync.js` ให้ดึงจาก 11 GIDs
2. ✅ รองรับ Header row ในการ parse
3. ✅ เพิ่ม Date/Status filter
4. ✅ Deploy + Test

### ลูกหมีจะได้:
- 📊 Dashboard ที่ดึงจาก 11 tabs แยกกัน
- 🔄 Real-time sync ทุก 30 วินาที
- 📋 ตารางที่ filter/sort ได้
- 🟢 Live indicator + Last update
- 💾 Cache fallback

---

## 📂 โครงสร้างไฟล์ Template

```
projects/p5-admin-pad/template/
├── README.md                    (ไฟล์นี้)
├── 00_META.csv                  (9 แถว)
├── 01_TRAINING.csv              (2 เดือน)
├── 02_ROLEPLAY.csv              (4 metrics)
├── 03_MENTOR.csv                (5 metrics + note)
├── 04_COACH.csv                 (4 metrics)
├── 05_AP.csv                    (9 actions)
├── 06_BP.csv                    (2 best practices)
├── 07_LL.csv                    (3 lessons)
├── 08_II.csv                    (1 innovation)
├── 09_XP.csv                    (2 experiences)
└── 10_DAILY_COMMENTS.csv        (4 comments)
```

---

**สร้างโดย AliClaw 🐾** — ลูกหมี import แล้วส่ง URL มาให้ตี๋เชื่อมต่อนะครับ! 💜
