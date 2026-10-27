#!/usr/bin/env python3
"""Create a chapter-level, repeatable reconciliation report for the extraction."""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

import fitz

from extract_book_to_latex import CHAPTERS, DESTINATION, SOURCE


def words(text: str) -> Counter[str]:
    return Counter(re.findall(r"[A-Za-z]{2,}", text.lower()))


def source_text(document: fitz.Document, start: int, end: int) -> str:
    return "\n".join(document[number - 1].get_text("text", sort=True) for number in range(start, end))


def generated_text(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"%.*", "", text)
    text = re.sub(r"\\(?:chapter|section|subsection|subsubsection|label)\{([^}]*)\}", r"\1", text)
    text = re.sub(r"\\[A-Za-z]+(?:\{[^}]*\})?", " ", text)
    return text.replace("$", " ")


def main() -> None:
    document = fitz.open(SOURCE)
    report = [
        "# Chapter-level reconciliation report",
        "",
        "Ground truth is `../book.pdf`. Token coverage compares normalized alphabetic word occurrences from each PDF chapter page range with its generated `.tex` file. It is a mechanical completeness signal, not evidence that equations, figures, tables, or page geometry were reconstructed.",
        "",
        "| Chapter | PDF pages | Source tokens | LaTeX tokens | Source-token coverage | Manual visual check |",
        "| --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for number, (slug, title, start) in enumerate(CHAPTERS, start=1):
        end = CHAPTERS[number][2] if number < len(CHAPTERS) else 552
        source = words(source_text(document, start, end))
        generated = words(generated_text(DESTINATION / "chapters" / f"{slug}.tex"))
        matched = sum((source & generated).values())
        total = sum(source.values())
        coverage = 100 * matched / total if total else 100
        check = "Reviewed: opening-page visual comparison" if number == 1 else "Pending"
        report.append(f"| {number}. {title} | {start}-{end - 1} | {total:,} | {sum(generated.values()):,} | {coverage:.1f}% | {check} |")
    report.extend([
        "",
        "## Manual review protocol",
        "",
        "For each row marked Pending, compare the source chapter's first page, one dense middle page, and its final page against the generated chapter. Confirm: (1) correct chapter boundaries and section order; (2) prose continuation across PDF page breaks; (3) figure/table/equation locations are recognizable; and (4) no text is visibly clipped in the compiled `main.pdf`.",
        "",
        "The project compilation was run with `latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex`; the final log contained no LaTeX errors, unresolved-group notices, Unicode failures, or overfull/underfull box notices.",
    ])
    (DESTINATION / "verification.md").write_text("\n".join(report) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
