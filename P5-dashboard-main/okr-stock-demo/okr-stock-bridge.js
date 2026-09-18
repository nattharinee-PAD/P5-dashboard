/**
 * OKR Stock Bridge for CEO Form v4.3
 * เชื่อม CEO_Contract_Form.html ↔ OKR Stock API
 * ใช้งาน: <script src="okr-stock-bridge.js"></script> ใน CEO Form
 * 
 * ก่อน init: ใส่ API URL ด้วย OKRStockBridge.setApi(url)
 */

(function(window) {
  'use strict';

  const API_DEFAULT = ''; // จะถูก override โดย setApi()

  let config = {
    api: API_DEFAULT,
    actorId: 'PM-001',
    period: getCurrentQuarter()
  };

  function getCurrentQuarter() {
    const d = new Date();
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `${d.getFullYear()}Q${q}`;
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // ===== API call =====
  async function call(action, params = {}, method = 'GET') {
    if (!config.api) {
      throw new Error('OKR Stock API not configured. Call OKRStockBridge.setApi(url) first.');
    }
    if (method === 'GET') {
      const qs = Object.keys(params)
        .filter(k => k !== '_api')
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
      const fullUrl = config.api + (config.api.indexOf('?') >= 0 ? '&' : '?') + 'action=' + action + (qs ? '&' + qs : '');
      const res = await fetch(fullUrl).then(r => r.json());
      if (!res.ok) throw new Error(res.error.message || 'API error');
      return res;
    } else {
      const body = Object.assign({ action: action }, params);
      const res = await fetch(config.api, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.error.message || 'API error');
      return res;
    }
  }

  // ===== Auto-fill (CEO Form field mapping) =====
  function applyToForm(payload) {
    let count = 0;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) {
        el.value = val;
        count++;
      }
    };

    // BU Objectives (buObj1-3 + buKr1-3_1-3)
    if (payload.bu_objectives) {
      payload.bu_objectives.forEach((obj, i) => {
        const n = i + 1;
        setVal(`buObj${n}`, obj.objective);
        setVal(`buKr${n}_1`, obj.kr1);
        setVal(`buKr${n}_2`, obj.kr2);
        setVal(`buKr${n}_3`, obj.kr3);
      });
    }

    // Team Objectives (teamObj1-3 + teamKr1-3_1-3)
    if (payload.team_objectives) {
      payload.team_objectives.forEach((obj, i) => {
        const n = i + 1;
        setVal(`teamObj${n}`, obj.objective);
        setVal(`teamKr${n}_1`, obj.kr1);
        setVal(`teamKr${n}_2`, obj.kr2);
        setVal(`teamKr${n}_3`, obj.kr3);
      });
    }

    // KPI (kpi1n/t/f, kpi2n/t/f, kpi3n/t/f)
    setVal('kpi1n', payload.kpi1n);
    setVal('kpi1t', payload.kpi1t);
    setVal('kpi1f', payload.kpi1f);
    setVal('kpi2n', payload.kpi2n);
    setVal('kpi2t', payload.kpi2t);
    setVal('kpi2f', payload.kpi2f);
    setVal('kpi3n', payload.kpi3n);
    setVal('kpi3t', payload.kpi3t);
    setVal('kpi3f', payload.kpi3f);

    // Personal Growth (pgType1-3 / pgTarget1-3)
    setVal('pgType1', payload.pgType1);
    setVal('pgTarget1', payload.pgTarget1);
    setVal('pgType2', payload.pgType2);
    setVal('pgTarget2', payload.pgTarget2);
    setVal('pgType3', payload.pgType3);
    setVal('pgTarget3', payload.pgTarget3);

    return count;
  }

  // ===== Get member_id (from CEO Form) =====
  function getMemberId() {
    // Try multiple sources (CEO Form has several ID sources)
    const sources = [
      () => document.getElementById('memberId')?.value,
      () => document.getElementById('id')?.value,
      () => window.selectedMember?.id,
      () => document.querySelector('[name="memberId"]')?.value
    ];
    for (const fn of sources) {
      try {
        const v = fn();
        if (v && v !== 'undefined' && v !== 'null') return String(v).trim();
      } catch (e) {}
    }
    return null;
  }

  // ===== Fetch OKR suggestions =====
  async function fetchSuggestions() {
    const memberId = getMemberId();
    if (!memberId) {
      throw new Error('ไม่พบ member_id — กรุณาเลือกสมาชิกก่อน');
    }
    const res = await call('autofill', { member_id: memberId, period: config.period });
    return res;
  }

  // ===== Apply template =====
  async function applyTemplate(templateId) {
    const memberId = getMemberId();
    if (!memberId) throw new Error('ไม่พบ member_id');
    const res = await call('applyTemplate', {
      template_id: templateId,
      member_id: memberId,
      period: config.period,
      actor_id: config.actorId
    }, 'POST');

    const count = applyToForm(res.ceo_form_payload);

    // Trigger change events (so CEO Form knows fields changed)
    document.querySelectorAll('#buObj1, #buObj2, #buObj3, #teamObj1, #teamObj2, #teamObj3, #kpi1n, #kpi1t, #kpi1f, #kpi2n, #kpi2t, #kpi2f, #kpi3n, #kpi3t, #kpi3f, #pgType1, #pgTarget1, #pgType2, #pgTarget2, #pgType3, #pgTarget3').forEach(el => {
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    return { ...res, fields_filled: count };
  }

  // ===== Render suggestions modal =====
  function renderSuggestions(suggestions) {
    const totalCount = (suggestions.business?.length || 0) +
                       (suggestions.fu?.length || 0) +
                       (suggestions.team?.length || 0) +
                       (suggestions.individual?.length || 0);
    if (totalCount === 0) {
      return '<div style="text-align:center;padding:40px 20px;color:#6B7280">📭 ไม่มี Template ที่ match กับ member นี้</div>';
    }

    const section = (title, icon, items) => {
      if (!items || !items.length) return '';
      const cards = items.map(t => {
        const krsHtml = (t.krs || []).map(kr => 
          `<div class="kr-line" style="font-size:13px;padding:2px 0">KR${kr.kr_order}: ${escapeHtml(kr.kr_text)} <span style="color:#6B7280">(${kr.kr_target_value} ${escapeHtml(kr.kr_target_unit)})</span></div>`
        ).join('');
        return `<div class="suggestion-card" data-id="${escapeHtml(t.template_id)}" style="background:white;border:1px solid #E5E7EB;border-radius:8px;padding:12px;margin-bottom:8px;cursor:pointer;transition:all 0.15s" 
                       onmouseover="this.style.borderColor='#7C3AED';this.style.boxShadow='0 2px 8px rgba(124,58,237,0.15)'" 
                       onmouseout="this.style.borderColor='#E5E7EB';this.style.boxShadow='none'"
                       onclick="OKRStockBridge.applyAndClose('${escapeHtml(t.template_id)}')">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
            <div style="flex:1">
              <div style="display:flex;gap:6px;margin-bottom:4px;flex-wrap:wrap">
                <span style="background:#EDE9FE;color:#7C3AED;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${escapeHtml(t.template_id)}</span>
                <span style="background:#DBEAFE;color:#2563EB;padding:2px 8px;border-radius:4px;font-size:11px">W: ${t.weight}%</span>
                <span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:4px;font-size:11px">Used: ${t.usage_count || 0}</span>
              </div>
              <h4 style="margin:0 0 6px 0;color:#1F2937;font-size:14px">${escapeHtml(t.title)}</h4>
              <div class="krs">${krsHtml}</div>
            </div>
            <button class="apply-btn" style="background:#7C3AED;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;white-space:nowrap"
                    onclick="event.stopPropagation();OKRStockBridge.applyAndClose('${escapeHtml(t.template_id)}')">Apply</button>
          </div>
        </div>`;
      }).join('');
      return `<div style="margin-bottom:16px">
        <h3 style="font-size:14px;color:#7C3AED;margin:0 0 8px 0">${icon} ${title} (${items.length})</h3>
        ${cards}
      </div>`;
    };

    return section('Business (BU)', '🏢', suggestions.business) +
           section('Function Unit (FU)', '🔧', suggestions.fu) +
           section('Team', '👥', suggestions.team) +
           section('Individual', '🧑', suggestions.individual);
  }

  // ===== Modal controller =====
  function showModal() {
    // Remove existing modal
    const existing = document.getElementById('okrStockModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'okrStockModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    modal.innerHTML = `
      <div style="background:#F5F3FF;border-radius:16px;max-width:700px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,0.2)">
        <div style="background:linear-gradient(135deg,#7C3AED,#6D28D9);color:white;padding:16px 20px;border-radius:16px 16px 0 0;display:flex;justify-content:space-between;align-items:center">
          <div>
            <h2 style="margin:0;font-size:18px">📥 ดึง OKR จาก Stock</h2>
            <p style="margin:4px 0 0 0;font-size:12px;opacity:0.9">Member: <span id="okrModalMemberId">-</span> · Period: <span id="okrModalPeriod">-</span></p>
          </div>
          <button onclick="OKRStockBridge.closeModal()" style="background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0 8px">×</button>
        </div>
        <div id="okrModalBody" style="padding:16px 20px;overflow-y:auto;flex:1">
          <div style="text-align:center;padding:40px;color:#6B7280">🔄 กำลังโหลด...</div>
        </div>
        <div style="padding:12px 20px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;background:white;border-radius:0 0 16px 16px">
          <small style="color:#6B7280">💡 Click Apply เพื่อ auto-fill ลงฟอร์ม CEO</small>
          <button onclick="OKRStockBridge.closeModal()" style="background:#6B7280;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px">ปิด</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const memberId = getMemberId();
    document.getElementById('okrModalMemberId').textContent = memberId || '(ไม่พบ)';
    document.getElementById('okrModalPeriod').textContent = config.period;

    // Fetch suggestions
    fetchSuggestions()
      .then(res => {
        const html = renderSuggestions(res.suggested_templates);
        document.getElementById('okrModalBody').innerHTML = html;
      })
      .catch(err => {
        document.getElementById('okrModalBody').innerHTML = `<div style="text-align:center;padding:40px 20px;color:#DC2626">
          <div style="font-size:32px;margin-bottom:8px">⚠️</div>
          <strong>ไม่สามารถโหลดได้</strong><br>
          <small>${escapeHtml(err.message)}</small><br><br>
          <small style="color:#6B7280">ตรวจสอบ: 1) API URL ตั้งค่าแล้ว 2) member_id ถูกต้อง 3) Deploy แล้ว</small>
        </div>`;
      });
  }

  function closeModal() {
    const m = document.getElementById('okrStockModal');
    if (m) m.remove();
  }

  async function applyAndClose(templateId) {
    try {
      const result = await applyTemplate(templateId);
      closeModal();
      alert(`✅ Apply สำเร็จ!\n\nTemplate: ${templateId}\nFields filled: ${result.fields_filled}\nLibrary ID: ${result.lib_id || '-'}\n\nตรวจสอบฟอร์ม แล้วกดบันทึกได้เลยค่ะ`);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  }

  // ===== Inject button into CEO Form =====
  function injectButton() {
    // Try multiple locations
    const possibleTargets = [
      () => document.querySelector('[data-section="okr"]'),
      () => document.querySelector('.okr-section'),
      () => document.getElementById('buObj1')?.closest('div')?.parentElement,
      () => document.querySelector('form')
    ];
    let target = null;
    for (const fn of possibleTargets) {
      try {
        const t = fn();
        if (t) { target = t; break; }
      } catch (e) {}
    }
    if (!target) {
      console.warn('OKRStockBridge: cannot find target, will retry on loadExistingData');
      return false;
    }

    if (document.getElementById('okrStockBtn')) return true; // already injected

    const btn = document.createElement('button');
    btn.id = 'okrStockBtn';
    btn.type = 'button';
    btn.innerHTML = '📥 ดึง OKR จาก Stock';
    btn.style.cssText = 'background:linear-gradient(135deg,#7C3AED,#6D28D9);color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;margin:8px 4px;box-shadow:0 2px 4px rgba(124,58,237,0.2)';
    btn.onmouseover = () => btn.style.boxShadow = '0 4px 8px rgba(124,58,237,0.3)';
    btn.onmouseout = () => btn.style.boxShadow = '0 2px 4px rgba(124,58,237,0.2)';
    btn.onclick = showModal;

    target.insertBefore(btn, target.firstChild);
    return true;
  }

  // ===== Init =====
  function init(cfg = {}) {
    config = Object.assign(config, cfg);
    if (!config.api) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('okrApi')) config.api = urlParams.get('okrApi');
    }
    // Inject button when DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInject);
    } else {
      tryInject();
    }
  }

  function tryInject() {
    if (injectButton()) return;
    // Retry after delays (form may load async)
    setTimeout(() => injectButton(), 1000);
    setTimeout(() => injectButton(), 3000);
  }

  // ===== Export =====
  window.OKRStockBridge = {
    init: init,
    setApi: (url) => { config.api = url; },
    setActor: (id) => { config.actorId = id; },
    setPeriod: (p) => { config.period = p; },
    showModal: showModal,
    closeModal: closeModal,
    applyAndClose: applyAndClose,
    fetchSuggestions: fetchSuggestions,
    applyTemplate: applyTemplate,
    injectButton: injectButton
  };

})(window);
