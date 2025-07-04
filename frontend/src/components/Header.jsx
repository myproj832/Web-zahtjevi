import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import iconInstitution from '../assets/Icons/icon-institution.png';
import iconDoctor from '../assets/Icons/icon-doctor.png';
import iconPharmacy from '../assets/Icons/iconPharmacy.jpg';
import iconAdmin from '../assets/Icons/icon-admin.png';

const Header = () => {
   const {
    izabranaInstitucija,
    addressInstitution,
    cityInstitution,
    phoneInstitution,
    rola,
    korisnik,
    specialization,
    logout,
  } = useAuth();

  const iconMap = {
    'Ljekar': { src: iconDoctor, alt: 'Ljekar' },
    'Apotekar': { src: iconPharmacy, alt: 'Apotekar'},
     'Admin': { src: iconAdmin, alt: 'Admin' }
  };

  const userIcon = iconMap[rola];

     return (
    <header className="header-page d-flex justify-content-between align-items-center px-3">
      {/* Ustanova */}
      <div className="header-institution-block">
        <div className="institution-top d-flex align-items-center">
          <img
            src={iconInstitution}
            alt="Ustanova"
            className="header-icon institution-icon"
          />
          <span className="institution-name">
            {(izabranaInstitucija?.name_institution || 'Ustanova').toUpperCase()}
          </span>
          </div>
       {rola !== 'Admin' && izabranaInstitucija && (
          <div className="institution-details">
            <span>
              <strong>Adresa:</strong> {izabranaInstitucija.address_institution}, {izabranaInstitucija.city_institution}
            </span>
            <span>
              <strong>Tel:</strong> {izabranaInstitucija.phone_institution}
            </span>
            {izabranaInstitucija.email_institution && (
              <span>
                <strong>Email:</strong> {izabranaInstitucija.email_institution}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Korisnik */}
       <div className="d-flex align-items-center">
        <div className="header-user-block">
          <div className="d-inline-flex align-items-center">
            {userIcon && (
              <img
                src={userIcon.src}
                alt={userIcon.alt}
                className="header-icon doctor-icon"
              />
            )}
            <span className="user-name">
              {/* {rola === 'Ljekar' ? 'Dr. ' : ''}{korisnik} */}
              {korisnik}
            </span>
          </div>
          {rola === 'Ljekar' && specialization && (
            <span className="user-specialization">
              {specialization}
            </span>
          )}
        </div>
        <button className="btn btn-logout btn-sm ml-3" onClick={logout}>
          Odjavi se
        </button>
      </div>
    </header>
  );
};



export default Header;