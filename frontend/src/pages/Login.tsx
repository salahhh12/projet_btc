import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        mot_de_passe: password,
      });
      login(response.data.token);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🔑 Connexion</h2>
      <div className="card p-4">
        <input type="email" placeholder="Email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-100" onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
};

export default Login;