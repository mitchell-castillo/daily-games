import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const catalogue=JSON.parse(await readFile(new URL('../games.json',import.meta.url)));
test('catalogue is versioned and has real published games',()=>{assert.equal(catalogue.schemaVersion,1);assert.ok(catalogue.games.length>0);assert.equal(new Set(catalogue.games.map(g=>g.id)).size,catalogue.games.length);});
for(const game of catalogue.games){test(`${game.title}: complete metadata and independent GitHub repository`,async()=>{for(const field of ['title','description','subtitle','category','date','duration','difficulty','href','repository','mechanic','uniqueness','controls','storageKey'])assert.ok(game[field],field);assert.ok(catalogue.categories.some(c=>c.id===game.category));assert.ok(game.href.startsWith('https://mitchell-castillo.github.io/'));assert.equal(new URL(game.repository).hostname,'github.com');assert.equal(new URL(game.href).pathname,`/${game.id}/`);assert.ok(!game.href.includes('/daily-games/'));assert.ok(game.storageKey.includes(game.id));await access(new URL(`../${game.cover}`,import.meta.url));});}
test('game IDs, sequence numbers and storage namespaces do not repeat',()=>{for(const key of ['id','number','storageKey','href','repository'])assert.equal(new Set(catalogue.games.map(g=>g[key])).size,catalogue.games.length);});
