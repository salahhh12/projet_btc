const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const axios = require('axios');
require('dotenv').config();

// ✅ Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL :', err);
    return;
  }
  console.log('✅ Connecté à la base de données MySQL');
});

// 🔹 Variables API TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

// 🎥 **Récupérer les films populaires**
router.get('/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('❌ Erreur API TMDB (Popular) :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des films populaires' });
  }
});

// 🔍 **Rechercher un film par titre**
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Veuillez fournir un titre de film' });

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query, language: 'fr-FR' }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('❌ Erreur API TMDB (Search) :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des films' });
  }
});

// 📋 **Obtenir les détails d'un film**
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY, language: 'fr-FR', append_to_response: 'credits' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erreur API TMDB (Details) :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du film' });
  }
});

// ✍️ **Ajouter ou modifier un avis**
router.post('/review', (req, res) => {
  const { utilisateur_id, film_id, note, commentaire } = req.body;

  if (!utilisateur_id || !film_id || !note || commentaire === undefined) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  db.query(
    `INSERT INTO avis (utilisateur_id, film_id, note, commentaire) 
     VALUES (?, ?, ?, ?) 
     ON DUPLICATE KEY UPDATE note = VALUES(note), commentaire = VALUES(commentaire)`,
    [utilisateur_id, film_id, note, commentaire],
    (err) => {
      if (err) {
        console.error('Erreur MySQL :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json({ message: 'Avis ajouté/modifié avec succès' });
    }
  );
});


// 📌 **Récupérer les avis d'un film**
router.get('/reviews/:film_id', (req, res) => {
  const { film_id } = req.params;

  db.query(
    'SELECT u.pseudo, a.note, a.commentaire FROM avis a JOIN utilisateurs u ON a.utilisateur_id = u.id WHERE film_id = ?',
    [film_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json(results);
    }
  );
});

// ✏️ **Modifier un avis**
router.put('/review', (req, res) => {
  const { utilisateur_id, film_id, note, commentaire } = req.body;

  db.query(
    'UPDATE avis SET note = ?, commentaire = ? WHERE utilisateur_id = ? AND film_id = ?',
    [note, commentaire, utilisateur_id, film_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Avis modifié avec succès' });
    }
  );
});

// 🗑️ **Supprimer un avis**
router.delete('/review', (req, res) => {
  const { utilisateur_id, film_id } = req.body;

  db.query(
    'DELETE FROM avis WHERE utilisateur_id = ? AND film_id = ?',
    [utilisateur_id, film_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Avis supprimé' });
    }
  );
});

// ❤️ **Ajouter un film aux favoris**
router.post('/favoris', (req, res) => {
  const { utilisateur_id, film_id } = req.body;

  db.query(
    'INSERT INTO favoris (utilisateur_id, film_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE film_id = VALUES(film_id)',
    [utilisateur_id, film_id],
    (err) => {
      if (err) {
        console.error('Erreur MySQL :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json({ message: 'Ajouté aux favoris' });
    }
  );
});

// 📜 **Récupérer les films favoris d'un utilisateur**
router.get('/favoris/:utilisateur_id', (req, res) => {
  const { utilisateur_id } = req.params;

  db.query(
    `SELECT f.film_id, 
            (SELECT poster_path FROM films_series WHERE id = f.film_id) AS poster_path 
     FROM favoris f WHERE f.utilisateur_id = ?`,
    [utilisateur_id],
    (err, results) => {
      if (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
  
});

// 🗑️ **Supprimer un film des favoris**
router.delete('/favoris', (req, res) => {
  const { utilisateur_id, film_id } = req.body;

  db.query(
    'DELETE FROM favoris WHERE utilisateur_id = ? AND film_id = ?',
    [utilisateur_id, film_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Film retiré des favoris' });
    }
  );
});

module.exports = router;
