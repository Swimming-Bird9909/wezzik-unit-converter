/**
 * UnitWise — 换算引擎
 * 负责 DOM 渲染、输入解析、即时换算、历史记录、热链、深链同步
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.UWEngine = factory();
  }
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const UW = (typeof window !== 'undefined' && window.UnitWise) || require('./data.js');

  function getURLParams() {
    const p = new URLSearchParams(location.search);
    const out = {};
    for (const [k, v] of p) out[k] = v;
    return out;
  }

  function setURLParams(params, replace = true) {
    const url = new URL(location.href);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined) url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    });
    const method = replace ? 'replaceState' : 'pushState';
    history[method](null, '', url);
  }

  function formatNumber(n, decimals = 6) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    const abs = Math.abs(n);
    if (abs === 0) return '0';
    if (abs < 1e-3 || abs >= 1e7) return n.toExponential(Math.max(2, decimals - 2));
    const fixed = n.toFixed(decimals);
    // 去掉尾随 0
    return fixed.replace(/\.?0+$/, '') || '0';
  }

  function trimFormatting(n, sigFigs = 8) {
    const str = formatNumber(n, sigFigs);
    return str;
  }

  function unitByKey(cat, key, cross) {
    if (UW.UNIT_DATA[cat]?.units?.[key]) return { key, cat, ...UW.UNIT_DATA[cat].units[key] };
    if (cross && UW.UNIT_DATA[cross]?.units?.[key]) return { key, cat: cross, ...UW.UNIT_DATA[cross].units[key] };
    for (const c of Object.keys(UW.UNIT_DATA)) {
      if (UW.UNIT_DATA[c]?.units?.[key]) return { key, cat: c, ...UW.UNIT_DATA[c].units[key] };
    }
    return null;
  }

  function bindSingleConverter(rootEl, opts) {
    const pair = opts.pair; // { cat, from, to, cross?, density?, material? }
    const uFrom = unitByKey(pair.cat, pair.from, pair.cross);
    const uTo   = unitByKey(pair.cat, pair.to,   pair.cross);
    const catData = UW.UNIT_DATA[pair.cat];
    if (!catData || !uFrom || !uTo) { console.warn('UW bind failed', pair); return; }

    const convertOpts = pair.density ? { density: pair.density } : undefined;
    const invert  = pair.density ? 1 / pair.density : null;

    const input = rootEl.querySelector('[data-input]');
    const output = rootEl.querySelector('[data-output]');
    const fromBtn = rootEl.querySelector('[data-from-symbol]');
    const toBtn   = rootEl.querySelector('[data-to-symbol]');
    const swap    = rootEl.querySelector('[data-swap]');
    const copy    = rootEl.querySelector('[data-copy]');
    const tableBody = rootEl.querySelector('[data-table-body]');
    const formulaEl = rootEl.querySelector('[data-formula]');
    const ctx = rootEl.querySelector('[data-ctx]');
    const presetBtns = rootEl.querySelectorAll('[data-preset]');
    const historyList = rootEl.querySelector('[data-history]');
    const clearHistory = rootEl.querySelector('[data-clear-history]');

    let lastVal = '';

    // 公式构造
    if (formulaEl) {
      if (pair.cat === 'temperature') {
        if (pair.from === 'celsius' && pair.to === 'fahrenheit') {
          formulaEl.textContent = '°F = (°C × 9/5) + 32';
        } else if (pair.from === 'fahrenheit' && pair.to === 'celsius') {
          formulaEl.textContent = '°C = (°F − 32) × 5/9';
        } else if (pair.from === 'celsius' && pair.to === 'kelvin') {
          formulaEl.textContent = 'K = °C + 273.15';
        } else if (pair.from === 'kelvin' && pair.to === 'celsius') {
          formulaEl.textContent = '°C = K − 273.15';
        }
      } else if (pair.cat === 'fuelEconomy') {
        formulaEl.textContent = 'MPG ≈ 235.215 ÷ (L/100km)';
      } else {
        const f = uFrom.toBase, t = uTo.toBase;
        if (Number.isInteger(Math.log2(f)) && Number.isInteger(Math.log2(t))) {
          formulaEl.textContent = `1 ${uFrom.symbol} = ${f / t} ${uTo.symbol}`;
        } else {
          formulaEl.textContent = `1 ${uFrom.symbol} = ${(f / t).toFixed(8)} ${uTo.symbol}`;
        }
      }
    }

    function convert(value) {
      const v = parseFloat(value);
      if (Number.isNaN(v)) {
        output.value = '';
        if (ctx) ctx.textContent = '';
        return;
      }
      const result = UW.convert(v, pair.cat, pair.from, pair.to, convertOpts);
      output.value = trimFormatting(result, 8);
      if (ctx) {
        ctx.textContent = `${trimFormatting(v, 8)} ${uFrom.symbol} ≈ ${trimFormatting(result, 8)} ${uTo.symbol}` + (pair.material ? ` (${pair.material})` : '');
      }
    }

    // 速查表生成
    function renderTable() {
      if (!tableBody) return;
      const tableValues = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
      const fmt = (n) => trimFormatting(n, 8);
      const isDensityReverse = !!(pair.density); // 我们假设 from=grams, to=cups/tbsp：n grams → n/density cups
      tableBody.innerHTML = tableValues.map(n => {
        const r = UW.convert(n, pair.cat, pair.from, pair.to, convertOpts);
        return `<tr><td>${fmt(n)} ${uFrom.symbol}</td><td><strong>${fmt(r)}</strong> ${uTo.symbol}</td></tr>`;
      }).join('');
    }

    function renderHistory() {
      if (!historyList) return;
      try {
        const key = `uw-hist-${pair.cat}-${pair.from}-${pair.to}`;
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        historyList.innerHTML = arr.length ? arr.map((item, i) => `
          <li>
            <button class="uw-hist-item" data-i="${i}">
              <span>${item.from} ${uFrom.symbol}</span>
              <span class="uw-hist-arrow">→</span>
              <span><strong>${item.to}</strong> ${uTo.symbol}</span>
            </button>
          </li>
        `).join('') : `<li class="uw-hist-empty">No history yet. Type a number above to begin.</li>`;
      } catch (e) {
        historyList.innerHTML = '';
      }
    }

    function pushHistory(from, to) {
      if (from === '' || Number.isNaN(parseFloat(from))) return;
      try {
        const key = `uw-hist-${pair.cat}-${pair.from}-${pair.to}`;
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.unshift({ from, to });
        // 去重
        const seen = new Set();
        const dedup = [];
        for (const item of arr) {
          const k = `${item.from}->${item.to}`;
          if (!seen.has(k) && dedup.length < 5) {
            seen.add(k);
            dedup.push(item);
          }
        }
        localStorage.setItem(key, JSON.stringify(dedup));
      } catch (e) { /* silent */ }
    }

    function bindEvents() {
      if (fromBtn) fromBtn.textContent = uFrom.symbol;
      if (toBtn)   toBtn.textContent   = uTo.symbol;

      input.addEventListener('input', e => {
        const v = e.target.value;
        lastVal = v;
        convert(v);
        setURLParams({ v }, true);
      });

      input.addEventListener('change', e => {
        if (e.target.value !== '') pushHistory(e.target.value, output.value);
        renderHistory();
      });

      if (swap) {
        swap.addEventListener('click', () => {
          // 跨类别对(grams<->cups etc) 没有反向 slug，禁用 swap
          if (pair.density || pair.cross) {
            if (swap) { swap.disabled = true; swap.style.opacity = 0.4; swap.title = 'Switch units for ingredient-specific conversions by editing the value'; }
            return;
          }
          // 找反向 slug
          const reverse = UW.FEATURED_PAIRS.find(p => p.cat === pair.cat && p.from === pair.to && p.to === pair.from);
          if (reverse) {
            // 必须带 .html 后缀，否则 Cloudflare fallback 会跳到首页
            location.href = `/${reverse.slug}.html${location.search || ''}`;
          } else {
            // 找不到反向：本地交换两个 input/output 的值，给用户即时反馈
            const oldFrom = input.value;
            input.value = output.value;
            convert(input.value);
            try { setURLParams({ v: input.value }, true); } catch (e) {}
            // 视觉小提示
            swap.classList.add('uw-swap-flash');
            setTimeout(() => swap.classList.remove('uw-swap-flash'), 350);
            if (oldFrom === '') {
              // 第一次没输入时给个示例
              const sample = (pair.cat === 'temperature') ? 100 : 1;
              input.value = sample;
              convert(sample);
            }
          }
        });
        if (pair.density || pair.cross) { swap.disabled = true; swap.style.opacity = 0.4; swap.title = 'Edit values manually — ingredient density varies'; }
      }

      if (copy) {
        copy.addEventListener('click', async () => {
          if (!output.value) return;
          try {
            await navigator.clipboard.writeText(output.value);
            const old = copy.dataset.label || copy.textContent;
            copy.dataset.label = old;
            copy.textContent = '✓ Copied';
            setTimeout(() => { copy.textContent = old; }, 1500);
          } catch (e) {
            // fallback
            output.select();
            document.execCommand('copy');
          }
        });
      }

      presetBtns.forEach(b => b.addEventListener('click', e => {
        e.preventDefault();
        input.value = b.dataset.preset;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }));

      if (historyList) {
        historyList.addEventListener('click', e => {
          const item = e.target.closest('[data-i]');
          if (!item) return;
          const i = parseInt(item.dataset.i, 10);
          try {
            const arr = JSON.parse(localStorage.getItem(`uw-hist-${pair.cat}-${pair.from}-${pair.to}`) || '[]');
            const it = arr[i];
            if (it) input.value = it.from;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          } catch (e) {}
        });
      }

      if (clearHistory) {
        clearHistory.addEventListener('click', () => {
          localStorage.removeItem(`uw-hist-${pair.cat}-${pair.from}-${pair.to}`);
          renderHistory();
        });
      }
    }

    function init() {
      // URL ?v=12 优先；否则默认 1
      const params = getURLParams();
      const startVal = params.v !== undefined ? params.v : 1;
      input.value = startVal;
      convert(startVal);
      renderTable();
      renderHistory();
      bindEvents();
    }

    init();
  }

  return {
    bindSingleConverter,
    getURLParams,
    setURLParams,
    formatNumber,
    unitByKey,
  };
}));
