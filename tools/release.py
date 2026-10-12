# -*- coding: utf-8 -*-
"""
Готовит пару файлов для отправки руководителю, с номером версии в названии.

Платформа не принимает повторно файл с тем же именем, поэтому каждая
отправка должна называться по-новому: calendar-embed-V2.txt, -V3 и так далее.
Содержимое при этом не меняется — это копии свежесобранных файлов.

Запуск (после build_embed.py и build_single.py):

    python tools/release.py            # следующая версия
    python tools/release.py --v 5      # конкретный номер

Результат: exports/calendar-embed-V<N>.txt и exports/lending-calendar-V<N>.html
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXPORTS = ROOT / 'exports'
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Что отправляем: исходник -> шаблон имени с версией
PAIRS = [
    ('calendar-embed.txt', 'calendar-embed-V%d.txt'),
    ('lending-calendar.html', 'lending-calendar-V%d.html'),
]

# Первая версия у руководителя была без номера, поэтому нумерация
# начинается со второй.
FIRST = 2


def current():
    found = [int(m.group(1)) for p in EXPORTS.glob('calendar-embed-V*.txt')
             for m in [re.fullmatch(r'calendar-embed-V(\d+)\.txt', p.name)] if m]
    return max(found) if found else None


def main():
    if '--v' in sys.argv:
        version = int(sys.argv[sys.argv.index('--v') + 1])
    else:
        now = current()
        version = FIRST if now is None else now + 1

    for src_name, pattern in PAIRS:
        src = EXPORTS / src_name
        if not src.exists():
            sys.exit('Нет файла %s — сначала пересоберите блок' % src_name)
        dst = EXPORTS / (pattern % version)
        shutil.copy2(src, dst)
        print('%s — %.1f КБ' % (dst.name, dst.stat().st_size / 1024))

    print('Версия для отправки: V%d' % version)


if __name__ == '__main__':
    main()
