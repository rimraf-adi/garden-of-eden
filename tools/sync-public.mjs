// Mirrors module assets into public/ so Next.js can serve them.
//   modules/<m>/images/**            -> public/books/<m>/**
//   modules/intro-to-ml/data/ste100  -> public/data/ste100
//   modules/gate-da/official         -> public/gate-da  (official syllabus PDFs)
// public/ copies are committed so deploys serve them as-is; edit modules/ and re-run this (npm run sync).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const mirror = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
};

fs.rmSync(path.join(root, 'public', 'books'), { recursive: true, force: true });
for (const m of fs.readdirSync(path.join(root, 'modules'))) {
  mirror(path.join(root, 'modules', m, 'images'), path.join(root, 'public', 'books', m));
}
mirror(path.join(root, 'modules', 'intro-to-ml', 'data', 'ste100'), path.join(root, 'public', 'data', 'ste100'));
mirror(path.join(root, 'modules', 'gate-da', 'official'), path.join(root, 'public', 'gate-da'));
console.log('synced module assets to public/');
