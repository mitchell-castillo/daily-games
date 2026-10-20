import { readProgress, completionCount } from './assets/progress.js';
const $ = (selector) => document.querySelector(selector);
let catalogue, category = 'all';
let searchTerm = '';
const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
const categoryName = (id) => catalogue.categories.find((item) => item.id === id)?.name || id;
function gameProgress(game) { return readProgress(game.storageKey, undefined, game.levels).progress; }
function playLabel(game) { const p = gameProgress(game); return p.run || completionCount(p) ? 'Continuar' : 'Jugar ahora'; }
function details(game) {
  $('#detail-edition').textContent = `JUEGO ${String(game.number).padStart(3, '0')}`;
  $('#detail-cover').src = game.cover;
  $('#detail-title').textContent = game.title;
  $('#detail-category').textContent = `${categoryName(game.category).toUpperCase()} · ${game.tags.join(' / ')}`;
  $('#detail-description').textContent = game.description;
  $('#detail-mechanic').textContent = game.mechanic;
  $('#detail-controls').textContent = game.controls;
  $('#detail-facts').replaceChildren(...[`${game.levels} ${game.levelLabel || 'sectores'}`, game.duration, `Dificultad ${game.difficulty.toLowerCase()}`].map((text) => el('span', '', text)));
  $('#detail-play').href = game.href;
  $('#detail-repository').href = game.repository;
  $('#detail-play').textContent = `${playLabel(game)} ↗`;
  $('#details-dialog').showModal();
}
function renderFeatured() {
  const game = catalogue.games[0];
  if (!game) return;
  $('#featured').hidden = false;
  $('#featured-edition').textContent = `JUEGO ${String(game.number).padStart(3, '0')}`;
  $('#featured-category').textContent = `${categoryName(game.category).toUpperCase()} · ${game.tags[1]?.toUpperCase() || game.tags[0].toUpperCase()}`;
  $('#featured-title').textContent = game.title;
  $('#featured-description').textContent = game.description;
  $('#featured-duration').textContent = game.duration;
  $('#featured-levels').textContent = `${game.levels} ${game.levelLabel || 'sectores'}`;
  $('#featured-play').href = game.href;
  $('#featured-art-link').href = game.href;
  $('#featured-art-link').setAttribute('aria-label', `Jugar ${game.title}`);
  $('#featured-art-link img').src = game.cover;
  $('#featured-play').replaceChildren(document.createTextNode(`${playLabel(game)} `), el('span', '', '↗'));
  $('#featured-details').onclick = () => details(game);
}
function renderFilters() {
  const filters = [{ id: 'all', name: 'Todos' }, ...catalogue.categories];
  $('#category-filters').replaceChildren(...filters.map((item) => {
    const count = catalogue.games.filter((g) => item.id === 'all' || g.category === item.id).length;
    const button = el('button', 'filter', item.name);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(item.id === category));
    button.append(el('span', '', count));
    button.onclick = () => { category = item.id; renderFilters(); renderGames(); };
    return button;
  }));
}
function card(game) {
  const article = el('article', 'game-card');
  const cover = el('a', 'card-art'); cover.href = game.href; cover.setAttribute('aria-label', `Jugar ${game.title}`);
  const img = el('img'); img.src = game.cover; img.alt = ''; img.width = 960; img.height = 680; img.loading = 'lazy';
  cover.append(img, el('span', 'card-label', `#${String(game.number).padStart(3, '0')}`));
  const content = el('div', 'card-copy');
  const top = el('div', 'card-top');
  const time = el('time', '', new Date(`${game.date}T12:00:00Z`).toLocaleDateString('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })); time.dateTime = game.date;
  top.append(el('span', 'eyebrow', `${categoryName(game.category)} · ${game.duration}`), time);
  const title = el('h3'); const titleLink = el('a', '', game.title); titleLink.href = game.href; title.append(titleLink);
  const bottom = el('div', 'card-bottom'); const play = el('a', '', `${playLabel(game)} ↗`); play.href = game.href;
  const more = el('button', 'details-link', 'Ver detalles'); more.onclick = () => details(game);
  bottom.append(play, more); content.append(top, title, el('p', '', game.subtitle), bottom);
  const completed = completionCount(gameProgress(game));
  if (completed) content.append(el('div', 'card-progress', `${completed}/${game.levels} ${game.levelLabel || 'sectores'} ${game.levelLabel === 'noches' ? 'completadas' : 'completados'} en este navegador`));
  article.append(cover, content); return article;
}
function renderGames() {
  const games = catalogue.games.filter((game) => (category === 'all' || game.category === category) && normalize(`${game.title} ${game.description} ${game.tags.join(' ')}`).includes(normalize(searchTerm)));
  const grid = $('#game-grid'); grid.replaceChildren(...games.map(card));
  $('#catalogue-status').textContent = '';
  if (!games.length) {
    const empty = el('div', 'no-results');
    empty.append(el('p', '', searchTerm ? 'No encontramos juegos con esa búsqueda.' : 'Esta categoría todavía no tiene juegos. Lo bueno está por venir.'));
    const reset = el('button', 'button button-quiet', 'Ver toda la colección');
    reset.onclick = () => { category = 'all'; searchTerm = ''; $('#search').value = ''; renderFilters(); renderGames(); };
    empty.append(reset); grid.append(empty);
  } else if (games.length === 1 && category === 'all' && !searchTerm) {
    const next = el('div', 'empty-card'); const copy = el('div');
    copy.append(el('h3', '', 'El próximo mundo está por llegar.'), el('p', '', 'Un juego nuevo. Una mecánica distinta. Este espacio es para lo que viene.'));
    next.append(el('span', 'empty-icon', '✳'), copy); grid.append(next);
  }
}
$('#search').addEventListener('input', (event) => { searchTerm = event.target.value.trim(); if (catalogue) renderGames(); });
$('#close-details').onclick = () => $('#details-dialog').close();
$('#details-dialog').addEventListener('click', (event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close(); } });
window.addEventListener('pageshow', () => { if (catalogue) { renderFeatured(); renderGames(); } });
window.addEventListener('storage', () => { if (catalogue) { renderFeatured(); renderGames(); } });
async function load() {
  try {
    const response = await fetch('./games.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.games) || !Array.isArray(data.categories)) throw new Error('Formato del catálogo no válido');
    catalogue = { ...data, games: data.games.filter((game) => game.status === 'published').sort((a,b) => b.number - a.number) };
    $('#game-count').textContent = catalogue.games.length;
    renderFeatured(); renderFilters(); renderGames();
  } catch {
    $('#game-grid').replaceChildren(el('p', 'no-results', 'No se pudo cargar la colección. Comprueba tu conexión y vuelve a intentarlo.'));
    const retry = el('button', 'button button-quiet', 'Reintentar'); retry.onclick = load; $('#game-grid').append(retry);
  }
}
load();
