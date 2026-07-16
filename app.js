// Devcon 8 India / Mumbai Field Guide / interactions

// --- Hero sunburst rays (generated so the markup stays clean) ---
(function buildRays() {
  const g = document.getElementById('rays');
  if (!g) return;
  const cx = 100, cy = 100, inner = 36, outer = 98;
  let svg = '';
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * inner;
    const y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a) * outer;
    const y2 = cy + Math.sin(a) * outer;
    svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
  }
  g.innerHTML = svg;
})();

// --- Hero ticker (duplicated track for a seamless loop) ---
(function buildTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;
  const items = [
    ['Nov 3 to 6, 2026', 1], ['Jio World Convention Centre', 0], ['Bandra Kurla Complex', 0],
    ['IST = UTC+5:30', 0], ['Currency: INR (₹)', 0], ['Diwali: Nov 8', 1],
    ['Do not drink the tap water', 1], ['English widely spoken', 0], ['Take the Metro in rush hour', 0],
    ['Emergency: 112', 1], ['Every place links to Maps', 0],
  ];
  const row = items.map(([t, hl]) => `<span class="${hl ? 'hl' : ''}">${t} &nbsp;·</span>`).join('');
  track.innerHTML = row + row; // duplicate for the -50% scroll loop
})();

// --- Food diet filter ---
const filterbar = document.getElementById('filterbar');
const foodCards = Array.from(document.querySelectorAll('.food'));
filterbar?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  filterbar.querySelectorAll('.filter-btn').forEach((b) =>
    b.setAttribute('aria-pressed', String(b === btn))
  );
  foodCards.forEach((card) => {
    const diets = card.dataset.diet.split(' ');
    const show = filter === 'all' || diets.includes(filter);
    card.classList.toggle('hide', !show);
  });
  updateFoodCount();
});
function updateFoodCount() {
  const shown = foodCards.filter((c) => !c.classList.contains('hide')).length;
  const fc = document.getElementById('foodCount');
  if (fc) fc.textContent = shown === foodCards.length ? `${shown} places` : `${shown} of ${foodCards.length} places`;
  document.getElementById('foodEmpty')?.classList.toggle('show', shown === 0);
}
updateFoodCount();

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

// --- Theme toggle (shared by navbar and accessibility panel) ---
(function themeControls() {
  const root = document.documentElement;
  const store = window.localStorage;
  const get = (k, d) => { try { return store.getItem(k) ?? d; } catch { return d; } };
  const set = (k, v) => { try { store.setItem(k, v); } catch {} };
  const remove = (k) => { try { store.removeItem(k); } catch {} };

  function currentTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist = true) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    if (persist) set('guide-theme', next);

    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === next));
    });

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const isDark = next === 'dark';
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', label);
      button.title = label;
    });
  }

  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.themeChoice));
  });

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
  });

  window.resetGuideTheme = () => {
    remove('guide-theme');
    applyTheme('light', false);
  };

  applyTheme(get('guide-theme', 'light'), false);
})();

// --- Accessibility toolbar (persisted preferences) ---
(function a11y() {
  const fab = document.getElementById('a11yFab');
  const panel = document.getElementById('a11yPanel');
  if (!fab || !panel) return;
  const store = window.localStorage;
  const get = (k, d) => { try { return store.getItem(k) ?? d; } catch { return d; } };
  const set = (k, v) => { try { store.setItem(k, v); } catch {} };

  // open / close
  const setOpen = (o) => { panel.classList.toggle('open', o); fab.setAttribute('aria-expanded', String(o)); };
  fab.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) setOpen(false);
  });

  // text size (zoom scales the whole layout proportionally)
  function applySize(factor) {
    document.documentElement.style.zoom = factor === '1' ? '' : factor;
    panel.querySelectorAll('[data-size]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.size === factor))
    );
  }
  panel.querySelectorAll('[data-size]').forEach((b) =>
    b.addEventListener('click', () => { applySize(b.dataset.size); set('a11y-size', b.dataset.size); })
  );

  // boolean toggles -> body class
  function applyToggle(cls, on) {
    document.body.classList.toggle(cls, on);
    panel.querySelectorAll(`[data-toggle="${cls}"]`).forEach((b) =>
      b.setAttribute('aria-pressed', String((b.dataset.on === 'true') === on))
    );
  }
  panel.querySelectorAll('[data-toggle]').forEach((b) =>
    b.addEventListener('click', () => {
      const cls = b.dataset.toggle, on = b.dataset.on === 'true';
      applyToggle(cls, on); set('a11y-' + cls, String(on));
    })
  );

  // reset
  document.getElementById('a11yReset')?.addEventListener('click', () => {
    ['a11y-size', 'a11y-hc', 'a11y-ul-links', 'a11y-reduce-motion'].forEach((k) => { try { store.removeItem(k); } catch {} });
    applySize('1'); ['hc', 'ul-links', 'reduce-motion'].forEach((c) => applyToggle(c, false));
    window.resetGuideTheme?.();
  });

  // restore saved prefs (default reduce-motion to the OS setting if unset)
  applySize(get('a11y-size', '1'));
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  applyToggle('hc', get('a11y-hc', 'false') === 'true');
  applyToggle('ul-links', get('a11y-ul-links', 'false') === 'true');
  applyToggle('reduce-motion', get('a11y-reduce-motion', prefersReduce ? 'true' : 'false') === 'true');
})();

