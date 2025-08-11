const API_KEY = "c9fcb908";
const BASE = "https://www.omdbapi.com/";

export async function fetchPopular(limit = 20) {
  return searchMovies("Avengers", limit);
}

export async function searchMovies(query, limit = 20) {
  const url = `${BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  if (data.Response === "False") return [];
  return data.Search.slice(0, limit);
}
