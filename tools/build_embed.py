# -*- coding: utf-8 -*-
"""
Готовит всё для вставки календаря на сторонний сайт.

На выходе:
  data/events.json          — события (их читает скрипт блока)
  embed/calendar.css        — стили блока
  embed/calendar.html       — разметка блока
  embed/calendar.js         — логика блока
  exports/calendar-embed.txt — КОРОТКИЙ ЗАГРУЗЧИК для вставки на страницу.
                               Он забирает три файла выше из репозитория,
                               поэтому любые правки вида подхватываются сами.

Запуск:  python tools/build_embed.py
Тест:    python tools/build_embed.py --base http://localhost:8765/
"""
import json, re, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
BASE_DEFAULT = 'https://raw.githubusercontent.com/AnastasiyaMakarenko/mb-sports-calendar/main/'

base = BASE_DEFAULT
if '--base' in sys.argv:
    base = sys.argv[sys.argv.index('--base') + 1]

src = (ROOT / 'js' / 'data.js').read_text(encoding='utf-8')

# ---------------- события в JSON ----------------
block = src[src.index('window.EVENTS = ['): src.index('/* События без дат')]
chunks = re.split(r"\n  \{ id:", block)[1:]


def field(chunk, key):
    m = re.search(r"(?<![\w$])" + key + r":'([^']*)'", chunk)
    return m.group(1) if m else ''


def num(chunk, key):
    m = re.search(r"(?<![\w$])" + key + r":(\d+)", chunk)
    return int(m.group(1)) if m else None


events = []
for c in chunks:
    c = 'id:' + c
    e = {k: field(c, k) for k in ('id', 't', 's', 'g', 'c', 'st', 'en', 'd', 'p', 'status', 'url')}
    e['i'] = num(c, 'i') or 1
    rank = num(c, 'rank')
    if rank:
        e['rank'] = rank
    if re.search(r"(?<![\w$])season:1", c):
        e['season'] = 1
    if not e['en']:
        e['en'] = e['st']
    events.append({k: v for k, v in e.items() if v not in ('', None)})

sports = [{'key': k, 'label': l, 'cat': cat}
          for k, l, cat in re.findall(r"key: '(\w+)',\s*label: '([^']+)',\s*cat: '(\w+)'", src)]

