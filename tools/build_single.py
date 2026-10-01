# -*- coding: utf-8 -*-
"""
Собирает версии лендинга для проверки:
  exports/lending-calendar.html — весь сайт одним файлом (открывается двойным кликом)
  exports/lending-calendar.txt  — текстовая версия календаря

Запуск: python tools/build_single.py
"""
import base64, re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')
data = (ROOT / 'js' / 'data.js').read_text(encoding='utf-8')
app = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')


def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode((ROOT / path).read_bytes()).decode())


for name in ('bonus-mobile', 'bonus-desktop', 'hero'):
    html = html.replace('img/%s.webp' % name, b64('img/%s.webp' % name, 'image/webp'))
html = html.replace('href="favicon.svg"', 'href="%s"' % b64('favicon.svg', 'image/svg+xml'))
html = re.sub(r'\s*<link rel="icon" href="favicon\.png".*?>', '', html)
html = re.sub(r'\s*<link rel="apple-touch-icon".*?>', '', html)
html = re.sub(r'\s*<!-- \?v=.*?-->', '', html)

html = re.sub(r'<link rel="stylesheet" href="css/style\.css[^"]*">', '@@CSS@@', html)
html = re.sub(r'<script src="js/data\.js[^"]*"></script>\s*<script src="js/app\.js[^"]*"></script>', '@@JS@@', html)
html = html.replace('@@CSS@@', '<style>\n' + css + '\n  </style>')
html = html.replace('@@JS@@', '<script>\n' + data + '\n</script>\n  <script>\n' + app + '\n</script>')
assert 'css/style.css' not in html and 'js/app.js' not in html and 'img/' not in html

(ROOT / 'exports').mkdir(exist_ok=True)
(ROOT / 'exports' / 'lending-calendar.html').write_text(html, encoding='utf-8')
print('html:', round(len(html.encode()) / 1024), 'КБ')

# ---------- текстовая версия ----------
block = data[data.index('window.EVENTS = ['): data.index('/* События без дат')]
chunks = re.split(r"\n  \{ id:", block)[1:]


def f(c, key):
    m = re.search(r"(?<![\w$])" + key + r":'([^']*)'", c)
    return m.group(1) if m else ''


MN = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
      'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ']

evs = []
for c in chunks:
    c = 'id:' + c
    evs.append({k: f(c, k) for k in ('st', 'd', 't', 'g', 'p', 'status', 'url')})
evs.sort(key=lambda e: (e['st'], e['t']))

out = ['КАЛЕНДАРЬ СПОРТИВНЫХ СОБЫТИЙ 2026–2027',
       'Спорт и киберспорт · %d турниров' % len(evs),
       'Статус даты: ✔ подтверждена · ≈ ожидается · ? не объявлена', '']
cur = None
for e in evs:
    if e['st'][:7] != cur:
        cur = e['st'][:7]
        y, mm = cur.split('-')
        out += ['', '=' * 68, '%s %s' % (MN[int(mm) - 1], y), '=' * 68]
    out.append('%s %s' % (e['status'] or '?', e['t']))
    out.append('   %s · %s' % (e['d'], e['g']))
    if e['p'] and e['p'] not in ('—', '?'):
        out.append('   Место: %s' % e['p'])
    out.append('   Линия: %s' % (e['url'] or 'https://melbet.ru/ru/sport'))
    out.append('')

(ROOT / 'exports' / 'lending-calendar.txt').write_text('\n'.join(out), encoding='utf-8-sig')
print('txt:', len(evs), 'событий')
