# 📋 P5 Training Register — Deploy Guide (5 ขั้นตอน)

> 🎯 เป้าหมาย: Deploy Apps Script + เชื่อม HTML → Google Sheet จริง

---

## ✅ ขั้นที่ 1: สร้าง Google Sheet ใหม่ (30 วินาที)

1. ไปที่ https://sheets.google.com → คลิก **+ Blank** (สร้างใหม่)
2. ตั้งชื่อ: `P5_Training_Register_2026` (หรือชื่อที่ลูกหมีชอบ)
3. **คัดลอก Sheet URL** ไว้ → จะใช้ในขั้นที่ 3

> 💡 URL จะอยู่ในรูปแบบ: `https://docs.google.com/spreadsheets/d/xxxxxxxxxx/edit`

---

## ✅ ขั้นที่ 2: เปิด Apps Script Editor (30 วินาที)

1. ใน Sheet ที่เพิ่งสร้าง → คลิกเมนู **Extensions** → **Apps Script**
2. จะเปิดหน้า Apps Script editor ใน tab ใหม่
3. ลบ code เดิมในไฟล์ `Code.gs` ทิ้งทั้งหมด

---

## ✅ ขั้นที่ 3: Paste Code จาก AliClaw (1 นาที)

1. เปิดไฟล์ `Code.gs` ที่ AliClaw เตรียมไว้ (อยู่ใน zip)
2. **Copy ทั้งหมด** (Ctrl+A → Ctrl+C)
3. **Paste** ลงใน Apps Script editor (Ctrl+V)
4. กดปุ่ม **💾 Save** (หรือ Ctrl+S)
5. ตั้งชื่อ project เช่น `P5_Backend`

---

## ✅ ขั้นที่ 4: Deploy เป็น Web App (1 นาที)

1. คลิกปุ่ม **Deploy** (มุมขวาบน) → **New deployment**
2. คลิกไอคอน ⚙️ (Settings) → เลือก **Web app**
3. ตั้งค่า:
   - **Description:** `P5 Training Register v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` ⚠️ ต้องเป็น Anyone เพื่อให้ HTML เรียกได้
4. กดปุ่ม **Deploy**
5. **Authorize access** → เลือกบัญชี Google → **Allow**
6. 🎉 **Copy Web App URL** ออกมา (จะอยู่ในกล่องขึ้นมา)

> 📌 URL จะอยู่ในรูปแบบ:  
> `https://script.google.com/macros/s/AKfycbz.../exec`

---

## ✅ ขั้นที่ 5: Paste URL ลงใน HTML (30 วินาที)

1. เปิดไฟล์ `P5-Dashboard-v7.6-RealSheet.html` ด้วย Text Editor (Notepad, VSCode, etc.)
2. กด **Ctrl+F** → หา `PASTE_YOUR_GAS_WEB_APP_URL_HERE`
3. **แทนที่ด้วย URL** ที่ copy มา
4. **Save** (Ctrl+S)
5. **ดับเบิลคลิก** ไฟล์ HTML เพื่อเปิดใน browser

---

## 🧪 ทดสอบ

1. เปิดเมนู **2.1 ลงทะเบียนหลักสูตร**
2. กรอกข้อมูล → กด **บันทึกข้อมูล**
3. ดู status bar:
   - 🟦 ส่งข้อมูลไป Google Sheet...
   - 🟢 **บันทึกสำเร็จ! Row #2 ใน Sheet: ...**
4. กลับไปดู Google Sheet → จะเห็นข้อมูลปรากฏที่ row 2 (row 1 คือ header)

---

## 🎯 สรุปขั้นตอน

| ขั้น | งาน | เวลา |
|---|---|---|
| 1 | สร้าง Sheet | 30 วินาที |
| 2 | เปิด Apps Script | 30 วินาที |
| 3 | Paste Code.gs | 1 นาที |
| 4 | Deploy Web App | 1 นาที |
| 5 | Paste URL ใน HTML | 30 วินาที |
| **รวม** | | **~3-4 นาที** |

---

## ❓ ถ้าเจอปัญหา

### ❌ "Failed to fetch" / CORS error
→ ตรวจสอบว่า Deploy เป็น **Anyone** (ไม่ใช่ "Anyone with Google account")

### ❌ "Invalid JSON"
→ ตรวจสอบว่า URL ถูก paste ครบ (ไม่ขาดตัวอักษร)

### ❌ "Missing required fields"
→ กรอกข้อมูลให้ครบทุกช่องที่มี * (ดาวแดง)

### ❌ บันทึกแล้วแต่ Sheet ไม่ขึ้น
→ กด **F5** refresh Sheet → รอ 5-10 วินาที

---

## 🔧 โครงสร้าง Sheet (29 columns)

| Col | ชื่อ | Source |
|---|---|---|
| A | Timestamp | Auto (เวลาบันทึก) |
| B | ชื่อหลักสูตร | courseName |
| C | รหัสสมาชิก | producerId |
| D | ชื่อ | firstName (auto-fill) |
| E | นามสกุล | lastName (auto-fill) |
| F | หลักสูตรประจำธุรกิจ | businessCourse |
| G | กลุ่มหลักสูตร | courseGroup |
| H | ประเภทหลักสูตร | courseType |
| I | 3 ผ่าน | threePass (auto) |
| J | หน่วยกิต | credit (auto) |
| K | ที่มาหลักสูตร | courseSource |
| L | รูปแบบการอบรม | trainingStyle |
| M | รูปแบบการประเมิน | evalStyle |
| N | ช่วงอายุ | ageRange |
| O | ความสามารถที่เก่ง | competency |
| P | สถานะหลักสูตร | courseStatus |
| Q | เป้าหมายประจำปี | yearlyTarget |
| R | ประเภทหลักสูตร (ประเมิน) | courseType2 |
| S | ผลลัพท์ภาพรวม | resultOverall |
| T | ผลลัพท์ (1) | result1 |
| U | KPI (1) | kpi1 |
| V | ผลลัพท์ (2) | result2 |
| W | KPI (2) | kpi2 |
| X | ผลลัพท์ (3) | result3 |
| Y | KPI (3) | kpi3 |
| Z | เนื้อหา 1 | content1 |
| AA | เนื้อหา 2 | content2 |
| AB | เนื้อหา 3 | content3 |
| AC | ข้อสอบ | exam |

---

📌 **AliClaw ตี๋พร้อมช่วยเสมอครับ ถ้ามีปัญหาในขั้นตอนไหน ส่งรูปมาดูได้เลย!**