(ROOT / 'data').mkdir(exist_ok=True)
(ROOT / 'data' / 'events.json').write_text(json.dumps({
    'updated_at': datetime.datetime.now().astimezone().replace(microsecond=0).isoformat(),
    'sports': sports,
    'events': events,
}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

# ---------------- стили: те же, но внутри #mbc ----------------
css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')


def scope(css_text):
    res, i = [], 0
    while i < len(css_text):
        br = css_text.find('{', i)
        if br == -1:
            res.append(css_text[i:]); break
        head = css_text[i:br]
        depth, j = 0, br
        while j < len(css_text):
            if css_text[j] == '{': depth += 1
            elif css_text[j] == '}':
                depth -= 1
                if depth == 0: break
            j += 1
        body, head_clean = css_text[br + 1:j], head.strip()
        if head_clean.startswith('@media'):
            res.append(head + '{' + scope(body) + '}')
        elif head_clean.startswith('@'):
            res.append(head + '{' + body + '}')
        else:
            sels = []
            for s in head_clean.split(','):
                s = s.strip()
                if not s:
                    continue
                if s in (':root', 'body', 'html'):
                    sels.append('#mbc')
                elif s == '*':
                    sels.append('#mbc *')
                else:
                    sels.append('#mbc ' + s)
            res.append('\n' + ', '.join(sels) + ' {' + body + '}')
        i = j + 1
    return ''.join(res)


css_scoped = ('/* Блок не зависит от стилей страницы, на которую его вставили */\n'
              '#mbc { display: block; text-align: left; }\n'
              '#mbc, #mbc * { box-sizing: border-box; }\n'
              '#mbc img { max-width: 100%; }\n') + scope(css)

# ---------------- разметка ----------------
html = (ROOT / 'index.html').read_text(encoding='utf-8')
markup = html[html.index('<div class="page">'):html.index('<script src="js/data.js')].strip()
markup = markup.replace('img/', base + 'img/')
markup = re.sub(r'\s*id="(months|sportChips|cards|listTitle|cardsEmpty|moreCards|filtersBtn|filtersCount|resetBtn|resetBtn2|filtersApply|filtersClose|fpanel)"',
                lambda m: ' id="mbc-' + m.group(1) + '"', markup)

# ---------------- скрипт ----------------
app = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')
palette = app[app.index('  var COLORS = {'):app.index('  var EVENTS = window.EVENTS;')]
line_url = re.search(r"var LINE_URL = '([^']*)'", app).group(1)
bonus_url = re.search(r"var BONUS_URL = '([^']*)'", app).group(1)
icons_js = re.search(r"var ICONS = (\{.*?\n  \});", app, re.S).group(1)
sport_color = re.search(r"var SPORT_COLOR = (\{.*?\n  \});", app, re.S).group(1)

consts = ("  var LINE_URL = '%s';\n  var BONUS_URL = '%s';\n" % (line_url, bonus_url)) + palette + \
         "  var SPORT_COLOR = " + sport_color + ";\n"

script = '''(function () {
  var BASE = '%s';
  var root = document.getElementById('mbc');
  var $ = function (id) { return root.querySelector('#mbc-' + id); };
  var CARDS_STEP = 12;
%s
  var MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  var ICONS = %s;

  var EVENTS = [], SPORTS = [], MONTHS = [];
  var state = { sports: {}, month: null, shown: CARDS_STEP };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function daysIn(y, m) { return new Date(y, m, 0).getDate(); }
  function bounds(key) { return [key + '-01', key + '-' + pad(daysIn(+key.slice(0, 4), +key.slice(5, 7)))]; }
  function overlaps(e, a, b) { return e.st <= b && e.en >= a; }
  function grad(c) { var g = COLORS[c] || ['#444', '#111']; return 'linear-gradient(135deg,' + g[0] + ' 0%%,' + g[1] + ' 100%%)'; }
  function icon(e) {
    return '<svg class="card__ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[e.s] || ICONS.football) + '</svg>';
  }
  function byPop(a, b) { return (b.i - a.i) || ((a.rank || 99) - (b.rank || 99)) || ((a.season ? 1 : 0) - (b.season ? 1 : 0)) || (a.st < b.st ? -1 : 1); }
  function active() { return Object.keys(state.sports).length; }
  function pass(e) { return !active() || !!state.sports[e.s]; }

  var TODAY = (function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); })();

  function buildMonths() {
    var first = EVENTS.reduce(function (a, e) { return e.st < a ? e.st : a; }, '9999').slice(0, 7);
    var last = EVENTS.reduce(function (a, e) { return e.en > a ? e.en : a; }, '0000').slice(0, 7);
    var y = +first.slice(0, 4), m = +first.slice(5, 7);
    MONTHS = [];
    while (y * 100 + m <= +last.replace('-', '')) {
      MONTHS.push({ key: y + '-' + pad(m), y: y, m: m });
      m++; if (m > 12) { m = 1; y++; }
    }
    var cur = TODAY.slice(0, 7);
    state.month = cur < MONTHS[0].key ? MONTHS[0].key : (cur > MONTHS[MONTHS.length - 1].key ? MONTHS[MONTHS.length - 1].key : cur);
  }

  function renderChips() {
    $('sportChips').innerHTML = SPORTS.map(function (s) {
      return '<button class="chip' + (state.sports[s.key] ? ' is-active' : '') + '" data-sport="' + s.key + '">' +
        '<i style="background:' + (SPORT_COLOR[s.key] || '#888') + '"></i>' + esc(s.label) + '</button>';
    }).join('');
    var n = active();
    $('filtersCount').hidden = !n;
    $('filtersCount').textContent = n;
    $('resetBtn').hidden = !n;
    $('filtersBtn').classList.toggle('is-on', !!n);
  }

  function renderMonths() {
    $('months').innerHTML = MONTHS.map(function (mo, i) {
      var past = bounds(mo.key)[1] < TODAY;
      return '<button class="mon' + (mo.key === state.month ? ' is-active' : '') + (past ? ' is-past' : '') + '" data-month="' + mo.key + '">' +
        MONTHS_SHORT[mo.m - 1] + (mo.m === 1 || i === 0 ? '<small>' + mo.y + '</small>' : '') + '</button>';
    }).join('');
    var nav = $('months'), act = nav.querySelector('.mon.is-active');
    if (act) nav.scrollLeft = act.offsetLeft - nav.clientWidth / 2 + act.clientWidth / 2;
  }

  function badge(e) {
    if (e.rank && e.rank <= 10) return '<span class="badge badge--top">Топ</span>';
    if (e.rank) return '<span class="badge">стоит посмотреть</span>';
    return '';
  }

  function renderList() {
    var b = bounds(state.month), mm = +state.month.slice(5, 7);
    var list = EVENTS.filter(function (e) { return pass(e) && overlaps(e, b[0], b[1]); }).sort(byPop);
    $('listTitle').textContent = MONTHS_NOM[mm - 1] + ' ' + state.month.slice(0, 4);
    $('cardsEmpty').hidden = list.length > 0;
    $('cards').innerHTML = list.slice(0, state.shown).map(function (e) {
      return '<a class="card' + (e.rank ? ' has-badge' : '') + '" href="' + esc(e.url || LINE_URL) + '" data-line style="--g:' + grad(e.c) + '" title="' + esc(e.t) + ' · ' + esc(e.d) + '">' +
        icon(e) + badge(e) +
        '<span class="card__g">' + esc(e.g) + '</span>' +
        '<span class="card__t">' + esc(e.t) + '</span>' +
        '<span class="card__link">Перейти в линию</span></a>';
    }).join('');
    var rest = list.length - state.shown;
    $('moreCards').hidden = rest <= 0;
    $('moreCards').textContent = 'Показать ещё ' + Math.min(rest, CARDS_STEP) + ' из ' + rest;
  }

  function renderAll() { state.shown = CARDS_STEP; renderChips(); renderMonths(); renderList(); }

  root.addEventListener('click', function (ev) {
    var t = ev.target, el;
    if ((el = t.closest('[data-line]')) && el.getAttribute('href') === '#') { ev.preventDefault(); return; }
    if (t.closest('[data-bonus]') && BONUS_URL === '#') { ev.preventDefault(); return; }
    if (t.closest('#mbc-filtersBtn')) { var h = $('fpanel').hidden; $('fpanel').hidden = !h; $('filtersBtn').setAttribute('aria-expanded', h ? 'true' : 'false'); return; }
    if (t.closest('#mbc-filtersClose') || t.closest('#mbc-filtersApply')) { $('fpanel').hidden = true; return; }
    if (t.closest('#mbc-resetBtn') || t.closest('#mbc-resetBtn2')) { state.sports = {}; renderAll(); return; }
    if (!t.closest('.filters') && !$('fpanel').hidden) $('fpanel').hidden = true;
    if ((el = t.closest('[data-sport]'))) {
      var k = el.getAttribute('data-sport');
      if (state.sports[k]) delete state.sports[k]; else state.sports[k] = 1;
      return renderAll();
    }
    if ((el = t.closest('[data-month]'))) { state.month = el.getAttribute('data-month'); state.shown = CARDS_STEP; renderMonths(); renderList(); return; }
    if (t.closest('#mbc-moreCards')) { state.shown += CARDS_STEP; renderList(); return; }
  });

  root.querySelector('[data-bonus]').setAttribute('href', BONUS_URL);

  (window.MBC_DATA ? Promise.resolve(window.MBC_DATA)
    : fetch(BASE + 'data/events.json?t=' + Date.now()).then(function (r) {
        if (!r.ok) throw new Error(r.status); return r.json();
      }))
    .then(function (data) {
      EVENTS = data.events || [];
      EVENTS.forEach(function (e) { if (!e.en) e.en = e.st; });
      SPORTS = data.sports || [];
      buildMonths();
      renderAll();
    })
    .catch(function (e) {
      $('cards').innerHTML = '';
      $('cardsEmpty').hidden = false;
      $('cardsEmpty').textContent = 'Не удалось загрузить календарь (' + e.message + ')';
    });
})();
''' % (base, consts, icons_js)

(ROOT / 'embed').mkdir(exist_ok=True)
(ROOT / 'embed' / 'calendar.css').write_text(css_scoped, encoding='utf-8')
(ROOT / 'embed' / 'calendar.html').write_text(markup, encoding='utf-8')
(ROOT / 'embed' / 'calendar.js').write_text(script, encoding='utf-8')

# ---------------- загрузчик для вставки на сайт ----------------
loader = '''<!-- Календарь спортивных событий. Вставить один раз; обновления приходят сами. -->
<div id="mbc">Загружаем календарь…</div>
<script>
(function () {
  var BASE = '%sembed/';
  var box = document.getElementById('mbc');
  function get(file) {
    return fetch(BASE + file + '?t=' + Date.now()).then(function (r) {
      if (!r.ok) throw new Error(file + ': ' + r.status);
      return r.text();
    });
  }
  Promise.all([get('calendar.css'), get('calendar.html'), get('calendar.js')])
    .then(function (parts) {
      var style = document.createElement('style');
      style.textContent = parts[0];
      document.head.appendChild(style);
      box.innerHTML = parts[1];
      var script = document.createElement('script');
      script.textContent = parts[2];
      document.body.appendChild(script);
    })
    .catch(function (e) {
      box.textContent = 'Не удалось загрузить календарь (' + e.message + ')';
    });
})();
</script>
''' % base

(ROOT / 'exports').mkdir(exist_ok=True)
(ROOT / 'exports' / 'calendar-embed.txt').write_text(loader, encoding='utf-8')

print('events.json:', len(events), 'событий')
print('embed/: css %d КБ, html %d КБ, js %d КБ' % (
    len(css_scoped.encode()) / 1024, len(markup.encode()) / 1024, len(script.encode()) / 1024))
print('загрузчик:', len(loader.encode()), 'байт, BASE =', base)
