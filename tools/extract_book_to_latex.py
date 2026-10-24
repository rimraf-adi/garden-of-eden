#!/usr/bin/env python3
"""Extract the numbered chapters of a PDF into a small LaTeX project.

This deliberately favors faithful, searchable prose over brittle attempts to
reconstruct the publisher's equations, figures, or page geometry.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "book.pdf"
DESTINATION = ROOT / "intro-to-ml"

CHAPTERS = [
    ("01-introduction", "Introduction", 36),
    ("02-supervised-learning", "Supervised Learning", 56),
    ("03-bayesian-decision-theory", "Bayesian Decision Theory", 82),
    ("04-parametric-methods", "Parametric Methods", 96),
    ("05-multivariate-methods", "Multivariate Methods", 122),
    ("06-dimensionality-reduction", "Dimensionality Reduction", 144),
    ("07-clustering", "Clustering", 178),
    ("08-nonparametric-methods", "Nonparametric Methods", 198),
    ("09-decision-trees", "Decision Trees", 220),
    ("10-linear-discrimination", "Linear Discrimination", 244),
    ("11-multilayer-perceptrons", "Multilayer Perceptrons", 268),
    ("12-local-models", "Local Models", 314),
    ("13-kernel-machines", "Kernel Machines", 344),
    ("14-bayesian-estimation", "Bayesian Estimation", 376),
    ("15-hidden-markov-models", "Hidden Markov Models", 398),
    ("16-graphical-models", "Graphical Models", 422),
    ("17-combining-multiple-learners", "Combining Multiple Learners", 454),
    ("18-reinforcement-learning", "Reinforcement Learning", 482),
    ("19-machine-learning-experiments", "Design and Analysis of Machine Learning Experiments", 510),
]

ESCAPES = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}

UNICODE_REPLACEMENTS = {
    "−": "$-$", "–": "--", "—": "---", "≤": "$\\leq$", "≥": "$\\geq$",
    "≠": "$\\neq$", "∈": "$\\in$", "∉": "$\\notin$", "∅": "$\\emptyset$",
    "∑": "$\\sum$", "∏": "$\\prod$", "∞": "$\\infty$", "∪": "$\\cup$",
    "∩": "$\\cap$", "∧": "$\\wedge$", "∨": "$\\vee$", "∗": "$*$",
    "≈": "$\\approx$", "∝": "$\\propto$", "√": "$\\sqrt{}$", "→": "$\\to$",
    "⇒": "$\\Rightarrow$", "↔": "$\\leftrightarrow$", "…": "...",
    "←": "$\\leftarrow$", "∀": "$\\forall$", "∂": "$\\partial$", "∇": "$\\nabla$",
    "∥": "$\\parallel$", "∼": "$\\sim$", "≡": "$\\equiv$", "≪": "$\\ll$",
    "±": "$\\pm$", "×": "$\\times$", "·": "$\\cdot$", "¸": ",", "ˆ": "\\textasciicircum{}",
    "˘": "", "˙": ".", "˜": "\\textasciitilde{}", "̸": "/", "⎛": "(", "⎜": "|",
    "⎝": "(", "⎞": ")", "⎟": "|", "⎠": ")", "⎡": "[", "⎢": "|",
    "⎣": "[", "⎤": "]", "⎥": "|", "⎦": "]", "⎧": "(", "⎨": "(",
    "⎩": "(", "⎪": "|", "□": "[]", "◦": "$\\circ$", "■": "",
    "α": "$\\alpha$", "β": "$\\beta$", "γ": "$\\gamma$", "δ": "$\\delta$",
    "ε": "$\\epsilon$", "η": "$\\eta$", "θ": "$\\theta$", "λ": "$\\lambda$",
    "μ": "$\\mu$", "ν": "$\\nu$", "π": "$\\pi$", "ρ": "$\\rho$", "σ": "$\\sigma$",
    "τ": "$\\tau$", "φ": "$\\phi$", "χ": "$\\chi$", "ω": "$\\omega$",
    "ξ": "$\\xi$", "ψ": "$\\psi$", "ϵ": "$\\epsilon$", "ı": "i",
    "Γ": "$\\Gamma$", "Δ": "$\\Delta$", "Λ": "$\\Lambda$", "Σ": "$\\Sigma$",
    "Φ": "$\\Phi$", "Ω": "$\\Omega$", "Ξ": "$\\Xi$", "Π": "$\\Pi$", "Ψ": "$\\Psi$",
    "ℓ": "$\\ell$", "ℜ": "$\\mathbb{R}$", "′": "'", "″": "''",
    "ﬁ": "fi", "ﬂ": "fl", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl",
}


def escape_latex(value: str, *, plain: bool = False) -> str:
    escaped: list[str] = []
    for char in value:
        replacement = UNICODE_REPLACEMENTS.get(char)
        if replacement is None:
            escaped.append(ESCAPES.get(char, char))
        elif plain:
            # PDF bookmarks cannot contain TeX math. Keep a readable name there.
            text = replacement.replace("$", "").replace("\\", "")
            escaped.append("".join(ESCAPES.get(item, item) for item in text))
        else:
            escaped.append(replacement)
    return "".join(escaped)


def clean_page(text: str, chapter_number: int, chapter_title: str) -> str:
    """Remove repeating page furniture while leaving body text intact."""
    text = text.replace("\u00ad", "").replace("ﬁ", "fi").replace("ﬂ", "fl")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    kept: list[str] = []
    for line in lines:
        if not line:
            kept.append("")
            continue
        # First-page display titles and subsequent-page running headers.
        if re.fullmatch(rf"{chapter_number}\s+{re.escape(chapter_title)}", line):
            continue
        if re.fullmatch(rf"{re.escape(chapter_title)}\s*{chapter_number}", line):
            continue
        if re.fullmatch(rf"\d+\s+{chapter_number}\s+{re.escape(chapter_title)}", line):
            continue
        if re.fullmatch(rf"{chapter_number}\s+{re.escape(chapter_title)}\s+\d+", line):
            continue
        if re.fullmatch(rf"{chapter_number}\.\d+(?:\.\d+)*\s+.+\s+\d+", line):
            continue
        if re.fullmatch(r"\d+", line):
            continue
        kept.append(line)
    return "\n".join(kept)


def paragraphs(text: str) -> list[str]:
    """Merge line-wrapped prose; keep headings, lists, and displayed math legible."""
    output: list[str] = []
    buffer: list[str] = []

    def flush() -> None:
        if buffer:
            item = " ".join(buffer).strip()
            if item:
                output.append(item)
            buffer.clear()

    for line in text.splitlines():
        if not line:
            flush()
            continue
        if re.match(r"^(?:[A-Z]\.)?\d+(?:\.\d+)+\s+", line):
            flush()
            output.append(line)
        elif line.startswith(("■", "•", "- ")):
            flush()
            output.append(line)
        elif buffer and buffer[-1].endswith("-") and line[:1].islower():
            buffer[-1] = buffer[-1][:-1] + line
        else:
            buffer.append(line)
    flush()
    return output


def tex_for_chapter(doc: fitz.Document, index: int, slug: str, title: str, start: int, end: int) -> str:
    # PDF page numbers are one-based in the contents; PyMuPDF indexes from zero.
    raw = "\n\n".join(
        clean_page(doc[page - 1].get_text("text", sort=True), index, title)
        for page in range(start, end)
    )
    items = paragraphs(raw)
    lines = [
        "% Generated from docs/book.pdf. Review equations and figures against the source PDF.",
        rf"\chapter{{{escape_latex(title)}}}",
        rf"\label{{chap:{slug}}}",
        "",
    ]
    chapter_title_pattern = re.compile(rf"^{index}\s*{re.escape(title)}$")
    section_pattern = re.compile(rf"^{index}\.(\d+(?:\.\d+)*)\s+(.+)$")
    for item in items:
        if chapter_title_pattern.fullmatch(item):
            continue
        section = section_pattern.fullmatch(item)
        if section:
            level = section.group(1).count(".") + 1
            command = ("section", "subsection", "subsubsection")[min(level - 1, 2)]
            lines.extend([rf"\{command}{{{escape_latex(section.group(2), plain=True)}}}", ""])
        elif item.startswith(("■", "•", "- ")):
            lines.extend([r"\begin{itemize}", rf"\item {escape_latex(item.lstrip('■•- '))}", r"\end{itemize}", ""])
        elif item.startswith("Ripper(Pos,Neg,k)"):
            # This is a diagram-like pseudocode block that the text extractor
            # flattens into one line; render it as deliberately ragged small text.
            lines.extend([r"\begin{quote}\small\raggedright", escape_latex(item), r"\par\end{quote}", ""])
        else:
            lines.extend([escape_latex(item), ""])
    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    if DESTINATION.exists():
        shutil.rmtree(DESTINATION)
    chapters_dir = DESTINATION / "chapters"
    source_pages_dir = DESTINATION / "source-pages"
    chapters_dir.mkdir(parents=True)
    source_pages_dir.mkdir(parents=True)
    doc = fitz.open(SOURCE)
    include_lines: list[str] = []
    manifest_lines = ["# Chapter extraction manifest", "", "| File | PDF pages |", "| --- | ---: |"]
    for number, (slug, title, start) in enumerate(CHAPTERS, start=1):
        end = CHAPTERS[number][2] if number < len(CHAPTERS) else 552
        chapter_path = chapters_dir / f"{slug}.tex"
        chapter_path.write_text(tex_for_chapter(doc, number, slug, title, start, end), encoding="utf-8")
        include_lines.append(rf"\include{{chapters/{slug}}}")
        manifest_lines.append(f"| `{chapter_path.name}` | {start}-{end - 1} |")

    (DESTINATION / "editable-main.tex").write_text(
        """\\documentclass[11pt,oneside]{book}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage[margin=1in]{geometry}
