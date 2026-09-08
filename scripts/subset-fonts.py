"""Build local CJK subsets after editing translations.
Usage: python subset-fonts.py /path/to/NotoSansCJKsc-Regular.otf /path/to/NotoSansJP.ttf
Requires fonttools and brotli for this maintenance task only.
"""
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
copy = ''.join(p.read_text() for p in (root / 'assets').glob('*.js')) + '中文日本語'
characters = {ord(c) for c in copy if ord(c) > 127}
for source, language in zip(sys.argv[1:], ['sc', 'jp']):
    font = TTFont(source)
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': 400}, inplace=True)
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=characters)
    sub.subset(font)
    family = 'Studio CJK ' + language.upper()
    names = {1: family, 2: 'Regular', 3: family + ' Regular 1.0',
             4: family + ' Regular', 6: 'StudioCJK' + language.upper() + '-Regular',
             16: family, 17: 'Regular'}
    for record in font['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    if 'CFF ' in font:
        font['CFF '].cff.fontNames = [names[6]]
        for top in font['CFF '].cff.topDictIndex:
            top.FamilyName, top.FullName = family, names[4]
    font.flavor = 'woff2'
    output = root / 'assets/fonts' / f'studio-cjk-{language}.woff2'
    font.save(output)
    print(output.name, output.stat().st_size, 'bytes')
