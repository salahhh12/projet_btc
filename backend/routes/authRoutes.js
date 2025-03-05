const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connecté à la base de données MySQL');
});

// 🔐 Inscription utilisateur
router.post('/register', async (req, res) => {
  const { email, mot_de_passe, pseudo } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      db.query('INSERT INTO utilisateurs (email, mot_de_passe, pseudo) VALUES (?, ?, ?)', 
        [email, hashedPassword, pseudo], 
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur' });
          res.status(201).json({ message: 'Utilisateur créé avec succès' });
        });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// 🔑 Connexion utilisateur
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const utilisateur = results[0];
    const isValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!isValid) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: utilisateur.id, pseudo: utilisateur.pseudo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

router.get('/utilisateur/avis/:utilisateur_id', (req, res) => {
  const { utilisateur_id } = req.params;

  db.query(
    'SELECT film_id, note, commentaire FROM avis WHERE utilisateur_id = ?',
    [utilisateur_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json(results);
    }
  );
});


module.exports = router;
