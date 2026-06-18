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

    // Start auto-sync from Google Sheet
    if (window.P5_SHEET) {
      window.P5_SHEET.startAutoSync((data, isCached) => {
        renderAll();
        updateLiveStatus(isCached);
      });
    } else {
      renderAll();
    }

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
      renderAPBP() +
      renderLLIIXP() +
      renderComments() +
      renderOther();

    requestAnimationFrame(() => {
      animateMiniBars();
      animateCounts();
    });
  }

  // ============ DASHBOARD ============
  function renderDashboard() {
    const D = getData();
    const k = D.kpiCards || [];
    return `
    <div class="page active" id="page-dashboard">
      <div class="kpi-grid">
        ${k.map(c => kpi(c.icon, c.value, c.label, gradFor(c.color), c.sub || '—')).join('')}
      </div>

      <div class="charts-row">
        <div class="card">
          <div class="card-head">
            <div>
              <h3>📚 Training: หลักสูตรตามแผน vs เปิดอบรม</h3>
              <p>ข้อมูลจริงจาก Google Sheet</p>
            </div>
            <div class="card-chip success">${D.training.months.length} เดือน</div>
          </div>
          <div class="bar-wrap" id="barTraining"></div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <h3>📊 5 ระบบหลัก — ภาพรวม</h3>
              <p>Training · Roleplay · Mentor · Coach</p>
            </div>
            <div class="card-chip">Live</div>
          </div>
          <div class="bar-wrap" id="barSystems"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h3>🎯 OKR + KR — ระบบพัฒนาบุคลากร PAD-02</h3>
            <p>จุดมุ่งหมาย · ภาพความสำเร็จ · OKR · Key Results</p>
          </div>
          <div class="card-chip warn">PAD Team</div>
        </div>
        <div class="okr-block">
          <div class="okr-line"><strong>🎯 จุดมุ่งหมาย:</strong> พัฒนาสมาชิกตาม Core competency PKG</div>
          <div class="okr-line"><strong>🏆 ภาพความสำเร็จ:</strong> สมาชิก PKG มีทักษะที่เป็นเลิศ ตาม CC PKG และ AOE BU</div>
          <div class="okr-line"><strong>📌 OKR:</strong> สมาชิกมีแผนและได้รับการพัฒนาศักยภาพตามแผนครบทุกคน</div>
          <div class="kr-list">
            <div class="kr-item">KR 1. <strong>ระบบอบรม</strong> · สมาชิกได้รับการฝึกอบรมตามแผนและสามารถนำความรู้ไปใช้ในการบรรลุเป้าหมายการทำงานที่ได้รับ 100%</div>
            <div class="kr-item">KR 2. <strong>ระบบ Mentor</strong> · สมาชิกใหม่/จับคู่คนกับงานใหม่/ปรับบทบาท/พัฒนาศักยภาพ ได้รับการดูแลจากพี่เลี้ยงแบบ 1:3 ครบ 100%</div>
            <div class="kr-item">KR 3. <strong>ระบบ Coach</strong> · สมาชิกที่ได้รับมอบหมายบทบาทเป็นผู้ Coach ได้พัฒนาทักษะการ Coach ผู้อื่น</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function kpi(icon, value, title, grad, sub) {
    return `
      <div class="kpi-card" style="--kpi-grad: ${grad}">
        <div class="kpi-icon">${icon}</div>
        <div class="kpi-title">${title}</div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-delta-label">${sub}</div>
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
              ${t.months.map(m => {
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
        ${kpi('🎭', fmt(r.total), 'ทีม Roleplay ทั้งหมด', gradFor('purple'), 'ข้อมูลจริง')}
        ${kpi('✅',  fmt(r.pass),  'ผ่าน',                   gradFor('green'), `${r.pct}% Cheer up`)}
        ${kpi('❌',  fmt(r.fail),  'ยังไม่บรรลุ',             gradFor('red'),   r.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
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
        ${kpi('👥', fmt(m.total), 'อยู่ในระบบ Mentor', gradFor('blue'),  'ทั้งหมด')}
        ${kpi('✅',  fmt(m.pass),  'วินัย ≥ 90%',      gradFor('green'), `${m.pct}%`)}
        ${kpi('❌',  fmt(m.fail),  'วินัย < 90%',      gradFor('gold'),  m.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
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
        ${kpi('🎯', fmt(c.total), 'อยู่ในระบบ Coach',    gradFor('purple'), 'ทั้งหมด')}
        ${kpi('✅',  fmt(c.pass),  'ตามเป้าหมาย',         gradFor('green'),  `${c.pct}%`)}
        ${kpi('❌',  fmt(c.fail),  'น้อยกว่าเป้า',         gradFor('gold'),   c.fail > 0 ? 'ต้องติดตาม' : 'ครบ!')}
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

  // ============ AP / BP ============
  function renderAPBP() {
    const D = getData();
    const ap = D.comments?.AP || [];
    const bp = D.comments?.BP || [];
    return `
    <div class="page" id="page-apbp">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>📋 AP — Action Plan</h3>
            <p>แผนปฏิบัติการ · ${ap.length} ข้อ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('AP', 'add', null)">➕ เพิ่ม Action</button>
          </div>
        </div>
        <ol class="comment-list">
          ${ap.map((c, idx) => `<li><div class="comment-no">${c.no || idx + 1}</div><div class="comment-text">${c.text}</div><div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('AP', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('AP', ${idx + 2})" title="ลบ">🗑️</button></div></li>`).join('')}
        </ol>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h3>📋 BP — Best Practice</h3>
            <p>แนวปฏิบัติที่ดี · ${bp.length} ข้อ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('BP', 'add', null)">➕ เพิ่ม BP</button>
          </div>
        </div>
        <ol class="comment-list">
          ${bp.map((c, idx) => `<li><div class="comment-no">${c.no || idx + 1}</div><div class="comment-text">${c.text}</div><div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('BP', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('BP', ${idx + 2})" title="ลบ">🗑️</button></div></li>`).join('')}
        </ol>
      </div>
    </div>`;
  }

  // ============ LL / II / XP ============
  function renderLLIIXP() {
    const D = getData();
    const ll = D.comments?.LL || [];
    const ii = D.comments?.II || [];
    const xp = D.comments?.XP || [];
    return `
    <div class="page" id="page-ll">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>💡 LL — Lesson Learned</h3>
            <p>บทเรียนที่ได้รับ · ${ll.length} ข้อ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('LL', 'add', null)">➕ เพิ่ม LL</button>
          </div>
        </div>
        <ol class="comment-list">
          ${ll.map((c, idx) => `<li><div class="comment-no">${c.no || idx + 1}</div><div class="comment-text">${c.text}</div><div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('LL', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('LL', ${idx + 2})" title="ลบ">🗑️</button></div></li>`).join('')}
        </ol>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h3>💡 II — Innovation / Idea</h3>
            <p>นวัตกรรม / ไอเดีย · ${ii.length} ข้อ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('II', 'add', null)">➕ เพิ่ม II</button>
          </div>
        </div>
        <ol class="comment-list">
          ${ii.map((c, idx) => `<li><div class="comment-no">${c.no || idx + 1}</div><div class="comment-text">${c.text}</div><div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('II', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('II', ${idx + 2})" title="ลบ">🗑️</button></div></li>`).join('')}
        </ol>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h3>⭐ XP — eXperience</h3>
            <p>ประสบการณ์ · ${xp.length} ข้อ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('XP', 'add', null)">➕ เพิ่ม XP</button>
          </div>
        </div>
        <ol class="comment-list">
          ${xp.map((c, idx) => `<li><div class="comment-no">${c.no || idx + 1}</div><div class="comment-text">${c.text}</div><div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('XP', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('XP', ${idx + 2})" title="ลบ">🗑️</button></div></li>`).join('')}
        </ol>
      </div>
    </div>`;
  }

  // ============ DAILY COMMENTS ============
  function renderComments() {
    const D = getData();
    const comments = D.comments?.['📝Daily Comments'] || [];
    return `
    <div class="page" id="page-comments">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>💬 Daily Comments</h3>
            <p>บันทึกประจำวัน · ${comments.length} รายการ</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="detail-toggle" onclick="openCRUDModal('DAILY_COMMENTS', 'add', null)">➕ เขียน Comment</button>
          </div>
        </div>
        <ul class="daily-list">
          ${comments.map((c, idx) => `
            <li>
              <div class="daily-icon">📌</div>
              <div class="daily-text">${c.text}</div>
              <div class="row-actions"><button class="row-action edit" onclick="openCRUDModal('DAILY_COMMENTS', 'edit', ${idx + 2})" title="แก้">✏️</button><button class="row-action del" onclick="deleteRow('DAILY_COMMENTS', ${idx + 2})" title="ลบ">🗑️</button></div>
            </li>`).join('')}
        </ul>
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
    });
  }

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);
})();
