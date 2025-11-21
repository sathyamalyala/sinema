import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { AppView, UserProfile, Movie } from './types';
import { getStoredUser, saveUser, clearUser, addOrUpdateRating } from './services/storageService';
import { searchMovies, getRecommendations } from './services/geminiService';
import MovieCard from './components/MovieCard';
import { Loader2, PlayCircle, Film, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  
  // Data states
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Auth states
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setView(AppView.HOME);
      fetchMovies('Trending Movies'); // Initial fetch
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim()) {
      setAuthError('Please enter a username');
      return;
    }
    
    // Simple mock auth
    const stored = getStoredUser();
    if (stored && stored.username === authUsername) {
      setUser(stored);
    } else {
      // Create new if doesn't exist for simplicity of demo
      const newUser: UserProfile = { username: authUsername, ratings: [] };
      saveUser(newUser);
      setUser(newUser);
    }
    setView(AppView.HOME);
    fetchMovies('Trending Movies');
    setAuthUsername('');
    setAuthError('');
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setView(AppView.AUTH);
    setMovies([]);
    setRecommendations([]);
  };

  const fetchMovies = async (query: string) => {
    setLoading(true);
    const results = await searchMovies(query);
    setMovies(results);
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    if (!user || user.ratings.length === 0) return;
    setLoading(true);
    const recs = await getRecommendations(user.ratings);
    setRecommendations(recs);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchMovies(searchQuery);
    }
  };

  const handleRateMovie = (movie: Movie, rating: number) => {
    const updatedUser = addOrUpdateRating({ id: movie.id, title: movie.title }, rating);
    setUser(updatedUser);
  };

  // Render Helpers
  const renderAuth = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <Film size={24} strokeWidth={3} />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">sinema</h1>
           <p className="text-zinc-400">Your personal movie curator.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1 ml-1">Username</label>
            <input 
              type="text" 
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
              placeholder="Enter any username to start"
            />
          </div>
          {authError && <p className="text-red-400 text-sm">{authError}</p>}
          
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Enter Sinema
          </button>
        </form>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Discover</h2>
        <form onSubmit={handleSearch} className="relative max-w-xl">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, genre, or mood..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 px-6 pl-12 text-white placeholder-zinc-500 focus:border-zinc-600 focus:ring-0 focus:outline-none"
          />
          <div className="absolute left-4 top-3.5 text-zinc-500">
            <Loader2 size={20} className={loading ? "animate-spin" : "hidden"} />
            {!loading && <PlayCircle size={20} />}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map(movie => {
            const userRating = user?.ratings.find(r => r.movieId === movie.id)?.rating || 0;
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                initialRating={userRating}
                onRate={(r) => handleRateMovie(movie, r)}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const renderProfile = () => {
    const ratedMovies = user?.ratings || [];
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <p className="text-zinc-400 text-sm mt-1">Member since 2024 • {ratedMovies.length} ratings</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{ratedMovies.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Watched</div>
          </div>
        </div>

        {ratedMovies.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-900 dashed">
            <p>No movies rated yet. Start discovering!</p>
            <button onClick={() => setView(AppView.HOME)} className="mt-4 text-white underline">Go to Discovery</button>
          </div>
        ) : (
          <div className="space-y-4">
            {ratedMovies.slice().reverse().map((rating) => (
              <div key={rating.movieId} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div>
                   <h3 className="font-medium text-white">{rating.movieTitle}</h3>
                   <p className="text-xs text-zinc-500">Rated on {new Date(rating.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 font-bold">{rating.rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Star icon for internal use in profile
  const Star = ({className, ...props}: any) => (
     <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const renderRecommendations = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="text-white" size={24} />
            AI Curated For You
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Based on your recent ratings</p>
        </div>
        <button 
          onClick={fetchRecommendations} 
          disabled={loading || (user?.ratings.length || 0) < 3}
          className="px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {(user?.ratings.length || 0) < 3 ? 'Rate 3 movies to unlock' : (loading ? 'Generating...' : 'Refresh')}
        </button>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(movie => (
             <MovieCard 
                key={movie.id} 
                movie={movie} 
                initialRating={0}
                onRate={(r) => handleRateMovie(movie, r)}
              />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border border-zinc-900 bg-zinc-900/30 rounded-2xl">
           <Sparkles className="text-zinc-700 mb-4" size={48} />
           { (user?.ratings.length || 0) < 3 ? (
             <>
               <h3 className="text-lg font-medium text-white">Not enough data</h3>
               <p className="text-zinc-500 mt-2 max-w-xs">Rate at least 3 movies in the Discovery tab to generate personalized AI recommendations.</p>
             </>
           ) : (
             <>
               <h3 className="text-lg font-medium text-white">Ready to Curate</h3>
               <p className="text-zinc-500 mt-2">Tap the button above to generate your list.</p>
             </>
           )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      <Navbar 
        user={user} 
        currentView={view} 
        onChangeView={(v) => {
          setView(v);
          if (v === AppView.RECOMMENDATIONS && recommendations.length === 0) {
             // Auto fetch if user clicks tab and has data
             if ((user?.ratings.length || 0) >= 3) fetchRecommendations();
          }
        }} 
        onLogout={handleLogout} 
      />
      
      <main>
        {view === AppView.AUTH && renderAuth()}
        {view === AppView.HOME && renderHome()}
        {view === AppView.PROFILE && renderProfile()}
        {view === AppView.RECOMMENDATIONS && renderRecommendations()}
      </main>
    </div>
  );
};

export default App;