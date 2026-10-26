import fs from 'fs';
import path from 'path';
import katex from 'katex';
const macros = JSON.parse(fs.readFileSync('lib/katexMacros.json', 'utf8'));
const book = process.argv[2];
const dir = `public/data/books/${book}/chapters`;
const bad = new Map();
let total = 0;
function check(src, display, where) {
  total++;
  try { katex.renderToString(src, { macros: { ...macros }, displayMode: display, throwOnError: true, strict: 'ignore' }); }
  catch (e) { const k = String(e.message).slice(0, 90); if (!bad.has(k)) bad.set(k, []); bad.get(k).push(where + ' :: ' + src.slice(0, 80).replace(/\n/g, ' ')); }
}
function walkBlocks(bs, where) {
  for (const b of bs || []) {
    if (b.t === 'math') check(b.x, true, where);
    for (const k of ['x', 'caption']) if (typeof b[k] === 'string' && b.t !== 'math') for (const m of b[k].matchAll(/(?<!\\)\$((?:\\.|[^$\\])+?)\$/g)) check(m[1], false, where);
    if (b.title) for (const m of b.title.matchAll(/(?<!\\)\$((?:\\.|[^$\\])+?)\$/g)) check(m[1], false, where);
    if (b.blocks) walkBlocks(b.blocks, where);
    if (b.items) for (const it of b.items) walkBlocks(it.blocks, where);
    if (b.rows) for (const r of b.rows) for (const c of r) for (const m of c.matchAll(/(?<!\\)\$((?:\\.|[^$\\])+?)\$/g)) check(m[1], false, where);
  }
}
for (const f of fs.readdirSync(dir)) {
  const ch = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  walkBlocks(ch.intro, f);
  for (const s of ch.sections) walkBlocks(s.blocks, f);
}
console.log(book, 'math items', total, 'failures', [...bad.values()].reduce((a, b) => a + b.length, 0));
for (const [k, v] of [...bad.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 14)) console.log('\n', v.length, k, '\n   ', v.slice(0, 2).join('\n    '));
