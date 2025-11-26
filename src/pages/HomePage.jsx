import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import MainLayout from "../layouts/Layout";
import { fetchMovies } from "../api/api";

export default function HomePage() {
  const [movies, setMovies] = useState([]);

    useEffect(() => {
    fetchMovies().then(setMovies).catch(console.error);
  }, []);

console.log('movies', movies)
  return (
    <MainLayout>
      <MovieGrid title="Now Showing" movies={movies} />
    </MainLayout>
  );
}

