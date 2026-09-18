/* ============================================================
   P5 v0.2.0 — App Logic
   Login, Navigation, Page Rendering, Custom Charts
   AliClaw 🐾 — 10 มิ.ย. 2569
   ============================================================ */

(function () {
  'use strict';
  const D = window.P5_DATA;
  if (!D) { console.error('P5_DATA not loaded'); return; }

  let currentUser = null;
  let currentPage = 'dashboard';

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const $  = (sel) => document.querySelector(sel);
  const fmt = (n) => new Intl.NumberFormat('th-TH').format(n);

  function pctClass(p) {
    if (p >= 80) return 'pct-green';
    if (p >= 60) return 'pct-gold';
    return 'pct-red';
  }

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  window.doLogin = function (type) {
    const input = $('#loginInput');
    const val   = input.value.trim();

    if (type === 'guest') {
      currentUser = { id: 'guest', name: 'Guest', role: 'guest', bu: 'all' };
    } else if (!val) {
      $('#loginError').textContent = '❌ กรุณาใส่รหัส';
      $('#loginError').style.display = 'block';
      return;
    } else if (D.users[val]) {
      const u = D.users[val];
      currentUser = { id: val, name: u.name, role: u.role, bu: u.bu, avatar: u.avatar };
    } else {
      // unknown — treat as member
      currentUser = { id: val, name: 'สมาชิก #' + val, role: 'member', bu: 'unknown' };
    }
    enterApp();
  };

  function enterApp() {
    $('#loginScreen').style.display = 'none';
    $('#appScreen').style.display   = 'block';

    $('#userNameTop').textContent  = currentUser.name;
    $('#userNameSide').textContent = currentUser.name;
    const roleText = {
      admin: '👑 ADMIN PAD', bmc: '📊 BMC',
      member: '👤 สมาชิก',   guest: '👁️ Guest'
    }[currentUser.role] || '👤 สมาชิก';
    $('#userRole').textContent = roleText;

    const av = currentUser.avatar || currentUser.name.charAt(0);
    $('#userAvatarTop').textContent  = av;
    $('#userAvatarSide').textContent = av;

    if (currentUser.role === 'guest') {
      $('#guestNotice') && ($('#guestNotice').style.display = 'flex');
    }
    showPage('dashboard');
  }

  window.doLogout = function () {
    currentUser = null;
    $('#appScreen').style.display   = 'none';
    $('#loginScreen').style.display = 'flex';
    $('#loginInput').value = '';
    $('#loginError').style.display = 'none';
  };

  // Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && $('#loginScreen').style.display !== 'none') doLogin();
  });

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------
  window.showPage = function (page) {
    currentPage = page;
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = $('#page-' + page);
    if (el) el.classList.add('active');
    const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (nav) nav.classList.add('active');
    if (window.innerWidth < 900) closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.toggleSidebar = function () {
    $('#sidebar').classList.toggle('open');
    $('#sidebarOverlay').classList.toggle('show');
  };
  window.closeSidebar = function () {
    $('#sidebar').classList.remove('open');
    $('#sidebarOverlay').classList.remove('show');
  };

  // ---------------------------------------------------------
  // PAGE RENDERING
  // ---------------------------------------------------------
  function renderAllPages() {
    $('#pageContent').innerHTML =
      renderDashboard() +
      renderTraining() +
      renderMentor() +
      renderCoach() +
      renderRoleplay() +
      renderCapital() +
      renderOther();
  }

  // ============ DASHBOARD ============
  function renderDashboard() {
    return `
    <div class="page-section active" id="page-dashboard">
      <div class="guest-notice" id="guestNotice" style="display:none">
        <span>👁️</span>
        <span>คุณกำลังดูแบบ <strong>Guest</strong> — เข้าสู่ระบบเพื่อดูข้อมูลเพิ่มเติม</span>
      </div>

      <div class="section-header">
        <div class="icon-wrap green">📊</div>
        <div>
          <h2>Dashboard P5 — ภาพรวมทุกระบบ</h2>
          <div class="sub">สมาชิกสถานะประจำ บรรจุก่อน 1 ม.ค. 2026 · 5 BU · 5 ระบบ</div>
        </div>
      </div>

      <div class="kpi-grid">
        ${kpi('🎯', '327', 'สมาชิกสถานะประจำ (Y+N)', 'green')}
        ${kpi('📚', '248', 'ครบ 44 หน่วยกิต (Training)', 'green', '75.8%')}
        ${kpi('👥', '285', 'ผ่านรายงานน้องเลี้ยง (Mentor)', 'green', '87.2%')}
        ${kpi('🎯', '118', 'โค้ชแล้ว (Coach)', 'blue', '75.6%')}
        ${kpi('🎭', '38/52', 'Roleplay เดือนเม.ย.', 'gold', '73.1%')}
        ${kpi('🏛️', '45', 'ภาวะผู้นำผู้รับใช้ (ระดับ 6)', 'green')}
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <h3>📊 สัดส่วนสมาชิก 5 BU</h3>
          <p class="chart-sub">รวม 327 คน</p>
          <div class="donut-wrap">
            <div class="donut-stage">
              <svg id="donutBU" viewBox="0 0 200 200"></svg>
              <div class="donut-center">
                <div class="donut-center-num" id="donutBUCenter">327</div>
                <div class="donut-center-label">สมาชิกทั้งหมด</div>
              </div>
            </div>
            <ul class="legend" id="legendBU"></ul>
          </div>
        </div>

        <div class="chart-card">
          <h3>📈 ความก้าวหน้า 6 ระดับนิเทศ</h3>
          <p class="chart-sub">ปฐมนิเทศ → ภาวะผู้นำผู้รับใช้</p>
          <div class="bar-wrap" id="barCapital"></div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <h3>📚 Training: % ครบ 44 หน่วยกิต vs GPA ≥ 3.5</h3>
          <p class="chart-sub">แยกตาม BU</p>
          <div class="bar-wrap" id="barTraining"></div>
        </div>

        <div class="chart-card">
          <h3>🎭 Roleplay: ส่งรายเดือน (ม.ค.-เม.ย.)</h3>
          <p class="chart-sub">52 ทีมต่อเดือน</p>
          <div class="bar-wrap" id="barRoleplay"></div>
        </div>
      </div>
    </div>`;
  }

  function kpi(icon, value, label, color, sub) {
    return `
      <div class="kpi-card color-${color}">
        <div class="kpi-icon">${icon}</div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-label">${label}</div>
        ${sub ? `<div class="kpi-sub">${sub}</div>` : ''}
      </div>`;
  }

  // ============ TRAINING ============
  function renderTraining() {
    return `
    <div class="page-section" id="page-training">
      <div class="section-header">
        <div class="icon-wrap green">📚</div>
        <div>
          <h2>ระบบ Training</h2>
          <div class="sub">เป้าหมายหน่วยกิต & GPA — สมาชิกสถานะประจำ บรรจุก่อน 1 ม.ค. 2026</div>
        </div>
      </div>

      <div class="kpi-grid">
        ${D.training.kpiCards.map(c => kpi(c.icon, c.value, c.label, c.color, c.sub)).join('')}
      </div>

      <div class="card">
        <div class="card-title">📊 แยกตาม BU</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>BU</th><th class="num">สมาชิกสถานะประจำ</th>
              <th class="num">ครบ 44 หน่วยกิต</th><th class="pct">% ครบ</th>
              <th class="num">GPA ≥ 3.5</th><th class="pct">% GPA</th>
            </tr>
          </thead>
          <tbody>
            ${D.training.byBU.map(b => `
              <tr>
                <td class="bu-name">${b.bu}</td>
                <td class="num">${b.members}</td>
                <td class="num">${b.complete44}</td>
                <td class="pct ${pctClass(b.completePct)}">${b.completePct.toFixed(1)}%</td>
                <td class="num">${b.gpa35}</td>
                <td class="pct ${pctClass(b.gpaPct)}">${b.gpaPct.toFixed(1)}%</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // ============ MENTOR ============
  function renderMentor() {
    const s = D.mentor.summary;
    return `
    <div class="page-section" id="page-mentor">
      <div class="section-header">
        <div class="icon-wrap gold">👥</div>
        <div>
          <h2>ระบบ Mentor</h2>
          <div class="sub">น้องเลี้ยง & รายงานวินัย ≥ 90%</div>
        </div>
      </div>

      <div class="pkg-total-bar">
        <span class="pt-label">🏛️ PKG รวมทุก BU:</span>
        <span class="pt-stat">สมาชิก <span class="pt-val">${s.total}</span> คน</span>
        <span class="pt-div">|</span>
        <span class="pt-stat">ส่ง ≥90% <span class="pt-val" style="color:#16a34a">${s.pass}</span> คน</span>
        <span class="pt-div">|</span>
        <span class="pt-stat">ไม่ผ่าน <span class="pt-val red">${s.fail}</span> คน</span>
        <span class="pt-div">|</span>
        <span class="pt-stat"><span class="pt-val" style="color:#16a34a">${s.pct.toFixed(1)}%</span></span>
      </div>

      <div class="card">
        <div class="card-title">📋 รายงานน้องเลี้ยงแยกกลุ่ม + BU</div>
        <table class="data-table" style="font-size:0.78em">
          <thead>
            <tr>
              <th>กลุ่ม</th><th>BU</th>
              <th class="num">จำนวนสมาชิก</th>
              <th class="num">ส่ง ≥90%</th>
              <th class="num">ไม่ผ่าน</th>
              <th class="pct">% วินัย</th>
            </tr>
          </thead>
          <tbody>
            ${D.mentor.groups.map(g => `
              <tr class="group-header ${g.color}"><td colspan="6">${g.name}</td></tr>
              ${g.items.map(b => `
                <tr>
                  <td rowspan="${g.items.length + 1}" style="background:rgba(22,163,74,0.10);text-align:center;font-weight:700;font-size:0.8em;vertical-align:middle">${g.name.split(' ').pop()}</td>
                  <td class="bu-name">${b.bu}</td>
                  <td class="num">${b.total}</td>
                  <td class="num" style="color:#16a34a">${b.pass}</td>
                  <td class="num" style="color:#ef4444">${b.fail}</td>
                  <td class="pct ${pctClass(b.pct)}">${b.pct.toFixed(1)}%</td>
                </tr>`).join('')}
              <tr class="subtotal">
                <td class="bu-name">รวม${g.name}</td>
                <td class="num">${g.subtotal.total}</td>
                <td class="num" style="color:#16a34a">${g.subtotal.pass}</td>
                <td class="num" style="color:#ef4444">${g.subtotal.fail}</td>
                <td class="pct ${pctClass(g.subtotal.pct)}">${g.subtotal.pct.toFixed(1)}%</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // ============ COACH ============
  function renderCoach() {
    return `
    <div class="page-section" id="page-coach">
      <div class="section-header">
        <div class="icon-wrap blue">🎯</div>
        <div>
          <h2>ระบบ Coach</h2>
          <div class="sub">พี่เลี้ยงโค้ชน้องเลี้ยง — วัดผลการโค้ช</div>
        </div>
      </div>

      <div class="kpi-grid">
        ${D.coach.kpiCards.map(c => kpi(c.icon, c.value, c.label, c.color, c.sub)).join('')}
      </div>

      <div class="card">
        <div class="card-title">📊 แยกตาม BU</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>BU</th>
              <th class="num">พี่เลี้ยงทั้งหมด</th>
              <th class="num">โค้ชแล้ว</th>
              <th class="num">ยังไม่โค้ช</th>
              <th class="pct">% โค้ช</th>
            </tr>
          </thead>
          <tbody>
            ${D.coach.byBU.map(b => `
              <tr>
                <td class="bu-name">${b.bu}</td>
                <td class="num">${b.total}</td>
                <td class="num" style="color:#16a34a">${b.done}</td>
                <td class="num" style="color:#ef4444">${b.pending}</td>
                <td class="pct ${pctClass(b.pct)}">${b.pct.toFixed(1)}%</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // ============ ROLEPLAY ============
  function renderRoleplay() {
    return `
    <div class="page-section" id="page-roleplay">
      <div class="section-header">
        <div class="icon-wrap purple">🎭</div>
        <div>
          <h2>ระบบ Roleplay</h2>
          <div class="sub">สถานะการส่ง Roleplay แยกเดือน + BU</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📅 สถานะส่ง Roleplay เดือน ม.ค. - มิ.ย. 2026</div>
        <div class="month-grid">
          ${D.roleplay.months.map(m => {
            let cls = '';
            if (m.status === 'current') cls = 'current';
            else if (m.status === 'future') cls = 'future';
            const valText = m.status === 'future' ? '—' : `${m.sent}/${m.total}`;
            const pctText = m.status === 'future' ? 'ยังไม่ถึง' : `${m.pct.toFixed(1)}%`;
            const valColor = m.status === 'future' ? 'var(--text-mute)'
              : (m.pct >= 85 ? '#16a34a' : m.pct >= 70 ? '#d4a017' : '#ef4444');
            return `
              <div class="month-cell ${cls}">
                <div class="month-name">${m.name}${m.status === 'current' ? ' ★' : ''}</div>
                <div class="month-val" style="color:${valColor}">${valText}</div>
                <div class="month-pct">${pctText}</div>
              </div>`;
          }).join('')}
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>BU</th><th class="num">ทีมทั้งหมด</th>
              <th class="num">ส่งแล้ว</th>
              <th class="num">ยังไม่ส่ง</th>
              <th class="pct">% ส่ง</th>
            </tr>
          </thead>
          <tbody>
            ${D.roleplay.byBU.map(b => `
              <tr>
                <td class="bu-name">${b.bu}</td>
                <td class="num">${b.total}</td>
                <td class="num" style="color:#16a34a">${b.sent}</td>
                <td class="num" style="color:#ef4444">${b.pending}</td>
                <td class="pct ${pctClass(b.pct)}">${b.pct.toFixed(1)}%</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="detail-center">
          <button class="detail-toggle" onclick="toggleDetail('rpDetail')">📋 ดูทีมที่ยังไม่ส่งเดือนนี้</button>
        </div>
        <div class="detail-panel" id="rpDetail">
          <table class="data-table">
            <thead><tr><th>BU</th><th>ทีมที่ยังไม่ส่ง</th></tr></thead>
            <tbody>
              ${D.roleplay.pendingTeams.map(p => `
                <tr><td class="bu-name">${p.bu}</td><td>${p.teams}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  window.toggleDetail = function (id) {
    $('#' + id).classList.toggle('show');
  };

  // ============ CAPITAL ============
  function renderCapital() {
    return `
    <div class="page-section" id="page-capital">
      <div class="section-header">
        <div class="icon-wrap red">🏛️</div>
        <div>
          <h2>ระบบกำกับทุนองค์กรสมาชิก PKG</h2>
          <div class="sub">ปฐมนิเทศ → ภาวะผู้นำผู้รับใช้</div>
        </div>
      </div>

      <div class="level-grid">
        ${D.capital.levels.map(l => `
          <div class="level-card" style="border-top: 3px solid ${l.color}">
            <div class="level-num">ระดับ ${l.num}</div>
            <div class="level-name">${l.name}</div>
            <div class="level-count" style="color:${l.color}">${l.pass}</div>
            <div class="level-sub">
              ✅ ผ่าน ${l.pass} &nbsp;⏳ รอ ${l.wait} &nbsp;➖ ${l.none}
            </div>
          </div>`).join('')}
      </div>

      <div class="card">
        <div class="card-title">📊 แยกตาม BU (ผ่าน / รออบรม / ไม่ต้องอบรม)</div>
        <table class="data-table" style="font-size:0.76em">
          <thead>
            <tr>
              <th>BU</th>
              ${D.capital.levelNames.map(n => `<th class="num">${n}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${D.capital.byBU.map(row => `
              <tr>
                <td class="bu-name">${row.bu}</td>
                ${row.data.map(d => `
                  <td class="num">
                    <span style="color:#16a34a">${d[0]}</span>/<span style="color:#d4a017">${d[1]}</span>/<span style="color:#94a3b8">${d[2]}</span>
                  </td>`).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // ============ OTHER ============
  function renderOther() {
    return `
    <div class="page-section" id="page-other">
      <div class="section-header">
        <div class="icon-wrap green">⚙️</div>
        <div>
          <h2>อื่นๆ</h2>
          <div class="sub">เครื่องมือและการตั้งค่าเพิ่มเติม</div>
        </div>
      </div>

      <div class="other-grid">
        ${D.other.cards.map(c => `
          <div class="other-card">
            <div class="o-icon">${c.icon}</div>
            <div class="o-info">
              <h3>${c.title}</h3>
              <p>${c.desc}</p>
            </div>
            ${c.count > 0 ? `<span class="o-badge">${c.count}</span>` : ''}
          </div>`).join('')}
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // CUSTOM CHARTS (Donut + Bar)
  // ---------------------------------------------------------
  function renderDonut(svgId, data, centerNumId) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    const cx = 100, cy = 100, r = 80;
    const C  = 2 * Math.PI * r;
    const total = data.reduce((s, d) => s + d.value, 0);

    let offset = 0;
    data.forEach((d, i) => {
      const seg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const frac = d.value / total;
      const dash = C * frac;
      seg.setAttribute('cx', cx);
      seg.setAttribute('cy', cy);
      seg.setAttribute('r',  r);
      seg.setAttribute('class', 'donut-segment');
      seg.setAttribute('stroke', d.color);
      seg.setAttribute('stroke-dasharray', `0 ${C}`);
      seg.setAttribute('stroke-dashoffset', -offset);
      svg.appendChild(seg);
      requestAnimationFrame(() => {
        setTimeout(() => seg.setAttribute('stroke-dasharray', `${dash} ${C - dash}`), 80 + i * 90);
      });
      offset += dash;
    });
    const center = document.getElementById(centerNumId);
    if (center) animateCount(center, 0, total, 1200, (v) => fmt(Math.round(v)));
  }

  function renderLegend(ulId, data) {
    const ul = document.getElementById(ulId);
    if (!ul) return;
    const total = data.reduce((s, d) => s + d.value, 0);
    ul.innerHTML = data.map(d => {
      const pct = ((d.value / total) * 100).toFixed(1);
      return `
        <li>
          <span class="legend-dot" style="background:${d.color}"></span>
          <span class="legend-label">${d.label}</span>
          <span class="legend-value">${fmt(d.value)}</span>
          <span class="legend-pct">${pct}%</span>
        </li>`;
    }).join('');
  }

  function renderHBar(containerId, data, opts = {}) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const max = opts.max || 100;
    wrap.innerHTML = data.map(d => {
      const pct = (d.value / max) * 100;
      const color = opts.color || 'linear-gradient(90deg, #16a34a, #d4a017)';
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
        setTimeout(() => animateCount(el, 0, target, 1100, (v) => {
          return opts.fmt ? opts.fmt(v) : fmt(Math.round(v));
        }), 100 + i * 70);
      });
    });
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

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    renderAllPages();

    // Render dashboard charts after DOM ready
    requestAnimationFrame(() => {
      const buData = D.training.byBU.map(b => ({
        label: b.bu, value: b.members, color: buColor(b.bu)
      }));
      renderDonut('donutBU', buData, 'donutBUCenter');
      renderLegend('legendBU', buData);

      renderHBar('barCapital', D.capital.levels.map(l => ({
        label: 'ระดับ ' + l.num + ' ' + l.name, value: l.pass
      })), { max: 327, fmt: (v) => fmt(Math.round(v)) + ' คน' });

      renderHBar('barTraining', D.training.byBU.flatMap(b => [
        { label: b.bu + ' • ครบ 44', value: b.completePct },
        { label: b.bu + ' • GPA 3.5',  value: b.gpaPct }
      ]), { max: 100, fmt: (v) => v.toFixed(1) + '%' });

      renderHBar('barRoleplay', D.roleplay.months
        .filter(m => m.status !== 'future')
        .map(m => ({ label: m.name, value: m.pct })),
        { max: 100, fmt: (v) => v.toFixed(1) + '%' });
    });
  });

  function buColor(bu) {
    return ({
      PMSG:   '#16a34a',
      CPDG:   '#22c55e',
      AAMG:   '#d4a017',
      RPLCG:  '#3b82f6',
      RAFCOG: '#a855f7'
    })[bu] || '#6b7280';
  }
})();
