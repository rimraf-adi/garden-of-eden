# Introduction to Machine Learning - LaTeX extraction

This project is an automated, chapter-wise text extraction from `../docs/book.pdf`.

`main.tex` is the source-faithful edition: it has the same 572 PDF pages, page numbers, equations, figures, tables, and typography as `../docs/book.pdf`. Its `source-pages/` directory provides one LaTeX wrapper per front-matter segment, chapter, appendix, and index.

`editable-main.tex` includes the 19 text-extracted chapter sources in `chapters/`. This edition is searchable and editable, but reflows prose into fewer pages and does not claim to reconstruct the original equations, figures, tables, marginal terms, or page geometry.

Compile either edition with `latexmk -pdf main.tex` or `latexmk -pdf editable-main.tex`.
