import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopularMovies } from '../services/api';
import { Movie } from '../types';

const Recommandations: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies().then(setMovies);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🎯 Films Recommandés</h1>
      <div className="row">
        {movies.slice(0, 8).map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card shadow-sm">
              {/* Lien uniquement sur l'image */}
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="card-img-top"
                />
              </Link>
              <div className="card-body">
                {/* Le titre n'est plus un lien */}
                <h5 className="card-title">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommandations;
