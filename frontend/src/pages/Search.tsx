import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Importation de Link pour les redirections
import { searchMovies } from '../services/api';
import { Movie } from '../types';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async () => {
    if (query) {
      const data = await searchMovies(query);
      setResults(data);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🔍 Rechercher un Film</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Entrez un titre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="row">
        {results.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card shadow-sm">
              {/* Lien autour de l'image pour rendre le film cliquable */}
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="card-img-top"
                />
              </Link>
              <div className="card-body">
                {/* Le titre n'est plus un lien, il est juste du texte */}
                <h5 className="card-title">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
