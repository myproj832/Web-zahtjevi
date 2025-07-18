import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const tokenApp = '2bc17d80-55fb-49ec-ac94-534421cbeb35';

  const [tokenKorisnik, setTokenKorisnik] = useState(() =>
    sessionStorage.getItem('tokenKorisnik')
  );
  const [korisnickoIme, setKorisnickoIme] = useState(() =>
    sessionStorage.getItem('korisnickoIme')
  );
  const [korisnik, setKorisnik] = useState(() =>
    sessionStorage.getItem('korisnik')
  );
  const [rola, setRola] = useState(() =>
  sessionStorage.getItem('role')
);

  const [institucije, setInstitucije] = useState(() => {
    const raw = sessionStorage.getItem('institucije');
    return raw ? JSON.parse(raw) : [];
  });
  const [izabranaInstitucija, setIzabranaInstitucija] = useState(() => {
    const raw = sessionStorage.getItem('izabranaInstitucija');
    return raw ? JSON.parse(raw) : null;
  });
  const [tokenUser, setTokenUser] = useState(() =>
    sessionStorage.getItem('tokenUser')
  );



  const isAuthenticated = Boolean(tokenUser);
  const [ipAddress, setIpAddress] = useState(null);

   // Čuvamo u sessionStorage svaki put kad se nešto menja
  useEffect(() => {
    tokenKorisnik
      ? sessionStorage.setItem('tokenKorisnik', tokenKorisnik)
      : sessionStorage.removeItem('tokenKorisnik');
  }, [tokenKorisnik]);

  useEffect(() => {
    korisnickoIme
      ? sessionStorage.setItem('korisnickoIme', korisnickoIme)
      : sessionStorage.removeItem('korisnickoIme');
  }, [korisnickoIme]);

  useEffect(() => {
    korisnik
      ? sessionStorage.setItem('korisnik', korisnik)
      : sessionStorage.removeItem('korisnik');
  }, [korisnik]);

  useEffect(() => {
    if (institucije.length) {
      sessionStorage.setItem('institucije', JSON.stringify(institucije));
    } else {
      sessionStorage.removeItem('institucije');
    }
  }, [institucije]);

  useEffect(() => {
    izabranaInstitucija
      ? sessionStorage.setItem(
          'izabranaInstitucija',
          JSON.stringify(izabranaInstitucija)
        )
      : sessionStorage.removeItem('izabranaInstitucija');
  }, [izabranaInstitucija]);

  useEffect(() => {
    tokenUser
      ? sessionStorage.setItem('tokenUser', tokenUser)
      : sessionStorage.removeItem('tokenUser');
  }, [tokenUser]);

 useEffect(() => {
  if (rola) {
    sessionStorage.setItem('rola', rola);
  } else {
    sessionStorage.removeItem('rola');
  }
}, [rola]);



  // Fetch public IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(err => console.error('Unable to fetch IP address', err));
  }, []);

  // 1) Poziv prvog check_in servisa
  const login = async ({ username, password }) => {
     const ip = ipAddress || '0.0.0.0';
    const res = await fetch('http://62.4.59.86:3334/api/check_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  token_app: tokenApp, user_p: username, pass_p: password, ip_p: ip }),
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
   setRola(out2.rola_u); 
 if (out2.rola_u === 'Admin') {
   navigate('/admin');
 } else {
   navigate('/requests');
 }
};




 const logout = () => {
   sessionStorage.clear();
    setTokenKorisnik(null);
    setTokenUser(null);
    setKorisnickoIme(null);
    setInstitucije([]);
    setIzabranaInstitucija(null);
    
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
        rola,
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


