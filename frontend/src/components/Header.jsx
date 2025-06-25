import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

const Header = () => {
  const { izabranaInstitucija, korisnik, logout } = useAuth();

    return (
    <header className="header-page d-flex justify-content-between align-items-center px-3">
      <div className="header-institution">
         {izabranaInstitucija
          ? `${izabranaInstitucija.name_unit}`
          : 'Ustanova'}
      </div>
      <div className="d-flex align-items-center">
        <span className="header-user">
          {korisnik || 'Korisnik'}
        </span>
        <button
          className="btn btn-logout btn-sm"
          onClick={logout}
        >
          Odjavi se
        </button>
      </div>
    </header>
  );
};


export default Header;