import React from "react";

import MovieGrid from "../components/MovieGrid";
import MainLayout from "../layouts/Layout";

const mockMovies = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  title: index % 2 === 0 ? "Godzilla vs Kong" : "Civil War",
  poster:
    index % 2 === 0
      ? "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"
      : "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
  rating: index % 2 === 0 ? "7.8" : "8.2",
}));

function HomePage() {
  return (
    // เรียกใช้ Layout ครอบเนื้อหาทั้งหมด
    <MainLayout>
      {/* ใส่เนื้อหาเฉพาะของหน้านี้ลงไป (children) */}
      <MovieGrid title="Now Showing" movies={mockMovies} />
    </MainLayout>
  );
}

export default HomePage;
