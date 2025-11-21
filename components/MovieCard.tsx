import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  initialRating?: number;
  onRate: (rating: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (score: number) => {
    setRating(score);
    onRate(score);
  };

  // Placeholder generation logic - used only if no poster is available
  const bgStyle = !movie.posterPlaceholder ? {
    backgroundColor: `hsl(0, 0%, 15%)`, // Keeping strictly grey/black as per instructions
    backgroundImage: `linear-gradient(45deg, hsla(0,0%,10%,1), hsla(0,0%,20%,0.5))`
  } : undefined;

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-900" style={bgStyle}>
         {movie.posterPlaceholder ? (
           <img 
             src={movie.posterPlaceholder} 
             alt={movie.title}
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             loading="lazy"
           />
         ) : (
           <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-6xl opacity-20 select-none">
             {movie.title.charAt(0)}
           </div>
         )}
         
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
         
         <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <span>{movie.year}</span>
              <span>•</span>
              <span className="line-clamp-1">{movie.genre.slice(0, 2).join(', ')}</span>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pt-2 flex-grow flex flex-col justify-between">
        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
          {movie.description}
        </p>

        {/* Rating Component */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Your Rating</span>
            {rating > 0 && <span className="text-xs text-white font-bold">{rating}/5</span>}
          </div>
          
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRate(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  fill={star <= (hoverRating || rating) ? "white" : "transparent"}
                  className={star <= (hoverRating || rating) ? "text-white" : "text-zinc-700"}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;