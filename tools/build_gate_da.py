#!/usr/bin/env python3
"""Convert the downloaded GateXAIML HTML notes into the site's book JSON (book id: gate-da).

Input : modules/gate-da/raw/<subject>/chNN.html   (see tools/fetch_gate_da.py)
Output: modules/gate-da/data/index.json and chapters/*.json

Usage: python3 tools/build_gate_da.py [subject ...]   (default: every subject that has been downloaded)
"""
import html, json, os, re, sys
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'modules', 'gate-da', 'raw')
OUT = os.path.join(ROOT, 'modules', 'gate-da', 'data')
BOOK = 'gate-da'

SUBJECTS = [  # (folder, display name, slug fragment)
    ('ps', 'Probability & Statistics', 'probability-statistics'),
    ('mla', 'Matrices & Linear Algebra', 'matrices'),
    ('va', 'Vector Spaces', 'vector-spaces'),
    ('calc', 'Calculus & Optimization', 'calculus'),
    ('python', 'Python Programming', 'python'),
    ('dsa', 'Data Structures & Algorithms', 'dsa'),
    ('dbms', 'Database Management Systems', 'dbms'),
    ('dw', 'Data Warehousing & OLAP', 'data-warehousing'),
    ('mls', 'Machine Learning: Supervised', 'ml-supervised'),
    ('mlu', 'Machine Learning: Unsupervised', 'ml-unsupervised'),
]

# ---------------------------------------------------------------- math helpers
JOINS = {'leftouterjoin': '⟕', 'rightouterjoin': '⟖', 'fullouterjoin': '⟗'}


def expand_macros(m):
    m = re.sub(r'\\ding\{51\}', '✓', m)
    m = re.sub(r'\\ding\{55\}', '✗', m)
    m = re.sub(r'\\R(?![A-Za-z])', r'\\mathbb{R}', m)
    for k, v in JOINS.items():
        m = re.sub(r'\\%s(?![A-Za-z])' % k, r'\\mathbin{%s}' % v, m)
    out, i = [], 0
    while True:
        j = m.find('\\norm{', i)
        if j < 0:
            out.append(m[i:]); break
        out.append(m[i:j])
        k, d = j + 6, 1
        while k < len(m) and d:
            d += (m[k] == '{') - (m[k] == '}')
            k += 1
        out.append('\\left\\lVert ' + m[j + 6:k - 1] + ' \\right\\rVert')
        i = k
    return ''.join(out)


MATH_RE = re.compile(r'(\\begin\{(?:align|aligned|gather|equation|split)\*?\}.+?\\end\{(?:align|aligned|gather|equation|split)\*?\}|\$\$.+?\$\$|\\\[.+?\\\]|\\\(.+?\\\)|(?<!\\)\$(?:\\.|[^$\\])+?\$)', re.S)
TAG_RE = re.compile(r'(<[^>]+>)')


def inline_markup(raw):
    """HTML fragment -> (mini-markup string, list of display-math strings by marker)."""
    displays, inlines = [], []

    def stash(mo):
        s = mo.group(0)
        if s.startswith('\\begin'):
            body, disp = s, True
        elif s.startswith('$$') or s.startswith('\\['):
            body, disp = s[2:-2], True
        elif s.startswith('\\('):
            body, disp = s[2:-2], False
        else:
            body, disp = s[1:-1], False
        body = expand_macros(html.unescape(re.sub(r'<(?=/?[a-zA-Z]+[^<>]*>)[^>]*>', '', body))).strip()
        if disp:
            displays.append(body)
            return '\u0001%d\u0001' % (len(displays) - 1)
        inlines.append(body)
        return '\u0002%d\u0003' % (len(inlines) - 1)

    raw = re.sub(r'\$\$(\d[\d,.]*)\$', r'$\\\\$\1$', raw)
    s = MATH_RE.sub(stash, raw)
    parts = TAG_RE.split(s)
    out = []
    in_code = 0
    for p in parts:
        if TAG_RE.fullmatch(p):
            t = re.match(r'</?\s*([a-zA-Z0-9]+)', p)
            name = t.group(1).lower() if t else ''
            close = p.startswith('</')
            if name == 'code':
                in_code += -1 if close else 1
            if name in ('strong', 'b'):
                out.append('</b>' if close else '<b>')
            elif name in ('em', 'i'):
                out.append('</i>' if close else '<i>')
            elif name in ('code', 'u', 'sup', 'sub'):
                out.append('</%s>' % name if close else '<%s>' % name)
            elif name == 'br':
                out.append('\n')
            continue
        txt = html.unescape(p)
        segs = re.split(r'(\u0002\d+\u0003)', txt)
        for sg in segs:
            mm = re.fullmatch(r'\u0002(\d+)\u0003', sg)
            if mm:
                out.append('$' + inlines[int(mm.group(1))] + '$')
            else:
                sg = sg.replace('<', '&lt;').replace('>', '&gt;')
                if not in_code:
                    sg = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', sg, flags=re.S)
                out.append(sg)
    return ''.join(out), displays


