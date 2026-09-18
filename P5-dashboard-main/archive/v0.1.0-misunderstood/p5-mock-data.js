/**
 * P5 Mock Data — ระบบพัฒนาสมาชิก PKG
 * P5 = People Performance & Progress Platform
 * สร้างโดย AliClaw ตามคำสั่ง ลูกหมี (ณัฐฑริณี) 10 มิ.ย. 2569
 * 
 * ใช้สำหรับ Demo เท่านั้น — โครงสร้างข้อมูลตามมาตรฐาน PKG
 */

window.P5_DATA = {
  meta: {
    org: "PKG Group (Tri Petch Isuzu Sales)",
    platform: "P5 — People Performance & Progress Platform",
    philosophy: "6 รับ · 9 มาตรฐาน · 20 วัฒนธรรม · 9 บรรยากาศ · Servant Leadership",
    period: "Q2/2569 (เม.ย. - มิ.ย.)",
    totalMembers: 1042,
    activeMembers: 987,
    newThisQuarter: 38,
    retentionRate: 94.7
  },

  // ============================================================
  // 1️⃣ DONUT CHART: สัดส่วนสมาชิกตาม BU
  // ============================================================
  membersByBU: [
    { label: "ขาย (Sales)",          value: 312, color: "#7c5cff" },
    { label: "บริการหลังการขาย",    value: 248, color: "#22d3ee" },
    { label: "ชิ้นส่วน (Parts)",     value: 196, color: "#f472b6" },
    { label: "บัญชี/การเงิน",        value: 124, color: "#fbbf24" },
    { label: "ทรัพยากรบุคคล",        value:  89, color: "#34d399" },
    { label: "IT & Digital",         value:  73, color: "#fb7185" }
  ],

  // ============================================================
  // 2️⃣ DONUT CHART: ระดับการพัฒนา (6 รับ)
  // ============================================================
  developmentLevel: [
    { label: "รับ 6 — Servant Leader", value:  18, color: "#7c5cff" },
    { label: "รับ 5 — Strategic",      value:  47, color: "#22d3ee" },
    { label: "รับ 4 — Manager",        value: 132, color: "#34d399" },
    { label: "รับ 3 — Senior",         value: 286, color: "#fbbf24" },
    { label: "รับ 2 — Junior",         value: 341, color: "#f472b6" },
    { label: "รับ 1 — Newcomer",       value: 163, color: "#94a3b8" }
  ],

  // ============================================================
  // 3️⃣ BAR CHART: KPI 9 มาตรฐาน (คะแนนเฉลี่ย 0-100)
  // ============================================================
  standardsKPI: [
    { label: "1. การขาย",        value: 87, max: 100 },
    { label: "2. การบริการ",      value: 92, max: 100 },
    { label: "3. ความรู้ผลิตภัณฑ์", value: 78, max: 100 },
    { label: "4. การเงิน",         value: 84, max: 100 },
    { label: "5. การสื่อสาร",      value: 76, max: 100 },
    { label: "6. ความปลอดภัย",     value: 95, max: 100 },
    { label: "7. 5ส",             value: 88, max: 100 },
    { label: "8. ทักษะดิจิทัล",    value: 71, max: 100 },
    { label: "9. ทัศนคติองค์กร",   value: 89, max: 100 }
  ],

  // ============================================================
  // 4️⃣ BAR CHART: คะแนน 20 ข้อวัฒนธรรมองค์กร (Top 10)
  // ============================================================
  cultureTop10: [
    { label: "ซื่อสัตย์",          value: 94 },
    { label: "รับผิดชอบ",          value: 91 },
    { label: "ทำงานเป็นทีม",       value: 88 },
    { label: "ใส่ใจลูกค้า",         value: 90 },
    { label: "เรียนรู้ไม่หยุด",     value: 85 },
    { label: "คิดบวก",             value: 87 },
    { label: "ส่งมอบตรงเวลา",      value: 89 },
    { label: "ประหยัด",            value: 82 },
    { label: "ปลอดภัย",            value: 96 },
    { label: "เคารพผู้อื่น",        value: 92 }
  ],

  // ============================================================
  // 5️⃣ BAR CHART: กิจกรรมพัฒนารายเดือน (คนเข้าร่วม)
  // ============================================================
  monthlyActivities: [
    { label: "ม.ค.", value: 412 },
    { label: "ก.พ.", value: 487 },
    { label: "มี.ค.", value: 523 },
    { label: "เม.ย.", value: 498 },
    { label: "พ.ค.", value: 612 },
    { label: "มิ.ย.", value: 687 }
  ],

  // ============================================================
  // 6️⃣ KPI CARDS
  // ============================================================
  kpiCards: [
    {
      icon: "👥",
      title: "สมาชิกทั้งหมด",
      value: "1,042",
      delta: "+38",
      deltaLabel: "คนใหม่ไตรมาสนี้",
      trend: "up",
      gradient: "linear-gradient(135deg, #7c5cff 0%, #a78bfa 100%)"
    },
    {
      icon: "🎯",
      title: "KPI เฉลี่ย 9 มาตรฐาน",
      value: "85.6",
      delta: "+3.2",
      deltaLabel: "เทียบ Q1",
      trend: "up",
      gradient: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)"
    },
    {
      icon: "💜",
      title: "คะแนนวัฒนธรรม 20 ข้อ",
      value: "89%",
      delta: "+1.8%",
      deltaLabel: "เทียบ Q1",
      trend: "up",
      gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)"
    },
    {
      icon: "🚀",
      title: "Retention Rate",
      value: "94.7%",
      delta: "+2.1%",
      deltaLabel: "เทียบ Q1",
      trend: "up",
      gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
    }
  ],

  // ============================================================
  // 7️⃣ Recent Activities (Live Feed)
  // ============================================================
  recentActivities: [
    { time: "09:42", icon: "✅", text: "สมาชิก #M-1024 ผ่าน KPI ข้อ 1 (การขาย) — คะแนน 95", tag: "success" },
    { time: "09:18", icon: "📚", text: "หลักสูตร \"Servant Leadership 101\" — เปิดให้ลงทะเบียน", tag: "info" },
    { time: "08:55", icon: "🎉", text: "พี่อ๊อด เลื่อนระดับเป็น \"รับ 4 — Manager\"", tag: "celebrate" },
    { time: "08:30", icon: "📊", text: "อัปโหลดผลประเมิน Q2 — แผนกขาย ครบ 100%", tag: "info" },
    { time: "เมื่อวาน", icon: "🏆", text: "ทีมชิ้นส่วนคว้ารางวัล \"ทีมแห่งปี\" Q1", tag: "celebrate" }
  ]
};
