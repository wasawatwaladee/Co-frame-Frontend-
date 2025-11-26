export async function fetchMovies() {
  const res = await fetch("http://localhost:5500/movies");
  return res.json();
}

export async function fetchMovie(id) {
  const res = await fetch(`http://localhost:5500/movies/${id}`);
  return res.json();
}
