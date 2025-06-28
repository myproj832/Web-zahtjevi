import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import iconInstitution from '../assets/Icons/icon-institution.png';
import iconDoctor from '../assets/Icons/icon-doctor.png';
import iconPharmacy from '../assets/Icons/iconPharmacy.jpg';

const Header = () => {
  const { izabranaInstitucija, rola, korisnik, logout } = useAuth();

  const iconMap = {
    'ljekar': { src: iconDoctor, alt: 'Ljekar' },
    'Apotekar': { src: iconPharmacy, alt: 'Apotekar'}
  };

  const userIcon = iconMap[rola];

    return (
    <header className="header-page d-flex justify-content-between align-items-center px-3">
       <div className="header-institution d-inline-flex align-items-center">
         <img
          src={iconInstitution}
          alt="Ustanova"
          className="header-icon institution-icon"
        />
        {izabranaInstitucija
          ? izabranaInstitucija.name_unit
          : 'Ustanova'}
      </div>
       <div className="d-flex align-items-center">
        <div className="header-user d-inline-flex align-items-center">
          {userIcon && (
            <img
              src={userIcon.src}
              alt={userIcon.alt}
              className="header-icon doctor-icon"
            />
          )}
          {rola ? `${rola}: ` : ''}{korisnik || 'Korisnik'}
        </div>

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