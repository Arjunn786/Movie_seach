const KEY = "movie-favorites";

export function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toggleFavorite(movie) {
  const list = loadFavorites();
  const exists = list.find((m) => m.imdbID === movie.imdbID);
  const updated = exists
    ? list.filter((m) => m.imdbID !== movie.imdbID)
    : [...list, movie];
  saveFavorites(updated);
  return updated;
}
