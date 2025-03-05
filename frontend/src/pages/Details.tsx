import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { Movie, Author } from '../types';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useContext(AuthContext)!;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comment, setComment] = useState('');
  const [note, setNote] = useState(5);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      getMovieDetails(parseInt(id)).then(setMovie);

      // Charger les avis
      axios.get(`http://localhost:5000/films/reviews/${id}`).then(res => setReviews(res.data));

      // Vérifier si le film est en favoris
      axios.get(`http://localhost:5000/films/favoris/1`).then(res => {
        setIsFavorite(res.data.some((fav: any) => fav.film_id === parseInt(id)));
      });
    }
  }, [id]);

  // Ajouter un avis
  const handleReview = async () => {
    if (!token) return alert('Connectez-vous pour laisser un avis');
    await axios.post('http://localhost:5000/films/review', {
      utilisateur_id: 1,
      film_id: id,
      note,
      commentaire: comment
    });
    alert('Avis ajouté !');
    setReviews([...reviews, { pseudo: 'Moi', note, commentaire: comment }]);
    setComment('');
  };

  // Ajouter aux favoris
  const handleFavorite = async () => {
    if (!token) return alert('Connectez-vous pour ajouter aux favoris');
    await axios.post('http://localhost:5000/films/favoris', {
      utilisateur_id: 1,
      film_id: id
    });
    setIsFavorite(true);
    alert('Ajouté aux favoris !');
  };

  if (!movie) return <p className="text-center">Chargement...</p>;

  // Filtrer les acteurs
  const actors = movie.credits?.cast;

  return (
    <div className="container mt-4 text-center">
      <h1 className="mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="img-fluid rounded shadow-lg"
      />
      <p className="mt-4">{movie.overview}</p>
      <p className="text-warning">⭐ {movie.vote_average}</p>

      {/* Bouton favoris */}
      <button className={`btn ${isFavorite ? 'btn-success' : 'btn-outline-success'} mt-3`} onClick={handleFavorite}>
        {isFavorite ? '❤️ Déjà en favoris' : '➕ Ajouter aux favoris'}
      </button>

      {/* Section Avis */}
      <div className="mt-5">
        <h3>📝 Avis des utilisateurs</h3>
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={i} className="border p-2 mb-2 rounded">
              <strong>{r.pseudo}</strong> ⭐ {r.note}
              <p>{r.commentaire}</p>
            </div>
          ))
        ) : (
          <p>Aucun avis pour ce film.</p>
        )}

        {/* Formulaire d'avis */}
        {token && (
          <div className="mt-4">
            <h4>Donner votre avis</h4>
            <input
              type="number"
              min="1"
              max="5"
              value={note}
              onChange={(e) => setNote(parseInt(e.target.value))}
              className="form-control mb-2"
            />
            <textarea
              placeholder="Votre commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-primary" onClick={handleReview}>Envoyer</button>
          </div>
        )}
      </div>

      {/* Section Acteurs */}
      <div className="mt-5">
        <h3>🎭 Acteurs principaux</h3>
        <div className="d-flex overflow-auto" style={{ paddingBottom: '20px' }}>
          {actors?.slice(0, 10).map((actor: Author) => (
            <div key={actor.id} className="card me-3" style={{ width: '150px', flexShrink: 0 }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title" style={{ fontSize: '14px' }}>{actor.name}</h5>
                <p className="card-text" style={{ fontSize: '12px' }}>{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
