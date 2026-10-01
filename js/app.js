(function () {
  'use strict';

  /* ---------- Настройки ---------- */
  var LINE_URL = '#';          // ссылка «Перейти в линию»: клик по карточке ведёт сюда
  var BONUS_URL = '#';         // ссылка кнопки «Забрать бонус»
  var FIRST_MONTH = '2026-09';
  var LAST_MONTH = '2027-12';
  var CARDS_STEP = 12;         // сколько карточек показывать сразу

  var COLORS = {
    rpl: ['#7b2ff7', '#e0245e'], cup: ['#c81d4e', '#6a11cb'], rus: ['#1d4ed8', '#dc2626'],
    epl: ['#6a11cb', '#b02fd8'], facup: ['#1e40af', '#3b82f6'], laliga: ['#ff4b2b', '#e11d48'],
    seriea: ['#1d4ed8', '#2563eb'], coppa: ['#65a30d', '#ca8a04'], bundes: ['#dc2626', '#991b1b'],
    dfb: ['#15a34a', '#0f766e'], ligue1: ['#3b5bfd', '#7c3aed'], ucl: ['#1e1b8f', '#4338ca'],
    uel: ['#ff7a00', '#e8410b'], uecl: ['#10b981', '#047857'], nations: ['#0f766e', '#1d4ed8'],
    asia: ['#0e7490', '#0891b2'], africa: ['#16a34a', '#ca8a04'], wwc: ['#db2777', '#9333ea'],
    conmebol: ['#0369a1', '#0f172a'], fifa: ['#1d4ed8', '#0f172a'], mls: ['#111827', '#374151'],
    saudi: ['#047857', '#065f46'], gold: ['#b8860b', '#6b4e00'],
    khl: ['#3a3a3a', '#0b0b0b'], nhl: ['#8a8a8a', '#1f1f1f'], iihf: ['#0c4a6e', '#1e3a8a'],
    nba: ['#e11d48', '#6d28d9'], vtb: ['#1d4ed8', '#0c1f6b'], euroleague: ['#ff8a00', '#f25c05'], fiba: ['#ea580c', '#9a3412'],
    tennis: ['#16a34a', '#15803d'], wta: ['#9333ea', '#c026d3'], atp: ['#0f172a', '#1e3a8a'],
    ao: ['#0284c7', '#1d4ed8'], rg: ['#c2410c', '#9a3412'], wimb: ['#166534', '#6b21a8'], uso: ['#1e3a8a', '#0284c7'],
    dark: ['#262626', '#0a0a0a'], ufc: ['#b91c1c', '#111111'], aca: ['#7f1d1d', '#1c1917'], box: ['#b45309', '#1c1917'],
    f1: ['#ef4444', '#7f1d1d'], moto: ['#f97316', '#1f2937'], dakar: ['#d97706', '#78350f'],
    figure: ['#38bdf8', '#6366f1'], biathlon: ['#0ea5e9', '#1e3a8a'], ski: ['#22d3ee', '#2563eb'],
    volley: ['#f59e0b', '#2563eb'], handball: ['#0d9488', '#1e40af'],
    athl: ['#ea580c', '#b91c1c'], aqua: ['#06b6d4', '#1d4ed8'],
    giro: ['#ec4899', '#be185d'], tdf: ['#eab308', '#a16207'], vuelta: ['#dc2626', '#9f1239'],
    nfl: ['#1e3a8a', '#991b1b'], sb: ['#7c2d12', '#6b21a8'], mlb: ['#1d4ed8', '#b91c1c'],
    chess: ['#404040', '#0a0a0a'], snooker: ['#15803d', '#052e16'], darts: ['#dc2626', '#15803d'],
    golf: ['#65a30d', '#166534'], rugby: ['#166534', '#0f172a'], cricket: ['#0f766e', '#134e4a'],
    multi: ['#0891b2', '#7c3aed'], olymp: ['#1d4ed8', '#0ea5e9'],
    esl: ['#1e3a8a', '#0f172a'], cs: ['#f59e0b', '#b45309'], pgl: ['#1e40af', '#6366f1'], blast: ['#f43f5e', '#7e22ce'],
    major: ['#0f172a', '#b8860b'], ewc: ['#0f766e', '#111827'], dota: ['#b91c1c', '#450a0a'], ti: ['#7f1d1d', '#1c1917'],
    lol: ['#0e7490', '#1e1b4b'], valorant: ['#ff4655', '#8b1e2b'], es: ['#6d28d9', '#1e1b4b']
  };

  var SPORT_COLOR = {
    football: '#7b2ff7', hockey: '#4b5563', basketball: '#f97316', tennis: '#16a34a', combat: '#b91c1c',
    motor: '#ef4444', winter: '#38bdf8', volley: '#eab308', handball: '#0d9488', athletics: '#06b6d4',
    cycling: '#ec4899', us: '#1e3a8a', other: '#65a30d', multi: '#7c3aed',
    cs2: '#f59e0b', dota2: '#991b1b', lol: '#0e7490', valorant: '#ff4655', esother: '#6d28d9'
  };

  var MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

  var EVENTS = window.EVENTS;
  var SPORTS = window.SPORTS;
  var SPORT = {};
  SPORTS.forEach(function (s) { SPORT[s.key] = s; });
  EVENTS.forEach(function (e) { if (!e.en) e.en = e.st; });

  var state = { sports: {}, month: null, shown: CARDS_STEP };

  /* ---------- Утилиты ---------- */
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  var MONTHS = (function () {
    var out = [], y = +FIRST_MONTH.slice(0, 4), m = +FIRST_MONTH.slice(5, 7);
    while (y * 100 + m <= +LAST_MONTH.replace('-', '')) {
      out.push({ key: y + '-' + pad(m), y: y, m: m });
      m++; if (m > 12) { m = 1; y++; }
    }
    return out;
  })();
  // «Сегодня» берём с часов пользователя: сайт всегда открывается на актуальном месяце
  var TODAY = (function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); })();
  var START_MONTH = (function () {
    var m = TODAY.slice(0, 7);
    return m < FIRST_MONTH ? FIRST_MONTH : (m > LAST_MONTH ? LAST_MONTH : m);
  })();

  function daysIn(y, m) { return new Date(y, m, 0).getDate(); }
  function monthBounds(key) { return [key + '-01', key + '-' + pad(daysIn(+key.slice(0, 4), +key.slice(5, 7)))]; }
  function overlaps(e, a, b) { return e.st <= b && e.en >= a; }
  function grad(c) { var g = COLORS[c] || ['#444', '#111']; return 'linear-gradient(135deg,' + g[0] + ' 0%,' + g[1] + ' 100%)'; }
  function wm(e) { return (e.t.split(/[\s:–-]+/)[0] || '').slice(0, 10); }
  function byPopularity(a, b) { return (b.i - a.i) || ((a.rank || 99) - (b.rank || 99)) || ((a.season ? 1 : 0) - (b.season ? 1 : 0)) || (a.st < b.st ? -1 : 1); }
  function activeCount() { return Object.keys(state.sports).length; }

  /* ---------- Фильтрация: только по видам спорта ---------- */
  function pass(e) {
    return !activeCount() || !!state.sports[e.s];
  }

  /* ---------- Панель фильтров ---------- */
  function renderChips() {
    $('#sportChips').innerHTML = SPORTS.map(function (s) {
      return '<button class="chip' + (state.sports[s.key] ? ' is-active' : '') + '" data-sport="' + s.key + '">' +
        '<i style="background:' + SPORT_COLOR[s.key] + '"></i>' + esc(s.label) + '</button>';
    }).join('');
    var n = activeCount(), badge = $('#filtersCount');
    badge.hidden = !n;
    badge.textContent = n;
    $('#resetBtn').hidden = !n;
    $('#filtersBtn').classList.toggle('is-on', !!n);
  }
  function openFilters(open) {
    $('#fpanel').hidden = !open;
    $('#filtersBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('filters-open', open);
  }

  /* ---------- Месяцы ---------- */
  function renderMonths() {
    $('#months').innerHTML = MONTHS.map(function (m, idx) {
      var past = monthBounds(m.key)[1] < TODAY;
      return '<button class="mon' + (m.key === state.month ? ' is-active' : '') + (past ? ' is-past' : '') + '" data-month="' + m.key + '">' +
        MONTHS_SHORT[m.m - 1] + (m.m === 1 || idx === 0 ? '<small>' + m.y + '</small>' : '') + '</button>';
    }).join('');
    var nav = $('#months'), act = $('.mon.is-active');
    if (act) nav.scrollLeft = act.offsetLeft - nav.clientWidth / 2 + act.clientWidth / 2;
  }

  /* ---------- Карточки месяца ---------- */
  function badge(e) {
    if (e.rank && e.rank <= 10) return '<span class="badge badge--top">Топ</span>';
    if (e.rank) return '<span class="badge">стоит посмотреть</span>';
    return '';
  }
  function cardHtml(e) {
    return '<a class="card' + (e.rank ? ' has-badge' : '') + '" href="' + LINE_URL + '" data-line style="--g:' + grad(e.c) + '" title="' + esc(e.t) + ' · ' + esc(e.d) + '">' +
      '<span class="card__ring"></span><span class="card__wm">' + esc(wm(e)) + '</span>' +
      badge(e) +
      '<span class="card__g">' + esc(e.g) + '</span>' +
      '<span class="card__t">' + esc(e.t) + '</span>' +
      '<span class="card__link">Перейти в линию</span></a>';
  }
  function renderList() {
    var b = monthBounds(state.month);
    var m = +state.month.slice(5, 7), y = state.month.slice(0, 4);
    var list = EVENTS.filter(function (e) { return pass(e) && overlaps(e, b[0], b[1]); }).sort(byPopularity);
    $('#listTitle').textContent = MONTHS_NOM[m - 1] + ' ' + y;
    $('#cardsEmpty').hidden = list.length > 0;
    $('#cards').innerHTML = list.slice(0, state.shown).map(cardHtml).join('');
    var rest = list.length - state.shown;
    var more = $('#moreCards');
    more.hidden = rest <= 0;
    more.textContent = 'Показать ещё ' + Math.min(rest, CARDS_STEP) + ' из ' + rest;
  }

  function renderAll() { state.shown = CARDS_STEP; renderChips(); renderMonths(); renderList(); }

  function resetFilters() { state.sports = {}; renderAll(); }

  /* ---------- Обработчики ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target, el;

    // клик по карточке и по кнопке бонуса ведёт на внешние ссылки
    if (t.closest('[data-line]') && LINE_URL === '#') { ev.preventDefault(); return; }
    if (t.closest('[data-bonus]') && BONUS_URL === '#') { ev.preventDefault(); return; }

    if (t.closest('#filtersBtn')) { openFilters($('#fpanel').hidden); return; }
    if (t.closest('#filtersClose') || t.closest('#filtersApply')) { openFilters(false); return; }
    if (t.closest('#resetBtn') || t.closest('#resetBtn2')) { resetFilters(); return; }
    if (!t.closest('.filters') && !$('#fpanel').hidden) openFilters(false);

    if ((el = t.closest('[data-sport]'))) {
      var k = el.getAttribute('data-sport');
      if (state.sports[k]) delete state.sports[k]; else state.sports[k] = 1;
      return renderAll();
    }
    if ((el = t.closest('[data-month]'))) {
      state.month = el.getAttribute('data-month'); state.shown = CARDS_STEP;
      renderMonths(); renderList(); return;
    }
    if (t.closest('#moreCards')) { state.shown += CARDS_STEP; renderList(); return; }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !$('#fpanel').hidden) openFilters(false);
  });

  $('[data-bonus]').setAttribute('href', BONUS_URL);

  /* ---------- Старт ---------- */
  state.month = START_MONTH;
  renderAll();
})();
