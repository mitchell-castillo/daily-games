/** Search is accent-insensitive and includes the game's actual gameplay category. */
export const normalize = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterGames(games, categories, category = 'all', query = '') {
  const term = normalize(query.trim());
  return games.filter((game) => (category === 'all' || game.category === category)
    && normalize([game.title, game.description, ...(game.tags || []), categories.find((item) => item.id === game.category)?.name || game.category].join(' ')).includes(term));
}
export function availableCategories(games, categories) {
  return categories.filter((category) => games.some((game) => game.category === category.id));
}
