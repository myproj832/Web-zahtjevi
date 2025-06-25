import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const tokenApp = '2bc17d80-55fb-49ec-ac94-534421cbeb35';

  const [tokenKorisnik, setTokenKorisnik] = useState(null);
  const [korisnickoIme, setKorisnickoIme] = useState(null);
    const [korisnik, setKorisnik] = useState(null);            
  const [institucije, setInstitucije] = useState([]);


  const [tokenUser, setTokenUser] = useState(null);
  const [izabranaInstitucija, setIzabranaInstitucija] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 

  // 1) Poziv prvog check_in servisa
  const login = async ({ username, password }) => {
    const res = await fetch('http://62.4.59.86:3334/api/check_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  token_app: tokenApp, user_p: username, pass_p: password, ip_p: '192.168.56.589' }),
    });
console.log('Login HTTP status:', res.status, 'ok?', res.ok);
     if (!res.ok) {
    const text = await res.text();   
     console.log('Login raw response text:', text);
      
    throw new Error(`Server error: ${text || res.status}`);
  } 
    const data = await res.json();
  const out = data.P_OUT_JSON;
if (out.error_u === 'OK') {

  setTokenKorisnik(out.token_user);
 
  setKorisnickoIme(out.username_u);

  setKorisnik(out.name_u);
  
  setInstitucije(out.institutions_u || []);
  return true;
} else {
  throw new Error(out.error_u);
}
  }

//   // 2) Odabir institucije (check_in_2)+ finalna provera (check_in_core)
  const selectInstitution = async (inst) => {
    const res2 = await fetch('http://62.4.59.86:3334/api/check_in_2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token_app: tokenApp,
       user_p: korisnickoIme,       
        token_user: tokenKorisnik,
         id_u: inst.id_institution,           
      sifra_p: inst.id_unit
      }),
    });
      if (!res2.ok) {
    const err = await res2.text();
    throw new Error(`check_in_2 HTTP ${res2.status}: ${err}`);
  }

  
  const data2 = await res2.json();
  const out2 = data2.P_OUT_JSON;
 if (!out2 || !out2.token_user) {
    throw new Error('check_in_2 failed: nema token_user');
  }
 setTokenUser(out2.token_user);
 setIzabranaInstitucija(inst);
  setIsAuthenticated(true);
  navigate('/requests');
};




 const logout = () => {
    setTokenKorisnik(null);
    setTokenUser(null);
    setKorisnickoIme(null);
    setInstitucije([]);
    setIzabranaInstitucija(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        tokenApp,
        tokenKorisnik,
        korisnickoIme,
       korisnik,
        institucije,
        tokenUser,
        izabranaInstitucija,
        isAuthenticated,
        login,
        selectInstitution,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

