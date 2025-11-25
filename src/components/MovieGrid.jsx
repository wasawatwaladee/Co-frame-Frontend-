import React from "react";
import MovieCard from "./MovieCard";

const MovieGrid = ({ title, movies }) => {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="mb-6 flex items-end gap-4">
        <h2 className="text-3xl font-semibold text-textPrimary">{title}</h2>
        <div className="h-0.5 flex-1 bg-linear-to-r from-primary/50 to-transparent mb-2 opacity-50"></div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
