export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string[];
  description: string;
  director?: string;
  posterPlaceholder?: string; // For UI mockups since we don't have real image URLs
}

export interface UserRating {
  movieId: string;
  movieTitle: string;
  rating: number; // 1-5
  timestamp: number;
}

export interface UserProfile {
  username: string;
  ratings: UserRating[];
}

// Enum for view states
export enum AppView {
  AUTH = 'AUTH',
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  RECOMMENDATIONS = 'RECOMMENDATIONS'
}