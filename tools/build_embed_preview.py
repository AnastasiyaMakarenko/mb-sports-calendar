# -*- coding: utf-8 -*-
"""
Страница-превью: тот же блок, что собирается на сайте, но стили, разметка,
скрипт, картинки и события зашиты внутрь — чтобы смотреть вид без сети.

Запуск: python tools/build_embed_preview.py
Результат: exports/embed-preview.html
"""
import base64, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
BASE = 'https://raw.githubusercontent.com/AnastasiyaMakarenko/mb-sports-calendar/main/'

css = (ROOT / 'embed' / 'calendar.css').read_text(encoding='utf-8')
markup = (ROOT / 'embed' / 'calendar.html').read_text(encoding='utf-8')
script = (ROOT / 'embed' / 'calendar.js').read_text(encoding='utf-8')
events = (ROOT / 'data' / 'events.json').read_text(encoding='utf-8')


def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode((ROOT / path).read_bytes()).decode())


for name in ('bonus-mobile', 'bonus-desktop', 'hero'):
    markup = markup.replace(BASE + 'img/%s.webp' % name, b64('img/%s.webp' % name, 'image/webp'))

assert 'raw.githubusercontent.com' not in markup, 'в разметке остались внешние ссылки'

page = '''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Календарь — превью блока для сайта</title>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #222; background: #fff; }
  .host { padding: 18px 16px; background: #f1f1f1; border-bottom: 1px solid #ddd; font-size: 14px; }
  .host b { display: block; font-size: 16px; margin-bottom: 4px; }
</style>
<style>
''' + css + '''
</style>
</head>
<body>
<div class="host"><b>Здесь идёт обычное содержимое страницы сайта</b>
Ниже — блок календаря ровно в том виде, в каком он встанет после вставки.</div>

<div id="mbc">
''' + markup + '''
</div>

<div class="host">Здесь продолжается страница сайта после блока.</div>

<script>window.MBC_DATA = ''' + events + ''';</script>
<script>
''' + script + '''
</script>
</body>
</html>
'''

(ROOT / 'exports').mkdir(exist_ok=True)
(ROOT / 'exports' / 'embed-preview.html').write_text(page, encoding='utf-8')
print('embed-preview.html:', round(len(page.encode()) / 1024), 'КБ')
