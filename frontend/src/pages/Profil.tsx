import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profil: React.FC = () => {
  const { token } = useContext(AuthContext)!;  // Utilisation du token JWT
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editReview, setEditReview] = useState<{ film_id: number; note: number; commentaire: string } | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Extraire l'ID de l'utilisateur depuis le token JWT
    const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Décoder le token JWT pour obtenir l'ID de l'utilisateur
    const utilisateurId = decodedToken.id;

    // Charger les favoris de l'utilisateur
    axios.get(`http://localhost:5000/films/favoris/${utilisateurId}`).then(res => setFavorites(res.data));

    // Charger les avis de l'utilisateur
    axios.get(`http://localhost:5000/utilisateur/avis/${utilisateurId}`).then(res => setReviews(res.data));
  }, [token, navigate]);

  // Supprimer un film des favoris
  const removeFavorite = async (film_id: number) => {
    const utilisateurId = 1;  // Récupérer cet ID depuis le token de l'utilisateur (comme ci-dessus)
    await axios.delete('http://localhost:5000/films/favoris', { data: { utilisateur_id: utilisateurId, film_id } });
    setFavorites(favorites.filter(fav => fav.film_id !== film_id));
  };

  // Supprimer un avis
  const deleteReview = async (film_id: number) => {
    const utilisateurId = 1;  // Récupérer cet ID depuis le token de l'utilisateur (comme ci-dessus)
    await axios.delete('http://localhost:5000/films/review', { data: { utilisateur_id: utilisateurId, film_id } });
    setReviews(reviews.filter(review => review.film_id !== film_id));
  };

  // Modifier un avis
  const updateReview = async () => {
    if (!editReview) return;
    const utilisateurId = 1;  // Récupérer cet ID depuis le token de l'utilisateur (comme ci-dessus)
    await axios.put('http://localhost:5000/films/review', {
      utilisateur_id: utilisateurId,
      film_id: editReview.film_id,
      note: editReview.note,
      commentaire: editReview.commentaire
    });
    setReviews(reviews.map(review => review.film_id === editReview.film_id ? editReview : review));
    setEditReview(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">👤 Mon Profil</h2>

      {/* Favoris */}
      <h3 className="mt-4">❤️ Films en Favoris</h3>
      {favorites.length > 0 ? (
        <div className="row">
          {favorites.map((fav) => (
            <div key={fav.film_id} className="col-md-3 mb-4">
              <div className="card shadow-sm">
                {fav.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`} alt="Film" className="card-img-top" />
                ) : (
                  <p>Affiche non disponible</p>
                )}
                <button className="btn btn-danger mt-2" onClick={() => removeFavorite(fav.film_id)}>🗑️ Retirer</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p>Aucun film en favoris.</p>}

      {/* Commentaires */}
      <h3 className="mt-4">✍️ Mes Commentaires</h3>
      {reviews.length > 0 ? (
        reviews.map((review, i) => (
          <div key={i} className="border p-2 mb-2 rounded">
            <p><strong>Film ID: {review.film_id}</strong></p>
            <p>⭐ {review.note}</p>
            <p>{review.commentaire}</p>

            {/* Boutons Modifier / Supprimer */}
            <button className="btn btn-warning me-2" onClick={() => setEditReview(review)}>✏️ Modifier</button>
            <button className="btn btn-danger" onClick={() => deleteReview(review.film_id)}>🗑️ Supprimer</button>
          </div>
        ))
      ) : <p>Vous n'avez laissé aucun commentaire.</p>}

      {/* Formulaire de modification d’un avis */}
      {editReview && (
        <div className="mt-4 border p-3 rounded">
          <h4>Modifier mon avis</h4>
          <input type="number" min="1" max="5" value={editReview.note} onChange={e => setEditReview({ ...editReview, note: parseInt(e.target.value) })} className="form-control mb-2" />
          <textarea value={editReview.commentaire} onChange={e => setEditReview({ ...editReview, commentaire: e.target.value })} className="form-control mb-2" />
          <button className="btn btn-success me-2" onClick={updateReview}>💾 Sauvegarder</button>
          <button className="btn btn-secondary" onClick={() => setEditReview(null)}>❌ Annuler</button>
        </div>
      )}
    </div>
  );
};

export default Profil;
