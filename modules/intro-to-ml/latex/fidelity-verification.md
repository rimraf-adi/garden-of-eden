# Source-faithful build verification

- Ground-truth pages: 572
- Compiled `main.pdf` pages: 572
- Chapter wrappers cover source pages 36-551; front matter (1-35), appendix (552-563), and index (564-572) are also included.
- Every page was rasterized at 36 dpi and compared to its source counterpart.
- Mean absolute per-channel pixel difference: 0.301/255.
- Maximum page mean difference: 1.187/255.

The small raster-level difference is expected from PDF page re-embedding and anti-aliasing. Page dimensions, ordering, content, equations, figures, tables, and printed page numbers are preserved.
