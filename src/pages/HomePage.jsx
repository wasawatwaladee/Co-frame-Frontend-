import React, { useEffect, useState, useRef } from "react";
import MovieGrid from "../components/MovieGrid";
import MainLayout from "../layouts/Layout";
import useUserStore from "../stores/Store";
import { useNavigate } from "react-router-dom";

// ⭐️ Draggable Carousel Component ที่แก้ไขให้วนซ้ำสมบูรณ์
const DraggableCarousel = ({ movies, onCenterMovieChange }) => {
  const carouselRef = useRef(null);
  // ⭐️ แก้ไข: เริ่มต้น centerIndex ที่ 0 (หรือตรงกับหนังเรื่องแรก)
  const [centerIndex, setCenterIndex] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
    const user = useUserStore((state) => state.user);

  
  if (movies.length === 0) return null;

  // ⭐️⭐️ 1. สร้าง Virtual Array เพื่อให้ Carousel วนซ้ำอย่างสมบูรณ์
  const extendedMovies = [...movies, ...movies, ...movies];
  const virtualCenterIndex = movies.length + centerIndex; // ตำแหน่ง center ใน Array กลาง (จาก 3 ชุด)

  // [ไม่เปลี่ยนแปลง] useEffect ยังคงใช้เพื่อซิงค์เมื่อ centerIndex เปลี่ยนจากการลาก
  useEffect(() => {
    // Logic ถูกย้ายไปที่ onClick/handleArrowClick เพื่อการตอบสนองที่เร็วกว่า
  }, [centerIndex, movies, onCenterMovieChange]);


  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStart;
    const now = Date.now();
    const timeDelta = Math.max(now - lastTimeRef.current, 16);
    velocityRef.current = delta / timeDelta;
    lastTimeRef.current = now;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const cardWidth = 200;
    const moveBy = Math.round(velocityRef.current * 50 / cardWidth);

    if (Math.abs(moveBy) > 0) {
      setCenterIndex((prev) => {
        // คำนวณ Index ใหม่ (ในขอบเขต 0 ถึง movies.length-1)
        const newIndex = (prev - moveBy + movies.length * 100) % movies.length;
        if (onCenterMovieChange && movies.length > 0) {
          onCenterMovieChange(movies[newIndex]);
        }
        return newIndex;
      });
    }
  };

  const handleArrowClick = (direction) => {
    setCenterIndex((prev) => {
      let newIndex;
      if (direction === "left") {
        newIndex = (prev - 1 + movies.length) % movies.length;
      } else {
        newIndex = (prev + 1) % movies.length;
      }
      // ⭐️ อัปเดต featured movie เมื่อกดลูกศร
      if (onCenterMovieChange && movies.length > 0) {
          onCenterMovieChange(movies[newIndex]);
      }
      return newIndex;
    });
  };

  const getCardStyles = (index) => {
    // ⭐️ 2. คำนวณระยะทางเทียบกับ virtualCenterIndex
    const currentDistance = index - virtualCenterIndex;
    
    // ⭐️ ปรับ Logic การคำนวณ normalizedDistance เพื่อแสดงเฉพาะหนังที่อยู่ใกล้เท่านั้น
    // เราต้องการแค่ 3 การ์ด: ซ้าย, กลาง, ขวา
    const absDistance = Math.abs(currentDistance); 
    
    // ใช้ distance เพื่อกำหนด Style
    let scale = 0.75;
    let opacity = 0;
    let blur = 6;
    let brightness = 0.7;
    let zIndex = 1;

    if (absDistance === 0) {
      scale = 1.15;
      opacity = 1;
      blur = 0;
      brightness = 1.1;
      zIndex = 50;
    } else if (absDistance === 1) {
      scale = 0.9;
      opacity = 0.7;
      blur = 4;
      brightness = 0.85;
      zIndex = 30;
    } else if (absDistance > 1) {
        // ซ่อนการ์ดที่ไกลเกินไปใน Virtual Array
        opacity = 0;
        zIndex = 1;
        scale = 0.7;
    }

    // ⭐️ คำนวณการเลื่อนตำแหน่ง (Translation)
    const cardSpacing = 270; // ระยะห่างการ์ด (อิงตาม w-56 และ gap-6)
    const translateValue = currentDistance * cardSpacing;
    
    return {
      position: 'absolute', // ใช้ absolute position เพื่อควบคุมการเลื่อน
      left: '50%',
      transform: `translateX(-50%) translateX(${translateValue}px) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px) brightness(${brightness})`,
      transition: isDragging ? "none" : "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  };

  
  // ⭐️ 3. คำนวณขอบเขตการแสดงผล (เพื่อลดจำนวน Element ใน DOM)
  // เราจะแสดงผลเฉพาะการ์ดที่อยู่รอบๆ virtualCenterIndex เท่านั้น
  const startIndex = virtualCenterIndex - 5;
  const endIndex = virtualCenterIndex + 5; 
  const visibleCards = extendedMovies.slice(startIndex, endIndex);


    return (
    <div className="relative w-full h-96 lg:h-[28rem] flex items-center justify-center mt-16 md:mt-20 lg:mt-24">
      <div
        ref={carouselRef}
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ⭐️ ใช้ extendedMovies แทน movies เพื่อให้วนซ้ำได้สมบูรณ์ */}
        <div className="relative w-full h-full"> 
          {extendedMovies.map((movie, index) => {
            // ⭐️ ซ่อนการ์ดที่อยู่ไกลจากจุดศูนย์กลาง (เพื่อประสิทธิภาพ)
            const absDistance = Math.abs(index - virtualCenterIndex);
            if (absDistance > 1) return null; 

            return (
                <div
                // Key ต้องเป็น unique: ใช้ index จาก extendedMovies
                key={index} 
                className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group w-56 h-84"
                style={getCardStyles(index)}
                onClick={() => {
                    if (!isDragging) {
                        // คำนวณ center index ในขอบเขต 0 ถึง movies.length-1
                        const newCenterIndex = index % movies.length; 
                        setCenterIndex(newCenterIndex);
                        onCenterMovieChange(movies[newCenterIndex]); 
                    }
                }}
                >
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                {absDistance === 0 && (
                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(255,255,255,0.2),0_0_40px_rgba(255,255,255,0.15)] pointer-events-none rounded-xl"></div>
                )}
                </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={() => handleArrowClick("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleArrowClick("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};


export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  // ⭐️ แก้ไข: กำหนดค่าเริ่มต้นเป็น null (จะถูกตั้งค่าใน useEffect)
  const [featuredMovie, setFeaturedMovie] = useState(null); 
  const [heroBackground, setHeroBackground] = useState("");
  const [backgroundFading, setBackgroundFading] = useState(false);
  const navigate = useNavigate();
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  const getMovies = useUserStore((state) => state.getMovies);
  
  // ⭐️ ดึง Categories จาก Store
  const categoriesFromStore = useUserStore(state=>state.categories)
  const getCategories = useUserStore(state=>state.getCategories)
  const user = useUserStore(state=>state.user)
  // ⭐️⭐️ 1. สร้าง List Categories ที่รวม 'All Movies'
  const categories = [
    { id: "all", name: "All Movies" }, 
    ...categoriesFromStore
  ];  

  // ⭐️ 3. แก้ไข useEffect: เพื่อตั้งค่า Featured Movie/Background เป็นเรื่องแรก
  useEffect(() => {
    getMovies()
      .then((moviesData) => {
        setMovies(moviesData || []);
        // ⭐️ ตั้งค่า Featured Movie และ Background เป็นเรื่องแรก (Index 0)
        if (moviesData && moviesData.length > 0) {
          setFeaturedMovie(moviesData[0]);
          setHeroBackground(moviesData[0].thumbnail);
        }
      })
      .catch(console.error);
      
    getCategories() // เรียก getCategories เมื่อ Component Mounts
    
  }, [getMovies,getCategories]);

  const handleCenterMovieChange = (movie) => {
    setBackgroundFading(true);
    setTimeout(() => {
      setFeaturedMovie(movie);
      setHeroBackground(movie.thumbnail);
      setBackgroundFading(false);
    }, 150);
  };

  const handleWatchNow = () => {
    if(!user){
      navigate('/login')
    }
    if (featuredMovie && user ) {

      navigate(`/room/${featuredMovie.id}`);
    }

  };

  const handleAddToList = () => {
    console.log("Added to list:", featuredMovie?.title);
  };

  // ⭐️ Logic การ Filter: ใช้ === 'all'
  const filteredMovies =
    selectedCategory === "all"
      ? movies
      : movies.filter((movie) => movie.categoryId === selectedCategory);


  return (
    <MainLayout>
      <div className="animate-fade-in overflow-x-hidden">
        {movies.length > 0 && (
          <div
            className={`relative w-full mb-0 h-screen md:h-[90vh] lg:h-screen overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              opacity: backgroundFading ? 0.7 : 1,
            }}
          >
            <div className={`absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b ${isDarkMode ? 'from-black via-black/60' : 'from-white via-white/60'} to-transparent z-10`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-black via-black/40' : 'from-white via-white/40'} to-transparent z-10`}></div>
            <div className={`absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t ${isDarkMode ? 'from-black via-black/70' : 'from-white via-white/70'} to-transparent z-10`}></div>

            <div className="relative h-full flex items-center z-20 px-6 md:px-8 lg:px-16 xl:px-24">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 w-full items-center">
                <div className={`col-span-1 flex flex-col space-y-6 max-w-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  <div>
                    <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {featuredMovie?.title || "Welcome"}
                    </h1>
                    <div className="h-1.5 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold">
                    <span className={`px-3 py-1.5 rounded-full backdrop-blur-sm ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      {featuredMovie?.createdAt.slice(0, 4)  || "2024"}
                    </span>
                    <span className="px-3 py-1.5 bg-red-600/80 rounded-full font-bold text-white">
                      {featuredMovie?.rating || "PG-13"}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full backdrop-blur-sm ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      {featuredMovie?.duration + "mins"|| "2h 30m"}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full backdrop-blur-sm ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      {/* Assuming movie object has category object populated */}
                      {featuredMovie?.category?.name || "Action"} 
                    </span>
                  </div>

                  <p className={`text-base md:text-lg leading-relaxed max-w-xl line-clamp-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {featuredMovie?.description ||
                      "Experience an unforgettable cinematic journey."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {user && 
                    <button
                      onClick={handleWatchNow}
                      className={`px-8 py-3 md:py-4 font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'}`}
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Watch Now</span>
                    </button>

                   }
                   {!user &&
                   <button
                      onClick={handleWatchNow}
                      className={`px-8 py-3 md:py-4 font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'}`}
                    >
                      {/* <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg> */}
                      <span>Login</span>
                    </button>
                   }
                    <button
                      onClick={handleAddToList}
                      className={`px-8 py-3 md:py-4 border-2 font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm ${isDarkMode ? 'border-white text-white hover:bg-white/10' : 'border-black text-black hover:bg-black/10'}`}
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>My List</span>
                    </button>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 hidden md:flex items-center justify-end">
                  <div className="w-full max-w-4xl">
                    <DraggableCarousel
                      movies={movies.slice(0, 7)}
                      onCenterMovieChange={handleCenterMovieChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden absolute bottom-16 left-0 right-0 z-30 px-4">
              <DraggableCarousel
                movies={movies.slice(0, 7)}
                onCenterMovieChange={handleCenterMovieChange}
              />
            </div>
          </div>
        )}

        <div className="mb-6 mt-8 px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-8">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center text-sm font-medium text-text-primary/60 hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap"
            >
              Categories
            </button>

            <div
              className={`flex items-center gap-3 overflow-x-auto scrollbar-hide transition-all duration-700 ${
                showFilter
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 pointer-events-none"
              }`}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap text-sm ${
                    selectedCategory === category.id
                      ? "text-[#d50000] shadow-lg"
                      : `hover:underline ${
                          isDarkMode
                            ? "text-text-secondary hover:text-white"
                            : "text-gray-600 hover:text-black"
                        }`
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-8 pb-12">
          <MovieGrid
            title={
              selectedCategory === "all"
                ? "Now Showing"
                : categories.find((c) => c.id === selectedCategory)?.name || "Movies"
            }
            movies={filteredMovies}
          />
        </div>
      </div>
    </MainLayout>
  );
}

