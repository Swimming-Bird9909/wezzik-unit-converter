/**
 * UnitWise — 全站通用交互
 * 暗色模式 / Cookie 同意 / 站内搜索 / 通用习惯
 */
(function () {
  'use strict';

  // ——— 暗色模式 ———
  (function theme() {
    const STORAGE_KEY = 'uw-theme';
    const root = document.documentElement;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.dataset.theme = 'dark';
    } else {
      root.dataset.theme = 'light';
    }
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-toggle-theme]');
      if (!t) return;
      e.preventDefault();
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem(STORAGE_KEY, next);
    });
  })();

  // ——— Cookie 同意横幅 ———
  (function cookieBanner() {
    const KEY = 'uw-cookie-consent';
    if (localStorage.getItem(KEY)) return;
    const banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;
    banner.hidden = false;
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      localStorage.setItem(KEY, 'accepted');
      banner.hidden = true;
    });
    banner.querySelector('[data-cookie-learn]')?.addEventListener('click', () => {
      location.href = '/cookies.html';
    });
  })();

  // ——— 站内搜索（用户输关键词直达目标换算） ———
  (function instantSearch() {
    const input = document.querySelector('[data-instant-search]');
    if (!input) return;
    const results = document.querySelector('[data-instant-results]');
    const UW = window.UnitWise || {};
    if (!UW.FEATURED_PAIRS) return;
    const pairs = UW.FEATURED_PAIRS.map(p => {
      const u1 = UW.UNIT_DATA[p.cat].units[p.from];
      const u2 = UW.UNIT_DATA[p.cat].units[p.to];
      return { ...p, label: `${u1.name} to ${u2.name}`, slug: p.slug };
    });
    input.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ''; return; }
      const hits = pairs
        .map(p => {
          let score = 0;
          if (p.slug.includes(q)) score += 10;
          if (p.label.toLowerCase().includes(q)) score += 5;
          if ((p.slug.replace(/-/g, ' ')).includes(q)) score += 4;
          return { p, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      results.innerHTML = hits.length
        ? hits.map(x => `<li><a href="/${x.p.slug}.html">${x.p.label}</a></li>`).join('')
        : `<li class="uw-no-result">No match found. Try "kg to lbs", "psi to bar", "celsius to fahrenheit"...</li>`;
    });
  })();

  // ——— 全站当前年份 ———
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
