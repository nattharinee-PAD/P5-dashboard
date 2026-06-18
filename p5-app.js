/* ============================================================
   P5 v0.4.0 — App Logic (Real-time Google Sheet)
   AliClaw 🐾 — 10 มิ.ย. 2569
   ============================================================ */

(function () {
  'use strict';

  // Wait for P5_DATA (from sheet sync)
  function getData() { return window.P5_DATA; }

  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => new Intl.NumberFormat('th-TH').format(n || 0);

  // ---------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------
  // ============================================================
  // CRUD HANDLERS
  // ============================================================
  const CRUD_SCHEMAS = {
    TRAINING: {
      title: { add: '➕ เพิ่มเดือนอบรม', edit: '✏️ แก้ไขเดือนอบรม' },
      fields: [
        { key: 'Month',    label: 'เดือน (1-12)',      type: 'number' },
        { key: 'Planned',  label: 'แผนหลักสูตร',         type: 'number' },
        { key: 'Done',     label: 'เปิดอบรมแล้ว',        type: 'number' },
        { key: 'Pending',  label: 'รอส่งผล',             type: 'number' },
        { key: 'Members',  label: 'จำนวนสมาชิก',         type: 'number' },
        { key: 'CheerPct', label: 'Cheer up (%)',       type: 'number' },
        { key: 'Note',     label: 'หมายเหตุ',           type: 'text' }
      ]
    },
    AP: {
      title: { add: '➕ เพิ่ม Action Plan', edit: '✏️ แก้ไข Action Plan' },
      fields: [
        { key: 'No',          label: 'ลำดับ',         type: 'text' },
        { key: 'Action',      label: 'Action',         type: 'textarea' },
        { key: 'Owner',       label: 'ผู้รับผิดชอบ',    type: 'text' },
        { key: 'Status',      label: 'สถานะ',         type: 'select', options: ['In Progress', 'Done', 'Active'] },
        { key: 'DueDate',     label: 'กำหนดเสร็จ',     type: 'date' },
        { key: 'UpdatedDate', label: 'วันที่อัปเดต',     type: 'date' }
      ]
    },
    BP: {
      title: { add: '➕ เพิ่ม Best Practice', edit: '✏️ แก้ไข Best Practice' },
      fields: [
        { key: 'No', label: 'ลำดับ', type: 'text' },
        { key: 'BestPractice', label: 'Best Practice', type: 'textarea' },
        { key: 'Owner', label: 'ผู้รับผิดชอบ', type: 'text' },
        { key: 'Status', label: 'สถานะ', type: 'select', options: ['In Progress', 'Done', 'Active'] },
        { key: 'UpdatedDate', label: 'วันที่อัปเดต', type: 'date' }
      ]
    },
    LL: {
      title: { add: '➕ เพิ่ม Lesson Learned', edit: '✏️ แก้ไข Lesson Learned' },
      fields: [
        { key: 'No', label: 'ลำดับ', type: 'text' },
        { key: 'LessonLearned', label: 'Lesson Learned', type: 'textarea' },
        { key: 'Owner', label: 'ผู้รับผิดชอบ', type: 'text' },
        { key: 'Status', label: 'สถานะ', type: 'select', options: ['In Progress', 'Done', 'Active'] },
        { key: 'UpdatedDate', label: 'วันที่อัปเดต', type: 'date' }
      ]
    },
    II: {
      title: { add: '➕ เพิ่ม Innovation', edit: '✏️ แก้ไข Innovation' },
      fields: [
        { key: 'No', label: 'ลำดับ', type: 'text' },
        { key: 'Innovation', label: 'Innovation', type: 'textarea' },
        { key: 'Owner', label: 'ผู้รับผิดชอบ', type: 'text' },
        { key: 'Status', label: 'สถานะ', type: 'select', options: ['In Progress', 'Done', 'Active'] },
        { key: 'UpdatedDate', label: 'วันที่อัปเดต', type: 'date' }
      ]
    },
    XP: {
      title: { add: '➕ เพิ่ม Experience', edit: '✏️ แก้ไข Experience' },
      fields: [
        { key: 'No', label: 'ลำดับ', type: 'text' },
        { key: 'Experience', label: 'Experience', type: 'textarea' },
        { key: 'Owner', label: 'ผู้รับผิดชอบ', type: 'text' },
        { key: 'Status', label: 'สถานะ', type: 'select', options: ['In Progress', 'Done', 'Active'] },
        { key: 'UpdatedDate', label: 'วันที่อัปเดต', type: 'date' }
      ]
    },
    DAILY_COMMENTS: {
      title: { add: '💬 เขียน Comment ใหม่', edit: '✏️ แก้ไข Comment' },
      fields: [
        { key: 'Date',     label: 'วันที่',          type: 'date' },
        { key: 'Author',   label: 'ผู้เขียน',        type: 'text' },
        { key: 'Comment',  label: 'Comment',       type: 'textarea' },
        { key: 'Category', label: 'หมวด',           type: 'select', options: ['Coach', 'Training', 'Mentor', 'Other'] }
      ]
    }
  };

  let currentCRUD = null;

  window.openCRUDModal = function(tabKey, mode, rowIndex) {
    if (!window.P5_API?.hasUrl()) {
      showToast('⚠️ กรุณาตั้งค่า Apps Script URL ก่อน — คลิก ⚙️ ตั้งค่า', 'warn');
      $('#btnConfig')?.click();
      return;
    }
    const schema = CRUD_SCHEMAS[tabKey];
    if (!schema) return showToast('❌ ไม่รู้จัก tab: ' + tabKey, 'error');
    currentCRUD = { tabKey, mode, rowIndex };

    $('#crudTitle').textContent = schema.title[mode];
    const fieldsHtml = schema.fields.map(f => {
      const id = 'crudFld_' + f.key;
      const value = (mode === 'edit' && rowIndex) ? getRowValue(tabKey, rowIndex, f.key) : '';
      let input;
      if (f.type === 'select') {
        input = `<select id="${id}" class="cfg-input">${f.options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
      } else if (f.type === 'textarea') {
        input = `<textarea id="${id}" class="cfg-input" rows="4">${value || ''}</textarea>`;
      } else {
        input = `<input type="${f.type}" id="${id}" class="cfg-input" value="${value || ''}">`;
      }
      return `<div class="config-row"><label>${f.label}</label>${input}</div>`;
    }).join('');
    $('#crudFields').innerHTML = fieldsHtml;
    $('#crudModal').style.display = 'flex';
  };

  function getRowValue(tabKey, rowIndex, key) {
    const D = getData();
    const tabData = (D.comments && D.comments[tabKey]) || (D.training && D.training.months) || [];
    if (tabKey === 'TRAINING') {
      const m = tabData[rowIndex - 2];
      return m ? String(m[key.toLowerCase()] || '') : '';
    }
    const r = tabData[rowIndex - 2];
    return r ? String(r[key.toLowerCase()] || r[key] || '') : '';
  }

  window.saveCRUD = async function() {
    if (!currentCRUD) return;
    const { tabKey, mode, rowIndex } = currentCRUD;
    const schema = CRUD_SCHEMAS[tabKey];
    const data = {};
    schema.fields.forEach(f => {
      const el = $('#crudFld_' + f.key);
      if (el) data[f.key] = el.value;
    });

    showToast('⏳ กำลังบันทึก...', 'info');
    try {
      let res;
      if (mode === 'add') {
        res = await window.P5_API.add(tabKey, data);
      } else {
        res = await window.P5_API.update(tabKey, rowIndex, data);
      }
      if (res.ok) {
        showToast('✅ บันทึกสำเร็จ!', 'success');
        $('#crudModal').style.display = 'none';
        currentCRUD = null;
        manualSync();
        renderAll();
      } else {
        showToast('❌ ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      showToast('❌ ' + err.message, 'error');
    }
  };

  window.deleteRow = async function(tabKey, rowIndex) {
    if (!window.P5_API?.hasUrl()) {
      showToast('⚠️ กรุณาตั้งค่า Apps Script URL ก่อน', 'warn');
      $('#btnConfig')?.click();
      return;
    }
    if (!confirm('⚠️ ลบข้อมูลแถวที่ ' + rowIndex + ' ใช่ไหม?')) return;
    showToast('⏳ กำลังลบ...', 'info');
    try {
      const res = await window.P5_API.remove(tabKey, rowIndex);
      if (res.ok) {
        showToast('✅ ลบสำเร็จ!', 'success');
        manualSync();
        renderAll();
      } else {
        showToast('❌ ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      showToast('❌ ' + err.message, 'error');
    }
  };

  window.showToast = function(msg, type = 'info') {
    const t = $('#toast');
    if (!t) { alert(msg); return; }
    t.textContent = msg;
    t.className = 'toast toast-' + type;
    t.style.display = 'block';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => { t.style.display = 'none'; }, 3500);
  };

  function setupCRUD() {
    $('#crudClose')?.addEventListener('click', () => { $('#crudModal').style.display = 'none'; currentCRUD = null; });
    $('#crudCancel')?.addEventListener('click', () => { $('#crudModal').style.display = 'none'; currentCRUD = null; });
    $('#crudSave')?.addEventListener('click', saveCRUD);
    document.getElementById('crudModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'crudModal') { $('#crudModal').style.display = 'none'; currentCRUD = null; }
    });
  }

  function init() {
    setupSheetButtons();
    setupConfig();
    setupCRUD();
    initTabs();

    // Render ทันทีด้วย mock data (กันหน้าว่าง)
    try { renderAll(); } catch(e) { console.error('init render error:', e); }

    // Start auto-sync from Google Sheet
    if (window.P5_SHEET) {
      window.P5_SHEET.startAutoSync((data, isCached) => {
        try { renderAll(); updateLiveStatus(isCached); } catch (e) { console.error('Render error:', e); }
      });
    }

    // Fallback: re-render หลัง 2 วินาที (กันพลาด)
    setTimeout(() => { try { renderAll(); } catch(e){} }, 2000);

    // Manual sync button
    $('#btnSync')?.addEventListener('click', manualSync);
    $('#btnRefreshNow')?.addEventListener('click', manualSync);
    $('#liveChip')?.addEventListener('click', manualSync);
  }

  function manualSync() {
    if (!window.P5_SHEET) return;
    $('#liveText').textContent = '🔄 กำลัง sync...';
    window.P5_SHEET.sync((data, isCached) => {
      renderAll();
      updateLiveStatus(isCached);
    });
  }

  function updateLiveStatus(isCached) {
    const age = window.P5_SHEET?.getCacheAge();
    const text = isCached
      ? '⚠️ Cache · อัปเดตล่าสุด ' + (age ? age + ' วินาทีที่แล้ว' : 'ไม่ทราบ')
      : '🟢 Live · ' + (age !== null ? 'เมื่อ ' + age + ' วินาทีที่แล้ว' : 'เพิ่ง sync');
    const el = $('#liveText');
    if (el) el.textContent = text;
  }

  function setupSheetButtons() {
    const url = 'https://docs.google.com/spreadsheets/d/15a8s_tLpuwBdIqJqwEv0be8Sy8162gnYti6kTggngh0/edit?gid=245123772#gid=245123772';
    const btn = $('#btnOpenSheet');
    const btn2 = $('#btnSheet');
    if (btn) btn.href = url;
    if (btn2) btn2.href = url;
  }

  // ============================================================
  // CONFIG MODAL
  // ============================================================
  function setupConfig() {
    const modal = $('#configModal');
    if (!modal) return;

    // Open
    $('#btnConfig')?.addEventListener('click', () => {
      const cfg = window.P5_SHEET?.getConfig() || {};
      if (cfg.sheetId) $('#cfgSheetId').value = cfg.sheetId;
      const gids = cfg.gids || {};
      Object.keys(gids).forEach(tab => {
        const el = $('#cfgGid_' + tab);
        if (el && gids[tab] !== null && gids[tab] !== undefined) el.value = gids[tab];
      });
      modal.style.display = 'flex';
    });
    // Close
    $('#configClose')?.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    // Save
    $('#cfgSave')?.addEventListener('click', () => {
      const newId = $('#cfgSheetId').value.trim();
      if (newId) window.P5_SHEET.setSheetId(newId);
      const tabs = ['00_META','01_TRAINING','02_ROLEPLAY','03_MENTOR','04_COACH','05_AP','06_BP','07_LL','08_II','09_XP','10_DAILY_COMMENTS'];
      tabs.forEach(t => {
        const el = $('#cfgGid_' + t);
        if (el && el.value.trim() !== '') {
          window.P5_SHEET.setTabGid(t, parseInt(el.value.trim()) || 0);
        }
      });
      modal.style.display = 'none';
      manualSync();
    });
    // Reset
    $('#cfgReset')?.addEventListener('click', () => {
      try { localStorage.removeItem('p5_sheet_config'); } catch(e) {}
      location.reload();
    });
  }

  // ---------------------------------------------------------
  // TABS
  // ---------------------------------------------------------
  function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const el = $('#page-' + tab.dataset.page);
        if (el) el.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // ---------------------------------------------------------
  // RENDER ALL
  // ---------------------------------------------------------
  function renderAll() {
    $('#pageContainer').innerHTML =
      renderDashboard() +
      renderTraining() +
      renderRoleplay() +
      renderMentor() +
      renderCoach() +
      renderOther();

    requestAnimationFrame(() => {
      animateMiniBars();
      animateCounts();
    });
  }

  // ============ DASHBOARD ============
  function renderDashboard() {
    const D = getData();
    const t = D.training;
    const r = D.roleplay;
    const m = D.mentor;
    const c = D.coach;
    const totalMembers = t.months.reduce((s, x) => s + x.members, 0);
    const totalDone = t.months.reduce((s, x) => s + x.done, 0);
    const totalPlanned = t.months.reduce((s, x) => s + x.planned, 0);
    const trainingPct = totalPlanned ? Math.round(totalDone / totalPlanned * 100) : 0;
    return `
    <div class="page active" id="page-dashboard">
      <!-- ROW 1: 4 BIG KPI CARDS -->
      <div class="kpi-grid">
        ${bigKpi('👥', fmt(totalMembers) || '—', 'สมาชิกที่มีแผน', 'green', 'ทั้งหมดในระบบ P5')}
        ${bigKpi('📚', trainingPct + '%', 'Training ตามแผน', trainingPct >= 80 ? 'green' : trainingPct >= 60 ? 'gold' : 'red', totalDone + ' / ' + totalPlanned + ' หลักสูตร')}
        ${bigKpi('👥', m.pct + '%', 'Mentor วินัย ≥ 90%', m.pct >= 80 ? 'green' : m.pct >= 60 ? 'gold' : 'red', m.pass + ' / ' + m.total + ' คน')}
        ${bigKpi('🎯', c.pct + '%', 'Coach ตามเป้า', c.pct >= 80 ? 'green' : c.pct >= 60 ? 'gold' : 'red', c.pass + ' / ' + c.total + ' คน')}
      </div>

      <!-- ROW 2: OKR + KR SECTION (5 บรรทัด) -->
      <div class="card okr-section">
        <div class="card-head">
          <div>
            <h3>🎯 OKR — ระบบพัฒนาบุคลากร</h3>
            <p>${D.meta.okrGoal || 'พัฒนาสมาชิกตาม Core competency PKG'}</p>
          </div>
          <div class="card-chip warn">PAD</div>
        </div>
        <div class="okr-grid">
          <div class="okr-row okr-goal">
            <div class="okr-label">🎯</div>
            <div class="okr-text"><strong>จุดมุ่งหมาย:</strong> ${D.meta.okrGoal || 'พัฒนาสมาชิกตาม Core competency PKG'}</div>
          </div>
          <div class="okr-row okr-vision">
            <div class="okr-label">🏆</div>
            <div class="okr-text"><strong>ภาพความสำเร็จ:</strong> ${D.meta.okrVision || 'สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU'}</div>
          </div>
          <div class="okr-row okr-okr">
            <div class="okr-label">📌</div>
            <div class="okr-text"><strong>OKR:</strong> ${D.meta.okr || 'สมาชิกมีแผนและได้รับการพัฒนาศักยภาพตามแผนครบทุกคน'}</div>
          </div>
          <div class="okr-row">
            <div class="okr-label okr-kr">KR 1</div>
            <div class="okr-text"><strong>ระบบอบรม:</strong> สมาชิกได้รับการฝึกอบรมตามแผนและสามารถนำความรู้ไปใช้ในการบรรลุเป้าหมายการทำงานที่ได้รับ 100%</div>
            <div class="okr-pct ${trainingPct >= 80 ? 'green' : 'gold'}">${trainingPct}%</div>
          </div>
          <div class="okr-row">
            <div class="okr-label okr-kr">KR 2</div>
            <div class="okr-text"><strong>ระบบ Mentor:</strong> สมาชิกใหม่/สมาชิกจับคู่คนกับงานใหม่/สมาชิกปรับบทบาท/สมาชิกพัฒนาศักยภาพ ได้รับการดูแลจากพี่เลี้ยงแบบ 1:3 ครบ 100%</div>
            <div class="okr-pct ${m.pct >= 80 ? 'green' : m.pct >= 60 ? 'gold' : 'red'}">${m.pct}%</div>
          </div>
          <div class="okr-row">
            <div class="okr-label okr-kr">KR 3</div>
            <div class="okr-text"><strong>ระบบ Coach:</strong> สมาชิกที่ได้รับมอบหมายบทบาทเป็นผู้ Coach ได้พัฒนาทักษะการ Coach ผู้อื่น</div>
            <div class="okr-pct ${c.pct >= 80 ? 'green' : 'gold'}">${c.pct}%</div>
          </div>
        </div>
      </div>

      <!-- ROW 2: ตารางรายงานวัดผลสถานการณ์ฝึกอบรม ณ ปัจจุบัน -->
      <div class="card">
        <div class="card-head">
          <div>
            <h3>📋 สรุปรายงานวัดผลสถานการณ์ฝึกอบรม ณ ปัจจุบัน</h3>
            <p>ข้อมูลจาก Google Sheet · GID 1104115053</p>
          </div>
          <div class="card-chip success">Live</div>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th rowspan="2">บริษัท</th>
                <th rowspan="2" class="num">จำนวนสมาชิก</th>
                <th colspan="3" class="num">เป้าหมายหน่วยกิตประจำปี /คน<br>(ครบ 44 หน่วยกิต)</th>
                <th colspan="3" class="num">เป้าหมายเกรดเฉลี่ย /คน<br>(GPA ผ่าน 3.5)</th>
                <th colspan="3" class="num">สถานะ</th>
              </tr>
              <tr>
                <th class="num">ครบ 44</th>
                <th class="num">ยังไม่ครบ</th>
                <th class="pct">คิดเป็น %</th>
                <th class="num">GPA ผ่าน 3.5</th>
                <th class="num">GPA ไม่ผ่าน 3.5</th>
                <th class="pct">คิดเป็น %</th>
                <th class="num">แล้วเสร็จ</th>
                <th class="num">รออบรม</th>
                <th class="pct">คิดเป็น %</th>
              </tr>
            </thead>
            <tbody id="reportTableBody">
              <tr><td colspan="10" style="text-align:center;padding:20px;color:#b8bcd6">กำลังโหลด...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ROW 2: 4 SMALL KPI CARDS (Roleplay + 3 more) -->
      <div class="kpi-grid kpi-grid-sm">
        ${smallKpi('🎭', fmt(r.pass) + ' / ' + fmt(r.total), 'Roleplay ผ่าน', r.pct + '%', r.pct >= 80 ? 'green' : 'red')}
        ${smallKpi('🏛️', 'ระดับ 6', 'ภาวะผู้นำฯ', '45 / 327', 'purple')}
        ${smallKpi('📋', '5', 'BU ในระบบ', 'PMSG/CPDG/AAMG/RPLCG/RAFCOG', 'blue')}
        ${smallKpi('⏱️', t.months.length + ' เดือน', 'Training Period', 'Q2/2569', 'gold')}
      </div>

      <!-- ROW 3: 2 MAIN CHARTS -->
      <div class="charts-row">
        <div class="card">
          <div class="card-head">
            <div>
              <h3>📊 Training — % ครบหลักสูตร แยกตาม BU</h3>
              <p>ข้อมูลจริงจาก Google Sheet</p>
            </div>
            <div class="card-chip success">${t.months.length} เดือน</div>
          </div>
          <div class="bar-wrap" id="barTraining"></div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <h3>🎯 4 ระบบหลัก — ภาพรวม</h3>
              <p>Training · Roleplay · Mentor · Coach</p>
            </div>
            <div class="card-chip">Live</div>
          </div>
          <div class="bar-wrap" id="barSystems"></div>
        </div>
      </div>

      <!-- ROW 4: 2 SMALL CHARTS -->
      <div class="charts-row">
        <div class="card">
          <div class="card-head">
            <div>
              <h3>👥 Mentor — กลุ่ม 1 / 2 / 4</h3>
              <p>% วินัยแยกตามกลุ่ม</p>
            </div>
            <div class="card-chip ${m.pct >= 80 ? 'success' : 'warn'}">${m.pct}%</div>
          </div>
          <div class="bar-wrap" id="barMentor"></div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <h3>🎯 Coach — 5 BU</h3>
              <p>% โค้ชสำเร็จแยกตาม BU</p>
            </div>
            <div class="card-chip success">${c.pct}%</div>
          </div>
          <div class="bar-wrap" id="barCoach"></div>
        </div>
      </div>

    </div>`;
  }

  function bigKpi(icon, value, title, color, sub) {
    return `
      <div class="kpi-card kpi-big color-${color}">
        <div class="kpi-icon">${icon}</div>
        <div class="kpi-title">${title}</div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-delta-label">${sub}</div>
      </div>`;
  }

  function smallKpi(icon, value, title, sub, color) {
    return `
      <div class="kpi-card kpi-sm color-${color}">
        <div class="kpi-row">
          <div class="kpi-icon">${icon}</div>
          <div class="kpi-text">
            <div class="kpi-title">${title}</div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-delta-label">${sub}</div>
          </div>
        </div>
      </div>`;
  }

  function gradFor(color) {
    return ({
      green: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      gold:  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      red:   'linear-gradient(135deg, #fb7185 0%, #ef4444 100%)',
      blue:  'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      purple:'linear-gradient(135deg, #a78bfa 0%, #7c5cff 100%)'
    })[color] || 'linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%)';
  }

  // ============ TRAINING ============
  function renderTraining() {
    const D = getData();
    const t = D.training;
    return `
    <div class="page" id="page-training">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>📚 Training — ข้อมูลจริงจาก Google Sheet</h3>
            <p>ผ่านที่ 1 · แผนหลักสูตร · เปิดอบรม · Cheer up</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('TRAINING', 'add', null)">➕ เพิ่มเดือน</button>
          </div>
        </div>
        <div class="tbl-wrap">
          <table class="tbl tbl-progress">
            <thead>
              <tr>
                <th>เดือน</th>
                <th class="num">แผนหลักสูตร</th>
                <th>เปิดอบรมแล้ว</th>
                <th class="num">% ตามแผน</th>
                <th class="num">รอส่งผล</th>
                <th class="num">สมาชิก</th>
                <th class="num">Cheer up</th>
                <th class="num" style="width:80px">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${t.months.map((m, idx) => {
                const pct = m.planned ? (m.done / m.planned * 100) : 0;
                const cls = pct >= 80 ? 'green' : pct >= 60 ? 'gold' : 'red';
                return `
                  <tr>
                    <td class="bu-name">เดือน ${m.month}</td>
                    <td class="num">${m.planned}</td>
                    <td>
                      <div class="mini-bar">
                        <div class="mini-fill ${cls}" data-target="${pct}"></div>
                      </div>
                    </td>
                    <td class="pct ${cls}">${pct.toFixed(1)}%</td>
                    <td class="num" style="color:#fbbf24">${m.pending}</td>
                    <td class="num">${fmt(m.members)}</td>
                    <td class="pct green">${m.cheerPct}%</td>
                    <td class="num">
                      <button class="row-action edit" onclick="openCRUDModal('TRAINING', 'edit', ${idx + 2})" title="แก้ไข">✏️</button>
                      <button class="row-action del"  onclick="deleteRow('TRAINING', ${idx + 2})"  title="ลบ">🗑️</button>
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  // ============ ROLEPLAY ============
  function renderRoleplay() {
    const D = getData();
    const r = D.roleplay;
    return `
    <div class="page" id="page-roleplay">
      <div class="kpi-grid">
        ${bigKpi('🎭', fmt(r.total), 'ทีม Roleplay ทั้งหมด', gradFor('purple'), 'ข้อมูลจริง')}
        ${bigKpi('✅',  fmt(r.pass),  'ผ่าน',                   gradFor('green'), `${r.pct}% Cheer up`)}
        ${bigKpi('❌',  fmt(r.fail),  'ยังไม่บรรลุ',             gradFor('red'),   r.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
      </div>
      <div class="card">
        <div class="card-head">
          <div>
            <h3>🎭 Roleplay — ภาพรวม</h3>
            <p>ข้อมูลจาก Google Sheet</p>
          </div>
          <div class="card-chip success">${r.pct}% สำเร็จ</div>
        </div>
        <div class="bar-wrap" id="barRoleplay"></div>
      </div>
    </div>`;
  }

  // ============ MENTOR ============
  function renderMentor() {
    const D = getData();
    const m = D.mentor;
    return `
    <div class="page" id="page-mentor">
      <div class="kpi-grid">
        ${bigKpi('👥', fmt(m.total), 'อยู่ในระบบ Mentor', gradFor('blue'),  'ทั้งหมด')}
        ${bigKpi('✅',  fmt(m.pass),  'วินัย ≥ 90%',      gradFor('green'), `${m.pct}%`)}
        ${bigKpi('❌',  fmt(m.fail),  'วินัย < 90%',      gradFor('gold'),  m.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
      </div>
      ${m.note ? `<div class="card"><div class="note-block">📝 <strong>หมายเหตุ:</strong> ${m.note}</div></div>` : ''}
      <div class="card">
        <div class="card-head">
          <div>
            <h3>👥 Mentor — ภาพรวม</h3>
            <p>จาก Google Sheet</p>
          </div>
          <div class="card-chip ${m.pct >= 80 ? 'success' : 'warn'}">${m.pct}%</div>
        </div>
        <div class="bar-wrap" id="barMentor"></div>
      </div>
    </div>`;
  }

  // ============ COACH ============
  function renderCoach() {
    const D = getData();
    const c = D.coach;
    return `
    <div class="page" id="page-coach">
      <div class="kpi-grid">
        ${bigKpi('🎯', fmt(c.total), 'อยู่ในระบบ Coach',    gradFor('purple'), 'ทั้งหมด')}
        ${bigKpi('✅',  fmt(c.pass),  'ตามเป้าหมาย',         gradFor('green'),  `${c.pct}%`)}
        ${bigKpi('❌',  fmt(c.fail),  'น้อยกว่าเป้า',         gradFor('gold'),   c.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
      </div>
      <div class="card">
        <div class="card-head">
          <div>
            <h3>🎯 Coach — ภาพรวม</h3>
            <p>จาก Google Sheet</p>
          </div>
          <div class="card-chip success">${c.pct}%</div>
        </div>
        <div class="bar-wrap" id="barCoach"></div>
      </div>
    </div>`;
  }

  // ============ OTHER ============
  function renderOther() {
    const D = getData();
    return `
    <div class="page" id="page-other">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>📊 แหล่งข้อมูล</h3>
            <p>Google Sheet + เครื่องมือเพิ่มเติม</p>
          </div>
        </div>
        <div class="other-grid">
          <a class="other-card" href="${D.meta.sheetUrl}" target="_blank">
            <div class="other-icon">📊</div>
            <div class="other-info">
              <h3>Google Sheet (PAD-02)</h3>
              <p>แก้ไขข้อมูลที่นี่ · เว็บอัปเดตอัตโนมัติ</p>
            </div>
          </a>
          <div class="other-card">
            <div class="other-icon">🔄</div>
            <div class="other-info">
              <h3>Auto Sync</h3>
              <p>ดึงข้อมูลทุก 30 วินาที · Cache ใน Browser</p>
            </div>
          </div>
          <div class="other-card">
            <div class="other-icon">📅</div>
            <div class="other-info">
              <h3>Last Update</h3>
              <p>${new Date(D.meta.lastUpdate).toLocaleString('th-TH')}</p>
            </div>
          </div>
          <div class="other-card">
            <div class="other-icon">💾</div>
            <div class="other-info">
              <h3>Version</h3>
              <p>P5 v0.4.0 · ${D.meta.cached ? '⚠️ Cache Mode' : '🟢 Live Mode'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // CHARTS / BARS
  // ---------------------------------------------------------
  function renderBar(containerId, items, max, color, fmtFn) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = items.map(d => {
      const pct = max ? (d.value / max * 100) : 0;
      return `
        <div class="bar-row">
          <div class="bar-label">${d.label}</div>
          <div class="bar-track">
            <div class="bar-fill" data-target="${pct}" style="background:${color}"></div>
          </div>
          <div class="bar-value" data-target="${d.value}">0</div>
        </div>`;
    }).join('');
    requestAnimationFrame(() => {
      wrap.querySelectorAll('.bar-fill').forEach((el, i) => {
        setTimeout(() => { el.style.width = el.dataset.target + '%'; }, 100 + i * 70);
      });
      wrap.querySelectorAll('.bar-value').forEach((el, i) => {
        const target = parseFloat(el.dataset.target);
        setTimeout(() => animateCount(el, 0, target, 1100, (v) => fmtFn ? fmtFn(v) : fmt(Math.round(v))), 100 + i * 70);
      });
    });
  }

  function renderDashboardCharts() {
    const D = getData();

    // Training bar: เดือน × %ตามแผน
    const tItems = D.training.months.map(m => {
      const pct = m.planned ? (m.done / m.planned * 100) : 0;
      return { label: `เดือน ${m.month}`, value: pct };
    });
    renderBar('barTraining', tItems, 100, 'linear-gradient(90deg, #34d399, #10b981)', v => v.toFixed(1) + '%');

    // 5 systems
    const sysItems = [
      { label: 'Training',   value: D.training.months.length ? (D.training.months.reduce((s,m) => s + (m.planned ? m.done/m.planned : 0), 0) / D.training.months.length * 100) : 0 },
      { label: 'Roleplay',   value: D.roleplay.pct },
      { label: 'Mentor',     value: D.mentor.pct },
      { label: 'Coach',      value: D.coach.pct }
    ];
    renderBar('barSystems', sysItems, 100, 'linear-gradient(90deg, #7c5cff, #22d3ee)', v => v.toFixed(1) + '%');

    // Roleplay
    renderBar('barRoleplay', [
      { label: 'ผ่าน',  value: D.roleplay.pass },
      { label: 'ยังไม่บรรลุ', value: D.roleplay.fail }
    ], D.roleplay.total || 1, 'linear-gradient(90deg, #f472b6, #ec4899)', v => fmt(Math.round(v)));

    // Mentor
    renderBar('barMentor', [
      { label: 'วินัย ≥ 90%', value: D.mentor.pass },
      { label: 'วินัย < 90%', value: D.mentor.fail }
    ], D.mentor.total || 1, 'linear-gradient(90deg, #60a5fa, #7c5cff)', v => fmt(Math.round(v)));

    // Coach
    renderBar('barCoach', [
      { label: 'ตามเป้า',   value: D.coach.pass },
      { label: 'น้อยกว่า',  value: D.coach.fail }
    ], D.coach.total || 1, 'linear-gradient(90deg, #fbbf24, #f59e0b)', v => fmt(Math.round(v)));
  }

  function animateCount(el, from, to, duration, formatter) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      el.textContent = formatter(v);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateMiniBars() {
    document.querySelectorAll('.mini-fill').forEach((el, i) => {
      const target = parseFloat(el.dataset.target) || 0;
      setTimeout(() => { el.style.width = target + '%'; }, 150 + i * 80);
    });
  }

  function animateCounts() {
    requestAnimationFrame(() => {
      renderDashboardCharts();
      loadReport();
    });
  }

  // ============================================================
  // LOAD REPORT (GID 1104115053 - ตารางรายงานวัดผลสถานการณ์ฝึกอบรม)
  // ============================================================
  async function loadReport() {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;

    // 1) Fallback: render ทันทีจาก mock data (window.P5_DATA.report)
    const mockReport = (window.P5_DATA && window.P5_DATA.report) || [];
    if (mockReport.length) {
      renderReportTable(mockReport);
    }

    // 2) Try to fetch จาก Google Sheet
    try {
      const rows = await window.P5_SHEET.getReport();
      // Skip 2 header rows → first row = column headers
      // rows[0] = title, rows[1] = sub-header, rows[2..] = data
      const html = rows.slice(2).map(r => {
        // Sheet structure: r[0]=BU, r[1]=planned, r[2]=done, r[3]=pending, r[4]=%
        // r[5]=members, r[6]=target44, r[7]=complete44, r[8]=incomplete, r[9]=pctComplete
        // r[10]=gpaPass, r[11]=gpaFail, r[12]=pctGpa
        // r[13]=statusDone, r[14]=statusPending, r[15]=pctStatus
        const bu = r[0] || '';
        const members = parseInt(r[5]) || 0;
        const complete44 = parseInt(r[7]) || 0;
        const incomplete = parseInt(r[8]) || 0;
        const pctComplete = parseFloat(r[9]) || 0;
        const gpaPass = parseInt(r[10]) || 0;
        const gpaFail = parseInt(r[11]) || 0;
        const pctGpa = parseFloat(r[12]) || 0;
        const statusDone = parseInt(r[13]) || 0;
        const statusPending = parseInt(r[14]) || 0;
        const pctStatus = parseFloat(r[15]) || 0;

        if (!bu) return ''; // keep PGHg even if members = 0

        const pctCompleteCls = pctComplete >= 80 ? 'green' : pctComplete >= 60 ? 'gold' : 'red';
        const pctGpaCls = pctGpa >= 80 ? 'green' : pctGpa >= 60 ? 'gold' : 'red';
        const pctStatusCls = pctStatus >= 80 ? 'green' : pctStatus >= 60 ? 'gold' : 'red';

        return {
          bu, members, complete44, incomplete, pctComplete, gpaPass, gpaFail, pctGpa,
          statusDone, statusPending, pctStatus,
          pctCompleteCls, pctGpaCls, pctStatusCls
        };
      }).filter(Boolean);
      if (html.length) renderReportTable(html);
    } catch (err) {
      console.warn('⚠️ loadReport (Google Sheet) failed, using mock:', err.message);
      // mock data ถูก render แล้วใน fallback
    }
  }

  // Render rows เป็น HTML
  function renderReportTable(rows) {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    const html = rows.map(r => {
      const cls1 = r.pctCompleteCls || (r.pctComplete >= 80 ? 'green' : r.pctComplete >= 60 ? 'gold' : 'red');
      const cls2 = r.pctGpaCls || (r.pctGpa >= 80 ? 'green' : r.pctGpa >= 60 ? 'gold' : 'red');
      const cls3 = r.pctStatusCls || (r.pctStatus >= 80 ? 'green' : r.pctStatus >= 60 ? 'gold' : 'red');
      return `
          <tr>
            <td class="bu-name">${r.bu}</td>
            <td class="num">${(r.members||0).toLocaleString('th-TH')}</td>
            <td class="num" style="color:#34d399">${(r.complete44||0).toLocaleString('th-TH')}</td>
            <td class="num" style="color:#fb7185">${(r.incomplete||0).toLocaleString('th-TH')}</td>
            <td class="pct ${cls1}">${(r.pctComplete||0).toFixed(2)}%</td>
            <td class="num" style="color:#34d399">${(r.gpaPass||0).toLocaleString('th-TH')}</td>
            <td class="num" style="color:#fb7185">${(r.gpaFail||0).toLocaleString('th-TH')}</td>
            <td class="pct ${cls2}">${(r.pctGpa||0).toFixed(2)}%</td>
            <td class="num" style="color:#34d399">${(r.statusDone||0).toLocaleString('th-TH')}</td>
            <td class="num" style="color:#fbbf24">${(r.statusPending||0).toLocaleString('th-TH')}</td>
            <td class="pct ${cls3}">${(r.pctStatus||0).toFixed(2)}%</td>
          </tr>`;
    }).join('');
    tbody.innerHTML = html;
  }

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);
})();
