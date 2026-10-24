import os, sys, re, json, glob
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "docs" / "book.pdf"
TEX_DIR = ROOT / "intro-to-ml" / "chapters"
OUTPUT_DIR = ROOT / "public" / "data"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
(OUTPUT_DIR / "chapters").mkdir(parents=True, exist_ok=True)

CHAPTER_METAS = [
    {"num": 1, "slug": "01-introduction", "title": "Introduction", "pages": "1-20", "pdfPages": "36-55", "tag": "Foundations", "icon": "BookOpen"},
    {"num": 2, "slug": "02-supervised-learning", "title": "Supervised Learning", "pages": "21-46", "pdfPages": "56-81", "tag": "Foundations", "icon": "GraduationCap"},
    {"num": 3, "slug": "03-bayesian-decision-theory", "title": "Bayesian Decision Theory", "pages": "47-60", "pdfPages": "82-95", "tag": "Probabilistic", "icon": "Scale"},
    {"num": 4, "slug": "04-parametric-methods", "title": "Parametric Methods", "pages": "61-86", "pdfPages": "96-121", "tag": "Parametric", "icon": "TrendingUp"},
    {"num": 5, "slug": "05-multivariate-methods", "title": "Multivariate Methods", "pages": "87-108", "pdfPages": "122-143", "tag": "Parametric", "icon": "Layers"},
    {"num": 6, "slug": "06-dimensionality-reduction", "title": "Dimensionality Reduction", "pages": "109-142", "pdfPages": "144-177", "tag": "Transformations", "icon": "Minimize2"},
    {"num": 7, "slug": "07-clustering", "title": "Clustering", "pages": "143-162", "pdfPages": "178-197", "tag": "Unsupervised", "icon": "PieChart"},
    {"num": 8, "slug": "08-nonparametric-methods", "title": "Nonparametric Methods", "pages": "163-184", "pdfPages": "198-219", "tag": "Nonparametric", "icon": "Activity"},
    {"num": 9, "slug": "09-decision-trees", "title": "Decision Trees", "pages": "185-208", "pdfPages": "220-243", "tag": "Tree Models", "icon": "GitFork"},
    {"num": 10, "slug": "10-linear-discrimination", "title": "Linear Discrimination", "pages": "209-232", "pdfPages": "244-267", "tag": "Discriminative", "icon": "Sliders"},
    {"num": 11, "slug": "11-multilayer-perceptrons", "title": "Multilayer Perceptrons", "pages": "233-278", "pdfPages": "268-313", "tag": "Neural Networks", "icon": "Cpu"},
    {"num": 12, "slug": "12-local-models", "title": "Local Models", "pages": "279-308", "pdfPages": "314-343", "tag": "Neural Networks", "icon": "Share2"},
    {"num": 13, "slug": "13-kernel-machines", "title": "Kernel Machines", "pages": "309-340", "pdfPages": "344-375", "tag": "Kernel Methods", "icon": "Zap"},
    {"num": 14, "slug": "14-bayesian-estimation", "title": "Bayesian Estimation", "pages": "341-362", "pdfPages": "376-397", "tag": "Probabilistic", "icon": "Compass"},
    {"num": 15, "slug": "15-hidden-markov-models", "title": "Hidden Markov Models", "pages": "363-386", "pdfPages": "398-421", "tag": "Sequential", "icon": "Repeat"},
    {"num": 16, "slug": "16-graphical-models", "title": "Graphical Models", "pages": "387-418", "pdfPages": "422-453", "tag": "Probabilistic", "icon": "Network"},
    {"num": 17, "slug": "17-combining-multiple-learners", "title": "Combining Multiple Learners", "pages": "419-446", "pdfPages": "454-481", "tag": "Ensembles", "icon": "Users"},
    {"num": 18, "slug": "18-reinforcement-learning", "title": "Reinforcement Learning", "pages": "447-474", "pdfPages": "482-509", "tag": "Reinforcement", "icon": "Gamepad2"},
    {"num": 19, "slug": "19-machine-learning-experiments", "title": "Design and Analysis of Machine Learning Experiments", "pages": "475-516", "pdfPages": "510-551", "tag": "Evaluation", "icon": "FlaskConical"},
]