def tabular_blocks(raw):
    """A leaked LaTeX tabularx environment -> a table block (plus any text around it)."""
    mm = re.search(r'\\begin\{tabularx?\}\{[^}]*\}(?:\{[^}]*\})?(.*?)\\end\{tabularx?\}', raw, re.S)
    body = mm.group(1)
    body = re.sub(r'\\rowcolor\{[^}]*\}', '', body)
    rows = []
    for chunk in re.split(r'\\hline|<br\s*/?>\s*', body):
        chunk = chunk.strip()
        if not chunk:
            continue
        cells = [inline_markup(c.strip())[0].strip() for c in chunk.split('&amp;')]
        if any(cells):
            rows.append(cells)
    out = []
    pre, post = raw[:mm.start()], raw[mm.end():]
    if pre.strip():
        out.extend(para_blocks(pre))
    out.append({'t': 'table', 'rows': rows})
    if post.strip():
        out.extend(para_blocks(post))
    return out


def para_blocks(raw):
    if '\\begin{tabular' in raw:
        return tabular_blocks(raw)
    s, disp = inline_markup(raw)
    blocks = []
    for piece in re.split(r'(\u0001\d+\u0001)', s):
        mm = re.fullmatch(r'\u0001(\d+)\u0001', piece)
        if mm:
            blocks.append({'t': 'math', 'x': disp[int(mm.group(1))]})
        else:
            piece = re.sub(r'[ \t]*\n[ \t]*', '\n', piece).strip()
            if piece:
                blocks.append({'t': 'p', 'x': piece})
    return blocks


def inner(node):
    return ''.join(html.escape(str(c), quote=False) if isinstance(c, NavigableString) else str(c) for c in node.contents)


# ---------------------------------------------------------------- structure
def box_kind(cls, title):
    if 'example-box' in cls:
        return 'example'
    if 'def-box' in cls or 'concept-box-alt' in cls:
        return 'definition'
    if 'fact-box' in cls:
        return 'nuance'
    if 'formula-box' in cls:
        return 'formulas'
    return 'theorem'


DEFAULT_NAME = {'example': 'Example', 'definition': 'Definition', 'nuance': 'Fact', 'formulas': 'Formulas', 'theorem': 'Concept'}


def plain(node):
    return re.sub(r'\s+', ' ', node.get_text(' ')).strip()


def convert_box(div, sub):
    cls = ' '.join(div.get('class', []))
    kind = box_kind(cls, '')
    t = div.find(class_='box-title', recursive=False)
    title = inline_markup(inner(t))[0].strip() if t else ''
    body = div.find(class_='box-body', recursive=False)
    blocks = convert_children(body if body else div, sub) if (body or div) else []
    num = None
    name = DEFAULT_NAME[kind]
    if kind == 'example':
        mm = re.match(r'^Example\s+(\d+)\s*:?\s*(.*)$', title, re.S)
        if mm:
            num, title = mm.group(1), mm.group(2).strip()
        elif title.lower() == 'example':
            title = ''
    elif title.lower() == name.lower() or (kind == 'theorem' and title.lower() == 'concept'):
        title = ''
    return {'t': 'box', 'kind': kind, 'name': name, 'num': num, 'title': title or None, 'blocks': blocks}


