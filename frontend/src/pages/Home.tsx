import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../services/api'; 
import { Movie } from '../types';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getTopRatedMovies().then(setMovies);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🎬 Films Populaires</h1>

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card shadow-sm">
              <Link to={`/movie/${movie.id}`}> {/* Lien vers la page de détails */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="card-img-top"
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">⭐ {movie.vote_average}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
