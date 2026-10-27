#!/usr/bin/env python3
"""Download the GateXAIML notes (HTML chapters and figure images) for the GATE DA book.

Usage: python3 tools/fetch_gate_da.py [subject ...]
Raw HTML goes to content/gate-da/raw/<subject>/chNN.html and figures to
public/books/gate-da/<subject>/figNNN.png. Existing files are skipped, and requests
are spaced out so the origin server is not hammered.
"""
import os, re, subprocess, sys, time

BASE = 'https://www.gatexaiml.in/gatexaiml_black/notes'
SUBJECTS = ['ps', 'mla', 'va', 'calc', 'python', 'dsa', 'dbms', 'dw', 'mls', 'mlu']
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'content', 'gate-da', 'raw')
FIG = os.path.join(ROOT, 'public', 'books', 'gate-da')


def get(url, out):
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return False
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(['curl', '-sfL', '-m', '40', '-o', out, url], check=False)
    time.sleep(0.15)
    return True


def main(subs):
    for s in subs:
        idx = os.path.join(RAW, s, 'index.html')
        get(f'{BASE}/{s}/index.html', idx)
        chs = sorted(set(re.findall(r'href="(ch\d+)\.html"', open(idx).read())))
        for c in chs:
            get(f'{BASE}/{s}/{c}.html', os.path.join(RAW, s, f'{c}.html'))
        figs = set()
        for c in chs:
            figs |= set(re.findall(r'src="(figures/[^"]+)"', open(os.path.join(RAW, s, f'{c}.html')).read()))
        n = 0
        for f in sorted(figs):
            if get(f'{BASE}/{s}/{f}', os.path.join(FIG, s, os.path.basename(f))):
                n += 1
        print(f'{s}: {len(chs)} chapters, {len(figs)} figures ({n} new)', flush=True)


if __name__ == '__main__':
    main(sys.argv[1:] or SUBJECTS)
