(function () {
  'use strict';

  /* ---------- Настройки ---------- */
  var LINE_URL = 'https://melbet.ru/ru/sport'; // запасная ссылка, если у события нет своей
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

  /* Нейтральные иконки видов спорта — фоновый элемент карточки */
  var ICONS = {
    football: '<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.4 2.5-1.3 4H9.9l-1.3-4L12 7.6Z"/><path d="M12 3v4.6M3.3 9.9l5.3.2M20.7 9.9l-5.3.2M6.6 19.6l3.3-5.5M17.4 19.6l-3.3-5.5"/>',
    hockey: '<ellipse cx="12" cy="8.5" rx="7.5" ry="3.2"/><path d="M4.5 8.5v5.8c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V8.5"/>',
    basketball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18"/><path d="M5.6 5.6c3.8 3.8 3.8 9 0 12.8M18.4 5.6c-3.8 3.8-3.8 9 0 12.8"/>',
    tennis: '<circle cx="12" cy="12" r="9"/><path d="M4.8 5.6c3.2 3.1 3.2 9.7 0 12.8M19.2 5.6c-3.2 3.1-3.2 9.7 0 12.8"/>',
    combat: '<path d="M7.6 6.4A3.4 3.4 0 0 1 11 3h3.3A4.7 4.7 0 0 1 19 7.7v3.1a4.7 4.7 0 0 1-4.7 4.7H7.6V6.4Z"/><path d="M7.6 8.3H6.2A2.6 2.6 0 0 0 3.6 10.9v.5a2.6 2.6 0 0 0 2.6 2.6h1.4"/><path d="M7.9 15.5h10.3v1.6a2.4 2.4 0 0 1-2.4 2.4h-5.5a2.4 2.4 0 0 1-2.4-2.4v-1.6Z"/>',
    motor: '<path d="M3.5 13.5a8.5 8.5 0 0 1 17 0v2.3a2 2 0 0 1-2 2h-5.2L4 16.2v-2.7Z"/><path d="M11 6.2v6.8h9.3"/>',
    winter: '<path d="M12 2.5v19M4 7l16 10M20 7L4 17"/><path d="M12 6.5l2.2-2.2M12 6.5L9.8 4.3M12 17.5l2.2 2.2M12 17.5l-2.2 2.2"/>',
    volley: '<circle cx="12" cy="12" r="9"/><path d="M12 3c3.4 4.6 3.4 13.4 0 18M3.4 9.3c5.4 1.3 12.6.2 16.8-3.1M20.6 14.7C15.2 13.4 8 14.5 3.8 17.8"/>',
    handball: '<circle cx="12" cy="12" r="9"/><path d="M12 3c-2 3.4-2 14.6 0 18M3.2 10.5c4 2.6 13.6 2.6 17.6 0"/>',
    athletics: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.8 1.8M9.5 2.5h5M12 2.5v3.5"/>',
    cycling: '<circle cx="5.5" cy="16.5" r="4"/><circle cx="18.5" cy="16.5" r="4"/><path d="M5.5 16.5l5-8h4.5l3.5 8M9 8.5h4"/>',
    us: '<ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-20 12 12)"/><path d="M9.5 14.2l5-4.4M10.6 11.2l1.4 1.2M12.4 9.6l1.4 1.2"/>',
    other: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5.5H4.5v1.8A3.5 3.5 0 0 0 8 10.8M17 5.5h2.5v1.8A3.5 3.5 0 0 1 16 10.8M12 14v3.5M8.5 20.5h7"/>',
    multi: '<circle cx="12" cy="14.5" r="5.5"/><path d="M9 3.5l2 5.5M15 3.5l-2 5.5"/>',
    cs2: '<rect x="2.5" y="7.5" width="19" height="10" rx="4.5"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 14h.01"/>',
    dota2: '<rect x="2.5" y="7.5" width="19" height="10" rx="4.5"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 14h.01"/>',
    lol: '<rect x="2.5" y="7.5" width="19" height="10" rx="4.5"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 14h.01"/>',
    valorant: '<rect x="2.5" y="7.5" width="19" height="10" rx="4.5"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 14h.01"/>',
    esother: '<rect x="2.5" y="7.5" width="19" height="10" rx="4.5"/><path d="M7 10.5v4M5 12.5h4M16 11.5h.01M18 14h.01"/>'
  };
  function icon(e) {
    var p = ICONS[e.s] || ICONS.football;
    return '<svg class="card__ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }

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
    // ссылка на турнир в линии: берём из поля url события, иначе общий LINE_URL
    var href = e.url || LINE_URL;
    return '<a class="card' + (e.rank ? ' has-badge' : '') + '" href="' + esc(href) + '" data-line style="--g:' + grad(e.c) + '" title="' + esc(e.t) + ' · ' + esc(e.d) + '">' +
      icon(e) +
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
    var card = t.closest('[data-line]');
    if (card && card.getAttribute('href') === '#') { ev.preventDefault(); return; }
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