// --- Food cuisine emojis (decorative, hidden from screen readers) ---
(function foodEmojis() {
  const map = [
    [['chabad', 'kosher'], '✡️'], [['south indian'], '🥞'],
    [['seafood', 'coastal', 'gajalee', 'mahesh', 'trishna'], '🦐'],
    [['mughlai', 'kebab', 'biryani', 'bademiya', 'shalimar', 'mohammed ali', 'lucky', 'street food strip'], '🍢'],
    [['parsi', 'irani', 'britannia', 'kyani'], '🍳'], [['dim sum', 'yauatcha'], '🥟'],
    [['vegan', 'plant based', 'organic', 'health'], '🥗'], [['sattvic', 'govinda'], '🪷'],
    [['thali', 'gujarati'], '🍛'], [['chaat', 'pani puri', 'street classic'], '🥪'],
    [['juice', 'chai'], '🥤'], [['tasting', 'modern indian', 'goan'], '🍴'],
  ];
  document.querySelectorAll('.food').forEach((card) => {
    const h4 = card.querySelector('h4');
    const txt = (h4.textContent + ' ' + (card.querySelector('.where')?.textContent || '')).toLowerCase();
    let emoji = '🍴';
    for (const [keys, e] of map) { if (keys.some((k) => txt.includes(k))) { emoji = e; break; } }
    const span = document.createElement('span');
    span.className = 'fico'; span.setAttribute('aria-hidden', 'true'); span.textContent = emoji;
    h4.prepend(span);
  });
})();

// --- Screen reader labels for map links (avoid reading raw "↗") and spice meters ---
(function srLabels() {
  document.querySelectorAll('.maplink').forEach((a) => {
    const label = a.textContent.replace(/↗/g, '').trim();
    a.setAttribute('aria-label', (label.toLowerCase() === 'map' ? 'Open in Google Maps' : label + ', map') + ' (opens in a new tab)');
  });
  document.querySelectorAll('.heat').forEach((h) => {
    const lvl = h.classList.contains('l3') ? 3 : h.classList.contains('l2') ? 2 : 1;
    h.setAttribute('role', 'img');
    h.setAttribute('aria-label', `Spice level ${lvl} out of 3`);
  });
})();

// --- Read aloud (text to speech) for blind / low vision users ---
(function readAloud() {
  const play = document.getElementById('raPlay');
  const stop = document.getElementById('raStop');
  const synth = window.speechSynthesis;
  if (!play || !stop) return;
  if (!synth) { play.disabled = true; play.textContent = 'Not supported'; return; }

  const els = Array.from(document.querySelectorAll('#main h2, #main h3, #main h4, #main p, #main li'))
    .filter((el) => el.textContent.trim().length > 1 && !el.closest('[aria-hidden="true"]'));
  let i = 0, active = false;
  const reduce = () => document.body.classList.contains('reduce-motion');
  function visibleText(el) {
    const c = el.cloneNode(true);
    c.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  }

  function clearHi() { els.forEach((e) => e.classList.remove('reading')); }
  function speakFrom(idx) {
    if (idx >= els.length) { finish(); return; }
    i = idx; active = true;
    clearHi();
    const el = els[i];
    const text = visibleText(el);
    if (!text) { speakFrom(i + 1); return; }
    el.classList.add('reading');
    el.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN'; u.rate = 1;
    u.onend = () => { if (active) speakFrom(i + 1); };
    synth.speak(u);
  }
  function finish() {
    active = false; clearHi(); synth.cancel();
    play.textContent = '▶ Listen'; play.classList.remove('speaking'); stop.disabled = true;
  }
  play.addEventListener('click', () => {
    if (!active) { stop.disabled = false; play.textContent = '⏸ Pause'; play.classList.add('speaking'); speakFrom(0); }
    else if (synth.paused) { synth.resume(); play.textContent = '⏸ Pause'; }
    else { synth.pause(); play.textContent = '▶ Resume'; }
  });
  stop.addEventListener('click', finish);
  window.addEventListener('beforeunload', () => synth.cancel());
})();

// --- Back to top ---
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop?.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);


