# -*- coding: utf-8 -*-
"""
Страница-превью: тот же блок, что отдаётся на сайт, но данные и картинки
зашиты внутрь — чтобы можно было посмотреть вид до публикации репозитория.

Запуск: python tools/build_embed_preview.py
Результат: exports/embed-preview.html
"""
import base64, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

snippet = (ROOT / 'exports' / 'calendar-embed.txt').read_text(encoding='utf-8')
BASE = 'https://raw.githubusercontent.com/AnastasiyaMakarenko/mb-sports-calendar/main/'


def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode((ROOT / path).read_bytes()).decode())


# картинки — внутрь файла
for name in ('bonus-mobile', 'bonus-desktop', 'hero'):
    snippet = snippet.replace(BASE + 'img/%s.webp' % name, b64('img/%s.webp' % name, 'image/webp'))

# события — внутрь файла (в рабочем блоке они грузятся из репозитория)
events_uri = b64('data/events.json', 'application/json')
snippet = snippet.replace(
    "fetch(BASE + 'data/events.json?t=' + Date.now())",
    "fetch('%s')" % events_uri)

snippet = snippet.replace("var BASE = '%s';" % BASE, "var BASE = '';")
assert 'raw.githubusercontent.com' not in snippet, 'остались внешние ссылки'

page = '''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Календарь — превью блока для сайта</title>
<style>
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #222; background: #fff; }
  .host { padding: 18px 16px; background: #f1f1f1; border-bottom: 1px solid #ddd; font-size: 14px; }
  .host b { display: block; font-size: 16px; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="host"><b>Здесь идёт обычное содержимое страницы сайта</b>
Ниже — блок календаря ровно в том виде, в каком он встанет после вставки.</div>

''' + snippet + '''
<div class="host">Здесь продолжается страница сайта после блока.</div>
</body>
</html>
'''

(ROOT / 'exports' / 'embed-preview.html').write_text(page, encoding='utf-8')
print('embed-preview.html:', round(len(page.encode()) / 1024), 'КБ')
