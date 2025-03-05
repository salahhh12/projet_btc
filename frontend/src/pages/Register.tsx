import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/auth/register', { email, mot_de_passe: password, pseudo });
      toast.success('Inscription réussie ! Connectez-vous.');
    } catch (error) {
      toast.error('Erreur lors de l’inscription');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📝 Inscription</h2>
      <div className="card p-4">
        <input type="text" placeholder="Pseudo" className="form-control mb-3" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
        <input type="email" placeholder="Email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-success w-100" onClick={handleRegister}>S'inscrire</button>
      </div>
    </div>
  );
};

export default Register;
