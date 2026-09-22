(function () {
  'use strict';

  /* ---------- Настройки ---------- */
  var LINE_URL = '#';          // ссылка «Перейти в линию» (подставьте адрес линии)
  var BONUS_URL = '#';         // ссылка кнопки «Забрать бонус»
  var TODAY = '2026-09-21';    // дата актуальности данных
  var FIRST_MONTH = '2026-09';
  var LAST_MONTH = '2027-12';
  var CARDS_STEP = 12;         // сколько карточек показывать сразу
  var RATING_SHORT = 10;       // сколько строк топа показывать сразу

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
  var MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  var WD = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

  var EVENTS = window.EVENTS;
  var SPORTS = window.SPORTS;
  var SPORT = {};
  SPORTS.forEach(function (s) { SPORT[s.key] = s; });
  var BY_ID = {};
  EVENTS.forEach(function (e) { if (!e.en) e.en = e.st; BY_ID[e.id] = e; });

  /* ---------- Состояние ---------- */
  var state = {
    cat: 'all', sports: {}, minI: 0, confirmed: false, q: '',
    month: TODAY.slice(0, 7), day: null, shown: CARDS_STEP, ratingAll: false
  };

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
  function daysIn(y, m) { return new Date(y, m, 0).getDate(); }
  function monthBounds(key) { return [key + '-01', key + '-' + pad(daysIn(+key.slice(0, 4), +key.slice(5, 7)))]; }
  function overlaps(e, a, b) { return e.st <= b && e.en >= a; }
  function grad(c) { var g = COLORS[c] || ['#444', '#111']; return 'linear-gradient(135deg,' + g[0] + ' 0%,' + g[1] + ' 100%)'; }
  function sportCat(e) { return SPORT[e.s] ? SPORT[e.s].cat : 'sport'; }
  function wm(e) { return (e.t.split(/[\s:–-]+/)[0] || '').slice(0, 10); }
  function starsHtml(i) { return '★'.repeat(i) + '<i>' + '★'.repeat(5 - i) + '</i>'; }
  function dayName(ds) {
    var d = new Date(ds + 'T00:00:00');
    return d.getDate() + ' ' + MONTHS_GEN[d.getMonth()] + ', ' + WD[d.getDay()];
  }
  function statusText(s) { return s === '✔' ? 'Дата подтверждена' : s === '≈' ? 'Дата ожидается' : 'Дата не объявлена'; }
  function byPopularity(a, b) { return (b.i - a.i) || ((a.rank || 99) - (b.rank || 99)) || ((a.season ? 1 : 0) - (b.season ? 1 : 0)) || (a.st < b.st ? -1 : 1); }
  function filtersActive() { return state.cat !== 'all' || Object.keys(state.sports).length || state.minI || state.confirmed || state.q; }

  /* ---------- Фильтрация ---------- */
  function pass(e) {
    if (state.cat !== 'all' && sportCat(e) !== state.cat) return false;
    if (Object.keys(state.sports).length && !state.sports[e.s]) return false;
    if (e.i < state.minI) return false;
    if (state.confirmed && e.status !== '✔') return false;
    if (state.q) {
      var hay = (e.t + ' ' + e.g + ' ' + (e.p || '') + ' ' + (e.who || '') + ' ' + (e.info || '')).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }
  function filtered() { return EVENTS.filter(pass); }

  /* ---------- Виды спорта ---------- */
  function renderChips() {
    var list = SPORTS.filter(function (s) { return state.cat === 'all' || s.cat === state.cat; });
    $('#sportChips').innerHTML = list.map(function (s) {
      return '<button class="chip' + (state.sports[s.key] ? ' is-active' : '') + '" data-sport="' + s.key + '">' +
        '<i style="background:' + SPORT_COLOR[s.key] + '"></i>' + esc(s.label) + '</button>';
    }).join('');
    $('#resetBtn').hidden = !filtersActive();
  }

  /* ---------- Лента месяцев = карта года ---------- */
  function renderMonths() {
    var list = filtered().filter(function (e) { return !e.season; });
    var counts = MONTHS.map(function (m) {
      var b = monthBounds(m.key);
      return list.filter(function (e) { return overlaps(e, b[0], b[1]); }).length;
    });
    var max = Math.max.apply(null, counts.concat(1));
    $('#months').innerHTML = MONTHS.map(function (m, idx) {
      var n = counts[idx];
      var h = n ? Math.max(12, Math.round(n / max * 100)) : 0;
      return '<button class="mon' + (m.key === state.month ? ' is-active' : '') + (n ? '' : ' is-empty') + '" data-month="' + m.key + '" title="' + MONTHS_NOM[m.m - 1] + ' ' + m.y + ': ' + n + '">' +
        '<span class="mon__bar"><i style="height:' + h + '%"></i></span>' +
        '<span class="mon__n">' + (n || '–') + '</span>' +
        '<span class="mon__name">' + MONTHS_SHORT[m.m - 1] + '</span>' +
        '<span class="mon__y">' + (m.m === 1 || idx === 0 ? m.y : '&nbsp;') + '</span></button>';
    }).join('');
    var nav = $('#months'), act = $('.mon.is-active');
    if (act) nav.scrollLeft = act.offsetLeft - nav.clientWidth / 2 + act.clientWidth / 2;
  }

  /* ---------- Сетка дней ---------- */
  function renderDays() {
    var y = +state.month.slice(0, 4), m = +state.month.slice(5, 7);
    var offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    var list = filtered().filter(function (e) { return !e.season; });
    var html = '';
    for (var p = 0; p < offset; p++) html += '<span class="d d--pad"></span>';
    for (var d = 1; d <= daysIn(y, m); d++) {
      var ds = state.month + '-' + pad(d);
      var evs = list.filter(function (e) { return overlaps(e, ds, ds); }).sort(byPopularity);
      var dots = evs.slice(0, 4).map(function (e) { return '<i style="background:' + SPORT_COLOR[e.s] + '"></i>'; }).join('');
      var wd = new Date(y, m - 1, d).getDay();
      html += '<button class="d' + (ds === TODAY ? ' is-today' : '') + (ds === state.day ? ' is-sel' : '') +
        (wd === 0 || wd === 6 ? ' is-we' : '') + (evs.length ? '' : ' is-none') +
        '" data-day="' + ds + '" aria-label="' + esc(dayName(ds)) + ': событий ' + evs.length + '">' +
        '<b>' + d + '</b><span class="d__dots">' + dots + '</span></button>';
    }
    $('#days').innerHTML = html;
  }

  /* ---------- Карточки (месяц или выбранный день) ---------- */
  function cardDate(e, b) {
    if (b && e.st <= b[0] && e.en >= b[1]) return 'Весь ' + MONTHS_NOM[+b[0].slice(5, 7) - 1].toLowerCase();
    return e.d;
  }
  function badge(e) {
    if (e.rank && e.rank <= 10) return '<span class="badge badge--top">Топ</span>';
    if (e.rank) return '<span class="badge">стоит<br>посмотреть</span>';
    return '';
  }
  function cardHtml(e, b) {
    return '<div class="card" role="button" tabindex="0" data-open="' + e.id + '" style="--g:' + grad(e.c) + '">' +
      '<span class="card__ring"></span><span class="card__wm">' + esc(wm(e)) + '</span>' +
      '<span class="card__g">' + esc(e.g) + '</span>' +
      '<h3 class="card__t">' + esc(e.t) + '</h3>' +
      '<span class="card__foot">' +
      '<span class="card__stars" title="Популярность: ' + e.i + ' из 5">' + starsHtml(e.i) + '</span>' +
      '<span class="card__d">' + esc(cardDate(e, b)) + (e.status !== '✔' ? ' <span class="card__st" title="' + statusText(e.status) + '">' + e.status + '</span>' : '') + '</span>' +
      '<a class="card__link" href="' + LINE_URL + '" data-line>Перейти в линию</a></span>' +
      badge(e) + '</div>';
  }
  function renderList() {
    var list, b = null, title;
    var m = +state.month.slice(5, 7), y = state.month.slice(0, 4);
    var seasonsBox = $('#seasons');
    if (state.day) {
      var all = filtered().filter(function (e) { return overlaps(e, state.day, state.day); });
      list = all.filter(function (e) { return !e.season; }).sort(byPopularity);
      var seasons = all.filter(function (e) { return e.season; }).sort(byPopularity);
      title = dayName(state.day);
      seasonsBox.hidden = !seasons.length;
      seasonsBox.innerHTML = '<details><summary>Также в этот день идут сезоны лиг: ' + seasons.length + '</summary><div class="seasons__list">' +
        seasons.map(function (e) { return '<button data-open="' + e.id + '">' + esc(e.t) + '</button>'; }).join('') + '</div></details>';
    } else {
      b = monthBounds(state.month);
      list = filtered().filter(function (e) { return overlaps(e, b[0], b[1]); }).sort(byPopularity);
      title = MONTHS_NOM[m - 1] + ' ' + y;
      seasonsBox.hidden = true;
    }
    $('#listTitle').innerHTML = esc(title) + ' <small>' + list.length + '</small>';
    $('#backToMonth').hidden = !state.day;
    $('#cardsEmpty').hidden = list.length > 0;
    $('#cards').innerHTML = list.slice(0, state.shown).map(function (e) { return cardHtml(e, b); }).join('');
    var rest = list.length - state.shown;
    var more = $('#moreCards');
    more.hidden = rest <= 0;
    more.textContent = 'Показать ещё ' + Math.min(rest, CARDS_STEP) + ' из ' + rest;
  }

  /* ---------- Топ ---------- */
  function renderRating() {
    var rows = state.ratingAll ? window.RATING : window.RATING.slice(0, RATING_SHORT);
    $('#ratingList').innerHTML = rows.map(function (r) {
      return '<li data-open="' + (r.id || '') + '"><span class="rating__n">' + r.n + '</span>' +
        '<span class="rating__t">' + esc(r.t) + '<small>' + esc(r.s) + '</small></span>' +
        '<span class="rating__d">' + esc(r.d) + '</span></li>';
    }).join('');
    $('#moreRating').textContent = state.ratingAll ? 'Свернуть' : 'Показать весь топ-30';
  }

  /* ---------- Справка ---------- */
  function renderInfo() {
    $('#rusList').innerHTML = window.RUSSIA.map(function (r) {
      return '<div class="rus__i ' + r.tone + '"><b>' + esc(r.k) + '</b><span>' + esc(r.v) + '</span></div>';
    }).join('');
    $('#undated').innerHTML = window.UNDATED.map(function (u) {
      return '<div class="undated__i"><span class="undated__bar" style="background:' + SPORT_COLOR[u.s] + '"></span><div>' +
        '<div class="undated__t">' + esc(u.t) + '</div>' +
        '<div class="undated__w">' + esc(u.when) + ' · <span class="stars">' + '★'.repeat(u.i) + '</span></div>' +
        '<div class="undated__x">' + esc(u.info) + '</div></div></div>';
    }).join('');
    $('#pendingList').innerHTML = window.PENDING.map(function (p) {
      return '<div class="timeline__i"><div class="timeline__w">' + esc(p.when) + '</div><div class="timeline__x">' + esc(p.what) + '</div></div>';
    }).join('');
  }

  /* ---------- Окно события ---------- */
  function openEvent(id) {
    var e = BY_ID[id];
    if (!e) return;
    var head = $('#mHead');
    head.style.setProperty('--g', grad(e.c));
    head.innerHTML = '<span class="card__ring"></span><span class="card__wm">' + esc(wm(e)) + '</span>' +
      '<div class="modal__g">' + esc(e.g) + '</div>' +
      '<h3 class="modal__t" id="mTitle">' + esc(e.t) + '</h3>' +
      '<div class="modal__tags"><span class="tag tag--y">' + esc(e.d) + '</span>' +
      '<span class="tag tag--stars" title="Популярность события">' + starsHtml(e.i) + '</span>' +
      (e.status !== '✔' ? '<span class="tag">' + statusText(e.status) + '</span>' : '') +
      (e.rank ? '<span class="tag">№' + e.rank + ' в топе</span>' : '') + '</div>';
    var rows = [['Где', e.p], ['Участники', e.who], ['Главное', e.info], ['Ждём анонса', e.ann]];
    $('#mBody').innerHTML = '<dl>' + rows.filter(function (r) { return r[1]; }).map(function (r) {
      return '<div class="kv' + (r[0] === 'Ждём анонса' ? ' kv--ann' : '') + '"><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('') + '</dl>' +
      '<div class="modal__cta"><a class="btn btn--dark" href="' + LINE_URL + '" data-line>Перейти в линию</a>' +
      '<button class="btn btn--ghost" data-goto="' + e.id + '">В календаре</button>' +
      (e.src ? '<a class="btn btn--link" href="' + esc(e.src) + '" target="_blank" rel="noopener">Источник</a>' : '') + '</div>';
    $('#modal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close').focus();
  }
  function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; }

  /* ---------- Рендер ---------- */
  function renderAll() { state.shown = CARDS_STEP; renderChips(); renderMonths(); renderDays(); renderList(); }
  function setMonth(key) { state.month = key; state.day = null; }

  /* ---------- Обработчики ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var line = t.closest('[data-line]');
    if (line) { ev.stopPropagation(); if (LINE_URL === '#') ev.preventDefault(); return; }
    if (t.closest('[data-bonus]') && BONUS_URL === '#') { ev.preventDefault(); return; }

    var el;
    if ((el = t.closest('[data-cat]'))) {
      state.cat = el.getAttribute('data-cat'); state.sports = {};
      $all('.seg__btn').forEach(function (b) { b.classList.toggle('is-active', b === el); });
      return renderAll();
    }
    if ((el = t.closest('[data-sport]'))) {
      var k = el.getAttribute('data-sport');
      if (state.sports[k]) delete state.sports[k]; else state.sports[k] = 1;
      return renderAll();
    }
    if ((el = t.closest('[data-min]'))) {
      state.minI = +el.getAttribute('data-min');
      $all('.star-btn').forEach(function (b) { b.classList.toggle('is-active', b === el); });
      return renderAll();
    }
    if ((el = t.closest('[data-month]'))) { setMonth(el.getAttribute('data-month')); return renderAll(); }
    if ((el = t.closest('[data-day]'))) {
      var ds = el.getAttribute('data-day');
      state.day = state.day === ds ? null : ds;
      state.shown = CARDS_STEP;
      renderDays(); renderList();
      return;
    }
    if (t.closest('#backToMonth')) { state.day = null; state.shown = CARDS_STEP; renderDays(); renderList(); return; }
    if (t.closest('#moreCards')) { state.shown += CARDS_STEP; renderList(); return; }
    if (t.closest('#moreRating')) { state.ratingAll = !state.ratingAll; renderRating(); return; }
    if ((el = t.closest('[data-goto]'))) {
      var e = BY_ID[el.getAttribute('data-goto')];
      closeModal();
      var start = e.st < FIRST_MONTH + '-01' ? TODAY : e.st;
      state.month = start.slice(0, 7); state.day = start;
      renderAll();
      $('#calendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if ((el = t.closest('[data-open]')) && el.getAttribute('data-open')) { openEvent(el.getAttribute('data-open')); return; }
    if (t.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !$('#modal').hidden) closeModal();
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('card')) {
      ev.preventDefault(); openEvent(ev.target.getAttribute('data-open'));
    }
  });

  var qTimer;
  $('#q').addEventListener('input', function () {
    clearTimeout(qTimer);
    var v = this.value;
    qTimer = setTimeout(function () { state.q = v.trim().toLowerCase(); renderAll(); }, 150);
  });
  $('#onlyConfirmed').addEventListener('change', function () { state.confirmed = this.checked; renderAll(); });
  $('#resetBtn').addEventListener('click', function () {
    state.cat = 'all'; state.sports = {}; state.minI = 0; state.confirmed = false; state.q = '';
    $('#q').value = ''; $('#onlyConfirmed').checked = false;
    $all('.seg__btn').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-cat') === 'all'); });
    $all('.star-btn').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-min') === '0'); });
    renderAll();
  });
  $('[data-bonus]').setAttribute('href', BONUS_URL);

  renderRating(); renderInfo(); renderAll();
})();
