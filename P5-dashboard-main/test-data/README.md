# test-data — ข้อมูลทดสอบสังเคราะห์

⚠️ **ทุกอย่างในโฟลเดอร์นี้และในไฟล์ที่ถูก patch เป็นข้อมูลปลอม** สร้างจาก seed คงที่
ไม่ใช่ข้อมูลจริงของ PKG · **ห้าม merge branch `test-data` กลับ `main`**

## รัน

```bash
node test-data/gen.mjs
```

รันซ้ำได้ ผลลัพธ์เหมือนเดิมทุกครั้ง (seed = 20260918 ใน `gen.mjs`)

## สร้าง/เขียนทับอะไรบ้าง

| ไฟล์ | เนื้อหา |
|---|---|
| `test-data/summary.csv` | ตารางสรุป 6 BU + แถวรวม (แทน gid 473614158) |
| `test-data/training\|roleplay\|mentor\|coach.csv` | KPI `label,value,unit` ของแต่ละระบบ |
| `test-data/lg.csv` | Learning & Growth 5 ทุน × 6 BU |
| `test-data/employee.csv` | พนักงานปลอม 3,000 คน (รหัสขึ้นต้น `T` กันชนกับรหัสจริง) |
| `pkg-employee.csv` | สำเนาของ `employee.csv` |
| `data/p5-data.js` | `window.P5_DATA` ทั้งก้อน (ใช้โดย `p5.html`) |
| `dashboard/P5-Dashboard-v7.7-LayoutFont.html` | patch: URL ทั้ง 7 ชี้ CSV ในโฟลเดอร์นี้, `TR22_REQUESTS` 30 คำขอ, `EMPLOYEE_EMBEDDED_CSV`, แบนเนอร์ 🧪 TEST DATA |

## แก้ปริมาณข้อมูล

ใน `gen.mjs`: `EMP_N` (จำนวนพนักงาน), `length: 30` ของ `requests` (จำนวนคำขอ 2.2), `_s` (seed)
