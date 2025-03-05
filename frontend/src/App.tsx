import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import Recommandations from './pages/Recommandations';
import Profil from './pages/Profil';
import { AuthContext } from './context/AuthContext';

const App: React.FC = () => {
  const { token, logout } = useContext(AuthContext)!;

  return (
    <Router>
      {/* Barre de navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">🎬 MovieDB</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav">
              <Link className="nav-link" to="/">🏠 Accueil</Link>
              <Link className="nav-link" to="/search">🔍 Recherche</Link>
              <Link className="nav-link" to="/recommandations">🎯 Recommandations</Link>
            </div>
            <div className="navbar-nav ms-auto">
              {token ? (
                <>
                  <Link className="nav-link" to="/profil">👤 Profil</Link>
                  <button className="btn btn-danger ms-2" onClick={logout}>🚪 Déconnexion</button>
                </>
              ) : (
                <>
                  <Link className="nav-link" to="/login">🔑 Connexion</Link>
                  <Link className="nav-link" to="/register">📝 Inscription</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Routes vers les pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommandations" element={<Recommandations />} />
        <Route path="/movie/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </Router>
  );
};

export default App;