def clean_tex_text(text):
    """Clean TeX escape artifacts for web display while preserving math expressions."""
    t = text
    # Replace standard TeX escaped symbols
    t = t.replace(r'\%', '%').replace(r'\&', '&').replace(r'\#', '#').replace(r'\_', '_')
    t = t.replace(r'\$', '$')
    t = t.replace(r'\textbackslash{}', '\\')
    t = t.replace(r'\textasciitilde{}', '~')
    t = t.replace(r'\textasciicircum{}', '^')
    t = t.replace('---', '—').replace('--', '–')
    # Clean itemize tags
    t = re.sub(r'\\begin\{itemize\}\s*\\item\s*', '• ', t)
    t = re.sub(r'\\end\{itemize\}', '', t)
    # Clean quote tags
    t = re.sub(r'\\begin\{quote\}[^\n]*', '', t)
    t = re.sub(r'\\end\{quote\}', '', t)
    t = t.replace(r'\par', '\n')
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t.strip()

def parse_chapter_tex(tex_path, meta):
    raw = open(tex_path, encoding='utf-8').read()
    raw = re.sub(r'^%[^\n]*\n', '', raw)
    raw = re.sub(r'\\chapter\{([^}]+)\}', '', raw)
    raw = re.sub(r'\\label\{([^}]+)\}', '', raw)

    sec_splits = re.split(r'\\section\{([^}]+)\}', raw)
    chapter_intro = clean_tex_text(sec_splits[0]) if len(sec_splits) > 0 else ""

    sections = []
    exercises = []
    references = []

    for i in range(1, len(sec_splits), 2):
        sec_title = sec_splits[i].strip()
        sec_body = sec_splits[i+1].strip()

        # Check for Exercises or References
        if sec_title.lower() == "exercises":
            # parse exercise list items or numbered items
            ex_lines = clean_tex_text(sec_body).split('\n\n')
            for ex in ex_lines:
                ex = ex.strip()
                if ex:
                    exercises.append(ex)
            continue
        elif sec_title.lower() == "references":
            ref_lines = clean_tex_text(sec_body).split('\n\n')
            for ref in ref_lines:
                ref = ref.strip()
                if ref:
                    references.append(ref)
            continue

        # Check for subsections
        sub_splits = re.split(r'\\subsection\{([^}]+)\}', sec_body)
        sec_intro = clean_tex_text(sub_splits[0])
        subsections = []
        for j in range(1, len(sub_splits), 2):
            sub_title = sub_splits[j].strip()
            sub_body = clean_tex_text(sub_splits[j+1])
            subsections.append({
                "id": f"{meta['num']}.{len(sections)+1}.{len(subsections)+1}",
                "title": sub_title,
                "content": sub_body
            })

        sections.append({
            "id": f"{meta['num']}.{len(sections)+1}",
            "title": sec_title,
            "intro": sec_intro,
            "subsections": subsections
        })

    # Summary: first ~300 chars of either chapter_intro or first section
    summary_cand = chapter_intro or (sections[0]["intro"] if sections else "")
    summary = summary_cand.split('\n')[0] if summary_cand else ""
    if len(summary) > 280:
        summary = summary[:277] + "..."

    word_count = len(raw.split())

    return {
        "num": meta["num"],
        "slug": meta["slug"],
        "title": meta["title"],
        "tag": meta["tag"],
        "icon": meta["icon"],
        "pages": meta["pages"],
        "pdfPages": meta["pdfPages"],
        "summary": summary,
        "wordCount": word_count,
        "readingTimeMin": max(1, round(word_count / 200)),
        "sections": sections,
        "exercises": exercises,
        "references": references,
        "intro": chapter_intro
    }

print("Parsing all chapters...")
chapter_index = []
doc = fitz.open(PDF_PATH)

