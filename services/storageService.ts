import { UserProfile, UserRating } from '../types';

const USER_KEY = 'sinema_user';

export const getStoredUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: UserProfile): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const addOrUpdateRating = (movie: {id: string, title: string}, rating: number): UserProfile => {
  const user = getStoredUser();
  if (!user) throw new Error("No user logged in");

  const existingIndex = user.ratings.findIndex(r => r.movieId === movie.id);
  const newRating: UserRating = {
    movieId: movie.id,
    movieTitle: movie.title,
    rating,
    timestamp: Date.now()
  };

  if (existingIndex >= 0) {
    user.ratings[existingIndex] = newRating;
  } else {
    user.ratings.push(newRating);
  }

  saveUser(user);
  return user;
};