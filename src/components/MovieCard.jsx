import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const openRoom = () => {
  const token = Math.random().toString(36).slice(2, 9);
  navigate(`/room/${movie.id}/${token}`);
};


  return (
    <div className="group relative cursor-pointer">
       <button onClick={()=>openRoom()}>

      <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-cardBg shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl">
        {/* Poster Image */}
       

        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
       

        {/* Overlay (Gradient & Info) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-ratingGold text-xs">★</span>
            <span className="text-xs text-textSecondary font-medium">
              {movie.rating}
            </span>
          </div>
        </div>
      </div>
       </button>
    </div>
  );
};

export default MovieCard;
