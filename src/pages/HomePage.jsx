import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import MainLayout from "../layouts/Layout";
import { fetchMovies } from "../api/api";
import useUserStore from "../stores/Store";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const isDarkMode = useUserStore(state => state.isDarkMode);

  const categories = [
    { id: "all", label: "All Movies" },
    { id: "action", label: "Action" },
    { id: "comedy", label: "Comedy" },
    { id: "drama", label: "Drama" },
    { id: "horror", label: "Horror" },
    { id: "scifi", label: "Sci-Fi" },
    { id: "romance", label: "Romance" },
    { id: "thriller", label: "Thriller" },
  ];

  useEffect(() => {
    fetchMovies().then(setMovies).catch(console.error);
  }, []);
  
  console.log('movies', movies)
  const filteredMovies = selectedCategory === "all" ? movies : movies.filter(movie => movie.category === selectedCategory);
  console.log("filteredMovies",filteredMovies)

  return (
    <MainLayout>
      <div className="animate-fade-in">
      {/* Categories Toggle and Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-4 h-8">
          {/* Categories Toggle Button */}
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center text-sm font-medium text-text-primary/60 hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap"
          >
            Categories
          </button>

          {/* Category Filter Bar */}
          <div 
            className={`flex items-center gap-3 overflow-x-auto scrollbar-hide transition-all duration-700 ${
              showFilter 
                ? 'opacity-100 max-w-full' 
                : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? "text-[#d50000] shadow-lg"
                    : `hover:underline ${isDarkMode ? 'text-text-secondary hover:text-white' : 'text-gray-600 hover:text-black'}`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div>
        <MovieGrid 
          title={selectedCategory === "all" ? "Now Showing" : categories.find(c => c.id === selectedCategory)?.label} 
          movies={filteredMovies} 
        />
      </div>
      </div>
    </MainLayout>
  );
}