for meta in CHAPTER_METAS:
    tex_path = TEX_DIR / f"{meta['slug']}.tex"
    if not tex_path.exists():
        print(f"Warning: {tex_path} missing")
        continue
    data = parse_chapter_tex(tex_path, meta)
    
    # Save individual full chapter JSON
    out_file = OUTPUT_DIR / "chapters" / f"{meta['slug']}.json"
    out_file.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

    # Index entry (without the full text bodies, to keep index fast and light)
    chapter_index.append({
        "num": meta["num"],
        "slug": meta["slug"],
        "title": meta["title"],
        "tag": meta["tag"],
        "icon": meta["icon"],
        "pages": meta["pages"],
        "pdfPages": meta["pdfPages"],
        "summary": data["summary"],
        "wordCount": data["wordCount"],
        "readingTimeMin": data["readingTimeMin"],
        "sectionCount": len(data["sections"]),
        "sections": [{"id": s["id"], "title": s["title"], "subsectionCount": len(s["subsections"])} for s in data["sections"]],
        "exerciseCount": len(data["exercises"]),
        "referenceCount": len(data["references"])
    })
    print(f"Saved Chapter {meta['num']}: {meta['title']} ({data['wordCount']} words)")

# Save chapters-index.json
(OUTPUT_DIR / "chapters-index.json").write_text(json.dumps(chapter_index, indent=2, ensure_ascii=False), encoding='utf-8')

# Extract Notations from pages 34-35 (index 33-34)
notations = []
notations_raw = doc[33].get_text() + "\n" + doc[34].get_text()
lines = [l.strip() for l in notations_raw.splitlines() if l.strip()]
i = 0
while i < len(lines):
    line = lines[i]
    if line in ["Notations", "xl", "Contents"]:
        i += 1
        continue
    # Typically symbol on one line, description on next, or combined
    symbol = line
    desc = ""
    if i + 1 < len(lines) and not lines[i+1].startswith(('1', '2', '3', '4', '5', '6', '7', '8', '9')):
        i += 1
        desc = lines[i]
        # if next line is also part of description
        if i + 1 < len(lines) and len(lines[i+1]) > 10 and not any(lines[i+1].startswith(c) for c in ['x', 'y', 'X', 'z', 'k', 'N', 'C', 'm', 's', 'r', 'g', 'E', 'l', 'L', '1', '#', 'δ']):
            i += 1
            desc += " " + lines[i]
    if desc:
        notations.append({"symbol": symbol, "meaning": desc})
    i += 1

(OUTPUT_DIR / "notations.json").write_text(json.dumps(notations, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Extracted {len(notations)} notations.")

# Extract Frontmatter (Preface, Series Foreword, Acknowledgments, Notes)
def clean_pdf_pages(start_p, end_p):
    text = ""
    for p in range(start_p - 1, end_p):
        for b in doc[p].get_text("blocks"):
            if b[3] <= 55 or b[1] >= 615: continue
            text += b[4] + "\n\n"
    return clean_tex_text(text)

frontmatter = {
    "seriesForeword": clean_pdf_pages(13, 13),
    "preface": clean_pdf_pages(26, 27),
    "acknowledgments": clean_pdf_pages(28, 29),
    "notesSecondEdition": clean_pdf_pages(30, 32),
}
(OUTPUT_DIR / "frontmatter.json").write_text(json.dumps(frontmatter, indent=2, ensure_ascii=False), encoding='utf-8')
print("Extracted frontmatter.")

# Extract Appendix A Probability (pages 552 to 563)
appendix_a = {
    "title": "Appendix A: Probability",
    "pages": "517-528",
    "pdfPages": "552-563",
    "content": clean_pdf_pages(552, 563)
}
(OUTPUT_DIR / "appendix.json").write_text(json.dumps(appendix_a, indent=2, ensure_ascii=False), encoding='utf-8')
print("Extracted appendix A.")

# Book Meta
book_meta = {
    "title": "Introduction to Machine Learning",
    "subtitle": "Second Edition",
    "author": "Ethem Alpaydın",
    "affiliation": "Department of Computer Engineering, Boğaziçi University",
    "publisher": "The MIT Press",
    "series": "Adaptive Computation and Machine Learning series",
    "seriesEditor": "Thomas G. Dietterich",
    "publishedYear": 2010,
    "isbn": "978-0-262-01243-0",
    "totalPages": 572,
    "totalChapters": 19,
    "pdfFile": "/docs/book.pdf",
    "latexArchive": "/intro-to-ml"
}
(OUTPUT_DIR / "book-meta.json").write_text(json.dumps(book_meta, indent=2, ensure_ascii=False), encoding='utf-8')
print("Successfully generated all book JSON assets!")
