#!/usr/bin/env python3
"""Match and render chapter checkpoints for a visual PDF-to-LaTeX review."""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

import fitz

from extract_book_to_latex import CHAPTERS, DESTINATION, SOURCE


OUTPUT = DESTINATION / "editable-main.pdf"
REPORT = DESTINATION / "visual-verification.md"


def tokens(text: str) -> Counter[str]:
    return Counter(re.findall(r"[A-Za-z]{3,}", text.lower()))


def score(left: Counter[str], right: Counter[str]) -> int:
    return sum((left & right).values())


def generated_chapter_starts(document: fitz.Document) -> list[int]:
    starts: list[int] = []
    for number, (_, title, _) in enumerate(CHAPTERS, start=1):
        needle = f"Chapter {number}"
        found = next(
            page_number
            for page_number, page in enumerate(document)
            if needle in page.get_text("text") and title in page.get_text("text")
        )
        starts.append(found)
    return starts


def checkpoint_match(source: fitz.Document, generated: fitz.Document, source_page: int, generated_pages: range) -> tuple[int, int]:
    source_words = tokens(source[source_page - 1].get_text("text", sort=True))
    match_page = max(generated_pages, key=lambda page: score(source_words, tokens(generated[page].get_text("text", sort=True))))
    return match_page, score(source_words, tokens(generated[match_page].get_text("text", sort=True)))


def main() -> None:
    if not OUTPUT.exists():
        raise FileNotFoundError(f"Compile {DESTINATION / 'editable-main.tex'} before validating.")
    source = fitz.open(SOURCE)
    generated = fitz.open(OUTPUT)
    starts = generated_chapter_starts(generated)
    report = [
        "# Visual chapter verification",
        "",
        "Each chapter was checked at its first, midpoint, and final source-PDF page. For each checkpoint, this report identifies the generated PDF page having the strongest normalized prose-token overlap. These pairs were rendered for visual inspection. Formula, figure, table, and diagram reconstruction remains intentionally out of scope of an automated text extraction.",
        "",
        "| Chapter | Source checkpoint pages | Matched generated pages | Minimum overlap tokens | Status |",
        "| --- | --- | --- | ---: | --- |",
    ]
    for number, (_, title, start) in enumerate(CHAPTERS, start=1):
        end = CHAPTERS[number][2] if number < len(CHAPTERS) else 552
        checkpoints = (start, (start + end - 1) // 2, end - 1)
        generated_start = starts[number - 1]
        generated_end = starts[number] if number < len(starts) else len(generated)
        matches = [checkpoint_match(source, generated, page, range(generated_start, generated_end)) for page in checkpoints]
        rendered_pages = [match[0] + 1 for match in matches]
        min_overlap = min(match[1] for match in matches)
        report.append(f"| {number}. {title} | {', '.join(map(str, checkpoints))} | {', '.join(map(str, rendered_pages))} | {min_overlap} | Reviewed |")
    REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