def convert_list(el, sub):
    ordered = el.name == 'ol'
    style = {'a': 'a', 'A': 'a', 'i': 'i', 'I': 'i'}.get(el.get('type'), None)
    items = []
    for li in el.find_all('li', recursive=False):
        items.append({'blocks': convert_children(li, sub)})
    return {'t': 'list', 'ordered': ordered, 'style': style, 'desc': False, 'items': items}


def convert_children(parent, sub):
    blocks = []
    buf = []  # loose inline content (text and inline tags) between block elements

    def flush():
        if buf:
            raw = ''.join(buf)
            buf.clear()
            if raw.strip():
                blocks.extend(para_blocks(raw))

    for c in parent.children:
        if isinstance(c, NavigableString):
            buf.append(html.escape(str(c), quote=False))
            continue
        if not isinstance(c, Tag):
            continue
        name = c.name
        cls = c.get('class', [])
        if name == 'p':
            flush(); blocks.extend(para_blocks(inner(c)))
        elif name in ('ul', 'ol'):
            flush(); blocks.append(convert_list(c, sub))
        elif name == 'div' and any(k in cls for k in ('concept-box', 'concept-box-alt', 'example-box', 'def-box', 'fact-box', 'formula-box')):
            flush(); blocks.append(convert_box(c, sub))
        elif name == 'div' and 'code-box' in cls:
            flush()
            t = c.find(class_='code-title')
            if t:
                blocks.append({'t': 'p', 'x': '<b>' + inline_markup(inner(t))[0].strip() + '</b>'})
            pre = c.find('pre')
            blocks.append({'t': 'code', 'x': (pre.get_text() if pre else c.get_text()).strip('\n')})
        elif name == 'pre':
            flush(); blocks.append({'t': 'code', 'x': c.get_text().strip('\n')})
        elif name == 'div' and 'figure-wrap' in cls:
            flush()
            srcs = ['/books/%s/%s/%s' % (BOOK, sub, os.path.basename(i['src'])) for i in c.find_all('img') if i.get('src')]
            cap = c.find(class_='figure-caption')
            blocks.append({'t': 'fig', 'num': None, 'figs': [], 'srcs': srcs, 'caption': inline_markup(inner(cap))[0].strip() if cap else ''})
        elif name == 'div':
            flush(); blocks.extend(convert_children(c, sub))
        elif name in ('h3', 'h4', 'h5'):
            flush(); blocks.append({'t': 'h', 'level': int(name[1]) , 'x': inline_markup(inner(c))[0].strip()})
        elif name == 'section':
            flush(); blocks.extend(convert_section_inline(c, sub))
        elif name == 'br':
            buf.append('\n')
        elif name in ('strong', 'b', 'em', 'i', 'code', 'u', 'sup', 'sub', 'span', 'a'):
            buf.append(str(c))
        else:
            flush(); blocks.extend(para_blocks(inner(c)))
    flush()
    return blocks


def convert_section_inline(sec, sub):
    """A nested (level 2/3) section becomes a heading plus its content."""
    blocks = []
    h = sec.find(re.compile('^h[2-5]$'), recursive=False)
    if h:
        lvl = {'h2': 2, 'h3': 3, 'h4': 4, 'h5': 5}[h.name]
        blocks.append({'t': 'h', 'level': lvl, 'x': inline_markup(inner(h))[0].strip(), 'id': sec.get('id')})
    rest = Tag(name='div')
    for ch in list(sec.children):
        if ch is h:
            continue
        rest.append(ch.extract() if hasattr(ch, 'extract') else ch)
    blocks.extend(convert_children(rest, sub))
    return blocks


def words(blocks):
    n = 0
    def walk(bs):
        nonlocal n
        for b in bs:
            if b['t'] in ('p', 'h'):
                n += len(re.sub(r'<[^>]+>|\$[^$]*\$', ' ', b['x']).split())
            elif b['t'] == 'box':
                walk(b['blocks'])
            elif b['t'] == 'list':
                for it in b['items']:
                    walk(it['blocks'])
    walk(blocks)
    return n


