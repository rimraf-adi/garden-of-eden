import glob, json, re

for f in sorted(glob.glob('public/data/chapters/*.json')):
    data = json.load(open(f))
    changed = False

    def clean_paragraphs(paragraphs):
        global changed
        new_p = []
        for idx, p in enumerate(paragraphs):
            # Check if this is a short stray axis label preceding a figure
            is_stray = False
            if idx + 1 < len(paragraphs) and re.match(r'^Figure\s+\d+\.\d+', paragraphs[idx+1].strip()):
                p_clean = p.strip()
                if len(p_clean) < 35 and any(term in p_clean.lower() for term in [
                    'x:', 'y:', 'x1:', 'x2:', 'mileage', 'price', 'savings', 'income', 'engine power', 'theta'
                ]):
                    is_stray = True
            if is_stray:
                changed = True
            else:
                new_p.append(p)
        return new_p

    for s in data['sections']:
        if 'intro' in s and s['intro']:
            s['intro'] = '\n\n'.join(clean_paragraphs(s['intro'].split('\n\n')))
        for sub in s.get('subsections', []):
            if 'content' in sub and sub['content']:
                sub['content'] = '\n\n'.join(clean_paragraphs(sub['content'].split('\n\n')))

    if changed:
        with open(f, 'w') as out:
            json.dump(data, out, indent=2, ensure_ascii=False)
        print(f"Cleaned {f}")