\\usepackage{microtype}
\\usepackage{amssymb}
\\usepackage[hidelinks]{hyperref}
\\emergencystretch=3em
\\title{Introduction to Machine Learning}
\\author{Extracted chapter-wise from the supplied PDF}
\\date{}
\\begin{document}
\\frontmatter
\\maketitle
\\tableofcontents
\\mainmatter
""" + "\n".join(include_lines) + "\n\\end{document}\n",
        encoding="utf-8",
    )
    facsimile_inputs = [
        "\\input{source-pages/cover-and-contents}",
        "\\input{source-pages/front-matter}",
    ]
    (source_pages_dir / "cover-and-contents.tex").write_text(
        "\\includepdf[pages=1-12,fitpaper=true]{../docs/book.pdf}\n", encoding="utf-8"
    )
    (source_pages_dir / "front-matter.tex").write_text(
        "\\includepdf[pages=13-35,fitpaper=true]{../docs/book.pdf}\n", encoding="utf-8"
    )
    for number, (slug, _, start) in enumerate(CHAPTERS, start=1):
        end = CHAPTERS[number][2] if number < len(CHAPTERS) else 552
        (source_pages_dir / f"{slug}.tex").write_text(
            rf"\includepdf[pages={start}-{end - 1},fitpaper=true]{{../docs/book.pdf}}" + "\n",
            encoding="utf-8",
        )
        facsimile_inputs.append(rf"\input{{source-pages/{slug}}}")
    (source_pages_dir / "appendix.tex").write_text(
        "\\includepdf[pages=552-563,fitpaper=true]{../docs/book.pdf}\n", encoding="utf-8"
    )
    (source_pages_dir / "index.tex").write_text(
        "\\includepdf[pages=564-572,fitpaper=true]{../docs/book.pdf}\n", encoding="utf-8"
    )
    facsimile_inputs.extend(["\\input{source-pages/appendix}", "\\input{source-pages/index}"])
    (DESTINATION / "main.tex").write_text(
        """\\documentclass{article}
\\usepackage{pdfpages}
\\begin{document}
""" + "\n".join(facsimile_inputs) + "\n\\end{document}\n",
        encoding="utf-8",
    )
    (DESTINATION / "README.md").write_text(
        """# Introduction to Machine Learning - LaTeX extraction

This project is an automated, chapter-wise text extraction from `../docs/book.pdf`.

`main.tex` is the source-faithful edition: it has the same 572 PDF pages, page numbers, equations, figures, tables, and typography as `../docs/book.pdf`. Its `source-pages/` directory provides one LaTeX wrapper per front-matter segment, chapter, appendix, and index.

`editable-main.tex` includes the 19 text-extracted chapter sources in `chapters/`. This edition is searchable and editable, but reflows prose into fewer pages and does not claim to reconstruct the original equations, figures, tables, marginal terms, or page geometry.

Compile either edition with `latexmk -pdf main.tex` or `latexmk -pdf editable-main.tex`.
""",
        encoding="utf-8",
    )
    (DESTINATION / "chapter-manifest.md").write_text("\n".join(manifest_lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
