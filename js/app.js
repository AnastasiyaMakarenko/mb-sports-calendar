(function () {
  'use strict';

  /* ---------- Настройки ---------- */
  var LINE_URL = '#';          // ссылка «Перейти в линию» (подставьте адрес линии)
  var BONUS_URL = '#';         // ссылка кнопки «Забрать бонус»
  var TODAY = '2026-09-21';    // дата актуальности данных
  var FIRST_MONTH = '2026-09';
  var LAST_MONTH = '2027-12';

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
  var MONTHS_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
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
    month: TODAY.slice(0, 7), day: TODAY, sort: 'interest'
  };

  /* ---------- Утилиты ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function monthList() {
    var out = [], y = +FIRST_MONTH.slice(0, 4), m = +FIRST_MONTH.slice(5, 7);
    while (y * 100 + m <= +LAST_MONTH.replace('-', '')) {
      out.push({ key: y + '-' + pad(m), y: y, m: m });
      m++; if (m > 12) { m = 1; y++; }
    }
    return out;
  }
  var MONTHS = monthList();
  function daysIn(y, m) { return new Date(y, m, 0).getDate(); }
  function monthBounds(key) {
    var y = +key.slice(0, 4), m = +key.slice(5, 7);
    return [key + '-01', key + '-' + pad(daysIn(y, m))];
  }
  function overlaps(e, a, b) { return e.st <= b && e.en >= a; }
  function grad(c) { var g = COLORS[c] || ['#444', '#111']; return 'linear-gradient(135deg,' + g[0] + ' 0%,' + g[1] + ' 100%)'; }
  function sportCat(e) { return SPORT[e.s] ? SPORT[e.s].cat : 'sport'; }
  function wm(e) { return (e.t.split(/[\s:–-]+/)[0] || '').slice(0, 10); }
  function human(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.getDate() + ' ' + MONTHS_GEN[d.getMonth()] + ' ' + d.getFullYear() + ', ' + WD[d.getDay()];
  }
  function stars(i) { var s = ''; for (var k = 1; k <= 5; k++) s += k <= i ? '★' : '<i>★</i>'; return '<span class="stars">' + s + '</span>'; }
  function statusText(s) { return s === '✔' ? '✔ подтверждено' : s === '≈' ? '≈ ожидается' : '? не объявлено'; }

  /* ---------- Фильтрация ---------- */
  function passBase(e, ignoreSports) {
    if (state.cat !== 'all' && sportCat(e) !== state.cat) return false;
    if (!ignoreSports && Object.keys(state.sports).length && !state.sports[e.s]) return false;
    if (e.i < state.minI) return false;
    if (state.confirmed && e.status !== '✔') return false;
    if (state.q) {
      var hay = (e.t + ' ' + e.g + ' ' + (e.p || '') + ' ' + (e.who || '') + ' ' + (e.info || '')).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }
  function filtered() { return EVENTS.filter(function (e) { return passBase(e); }); }

  /* ---------- Hero ---------- */
  function renderStats() {
    var sp = EVENTS.filter(function (e) { return sportCat(e) === 'sport'; }).length;
    var es = EVENTS.length - sp;
    var top = EVENTS.filter(function (e) { return e.i === 5; }).length;
    $('#heroStats').innerHTML =
      '<div class="stat"><b>' + EVENTS.length + '</b><span>событий в календаре</span></div>' +
      '<div class="stat"><b>' + sp + ' / ' + es + '</b><span>спорт / киберспорт</span></div>' +
      '<div class="stat"><b>' + top + '</b><span>самых популярных ★★★★★</span></div>';
  }

  /* ---------- Фильтры ---------- */
  function renderChips() {
    var list = SPORTS.filter(function (s) { return state.cat === 'all' || s.cat === state.cat; });
    var html = '';
    var lastCat = null;
    list.forEach(function (s) {
      if (state.cat === 'all' && s.cat !== lastCat) {
        html += '<span class="chip" style="border:0;padding-left:0;font-weight:800;pointer-events:none">' + (s.cat === 'sport' ? 'Спорт:' : 'Киберспорт:') + '</span>';
        lastCat = s.cat;
      }
      var n = EVENTS.filter(function (e) { return e.s === s.key; }).length;
      html += '<button class="chip' + (state.sports[s.key] ? ' is-active' : '') + '" data-sport="' + s.key + '"><i style="background:' + SPORT_COLOR[s.key] + '"></i>' + esc(s.label) + ' <small>' + n + '</small></button>';
    });
    $('#sportChips').innerHTML = html;
  }

  /* ---------- Карта года ---------- */
  function level(n) { return n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : n <= 8 ? 4 : 5; }
  function renderHeat() {
    var rows = SPORTS.filter(function (s) {
      if (state.cat !== 'all' && s.cat !== state.cat) return false;
      if (Object.keys(state.sports).length && !state.sports[s.key]) return false;
      return true;
    });
    var html = '<div class="heat__corner"></div>';
    MONTHS.forEach(function (m) {
      html += '<div class="heat__mh' + (m.key === state.month ? ' is-cur' : '') + '">' + MONTHS_SHORT[m.m - 1] + (m.m === 1 || m.key === FIRST_MONTH ? '<b>' + m.y + '</b>' : '<b>&nbsp;</b>') + '</div>';
    });
    rows.forEach(function (s) {
      html += '<div class="heat__row" title="' + esc(s.label) + '"><i style="background:' + SPORT_COLOR[s.key] + '"></i>' + esc(s.label) + '</div>';
      MONTHS.forEach(function (m) {
        var b = monthBounds(m.key);
        var n = EVENTS.filter(function (e) { return e.s === s.key && passBase(e, true) && overlaps(e, b[0], b[1]); }).length;
        var sel = m.key === state.month && state.sports[s.key] && Object.keys(state.sports).length === 1;
        html += '<button class="heat__cell l' + level(n) + (sel ? ' is-sel' : '') + '" data-m="' + m.key + '" data-s="' + s.key + '" title="' + esc(s.label) + ', ' + MONTHS_NOM[m.m - 1].toLowerCase() + ' ' + m.y + ': ' + n + '">' + (n || '') + '</button>';
      });
    });
    $('#heat').innerHTML = html;
  }

  /* ---------- Месяцы ---------- */
  function renderMonths() {
    var html = '', year = null;
    MONTHS.forEach(function (m) {
      if (m.y !== year) { html += '<span class="months__year">' + m.y + '</span>'; year = m.y; }
      var b = monthBounds(m.key);
      var n = EVENTS.filter(function (e) { return passBase(e) && overlaps(e, b[0], b[1]); }).length;
      html += '<button class="months__btn' + (m.key === state.month ? ' is-active' : '') + (n ? '' : ' is-empty') + '" data-month="' + m.key + '">' + MONTHS_NOM[m.m - 1] + '</button>';
    });
    $('#months').innerHTML = html;
    var act = $('.months__btn.is-active');
    if (act && act.scrollIntoView) {
      var nav = $('#months');
      nav.scrollLeft = act.offsetLeft - nav.clientWidth / 2 + act.clientWidth / 2;
    }
  }

  /* ---------- Календарь дней ---------- */
  function renderDays() {
    var y = +state.month.slice(0, 4), m = +state.month.slice(5, 7);
    var first = new Date(y, m - 1, 1).getDay();
    var offset = (first + 6) % 7;
    var total = daysIn(y, m);
    var list = filtered();
    var html = '';
    for (var p = 0; p < offset; p++) html += '<div class="dcell dcell--pad"></div>';
    for (var d = 1; d <= total; d++) {
      var ds = state.month + '-' + pad(d);
      var evs = list.filter(function (e) { return !e.season && overlaps(e, ds, ds); });
      evs.sort(function (a, b) { return b.i - a.i; });
      var dots = evs.slice(0, 6).map(function (e) { return '<i style="background:' + SPORT_COLOR[e.s] + '" title="' + esc(e.t) + '"></i>'; }).join('');
      var wd = new Date(y, m - 1, d).getDay();
      var cls = 'dcell' + (ds === TODAY ? ' is-today' : '') + (ds === state.day ? ' is-sel' : '') + (wd === 0 || wd === 6 ? ' is-weekend' : '');
      html += '<button class="' + cls + '" data-day="' + ds + '" aria-label="' + esc(human(ds)) + ', событий: ' + evs.length + '">' +
        '<span class="dcell__n">' + d + '</span>' +
        (evs.length ? '<span class="dcell__cnt">' + evs.length + '</span>' : '') +
        '<span class="dcell__dots">' + dots + '</span></button>';
    }
    $('#days').innerHTML = html;
  }

  function renderDayPanel() {
    var ds = state.day;
    var panel = $('#dayPanel');
    if (!ds || ds.slice(0, 7) !== state.month) {
      panel.innerHTML = '<p class="day__title">Выберите день</p><p class="day__empty">Нажмите на дату в календаре, чтобы увидеть турниры этого дня.</p>';
      return;
    }
    var list = filtered().filter(function (e) { return overlaps(e, ds, ds); });
    var one = list.filter(function (e) { return !e.season; }).sort(function (a, b) { return b.i - a.i || (a.st < b.st ? -1 : 1); });
    var seasons = list.filter(function (e) { return e.season; }).sort(function (a, b) { return b.i - a.i; });
    var html = '<p class="day__title">' + esc(human(ds)) + '</p>' +
      '<p class="day__sub">' + (one.length ? 'Турниров и матчей: ' + one.length : 'Разовых событий нет') + (seasons.length ? ' · идут сезоны: ' + seasons.length : '') + '</p>';
    one.forEach(function (e) {
      var starts = e.st === ds ? 'старт' : e.en === ds ? 'финал / последний день' : 'идёт';
      html += '<button class="day__item" data-open="' + e.id + '">' +
        '<span class="day__bar" style="background:' + grad(e.c) + '"></span>' +
        '<span><span class="day__name">' + esc(e.t) + '</span><span class="day__meta" style="display:block">' + esc(e.g) + ' · ' + esc(e.d) + ' · ' + starts + '</span></span>' +
        '<span class="day__i" title="Популярность события: ' + e.i + ' из 5">' + '★'.repeat(e.i) + '</span></button>';
    });
    if (!one.length) html += '<p class="day__empty">В этот день разовых событий нет — ниже идущие сезоны.</p>';
    if (seasons.length) {
      html += '<div class="day__seasons"><b>Идут сезоны</b>' + seasons.map(function (e) {
        return '<button data-open="' + e.id + '">' + esc(e.t) + '</button>';
      }).join('') + '</div>';
    }
    panel.innerHTML = html;
  }

  /* ---------- Карточки месяца ---------- */
  function cardDate(e, b) {
    if (e.st <= b[0] && e.en >= b[1]) {
      var m = +b[0].slice(5, 7);
      return 'Весь ' + MONTHS_NOM[m - 1].toLowerCase();
    }
    return e.d;
  }
  function badge(e) {
    if (e.rank && e.rank <= 10) return '<span class="badge badge--top">Топ</span>';
    if (e.rank) return '<span class="badge">стоит<br>посмотреть</span>';
    return '';
  }
  function renderCards() {
    var b = monthBounds(state.month);
    var m = +state.month.slice(5, 7), y = state.month.slice(0, 4);
    $('#monthTitle').textContent = 'Турниры: ' + MONTHS_NOM[m - 1].toLowerCase() + ' ' + y;
    var list = filtered().filter(function (e) { return overlaps(e, b[0], b[1]); });
    if (state.sort === 'interest') {
      list.sort(function (a, c) { return (c.i - a.i) || ((a.rank || 99) - (c.rank || 99)) || (a.season ? 1 : 0) - (c.season ? 1 : 0) || (a.st < c.st ? -1 : 1); });
    } else {
      list.sort(function (a, c) { return a.st < c.st ? -1 : a.st > c.st ? 1 : c.i - a.i; });
    }
    $('#cardsEmpty').hidden = list.length > 0;
    $('#cards').innerHTML = list.map(function (e) {
      return '<div class="card" role="button" tabindex="0" data-open="' + e.id + '" style="--g:' + grad(e.c) + '">' +
        '<span class="card__ring"></span><span class="card__wm">' + esc(wm(e)) + '</span>' +
        (e.status !== '✔' ? '<span class="card__st" title="' + statusText(e.status) + '">' + e.status + '</span>' : '') +
        '<span class="card__g">' + esc(e.g) + '</span>' +
        '<h3 class="card__t">' + esc(e.t) + '</h3>' +
        '<span class="card__foot"><span class="card__stars" title="Популярность события: ' + e.i + ' из 5">' + '★'.repeat(e.i) + '<i>' + '★'.repeat(5 - e.i) + '</i></span>' +
        '<span class="card__d" style="display:block">' + esc(cardDate(e, b)) + '</span>' +
        '<a class="card__link" href="' + LINE_URL + '" data-line>Перейти в линию</a></span>' +
        badge(e) + '</div>';
    }).join('');
  }

  /* ---------- Рейтинг, Россия, ожидания ---------- */
  function renderRating() {
    $('#ratingList').innerHTML = window.RATING.map(function (r) {
      return '<li data-open="' + (r.id || '') + '"><span class="rating__n">' + r.n + '</span>' +
        '<span><span class="rating__t">' + esc(r.t) + '</span><span class="rating__why" style="display:block">' + esc(r.why) + '</span></span>' +
        '<span class="rating__d">' + esc(r.d) + '<span class="rating__s">' + esc(r.s) + '</span></span></li>';
    }).join('');
  }
  function renderRussia() {
    $('#rusList').innerHTML = window.RUSSIA.map(function (r) {
      return '<div class="rus__i ' + r.tone + '"><b>' + esc(r.k) + '</b><span>' + esc(r.v) + '</span></div>';
    }).join('');
  }
  function renderPending() {
    var und = window.UNDATED.filter(function (u) {
      if (state.cat !== 'all' && (SPORT[u.s] || {}).cat !== state.cat) return false;
      if (Object.keys(state.sports).length && !state.sports[u.s]) return false;
      return u.i >= state.minI;
    });
    $('#undated').innerHTML = (und.length ? und : []).map(function (u) {
      return '<div class="undated__i"><span class="undated__bar" style="background:' + SPORT_COLOR[u.s] + '"></span><div>' +
        '<div class="undated__t">' + esc(u.t) + ' <span class="stars" style="font-size:11px">' + '★'.repeat(u.i) + '</span></div>' +
        '<div class="undated__w">' + esc(u.when) + ' · ' + esc((SPORT[u.s] || {}).label || '') + '</div>' +
        '<div class="undated__x">' + esc(u.info) + '</div></div></div>';
    }).join('') || '<p class="muted">По выбранным фильтрам событий без дат нет.</p>';
    $('#pendingList').innerHTML = window.PENDING.map(function (p) {
      return '<div class="timeline__i"><div class="timeline__w">' + esc(p.when) + '</div><div class="timeline__x">' + esc(p.what) + '</div></div>';
    }).join('');
  }

  /* ---------- Модалка ---------- */
  function openEvent(id) {
    var e = BY_ID[id];
    if (!e) return;
    var box = $('#modal');
    var head = $('#mHead');
    head.style.setProperty('--g', grad(e.c));
    head.innerHTML = '<span class="card__ring"></span><span class="card__wm">' + esc(wm(e)) + '</span>' +
      '<div class="modal__g">' + esc(e.g) + '</div>' +
      '<h3 class="modal__t" id="mTitle">' + esc(e.t) + '</h3>' +
      '<div class="modal__tags"><span class="tag tag--y">' + esc(e.d) + '</span><span class="tag">' + statusText(e.status) + '</span>' +
      (e.rank ? '<span class="tag">№' + e.rank + ' в топе популярности</span>' : '') + '</div>';
    var rows = [
      ['Где проходит', e.p],
      ['Участники, фавориты, составы', e.who],
      ['Предпосылки и инфоповоды', e.info],
      ['Популярность события', stars(e.i), true],
      ['Вид спорта', (SPORT[e.s] || {}).label]
    ];
    var html = '<dl>';
    rows.forEach(function (r) {
      if (!r[1]) return;
      html += '<div class="kv"><dt>' + r[0] + '</dt><dd>' + (r[2] ? r[1] : esc(r[1])) + '</dd></div>';
    });
    if (e.ann) html += '<div class="kv kv--ann"><dt>Что ещё объявят</dt><dd>' + esc(e.ann) + '</dd></div>';
    html += '</dl><div class="modal__cta"><a class="btn btn--dark" href="' + LINE_URL + '" data-line>Перейти в линию</a>' +
      (e.src ? '<a class="btn btn--ghost" href="' + esc(e.src) + '" target="_blank" rel="noopener">Источник</a>' : '') +
      '<button class="btn btn--ghost" data-goto="' + e.id + '">Показать в календаре</button></div>';
    $('#mBody').innerHTML = html;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close').focus();
  }
  function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; }

  /* ---------- Рендер ---------- */
  function renderAll() {
    renderChips(); renderHeat(); renderMonths(); renderDays(); renderDayPanel(); renderCards(); renderPending();
  }
  function setMonth(key, keepDay) {
    state.month = key;
    if (!keepDay) {
      if (TODAY.slice(0, 7) === key) state.day = TODAY;
      else {
        var list = filtered().filter(function (e) { return !e.season; });
        var days = daysIn(+key.slice(0, 4), +key.slice(5, 7)), found = null;
        for (var d = 1; d <= days && !found; d++) {
          var ds = key + '-' + pad(d);
          if (list.some(function (e) { return overlaps(e, ds, ds); })) found = ds;
        }
        state.day = found || key + '-01';
      }
    }
  }

  /* ---------- События интерфейса ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var line = t.closest('[data-line]');
    if (line) { ev.stopPropagation(); if (LINE_URL === '#') ev.preventDefault(); return; }
    if (t.closest('[data-bonus]') && BONUS_URL === '#') { ev.preventDefault(); return; }

    var cat = t.closest('[data-cat]');
    if (cat) {
      state.cat = cat.getAttribute('data-cat'); state.sports = {};
      $all('.seg__btn').forEach(function (b) { b.classList.toggle('is-active', b === cat); });
      return renderAll();
    }
    var sp = t.closest('[data-sport]');
    if (sp) {
      var k = sp.getAttribute('data-sport');
      if (state.sports[k]) delete state.sports[k]; else state.sports[k] = 1;
      return renderAll();
    }
    var mi = t.closest('[data-min]');
    if (mi) {
      state.minI = +mi.getAttribute('data-min');
      $all('.interest__btn').forEach(function (b) { b.classList.toggle('is-active', b === mi); });
      return renderAll();
    }
    var hc = t.closest('.heat__cell');
    if (hc) {
      state.sports = {}; state.sports[hc.getAttribute('data-s')] = 1;
      setMonth(hc.getAttribute('data-m'));
      renderAll();
      $('#calendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var mb = t.closest('[data-month]');
    if (mb) { setMonth(mb.getAttribute('data-month')); return renderAll(); }
    var dc = t.closest('[data-day]');
    if (dc) { state.day = dc.getAttribute('data-day'); renderDays(); renderDayPanel(); return; }
    var so = t.closest('[data-sort]');
    if (so) {
      state.sort = so.getAttribute('data-sort');
      $all('.sort__btn').forEach(function (b) { b.classList.toggle('is-active', b === so); });
      return renderCards();
    }
    var go = t.closest('[data-goto]');
    if (go) {
      var e = BY_ID[go.getAttribute('data-goto')];
      closeModal();
      var start = e.st < FIRST_MONTH + '-01' ? TODAY : e.st;
      setMonth(start.slice(0, 7), true); state.day = start;
      renderAll();
      $('#calendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var op = t.closest('[data-open]');
    if (op && op.getAttribute('data-open')) { openEvent(op.getAttribute('data-open')); return; }
    if (t.closest('[data-close]')) { closeModal(); return; }
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
    $all('.interest__btn').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-min') === '0'); });
    renderAll();
  });
  $('[data-bonus]').setAttribute('href', BONUS_URL);

  /* ---------- Старт ---------- */
  renderStats(); renderRating(); renderRussia(); renderAll();
})();
