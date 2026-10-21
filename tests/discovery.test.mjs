import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterGames, availableCategories } from '../assets/catalogue.js';
const {games,categories} = JSON.parse(await readFile(new URL('../games.json',import.meta.url)));
test('all actual games are discoverable, without artificial Top 5 entries', () => {
  assert.equal(filterGames(games,categories).length,games.length);
  assert.equal(new Set(games.map(g=>g.id)).size,games.length);
});
test('only categories with real published games are offered',()=>{
  const populated=availableCategories(games,categories);
  assert.deepEqual(populated.map(c=>c.id),['puzles','estrategia','arcade']);
  for(const category of populated) assert.ok(filterGames(games,categories,category.id).length);
});
test('search ignores accents/case/outer whitespace and includes gameplay category',()=>{
  assert.equal(filterGames(games,categories,'all','  ORBITA  ')[0].id,'orbita-de-rescate');
  assert.equal(filterGames(games,categories,'all','jardin')[0].id,'jardin-de-bolsillo');
  assert.equal(filterGames(games,categories,'all','puzles')[0].id,'orbita-de-rescate');
  assert.equal(filterGames(games,categories,'all','por turnos')[0].id,'jardin-de-bolsillo');
});
test('category and search combine; unmatched input returns no games',()=>{
  assert.equal(filterGames(games,categories,'arcade','mar').length,1);
  assert.equal(filterGames(games,categories,'puzles','mar').length,0);
  assert.equal(filterGames(games,categories,'all','no-existe').length,0);
});
test('empty catalogue remains safe',()=>{
  assert.deepEqual(filterGames([],categories),[]);
  assert.deepEqual(availableCategories([],categories),[]);
});
