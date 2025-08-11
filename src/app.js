import { fetchPopular, searchMovies } from "./api.js";
import { debounce } from "./debounce.js";
import { loadFavorites, toggleFavorite } from "./favorite.js";

const state = {
  status: "idle",
  items: [],
  errorMessage: "",
  favorites: [],
  mode: "popular",
  lastQuery: ""
};

const el = {
  search: document.getElementById("search"),
  results: document.getElementById("results"),
  favorites: document.getElementById("favorites"),
  status: document.getElementById("status"),
  heading: document.getElementById("results-heading")
};

function setState(next) {
  Object.assign(state, next);
  render();
}

function render() {
  el.status.textContent = "";
  el.results.innerHTML = "";
  el.favorites.innerHTML = "";

  if (state.status === "loading") {
    el.status.textContent = "Loading...";
  } else if (state.status === "error") {
    el.status.textContent = state.errorMessage;
  } else if (state.status === "empty") {
    el.status.textContent = "No results found.";
  } else if (state.status === "success") {
    el.heading.textContent =
      state.mode === "popular"
        ? "Popular Movies"
        : `Results for: "${state.lastQuery}"`;
    el.results.append(...state.items.map((movie) => makeCard(movie, false)));
  }

  el.favorites.append(...state.favorites.map((movie) => makeCard(movie, true)));
}

function makeCard(movie, isFavorite = false) {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = movie.Poster !== "N/A"
    ? movie.Poster
    : "https://via.placeholder.com/150x225?text=No+Image";
  const title = document.createElement("div");
  title.textContent = `${movie.Title} (${movie.Year})`;

  const btn = document.createElement("button");
  btn.textContent = isFavorite ? "Remove Favorite" : "Add Favorite";
  btn.onclick = () => {
    const updated = toggleFavorite(movie);
    setState({ favorites: updated });
  };

  li.append(img, title, btn);
  return li;
}

async function loadPopular() {
  setState({ status: "loading", mode: "popular", lastQuery: "" });
  try {
    const items = await fetchPopular(20);
    setState({
      status: items.length ? "success" : "empty",
      items,
      errorMessage: ""
    });
  } catch (err) {
    setState({ status: "error", errorMessage: err.message });
  }
}

const onSearch = debounce(async (e) => {
  const query = e.target.value.trim();
  if (query.length < 2) {
    loadPopular();
    return;
  }
  setState({ status: "loading", mode: "search", lastQuery: query });
  try {
    const items = await searchMovies(query, 20);
    setState({
      status: items.length ? "success" : "empty",
      items,
      errorMessage: ""
    });
  } catch (err) {
    setState({ status: "error", errorMessage: err.message });
  }
}, 400);

el.search.addEventListener("input", onSearch);

setState({ favorites: loadFavorites() });
loadPopular();
