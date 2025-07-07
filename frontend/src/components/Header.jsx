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

  // helper funkcija za formatiranje
function formatPhone(rawPhone) {
   if (!rawPhone) return '';
  let digits = rawPhone.replace(/\D/g, '');

  // ukloni vodeću nulu ili već uneseni kod zemlje (382)
  if (digits.startsWith('382')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // očekujemo 8 cifara: 2 za pozivni operatera + 6 za ostatak
  if (digits.length === 8) {
    const op = digits.slice(0, 2);
    const a = digits.slice(2, 5);
    const b = digits.slice(5);
    return `+382 ${op} ${a} ${b}`;
  }

  // ako nije u očekivanom formatu, vrati original
  return rawPhone;
}

     return (
    <header className="header-page d-flex justify-content-between align-items-center px-3">
      {/* Ustanova */}
       <div className="header-institution d-flex align-items-start">
          <img
            src={iconInstitution}
            alt="Ustanova"
            className="header-icon institution-icon"
          />
        <div className="institution-top d-flex align-items-center">
          <span className="institution-name">
            {(izabranaInstitucija?.name_institution || 'Ustanova').toUpperCase()}
          </span>
         
       {rola !== 'Admin' && izabranaInstitucija && (
          <div className="institution-details">
            <span>
              <strong>Adresa:</strong> {izabranaInstitucija.address_institution} {izabranaInstitucija.city_institution}
            </span>
            <span>
             <strong>Tel:</strong> {formatPhone(izabranaInstitucija.phone_institution)}
            </span>
            {izabranaInstitucija.email_institution && (
              <span>
                <strong>Email:</strong> {izabranaInstitucija.email_institution}
              </span>
            )}
          </div>
        )}
         </div>
      </div>

      {/* Korisnik */}
      <div className="header-user d-flex align-items-start">
            {userIcon && (
              <img
                src={userIcon.src}
                alt={userIcon.alt}
                className="header-icon doctor-icon"
              />
            )}
        <div className="header-user-block">
          
            <span className="user-name">
           
              {korisnik}
            </span>
          {rola === 'Ljekar' && specialization && (
            <span className="user-specialization">
              {specialization}
            </span>
            
          )}
           {rola === 'Admin' && (
      <span className="user-specialization">Administrator</span>
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