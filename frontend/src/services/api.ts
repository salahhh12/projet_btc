import axios from 'axios';
import { Movie } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// 🔍 Recherche de films
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/films/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de films', error);
    return [];
  }
};

// 🎥 Films populaires
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/films/popular`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires', error);
    return [];
  }
};

// 📋 Détails d'un film avec les auteurs
export const getMovieDetails = async (id: number): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits', // Ajouter les informations sur les auteurs (réalisateurs, scénaristes)
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du film', error);
    return null;
  }
};

// 🎥 Films les mieux notés
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films les mieux notés', error);
    return [];
  }
};

// 🧡 Récupérer les favoris d'un utilisateur
export const getUserFavorites = async (utilisateurId: number): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/films/favoris/${utilisateurId}`);
    return response.data;  // Retourne les films favoris de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris', error);
    return [];
  }
};