def slugify(s):
    s = re.sub(r'<[^>]+>|\$[^$]*\$', ' ', s).lower()
    s = re.sub(r'&[a-z]+;', ' ', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:60]


def summary_of(blocks):
    for b in blocks:
        if b['t'] == 'p' and len(b['x']) > 40:
            t = re.sub(r'<[^>]+>', '', b['x'])
            return t if len(t) <= 220 else t[:219].rsplit(' ', 1)[0] + '…'
        if b['t'] == 'box':
            s = summary_of(b['blocks'])
            if s:
                return s
    return ''


def convert_chapter(path, sub, subname, num):
    soup = BeautifulSoup(open(path, encoding='utf-8').read(), 'lxml')
    inner_el = soup.select_one('.content-inner')
    title = plain(inner_el.select_one('h1'))
    label = str(num)
    intro, sections = [], []
    cur = None
    for ch in inner_el.children:
        if not isinstance(ch, Tag):
            continue
        cls = ch.get('class', [])
        if 'chapter-header' in cls or 'chapter-pager' in cls or ch.name in ('footer', 'script'):
            continue
        if ch.name == 'section' and 'level-1' in cls:
            h = ch.find('h2', recursive=False)
            sid = '%s.%d' % (label, len(sections) + 1)
            rest = Tag(name='div')
            for c in list(ch.children):
                if c is not h:
                    rest.append(c.extract())
            sections.append({'id': sid, 'title': inline_markup(inner(h))[0].strip() if h else title, 'blocks': convert_children(rest, sub)})
        elif ch.name == 'section':
            intro.extend(convert_section_inline(ch, sub))
        else:
            wrap = Tag(name='div')
            wrap.append(ch.extract())
            blocks = convert_children(wrap, sub)
            (sections[-1]['blocks'] if sections else intro).extend(blocks)
    allb = intro + [b for s in sections for b in s['blocks']]
    wc = words(allb)
    meta = {
        'book': BOOK, 'num': num, 'label': label,
        'slug': '%02d-%s-%s' % (num, SLUG[sub], slugify(title)),
        'title': title, 'tag': subname, 'summary': summary_of(allb),
        'wordCount': wc, 'readingTimeMin': max(1, round(wc / 200)),
    }
    return meta, intro, sections


SLUG = {s: sl for s, _, sl in SUBJECTS}


def main(only):
    os.makedirs(os.path.join(OUT, 'chapters'), exist_ok=True)
    for f in os.listdir(os.path.join(OUT, 'chapters')):
        os.remove(os.path.join(OUT, 'chapters', f))
    metas, num, figs = [], 0, 0
    for sub, name, _ in SUBJECTS:
        d = os.path.join(RAW, sub)
        if not os.path.isdir(d) or (only and sub not in only):
            continue
        for fn in sorted(f for f in os.listdir(d) if re.fullmatch(r'ch\d+\.html', f)):
            num += 1
            meta, intro, sections = convert_chapter(os.path.join(d, fn), sub, name, num)
            chap = dict(meta, intro=intro, sections=sections, sectionCount=len(sections))
            with open(os.path.join(OUT, 'chapters', meta['slug'] + '.json'), 'w', encoding='utf-8') as fh:
                json.dump(chap, fh, ensure_ascii=False)
            m2 = dict(meta, sectionCount=len(sections), sections=[{'id': s['id'], 'title': s['title']} for s in sections])
            metas.append(m2)
            figs += json.dumps(chap).count('"srcs"')
    index = {'id': BOOK, 'title': 'GATE DA', 'subtitle': 'Data Science & Artificial Intelligence: complete notes from GateXAIML',
             'chapters': metas, 'figureCount': figs}
    with open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8') as fh:
        json.dump(index, fh, ensure_ascii=False)
    print('%d chapters, %d figure blocks' % (len(metas), figs))


if __name__ == '__main__':
    main(set(sys.argv[1:]))
