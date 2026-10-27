// Mirrors module assets into public/ so Next.js can serve them.
//   modules/<m>/images/**            -> public/books/<m>/**
//   modules/intro-to-ml/data/ste100  -> public/data/ste100
// public/books and public/data are generated (gitignored); modules/ is the source of truth.
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
console.log('synced module assets to public/');