// --- Scrollspy (highlight the section you are reading in the nav) ---
(function scrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const pairs = links
    .map((a) => [document.getElementById(a.getAttribute('href').slice(1)), a])
    .filter(([sec]) => sec);
  if (!pairs.length) return;
  let current = null;
  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY + 90;
    let active = null;
    for (const [sec, a] of pairs) { if (sec.offsetTop <= y) active = a; }
    if (active === current) return;
    current = active;
    links.forEach((l) => {
      const on = l === active;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    // keep the active link visible in the mobile swipe strip.
    // Horizontal scroll on the strip only; scrollIntoView is off-limits here
    // because it also scrolls the page, which hijacks anchor clicks and
    // makes scrolling feel stuck.
    const strip = document.querySelector('.nav-links');
    if (active && strip && strip.scrollWidth > strip.clientWidth + 4) {
      const left = active.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
      strip.scrollTo({ left: Math.max(0, left - (strip.clientWidth - active.offsetWidth) / 2), behavior: 'smooth' });
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

// --- Pre-trip checklist (persisted per device) ---
(function checklist() {
  const list = document.getElementById('checklistItems');
  if (!list) return;
  const KEY = 'guide-checklist';
  const boxes = Array.from(list.querySelectorAll('input[type="checkbox"]'));
  const count = document.getElementById('checkCount');
  let saved = {};
  try { saved = JSON.parse(window.localStorage.getItem(KEY) || '{}'); } catch {}
  boxes.forEach((b) => { b.checked = !!saved[b.value]; });
  function sync() {
    const state = {};
    boxes.forEach((b) => {
      if (b.checked) state[b.value] = 1;
      b.closest('.check-item')?.classList.toggle('done', b.checked);
    });
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    const done = boxes.filter((b) => b.checked).length;
    if (count) count.textContent = `· ${done} of ${boxes.length} done`;
  }
  list.addEventListener('change', sync);
  document.getElementById('checkReset')?.addEventListener('click', () => {
    boxes.forEach((b) => { b.checked = false; });
    sync();
  });
  sync();
})();

// --- Driver card (full-screen address card for taxi and auto drivers) ---
(function driverCard() {
  const overlay = document.getElementById('driverCard');
  if (!overlay) return;
  let lastFocus = null;
  function openCard() {
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.driver-close')?.focus();
  }
  function closeCard() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-driver-open]').forEach((b) => b.addEventListener('click', openCard));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.driver-close')) closeCard();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCard();
  });
  overlay.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {}
      if (!ok) {
        try {
          const ta = document.createElement('textarea');
          ta.value = text; ta.setAttribute('readonly', '');
          ta.style.position = 'fixed'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          ok = document.execCommand('copy'); ta.remove();
        } catch {}
      }
      const orig = btn.textContent;
      btn.textContent = ok ? 'Copied ✓' : 'Copy failed';
      setTimeout(() => { btn.textContent = orig; }, 1600);
    });
  });
})();

// --- Print: expand FAQ answers so a saved PDF is complete ---
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.faq-item').forEach((d) => { d.dataset.wasOpen = d.open ? '1' : ''; d.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('.faq-item').forEach((d) => { d.open = !!d.dataset.wasOpen; });
});

// --- Food scroller arrows ---
(function foodScroll() {
  const grid = document.getElementById('foodGrid');
  if (!grid) return;
  const step = () => Math.max(grid.clientWidth * 0.8, 336);
  document.getElementById('foodPrev')?.addEventListener('click', () => grid.scrollBy({ left: -step(), behavior: 'smooth' }));
  document.getElementById('foodNext')?.addEventListener('click', () => grid.scrollBy({ left: step(), behavior: 'smooth' }));
})();


// --- Night scene: street lamps on the Sea Link and monuments (lit in dark mode) ---
(function nightScene() {
  const NS = 'http://www.w3.org/2000/svg';
  function addLamp(group, x, ground, height, headR) {
    const pole = document.createElementNS(NS, 'line');
    pole.setAttribute('class', 'lamp-pole');
    pole.setAttribute('x1', x); pole.setAttribute('x2', x);
    pole.setAttribute('y1', ground); pole.setAttribute('y2', ground - height);
    const halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('class', 'lamp-halo');
    halo.setAttribute('cx', x); halo.setAttribute('cy', ground - height - headR);
    halo.setAttribute('r', headR * 3.2);
    const head = document.createElementNS(NS, 'circle');
    head.setAttribute('class', 'lamp-head');
    head.setAttribute('cx', x); head.setAttribute('cy', ground - height - headR);
    head.setAttribute('r', headR);
    group.appendChild(pole); group.appendChild(halo); group.appendChild(head);
  }
  function lampGroup(svg) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'lamps');
    svg.appendChild(g);
    return g;
  }
  // Sea Link: lamps along the deck (deck top edge sits at y=300)
  const hero = document.querySelector('.hero .landmark');
  if (hero) {
    const g = lampGroup(hero);
    [80, 230, 380, 620, 770, 920, 1160, 1310, 1460].forEach((x) => addLamp(g, x, 300, 26, 4.5));
  }
  // Monuments: a pair of street lamps at each one's feet
  document.querySelectorAll('.landmark.lm-small, .landmark.lm-feature').forEach((svg) => {
    const vb = svg.viewBox.baseVal;
    if (!vb || !vb.width) return;
    const g = lampGroup(svg);
    const h = Math.max(22, vb.height * 0.08);
    const r = Math.max(3, Math.min(4.5, vb.width * 0.02));
    [vb.width * 0.14, vb.width * 0.86].forEach((x) => addLamp(g, x, vb.height - 4, h, r));
  });
})();
