#!/usr/bin/env python3
"""Convert the LaTeX sources of the interview-prep books into site JSON.

Usage: build_books.py <book-id> <source-dir> [--figures]

Writes:
  public/data/books/<book>/index.json
  public/data/books/<book>/chapters/<slug>.json
  public/data/books/<book>/tex/<slug>.tex
  public/books/<book>/fig-<n>.svg           (with --figures)
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BOOKS = {
    'inferential-statistics': {
        'title': 'Inferential Statistics',
        'subtitle': 'From Estimation to Experiments and Regression',
        'files': [f'chapters/ch{n:02d}.tex' for n in range(1, 17)],
        'preamble': None,
        'main': 'main.tex',
        'parts': {1: 'Estimation & Intervals', 3: 'Tests of Hypotheses', 5: 'Regression & Correlation', 7: 'Designed Experiments', 9: 'Nonparametric & Quality Control', 11: 'Supplementary Chapters', 15: 'Exam Revision'},
        'theorem_counter': True,
    },
    'linear-algebra': {
        'title': 'Linear Algebra',
        'subtitle': 'From Linear Systems to the Singular Value Decomposition',
        'files': [f'chapters/ch{n:02d}.tex' for n in range(1, 22)],
        'preamble': None,
        'main': 'main.tex',
        'parts': {1: 'Systems & Matrices', 6: 'Vector Spaces & Maps', 11: 'Geometry & Spectral Theory', 18: 'Applications'},
        'theorem_counter': True,
    },
    'vector-calculus': {
        'title': 'Vector Calculus',
        'subtitle': 'A Complete Interview-Level Guide with Full Proofs',
        'files': [f'chapters/{n}.tex' for n in [
            '01_geometry', '02_differentiation', '03_fields', '04_multiple_integrals',
            '05_curvilinear', '06_line_surface', '07_theorems', '08_physics',
            '09_helmholtz', '10_forms', '11_ml', '12_appendix']],
        'preamble': 'preamble.tex',
        'main': 'main.tex',
        'parts': {1: 'Foundations', 4: 'Integration', 7: 'Big Theorems'},
        'theorem_counter': True,
    },
    'probability': {
        'title': 'Probability',
        'subtitle': 'From Counting to Random Variables and Rigorous Foundations',
        'files': [f'chapters/ch{n:02d}.tex' for n in range(1, 20)],
        'preamble': None,
        'main': 'main.tex',
        'parts': {1: 'Classical', 4: 'Discrete', 7: 'Continuous', 10: 'Limits', 12: 'Processes', 15: 'Foundations', 16: 'Applications'},
        'theorem_counter': True,
    },
    'differential-equations': {
        'title': 'Differential Equations',
        'subtitle': 'Initial and boundary value problems, transforms and PDEs',
        'files': [f'ch{n:02d}.tex' for n in range(1, 17)],
        'preamble': None,
        'main': 'main.tex',
        'parts': {1: 'Part A · ODE', 7: 'Part B · PDE', 14: 'Part C · Extra'},
        'theorem_counter': False,
    },
}

THEOREMS = {'theorem': 'Theorem', 'lemma': 'Lemma', 'proposition': 'Proposition',
            'corollary': 'Corollary', 'definition': 'Definition', 'example': 'Example'}
BOXES = {  # env -> (kind, default title or None, takes mandatory title arg)
    'intuition': ('intuition', 'Intuition', False),
    'pitfall': ('pitfall', 'Common pitfall', None),
    'interview': ('interview', 'Interview check', None),
    'nuance': ('nuance', 'Nuance', True),
    'summarybox': ('summary', 'Chapter summary', False),
    'defbox': ('key', 'Key idea', True),
    'methodbox': ('method', 'Method', True),
    'examplebox': ('worked', 'Worked example', True),
    'derivbox': ('derivation', 'Derivation', True),
    'notebox': ('watch', 'Watch out', False),
    'practicebox': ('practice', 'Practice', False),
    'answerbox': ('answers', 'Answers', False),
    'remark': ('remark', 'Remark', False),
    'formulabox': ('formulas', 'Formulas', True),
}
PAIR_DELIMS = {'abs': ('\\left\\lvert ', '\\right\\rvert'), 'norm': ('\\left\\lVert ', '\\right\\rVert'),
               'set': ('\\left\\{ ', '\\right\\}')}
UNKNOWN = {}


# ---------------------------------------------------------------- helpers
def strip_comments(s):
    out = []
    for line in s.split('\n'):
        i = 0
        while i < len(line):
            if line[i] == '\\':
                i += 2
                continue
            if line[i] == '%':
                line = line[:i]
                break
            i += 1
        out.append(line)
    return '\n'.join(out)


def read_group(s, i, open_c='{', close_c='}'):
    """s[i] == open_c; return (content, index after the matching close)."""
    assert s[i] == open_c, (s[i - 20:i + 20])
    depth = 0
    j = i
    while j < len(s):
        c = s[j]
        if c == '\\':
            j += 2
            continue
        if c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return s[i + 1:j], j + 1
        j += 1
    raise ValueError('unbalanced group near: ' + s[i:i + 60])


def skip_ws(s, i):
    while i < len(s) and s[i] in ' \t\n':
        i += 1
    return i


def find_env_end(s, start, name):
    """start is just after \\begin{name}; return index of the matching \\end{name} start."""
    pat = re.compile(r'\\(begin|end)\{' + re.escape(name) + r'\}')
    depth = 1
    for m in pat.finditer(s, start):
        depth += 1 if m.group(1) == 'begin' else -1
        if depth == 0:
            return m.start(), m.end()
    raise ValueError('unterminated env ' + name)


def slugify(t):
    t = re.sub(r'\$[^$]*\$', '', t)
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t).strip('-').lower()
    return t[:48].strip('-')


# ---------------------------------------------------------------- converter
class Ctx:
    def __init__(self, cfg, labels, tikz_start):
        self.cfg = cfg
        self.labels = labels
        self.chapter = 0
        self.chapter_label = ''
        self.section = 0
        self.theorem = 0
        self.exercise = 0
        self.figure = 0
        self.equation = 0
        self.cur = '?'
        self.tikz_index = tikz_start
        self.figs = []  # tikz sources in document order
        self.appendix = False


class Converter:
    def __init__(self, ctx):
        self.c = ctx
        self.maths = []

    # ---- math handling
    def clean_math(self, m):
        m = re.sub(r'\\(label|nonumber|notag|qedhere)(\{[^}]*\})?', '', m)
        m = re.sub(r'\\(abs|norm|set)\*?(\[[^\]]*\])?\{', lambda x: '\\' + x.group(1) + '{', m)
        m = m.replace('\\begin{align*}', '\\begin{aligned}').replace('\\end{align*}', '\\end{aligned}')
        m = m.replace('\\begin{align}', '\\begin{aligned}').replace('\\end{align}', '\\end{aligned}')
        m = m.replace('\\begin{gather*}', '\\begin{gathered}').replace('\\end{gather*}', '\\end{gathered}')
        m = m.replace('\\begin{gather}', '\\begin{gathered}').replace('\\end{gather}', '\\end{gathered}')
        m = m.replace('\\begin{equation*}', '').replace('\\end{equation*}', '')
        m = m.replace('\\begin{equation}', '').replace('\\end{equation}', '')
        m = re.sub(r'\\text\{([^{}]*?)\$([^$]*)\$([^{}]*)\}', lambda x: '\\text{' + x.group(1) + '}' + x.group(2) + '\\text{' + x.group(3) + '}', m)
        m = m.replace('psmallmatrix', 'pmatrix')
        m = re.sub(r'\\hfill|\\hspace\*?\{[^}]*\}', lambda _: '\\quad ', m)
        m = re.sub(r'\\ref\{([^}]*)\}', lambda x: self.c.labels.get(x.group(1), '?'), m)
        m = re.sub(r'\\eqref\{([^}]*)\}', lambda x: '(' + self.c.labels.get(x.group(1), '?') + ')', m)
        return m.strip()

    def protect_math(self, s):
        """Replace math spans with placeholders; returns text."""
        out = []
        i = 0
        n = len(s)
        while i < n:
            ch = s[i]
            if ch == '\\' and i + 1 < n:
                nxt = s[i + 1]
                if nxt == '[':
                    j = s.index('\\]', i)
                    out.append(self.ph('D', s[i + 2:j]))
                    i = j + 2
                    continue
                if nxt == '(':
                    j = s.index('\\)', i)
                    out.append(self.ph('I', s[i + 2:j]))
                    i = j + 2
                    continue
                m = re.match(r'\\begin\{(equation\*?|align\*?|gather\*?|multline\*?|eqnarray\*?)\}', s[i:])
                if m:
                    name = m.group(1)
                    e0, e1 = find_env_end(s, i + m.end(), name)
                    out.append(self.ph('E', s[i:e1], name))
                    i = e1
                    continue
                out.append(s[i:i + 2])
                i += 2
                continue
            if ch == '$':
                if s.startswith('$$', i):
                    j = s.index('$$', i + 2)
                    out.append(self.ph('D', s[i + 2:j]))
                    i = j + 2
                    continue
                j = i + 1
                depth = 0
                while j < n and not (s[j] == '$' and depth == 0):
                    if s[j] == '\\':
                        j += 1
                    elif s[j] == '{':
                        depth += 1
                    elif s[j] == '}':
                        depth -= 1
                    j += 1
                out.append(self.ph('I', s[i + 1:j]))
                i = j + 1
                continue
            out.append(ch)
            i += 1
        return ''.join(out)

    def ph(self, kind, content, env=None):
        self.maths.append((kind, content, env))
        return f'\x00{len(self.maths) - 1}\x00'

    # ---- inline text
    def inline(self, s):
        """Convert LaTeX text (math already protected) to mini-markup."""
        out = []
        i = 0
        n = len(s)
        while i < n:
            ch = s[i]
            if ch == '\x00':
                j = s.index('\x00', i + 1)
                idx = int(s[i + 1:j])
                kind, content, env = self.maths[idx]
                if kind == 'I':
                    out.append('$' + self.clean_math(content) + '$')
                else:
                    out.append('\x01' + str(idx) + '\x01')  # display math inside inline flow; hoisted later
                i = j + 1
                continue
            if ch == '\\':
                m = re.match(r'\\([a-zA-Z]+)\*?', s[i:])
                if not m:
                    nxt = s[i + 1:i + 2]
                    mapping = {'&': '&', '%': '%', '$': '\\$', '#': '#', '_': '_', '{': '{', '}': '}',
                               ' ': ' ', ',': '\u2009', ';': ' ', ':': ' ', '!': '', '\\': '\n', '@': '',
                               '-': '', '/': '', '"': '"', "'": "'", '`': '`', '^': '^', '~': '~'}
                    out.append(mapping.get(nxt, nxt))
                    i += 2
                    continue
                name = m.group(1)
                i += m.end()
                r = self.command(name, s, i)
                if r is None:
                    UNKNOWN[name] = UNKNOWN.get(name, 0) + 1
                    continue
                text, i = r
                out.append(text)
                continue
            if ch == '~':
                out.append('\u00a0')
            elif ch == '{' or ch == '}':
                pass
            elif ch == '-' and s.startswith('---', i):
                out.append('\u2014')
                i += 2
            elif ch == '-' and s.startswith('--', i):
                out.append('\u2013')
                i += 1
            elif ch == '`' and s.startswith('``', i):
                out.append('\u201c')
                i += 1
            elif ch == "'" and s.startswith("''", i):
                out.append('\u201d')
                i += 1
            elif ch == '`':
                out.append('\u2018')
            elif ch == "'":
                out.append('\u2019')
            elif ch == '<':
                out.append('&lt;')
            elif ch == '>':
                out.append('&gt;')
            else:
                out.append(ch)
            i += 1
        return ''.join(out)

    def arg(self, s, i):
        i = skip_ws(s, i)
        if i < len(s) and s[i] == '{':
            return read_group(s, i)
        return '', i

    def command(self, name, s, i):
        simple_wrap = {'textbf': 'b', 'emph': 'i', 'textit': 'i', 'texttt': 'code', 'textsc': 'b',
                       'textsf': 'span', 'mbox': 'span', 'text': 'span', 'underline': 'u', 'textrm': 'span', 'textsl': 'i'}
        drop_noarg = {'noindent', 'medskip', 'smallskip', 'bigskip', 'centering', 'small', 'large', 'Large', 'LARGE',
                      'scriptsize', 'footnotesize', 'normalsize', 'newpage', 'clearpage', 'par', 'qedhere', 'hfill',
                      'bfseries', 'itshape', 'rmfamily', 'sffamily', 'raggedright', 'maketitle', 'tableofcontents',
                      'protect', 'relax', 'null', 'strut', 'vfill', 'Huge', 'huge', 'noindent', 'ignorespaces',
                      'nobreak', 'allowbreak', 'selectfont', 'mdseries', 'upshape', 'tiny', 'item', 'pagebreak', 'break'}
        if name in drop_noarg:
            return '', i
        if name in simple_wrap:
            a, i = self.arg(s, i)
            inner = self.inline(a)
            tag = simple_wrap[name]
            return (f'<{tag}>{inner}</{tag}>' if tag != 'span' else inner), i
        if name == 'textcolor' or name == 'colorbox':
            _, i = self.arg(s, i)
            a, i = self.arg(s, i)
            return self.inline(a), i
        if name in ('color',):
            _, i = self.arg(s, i)
            return '', i
        if name in ('textsuperscript',):
            a, i = self.arg(s, i)
            return '^' + self.inline(a), i
        if name == 'footnote':
            a, i = self.arg(s, i)
            return ' (' + self.inline(a) + ')', i
        if name in ('url', 'href'):
            a, i = self.arg(s, i)
            if name == 'href':
                b, i = self.arg(s, i)
                return self.inline(b), i
            return a, i
        if name in ('vspace', 'hspace', 'phantom', 'vphantom', 'hphantom', 'label_', 'index'):
            a, i = self.arg(s, i)
            return '', i
        if name == 'label':
            a, i = self.arg(s, i)
            self.c.labels[a] = self.c.cur
            return '', i
        if name == 'ref' or name == 'autoref' or name == 'cref':
            a, i = self.arg(s, i)
            return self.c.labels.get(a, '?'), i
        if name == 'eqref':
            a, i = self.arg(s, i)
            return '(' + self.c.labels.get(a, '?') + ')', i
        if name == 'pageref':
            a, i = self.arg(s, i)
            return '', i
        if name in ('quad', 'qquad', 'enspace', 'thinspace'):
            return '\u2003' if name != 'thinspace' else '\u2009', i
        if name == 'ldots' or name == 'dots' or name == 'textellipsis':
            return '\u2026', i
        if name == 'checkmark':
            return '\u2713', i
        if name in ('textbackslash',):
            return '\\', i
        if name == 'LaTeX':
            return 'LaTeX', i
        if name == 'TeX':
            return 'TeX', i
        if name == 'S':
            return '\u00a7', i
        if name == 'textbullet':
            return '\u2022', i
        if name == 'ss':
            return '\u00df', i
        if name in ('MakeUppercase', 'uppercase'):
            a, i = self.arg(s, i)
            return self.inline(a).upper(), i
        if name in ('paragraph', 'subparagraph', 'subsubsection'):
            a, i = self.arg(s, i)
            return '\x02' + self.inline(a) + '\x02', i
        if name in ('addcontentsline',):
            _, i = self.arg(s, i)
            _, i = self.arg(s, i)
            _, i = self.arg(s, i)
            return '', i
        if name in ('markboth',):
            _, i = self.arg(s, i)
            _, i = self.arg(s, i)
            return '', i
        if name in ('rule',):
            _, i = self.arg(s, i)
            _, i = self.arg(s, i)
            return '', i
        if name == 'caption':
            _, i = self.arg(s, i)
            return '', i
        if name == 'arraystretch':
            return '', i
        if name == 'renewcommand' or name == 'newcommand':
            _, i = self.arg(s, i)
            _, i = self.arg(s, i)
            return '', i
        if name in ('boxed',):
            return None
        if name in ('overline', 'bar'):
            return None
        return None

    # ---- block parsing
    def blocks(self, s):
        """s: text with math protected, environments intact. Returns list of blocks."""
        blocks = []
        buf = []

        def flush():
            text = ''.join(buf)
            buf.clear()
            self.emit_paragraphs(text, blocks)

        i = 0
        n = len(s)
        while i < n:
            m = re.compile(r'\\begin\{([a-zA-Z*]+)\}').search(s, i)
            m2 = re.compile(r'\\(sub)*section\*?\s*\{|\\chapter\*?\s*\{').search(s, i)
            cands = [x for x in (m, m2) if x]
            if not cands:
                buf.append(s[i:])
                break
            nxt = min(cands, key=lambda x: x.start())
            buf.append(s[i:nxt.start()])
            if nxt is m2:
                # section heading handled by caller via split; treat inline if reached
                buf.append(s[nxt.start():nxt.end()])
                i = nxt.end()
                continue
            name = nxt.group(1)
            e0, e1 = find_env_end(s, nxt.end(), name)
            inner = s[nxt.end():e0]
            flush()
            self.env(name, inner, blocks, s[nxt.end():])
            i = e1
        flush()
        return blocks

    def emit_paragraphs(self, text, blocks):
        for para in re.split(r'\n\s*\n', text):
            p = para.strip()
            if not p:
                continue
            html = self.inline(p).strip()
            if not html:
                continue
            html = re.sub(r'[ \t]*\n[ \t]*', ' ', html) if '\n' in html and '\\\\' not in p else html
            # hoist display math placed inside a paragraph
            parts = re.split('\x01(\\d+)\x01', html)
            for k, part in enumerate(parts):
                if k % 2 == 1:
                    idx = int(part)
                    kind, content, env = self.maths[idx]
                    blocks.append(self.math_block(content, env))
                else:
                    part = part.strip()
                    if not part:
                        continue
                    # run-in heading from \paragraph
                    hm = re.match(r'^\x02(.*?)\x02\s*(.*)$', part, re.S)
                    if hm:
                        blocks.append({'t': 'h', 'level': 4, 'x': hm.group(1).strip().rstrip('.')})
                        part = hm.group(2).strip()
                        if not part:
                            continue
                    part = part.replace('\x02', '')
                    blocks.append({'t': 'p', 'x': part})

    def math_block(self, content, env):
        tag = None
        body = content
        if env:
            numbered = not env.endswith('*')
            inner_m = re.match(r'\\begin\{[^}]+\}(.*)\\end\{[^}]+\}$', content, re.S)
            body = inner_m.group(1) if inner_m else content
            if env.startswith('align') or env.startswith('eqnarray'):
                body = '\\begin{aligned}' + body + '\\end{aligned}'
            elif env.startswith('gather'):
                body = '\\begin{gathered}' + body + '\\end{gathered}'
            elif env.startswith('multline'):
                body = '\\begin{gathered}' + body + '\\end{gathered}'
            if numbered:
                self.c.equation += 1
                tag = f'{self.c.chapter_label}.{self.c.equation}'
                lm = re.search(r'\\label\{([^}]*)\}', content)
                if lm:
                    self.c.labels[lm.group(1)] = tag
                self.c.labels.setdefault('__last_eq', tag)
        else:
            lm = re.search(r'\\label\{([^}]*)\}', content)
            if lm:
                self.c.labels[lm.group(1)] = self.c.cur
        out = {'t': 'math', 'x': self.clean_math(body)}
        if tag:
            out['tag'] = tag
        return out

    def optional(self, inner):
        """Parse leading [..] optional arg from env body."""
        j = skip_ws(inner, 0)
        if j < len(inner) and inner[j] == '[':
            depth = 0
            k = j
            while k < len(inner):
                if inner[k] == '[':
                    depth += 1
                elif inner[k] == ']':
                    depth -= 1
                    if depth == 0:
                        return inner[j + 1:k], inner[k + 1:]
                k += 1
        return None, inner

    def env(self, name, inner, blocks, _rest):
        c = self.c
        if name in THEOREMS:
            c.theorem += 1
            num = f'{c.chapter_label}.{c.theorem}'
            saved = c.cur
            c.cur = num
            title, body = self.optional(inner)
            sub = self.blocks(body)
            c.cur = saved
            blocks.append({'t': 'box', 'kind': name, 'name': THEOREMS[name], 'num': num,
                           'title': self.inline(title) if title else None, 'blocks': sub})
            return
        if name == 'proof':
            title, body = self.optional(inner)
            blocks.append({'t': 'box', 'kind': 'proof', 'name': 'Proof',
                           'title': self.inline(title) if title else None, 'blocks': self.blocks(body)})
            return
        if name == 'exercise':
            c.exercise += 1
            num = f'{c.chapter_label}.{c.exercise}'
            saved = c.cur
            c.cur = num
            sub = self.blocks(inner)
            c.cur = saved
            blocks.append({'t': 'box', 'kind': 'exercise', 'name': 'Exercise', 'num': num, 'blocks': sub})
            return
        if name in BOXES:
            kind, default, takes = BOXES[name]
            title = None
            body = inner
            j = skip_ws(inner, 0)
            if takes is not False and j < len(inner) and inner[j] == '[':
                t, body = self.optional(inner)
                title = t
            elif takes and j < len(inner) and inner[j] == '{':
                t, k = read_group(inner, j)
                title = t
                body = inner[k:]
            elif takes is None and j < len(inner) and inner[j] == '{':
                t, k = read_group(inner, j)
                title = t
                body = inner[k:]
            blocks.append({'t': 'box', 'kind': kind, 'name': default,
                           'title': self.inline(self.protect_math(title)) if title else None,
                           'blocks': self.blocks(body)})
            return
        if name in ('itemize', 'enumerate', 'description'):
            opt, body = self.optional(inner)
            style = None
            if name == 'enumerate':
                style = '1'
                if opt:
                    if 'alph' in opt:
                        style = 'a'
                    elif 'roman' in opt:
                        style = 'i'
                    elif 'arabic' in opt:
                        style = '1'
            items = []
            parts = split_items(body)
            for part in parts[1:]:
                lab = None
                lm = re.match(r'\s*\[([^\]]*)\]', part)
                if lm:
                    lab = self.inline(self.protect_math(lm.group(1)))
                    part = part[lm.end():]
                sub = self.blocks(part)
                item = {'blocks': sub}
                if lab:
                    item['label'] = lab
                items.append(item)
            blocks.append({'t': 'list', 'ordered': name == 'enumerate', 'style': style,
                           'desc': name == 'description', 'items': items})
            return
        if name in ('center', 'minipage', 'flushleft', 'flushright', 'quote', 'quotation', 'small', 'footnotesize'):
            body = inner
            if name == 'minipage':
                _, k = self.arg(inner, skip_ws(inner, 0))
                body = inner[k:]
            blocks.extend(self.blocks(body))
            return
        if name == 'figure':
            c.figure += 1
            num = f'{c.chapter_label}.{c.figure}'
            saved = c.cur
            c.cur = num
            caption = ''
            body = inner
            cm = re.search(r'\\caption\s*\{', inner)
            if cm:
                cap, k = read_group(inner, cm.end() - 1)
                caption = self.inline(self.protect_math(cap))
                body = inner[:cm.start()] + inner[k:]
            lm = re.search(r'\\label\{([^}]*)\}', body)
            if lm:
                c.labels[lm.group(1)] = num
            figs = self.collect_tikz(body)
            c.cur = saved
            blocks.append({'t': 'fig', 'num': num, 'figs': figs, 'caption': caption})
            return
        if name == 'tikzpicture':
            figs = self.collect_tikz('\\begin{tikzpicture}' + inner + '\\end{tikzpicture}')
            blocks.append({'t': 'fig', 'num': None, 'figs': figs, 'caption': ''})
            return
        if name in ('table',):
            body = inner
            caption = ''
            cm = re.search(r'\\caption\s*\{', inner)
            if cm:
                cap, k = read_group(inner, cm.end() - 1)
                caption = self.inline(self.protect_math(cap))
            sub = self.blocks(body)
            for b in sub:
                if b['t'] == 'table' and caption:
                    b['caption'] = caption
            blocks.extend([b for b in sub if b['t'] != 'p' or not b['x'].startswith('Table')])
            return
        if name == 'tabular':
            _, k = self.arg(inner, skip_ws(inner, 0))
            body = inner[k:]
            blocks.append(self.table(body))
            return
        if name == 'verbatim':
            blocks.append({'t': 'code', 'x': inner.strip('\n')})
            return
        if name in ('titlepage',):
            return
        if name in ('equation', 'align', 'gather', 'multline', 'eqnarray'):
            blocks.append(self.math_block(f'\\begin{{{name}}}{inner}\\end{{{name}}}', name))
            return
        # unknown env: render inner
        UNKNOWN['env:' + name] = UNKNOWN.get('env:' + name, 0) + 1
        blocks.extend(self.blocks(inner))

    def unprotect(self, s):
        def rep(m):
            kind, content, env = self.maths[int(m.group(1))]
            if kind == 'I':
                return '$' + content + '$'
            if kind == 'D':
                return '\\[' + content + '\\]'
            return content
        return re.sub('\x00(\\d+)\x00', rep, s)

    def collect_tikz(self, body):
        body = re.sub(r'\\(label|centering)(\{[^}]*\})?', '', body)
        n = len(re.findall(r'\\begin\{tikzpicture\}', body))
        if n == 0:
            return []
        idxs = list(range(self.c.tikz_index, self.c.tikz_index + n))
        self.c.tikz_index += n
        self.c.figs.append({'src': self.unprotect(body), 'idx': idxs})
        return idxs

    def table(self, body):
        body = re.sub(r'\\(toprule|midrule|bottomrule|hline)(\[[^\]]*\])?', '\x03', body)
        rows = []
        for raw in re.split(r'\\\\(?:\[[^\]]*\])?', body):
            segs = raw.split('\x03')
            row_text = segs[-1] if segs[-1].strip() else (segs[-2] if len(segs) > 1 else '')
            if not row_text.strip():
                continue
            cells = []
            depth = 0
            cur = ''
            for ch in row_text:
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                if ch == '&' and depth == 0 and not cur.endswith('\\'):
                    cells.append(cur)
                    cur = ''
                else:
                    cur += ch
            cells.append(cur)
            out = []
            for cell in cells:
                mm = re.match(r'\s*\\multicolumn\{(\d+)\}\{[^}]*\}\{(.*)\}\s*$', cell, re.S)
                if mm:
                    out.append(self.inline(mm.group(2).strip()))
                else:
                    out.append(self.inline(cell.strip()))
            rows.append(out)
        return {'t': 'table', 'rows': rows}


def split_items(body):
    """Split a list body on top-level \\item (ignoring items of nested lists)."""
    parts = []
    depth = 0
    last = 0
    first = True
    for m in re.finditer(r'\\(begin|end)\{(itemize|enumerate|description)\}|\\item\b', body):
        tok = m.group(0)
        if tok.startswith('\\begin'):
            depth += 1
        elif tok.startswith('\\end'):
            depth -= 1
        elif depth == 0:
            parts.append(body[last:m.start()])
            last = m.end()
    parts.append(body[last:])
    return parts


def plain_text(blocks, keep_math=False):
    out = []
    for b in blocks:
        if 'x' in b and isinstance(b['x'], str):
            out.append(re.sub(r'<[^>]+>' if keep_math else r'<[^>]+>|\$', '', b['x']))
        for k in ('blocks',):
            if k in b:
                out.append(plain_text(b[k], keep_math))
        if b.get('t') == 'list':
            for it in b['items']:
                out.append(plain_text(it['blocks'], keep_math))
        if b.get('t') == 'table':
            for r in b['rows']:
                out.append(' '.join(r))
    return ' '.join(out)


# ---------------------------------------------------------------- chapter driver
def convert_chapter(src, ctx, num_hint):
    raw = open(src, encoding='utf-8').read()
    text = strip_comments(raw)
    cv = Converter(ctx)
    text = cv.protect_math(text)
    cm = re.search(r'\\chapter(\*?)\s*\{', text)
    if not cm:
        raise ValueError('no chapter in ' + src)
    title_raw, k = read_group(text, cm.end() - 1)
    starred = bool(cm.group(1))
    body = text[k:]
    return cv, title_raw, starred, body, raw


def split_sections(cv, body):
    """Return (intro_text, [(num_label, title, level, text)])."""
    pat = re.compile(r'\\section(\*?)\s*\{')
    out = []
    pos = 0
    first = pat.search(body)
    intro = body[:first.start()] if first else body
    for m in pat.finditer(body):
        title, k = read_group(body, m.end() - 1)
        nxt = pat.search(body, k)
        end = nxt.start() if nxt else len(body)
        out.append((bool(m.group(1)), title, body[k:end]))
    return intro, out


def split_subsections(text):
    pat = re.compile(r'\\subsection(\*?)\s*\{')
    parts = []
    pos = 0
    last = None
    for m in pat.finditer(text):
        title, k = read_group(text, m.end() - 1)
        parts.append(('text', text[pos:m.start()]))
        parts.append(('sub', title))
        pos = k
    parts.append(('text', text[pos:]))
    return parts


def build_book(book_id, src_dir):
    cfg = BOOKS[book_id]
    labels = {}
    result = None
    for pass_no in (1, 2):
        ctx_labels = labels
        chapters = []
        all_figs = []
        tikz_idx = 0
        ctx = Ctx(cfg, ctx_labels, 0)
        chapter_counter = 0
        appendix = False
        for rel in cfg['files']:
            path = os.path.join(src_dir, rel)
            if not os.path.exists(path):
                continue  # chapters still being written
            ctx.chapter_label = ''
            cv, title_raw, starred, body, raw = convert_chapter(path, ctx, 0)
            if rel.endswith('12_appendix.tex'):
                appendix = True
            chapter_counter += 1
            ctx.chapter = chapter_counter
            ctx.chapter_label = 'A' if appendix else str(chapter_counter)
            ctx.section = 0
            ctx.theorem = 0
            ctx.exercise = 0
            ctx.figure = 0
            ctx.equation = 0
            ctx.cur = ctx.chapter_label
            title = cv.inline(title_raw)
            title = re.sub(r'<[^>]+>', '', title).replace('\n', ' ')
            intro_text, secs = split_sections(cv, body)
            intro_blocks = cv.blocks(intro_text)
            sections = []
            for starred_s, stitle, stext in secs:
                if starred_s:
                    sid = ''
                else:
                    ctx.section += 1
                    sid = f'{ctx.chapter_label}.{ctx.section}'
                ctx.cur = sid or ctx.chapter_label
                sub_no = 0
                blocks = []
                for kind, payload in split_subsections(stext):
                    if kind == 'sub':
                        sub_no += 1
                        sub_id = f'{sid}.{sub_no}' if sid else ''
                        ctx.cur = sub_id
                        blocks.append({'t': 'h', 'level': 3, 'id': sub_id,
                                       'x': re.sub(r'<[^>]+>', '', cv.inline(payload))})
                    else:
                        blocks.extend(cv.blocks(payload))
                st = re.sub(r'<[^>]+>', '', cv.inline(stitle))
                if sid:
                    labels.setdefault('__sec:' + sid, st)
                sections.append({'id': sid, 'title': st, 'blocks': blocks})
            words = len(re.findall(r'\w+', plain_text(intro_blocks) + ' ' + ' '.join(plain_text(s['blocks']) for s in sections)))
            summary_src = plain_text(intro_blocks, True) or (plain_text(sections[0]['blocks'], True) if sections else '')
            summary = re.sub(r'\s+', ' ', summary_src).strip()
            if len(summary) > 260:
                cut = summary[:257]
                if len(re.findall(r'(?<!\\)\$', cut)) % 2:
                    cut = cut[:cut.rfind('$')]
                summary = cut.rsplit(' ', 1)[0].rstrip() + '…'
            part_tag = ''
            for start in sorted(cfg['parts']):
                if chapter_counter >= start:
                    part_tag = cfg['parts'][start]
            slug = f'{ctx.chapter_label.lower() if appendix else f"{chapter_counter:02d}"}-{slugify(title)}'
            chapters.append({
                'book': book_id, 'num': chapter_counter, 'label': ctx.chapter_label, 'slug': slug,
                'title': title, 'tag': 'Appendix' if appendix else part_tag, 'summary': summary,
                'wordCount': words, 'readingTimeMin': max(1, round(words / 200)),
                'intro': intro_blocks, 'sections': sections,
                'sectionCount': len(sections), '_src': path, '_raw': raw,
            })
        all_figs = ctx.figs
        result = (chapters, all_figs)
    return result


def compile_figures(book_id, src_dir, groups, out_dir):
    cfg = BOOKS[book_id]
    os.makedirs(out_dir, exist_ok=True)
    main = open(os.path.join(src_dir, cfg['main']), encoding='utf-8').read()
    if cfg['preamble']:
        pre = f"\\input{{{cfg['preamble']}}}\n"
    else:
        head = main.split('\\begin{document}')[0]
        pre = re.sub(r'\\documentclass[^\n]*\n', '', head)
    work = tempfile.mkdtemp(prefix='figs_')
    for f in os.listdir(src_dir):
        p = os.path.join(src_dir, f)
        if os.path.isfile(p) and not f.endswith(('.pdf', '.aux', '.log')):
            shutil.copy(p, work)
    total = sum(len(g['idx']) for g in groups)
    ok = 0
    for gi, g in enumerate(groups):
        name = f'grp-{gi}'
        tex = ('\\documentclass[11pt]{report}\n\\def\\pgfsysdriver{pgfsys-dvisvgm.def}\n'
               '\\PassOptionsToPackage{dvisvgm}{xcolor}\\PassOptionsToPackage{dvisvgm}{graphicx}\n' + pre + '\n\\usepackage[active,tightpage]{preview}\n'
               '\\PreviewEnvironment{tikzpicture}\n\\setlength\\PreviewBorder{4pt}\n\\pagestyle{empty}\n'
               '\\begin{document}\n' + g['src'] + '\n\\end{document}\n')
        tex = tex.replace('\\title{}', '')
        with open(os.path.join(work, name + '.tex'), 'w') as fh:
            fh.write(tex)
        r = subprocess.run(['latex', '-interaction=nonstopmode', '-halt-on-error', name + '.tex'],
                           cwd=work, capture_output=True, text=True)
        pdf = os.path.join(work, name + '.dvi')
        if not os.path.exists(pdf) and 'interp' in g['src']:
            # DVI output has no smooth-shading support; fall back to flat shading
            with open(os.path.join(work, name + '.tex')) as fh:
                flat = fh.read().replace('shader=faceted interp', 'shader=flat').replace('shader=interp', 'shader=flat')
            with open(os.path.join(work, name + '.tex'), 'w') as fh:
                fh.write(flat)
            r = subprocess.run(['latex', '-interaction=nonstopmode', '-halt-on-error', name + '.tex'],
                               cwd=work, capture_output=True, text=True)
        if not os.path.exists(pdf):
            print('  group failed', gi, g['idx'], [l for l in r.stdout.split('\n') if l.startswith('!')][:2])
            continue
        for page, idx in enumerate(g['idx'], start=1):
            target = os.path.join(out_dir, f'fig-{idx}.svg')
            r2 = subprocess.run(['dvisvgm', '--no-fonts', '--bbox=preview', '-p', str(page), '-o', target, pdf],
                                cwd=work, capture_output=True, text=True)
            if os.path.exists(target):
                ok += 1
            else:
                print('  svg failed', idx, r2.stderr[-160:])
    shutil.rmtree(work, ignore_errors=True)
    print(f'  figures: {ok}/{total}')


def main():
    book_id, src_dir = sys.argv[1], sys.argv[2]
    do_figs = '--figures' in sys.argv
    cfg = BOOKS[book_id]
    chapters, figs = build_book(book_id, src_dir)
    out = os.path.join(ROOT, 'public', 'data', 'books', book_id)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'chapters'))
    os.makedirs(os.path.join(out, 'tex'))
    index = []
    for ch in chapters:
        raw = ch.pop('_raw')
        ch.pop('_src')
        open(os.path.join(out, 'tex', ch['slug'] + '.tex'), 'w').write(raw)
        json.dump(ch, open(os.path.join(out, 'chapters', ch['slug'] + '.json'), 'w'), ensure_ascii=False)
        index.append({k: ch[k] for k in ('book', 'num', 'label', 'slug', 'title', 'tag', 'summary', 'wordCount',
                                         'readingTimeMin', 'sectionCount')} |
                     {'sections': [{'id': s['id'], 'title': s['title']} for s in ch['sections']]})
    json.dump({'id': book_id, 'title': cfg['title'], 'subtitle': cfg['subtitle'], 'chapters': index,
               'figureCount': sum(len(g['idx']) for g in figs)},
              open(os.path.join(out, 'index.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'{book_id}: {len(chapters)} chapters, {sum(len(g['idx']) for g in figs)} figures, '
          f'{sum(c["wordCount"] for c in chapters)} words')
    if UNKNOWN:
        print('  unknown commands:', sorted(UNKNOWN.items(), key=lambda x: -x[1])[:40])
    if do_figs:
        compile_figures(book_id, src_dir, figs, os.path.join(ROOT, 'public', 'books', book_id))


if __name__ == '__main__':
    main()
