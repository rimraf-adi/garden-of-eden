# modules/

One folder per subject. Source of truth for all content.

```
modules/<subject>/
  latex/    LaTeX sources (and source zips)
  images/   figures; mirrored to public/books/<subject>/ by tools/sync-public.mjs
  data/     generated JSON (index.json, chapters/, tex/) read by lib/books*.ts
  raw/      (gate-da only) downloaded GateXAIML HTML
```

`npm run dev` and `npm run build` run the sync automatically; `public/books`, `public/data` and `public/gate-da` are generated copies; they are committed, so edit `modules/` and run `npm run sync`.
