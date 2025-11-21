import { GoogleGenAI, Type } from "@google/genai";
import { Movie, UserRating } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Movie objects to ensure strict JSON output
const movieSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Unique identifier (kebab-case of title)" },
    title: { type: Type.STRING },
    year: { type: Type.STRING },
    genre: { type: Type.ARRAY, items: { type: Type.STRING } },
    description: { type: Type.STRING, description: "Short engaging plot summary" },
    director: { type: Type.STRING }
  },
  required: ["id", "title", "year", "genre", "description"]
};

const movieListSchema = {
  type: Type.ARRAY,
  items: movieSchema
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    if (!apiKey) return []; // Fallback if no key

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 12 movies related to the search term: "${query}". If the term is generic (like 'trending' or empty), return a list of current critically acclaimed or popular movies. Ensure diverse genres.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieListSchema,
        systemInstruction: "You are a movie database API. Return accurate details.",
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Movie[];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

export const getRecommendations = async (ratings: UserRating[]): Promise<Movie[]> => {
  try {
    if (!apiKey) return [];
    
    const ratingsSummary = ratings.map(r => `${r.movieTitle} (${r.rating}/5 stars)`).join(", ");
    
    const prompt = `
      The user has rated the following movies: [${ratingsSummary}].
      Based on these preferences, recommend 10 NEW movies they have likely not seen. 
      Focus on similar themes, directors, or high-quality cinema that matches their taste profile.
      Do not repeat movies from the input list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieListSchema,
        systemInstruction: "You are a sophisticated movie recommendation engine. Prioritize hidden gems and critically acclaimed matches.",
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Movie[];
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return [];
  }
};