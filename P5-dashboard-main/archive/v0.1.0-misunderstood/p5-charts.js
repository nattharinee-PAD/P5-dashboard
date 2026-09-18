/* ============================================================
   P5 Charts Engine — Custom SVG Donut + Bar Charts
   ไม่พึ่ง Chart.js / D3 — เขียนเองเพื่อ performance & zero-dependency
   สร้างโดย AliClaw 🐾
   ============================================================ */

(function () {
  'use strict';
  const D = window.P5_DATA;
  if (!D) { console.error('P5_DATA not loaded'); return; }

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const fmtNum = (n) => new Intl.NumberFormat('th-TH').format(n);

  // ---------------------------------------------------------
  // 1) DONUT CHART
  // ---------------------------------------------------------
  function renderDonut(svgId, data, centerNumId) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';

    const cx = 100, cy = 100, r = 80;     // viewBox 0 0 200 200
    const C  = 2 * Math.PI * r;            // circumference = 502.65...
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
      seg.setAttribute('data-label', d.label);
      seg.setAttribute('data-value', d.value);
      seg.setAttribute('data-pct',  (frac * 100).toFixed(1));
      svg.appendChild(seg);

      // Animate stroke from 0 -> dash on next frame
      requestAnimationFrame(() => {
        setTimeout(() => {
          seg.setAttribute('stroke-dasharray', `${dash} ${C - dash}`);
        }, 80 + i * 90);
      });

      offset += dash;
    });

    // Update center number with animated count
    const center = document.getElementById(centerNumId);
    if (center) animateCount(center, 0, total, 1200, fmtNum);
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
          <span class="legend-value">${fmtNum(d.value)}</span>
          <span class="legend-pct">${pct}%</span>
        </li>`;
    }).join('');
  }

  // ---------------------------------------------------------
  // 2) KPI CARDS
  // ---------------------------------------------------------
  function renderKPICards() {
    const grid = document.getElementById('kpiGrid');
    if (!grid) return;
    grid.innerHTML = D.kpiCards.map(k => `
      <div class="kpi-card" style="--kpi-gradient: ${k.gradient}">
        <div class="kpi-card-icon">${k.icon}</div>
        <div class="kpi-card-title">${k.title}</div>
        <div class="kpi-card-value">${k.value}</div>
        <div>
          <span class="kpi-card-delta">${k.trend === 'up' ? '↑' : '↓'} ${k.delta}</span>
          <span class="kpi-card-delta-label">${k.deltaLabel}</span>
        </div>
      </div>
    `).join('');
  }

  // ---------------------------------------------------------
  // 3) HORIZONTAL BAR CHART (with label + track + value)
  // ---------------------------------------------------------
  function renderHBar(containerId, data, opts = {}) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const max = opts.max || Math.max(...data.map(d => d.value));
    const gradStart = opts.gradStart || '#7c5cff';
    const gradEnd   = opts.gradEnd   || '#22d3ee';

    wrap.innerHTML = data.map(d => {
      const pct = (d.value / max) * 100;
      return `
        <div class="bar-row">
          <div class="bar-label" title="${d.label}">${d.label}</div>
          <div class="bar-track">
            <div class="bar-fill"
                 data-target="${pct}"
                 style="background: linear-gradient(90deg, ${gradStart} 0%, ${gradEnd} 100%);"></div>
          </div>
          <div class="bar-value" data-target="${d.value}">0</div>
        </div>`;
    }).join('');

    // Animate fill widths
    requestAnimationFrame(() => {
      wrap.querySelectorAll('.bar-fill').forEach((el, i) => {
        setTimeout(() => { el.style.width = el.dataset.target + '%'; }, 100 + i * 70);
      });
      // Animate value text
      wrap.querySelectorAll('.bar-value').forEach((el, i) => {
        const target = parseFloat(el.dataset.target);
        setTimeout(() => animateCount(el, 0, target, 1100, (v) => {
          return opts.fmt ? opts.fmt(v) : fmtNum(v);
        }), 100 + i * 70);
      });
    });
  }

  // ---------------------------------------------------------
  // 4) VERTICAL BAR CHART (months)
  // ---------------------------------------------------------
  function renderVBar(containerId, data) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.classList.add('bar-month-grid');
    const max = Math.max(...data.map(d => d.value));
    wrap.innerHTML = data.map(d => {
      const pct = (d.value / max) * 100;
      return `
        <div class="bar-month">
          <div class="bar-month-value" data-target="${d.value}">0</div>
          <div class="bar-month-track">
            <div class="bar-month-fill" data-target="${pct}"></div>
          </div>
          <div class="bar-month-label">${d.label}</div>
        </div>`;
    }).join('');

    requestAnimationFrame(() => {
      wrap.querySelectorAll('.bar-month-fill').forEach((el, i) => {
        setTimeout(() => { el.style.height = el.dataset.target + '%'; }, 100 + i * 70);
      });
      wrap.querySelectorAll('.bar-month-value').forEach((el, i) => {
        const target = parseFloat(el.dataset.target);
        setTimeout(() => animateCount(el, 0, target, 1100, fmtNum), 100 + i * 70);
      });
    });
  }

  // ---------------------------------------------------------
  // 5) FEED LIST
  // ---------------------------------------------------------
  function renderFeed() {
    const ul = document.getElementById('feedList');
    if (!ul) return;
    ul.innerHTML = D.recentActivities.map(a => `
      <li>
        <div class="feed-icon ${a.tag}">${a.icon}</div>
        <div class="feed-text">${a.text}</div>
        <div class="feed-time">${a.time}</div>
      </li>
    `).join('');
  }

  // ---------------------------------------------------------
  // 6) COUNT ANIMATION
  // ---------------------------------------------------------
  function animateCount(el, from, to, duration, formatter) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);              // easeOutCubic
      const v = from + (to - from) * eased;
      el.textContent = formatter ? formatter(v) : Math.round(v);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------------------------------------------------------
  // 7) RE-RENDER ON RESIZE (donut dash recalc)
  // ---------------------------------------------------------
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDonut('donutBU', D.membersByBU, 'donutBUCenter');
      renderDonut('donutDev', D.developmentLevel, 'donutDevCenter');
    }, 200);
  });

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    renderKPICards();
    renderDonut('donutBU', D.membersByBU, 'donutBUCenter');
    renderLegend('legendBU', D.membersByBU);
    renderDonut('donutDev', D.developmentLevel, 'donutDevCenter');
    renderLegend('legendDev', D.developmentLevel);

    renderHBar('barStandards', D.standardsKPI, {
      max: 100,
      gradStart: '#7c5cff',
      gradEnd:   '#22d3ee',
      fmt: (v) => v.toFixed(1) + '%'
    });

    renderHBar('barCulture', D.cultureTop10, {
      max: 100,
      gradStart: '#f472b6',
      gradEnd:   '#a78bfa',
      fmt: (v) => v.toFixed(0) + '%'
    });

    renderVBar('barMonthly', D.monthlyActivities);
    renderFeed();

    console.log('🐾 P5 Dashboard rendered with', D.membersByBU.length + D.developmentLevel.length + D.standardsKPI.length + D.cultureTop10.length + D.monthlyActivities.length, 'data points');
  });
})();
