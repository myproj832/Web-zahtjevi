import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const API_URL = 'http://62.4.59.86:3334/api';
  const { tokenApp, tokenUser, korisnickoIme } = useAuth();

 
  const [komitenti, setKomitenti] = useState([]);
   const [ustanove, setUstanove] = useState([]);
    const [ljekari, setLjekari] = useState([]);

  // Helper to include auth tokens
   const authPayload = useCallback(() => ({
    token_app: tokenApp,
    in_auten: JSON.stringify({ username_u: korisnickoIme, token_user: tokenUser })
  }), [tokenApp, tokenUser, korisnickoIme]);

  

  /**
   * Fetch list of clients (komitenti) via POST with auth payload
   */
  const fetchKomitenti = useCallback(async () => { 
    const url = `${API_URL}/komitenti`;
   
    const payload = authPayload();
   
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // console.log('[AdminContext] fetchKomitenti - Raw response:', res);
    if (!res.ok) {
      console.error('[AdminContext] fetchKomitenti - Error status:', res.status);
      throw new Error('Greška pri učitavanju komitenata');
    }
    const data = await res.json();
    console.log('[AdminContext] fetchKomitenti - Parsed JSON:', data);
    // expect data.P_OUT_JSON as array of { id_kom, naziv_kom, adresa }
    setKomitenti(data.P_OUT_JSON || []);
    return data.P_OUT_JSON;
   }, [API_URL, authPayload]);

  /**
   * Fetch list of institutions (ustanova)
   */
  const fetchUstanove = useCallback(async () => { 
    const url = `${API_URL}/ustanove`;
    const payload = authPayload();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Greška pri učitavanju ustanova');
    const data = await res.json();
     console.log('[AdminContext] fetchUstanove - Received list:', data.P_OUT_JSON);
    setUstanove(data.P_OUT_JSON || []);
    return data.P_OUT_JSON;
   }, [API_URL, authPayload]);

   // Fetch list of doctors (ljekari)

   const fetchLjekari = useCallback(async () => {
    const url = `${API_URL}/ljekari`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload())
    });
    if (!res.ok) {
      console.error('[AdminContext] fetchLjekari - status:', res.status);
      throw new Error('Greška pri učitavanju ljekara');
    }
    const data = await res.json();
    console.log('[AdminContext] fetchLjekari - P_OUT_JSON:', data.P_OUT_JSON);
    setLjekari(data.P_OUT_JSON || []);
    return data.P_OUT_JSON;
  }, [API_URL, authPayload]);

  // Load reference data on mount
  useEffect(() => {
     if (!tokenApp || !tokenUser) return; 
    fetchKomitenti().catch(console.error);
    fetchUstanove().catch(console.error);
    fetchLjekari().catch(console.error);
  },  [tokenApp, tokenUser, fetchKomitenti, fetchUstanove, fetchLjekari]);



  /**
   * Add a new institution (ustanovu)
   */
  const addUstanova = useCallback(async (data) => {
    const inJson = {
      akcija: 'INS',
      id_ust: null,
      naziv_pravnog: data.nazivPravnog,
      naziv_ustanove: data.nazivUstanove,
      adresa_ustanove: data.adresaUstanove,
      grad_ustanove: data.gradUstanove,
      tel_ustanove: data.telUstanove,
      kontakt_osoba: data.kontaktOsoba,
      id_kom: data.idKom,
       napomena: data.napomena
    };
    const body = {
      ...authPayload(),
      in_json: JSON.stringify(inJson)
    };
    const url = `${API_URL}/unesi_ustanovu`;
    console.log('[AdminContext] addUstanova - URL:', url);
    console.log('[AdminContext] addUstanova - Request body:', body);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('[AdminContext] addUstanova - Raw response:', res);
    if (!res.ok) {
      const errText = await res.text();
      console.error('[AdminContext] addUstanova - Error text:', errText);
      throw new Error(`Greška pri dodavanju ustanove: ${errText}`);
    }
    const dataOut = await res.json();
    console.log('[AdminContext] addUstanova - Parsed JSON:', dataOut);
    return dataOut;
  }, [API_URL, authPayload]);

  /**
 * Update existing institution (ustanovu)
 */
 const updateUstanova = useCallback(async (data) => {
  const inJson = {
    akcija: 'UPD',
    id_ust: data.id,                     // ID ustanove koju menjamo
    naziv_pravnog: data.nazivPravnog,
    naziv_ustanove: data.nazivUstanove,
    adresa_ustanove: data.adresaUstanove,
    grad_ustanove: data.gradUstanove,
    tel_ustanove: data.telUstanove,
    kontakt_osoba: data.kontaktOsoba,
    id_kom: data.idKom,
    napomena: data.napomena              // Napomena takođe
  };
  const body = {
    ...authPayload(),
    in_json: JSON.stringify(inJson)
  };
  const url = `${API_URL}/unesi_ustanovu`;
  console.log('[AdminContext] updateUstanova - Request body:', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('[AdminContext] updateUstanova - Error text:', errText);
    throw new Error(`Greška pri izmjeni ustanove: ${errText}`);
  }
  const dataOut = await res.json();
  console.log('[AdminContext] updateUstanova - Parsed JSON:', dataOut);
  // Osveži listu ustanova
  await fetchUstanove();
  return dataOut;
}, [API_URL, authPayload, fetchUstanove]);

  /**
   * Add a new doctor (ljekara)
   */
  const addLjekar = useCallback(async (data) => {
    const inJson = {
      akcija: 'INS',
      id_kor: data.idKor,
      ime_prezime: data.imePrezime,
      email: data.email,
      licenca: data.licenca,
      tel: data.tel,
      specijalizacija: data.specijalizacija,
      adresa: data.adresa,
      user_p: data.username,
      pass_p: data.password,
      lista_ustanova: data.listaUstanova.map(id => ({ id_ust: id }))
    };
    console.log('[AdminContext] addLjekar - inJson:', inJson);
    const body = { ...authPayload(), in_json: JSON.stringify(inJson) };
    console.log('[AdminContext] addLjekar - Request body:', body);
    const res = await fetch(`${API_URL}/unesi_ljekara`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('[AdminContext] addLjekar - Raw response:', res);
    if (!res.ok) {
      const errText = await res.text();
      console.error('[AdminContext] addLjekar - Error text:', errText);
      throw new Error(`Greška pri dodavanju ljekara: ${errText}`);
    }
    const dataOut = await res.json();
    console.log('[AdminContext] addLjekar - Parsed JSON:', dataOut);
    return dataOut;
   }, [API_URL, authPayload]);

      
 // Update existing doctor (ljekara)

 const updateLjekar = useCallback(async (data) => {
  const inJson = {
    akcija: 'UPD',
    id_kor: data.idKor,
    ime_prezime: data.imeIPrezime,
    email: data.email,
    licenca: data.licenca,
    tel: data.tel,
    specijalizacija: data.specijalizacija,
    adresa: data.adresa,
    user_p: data.username,
    pass_p: data.password,
    lista_ustanova: data.listaUstanova.map(id => ({ id_ust: id }))
  };
  const body = { ...authPayload(), in_json: JSON.stringify(inJson) };
  const res = await fetch(`${API_URL}/unesi_ljekara`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Greška pri izmjeni ljekara: ${text}`);
  }
  const out = await res.json();
  // nakon uspjeha, refresh liste
  await fetchLjekari();
  return out;
 }, [API_URL, authPayload, fetchLjekari]);

 // Memoiziramo cijeli value object kako ne bi svaki render davao novu referencu
  const value = useMemo(() => ({                                            // useMemo za provider value
    
    komitenti,
    ustanove,
    ljekari,
    fetchKomitenti,
    fetchUstanove,
    fetchLjekari,
    addUstanova,
    updateUstanova,
    addLjekar,
    updateLjekar
  }), [
     komitenti, ustanove, ljekari,
    fetchKomitenti, fetchUstanove, fetchLjekari,
    addUstanova, updateUstanova, addLjekar, updateLjekar
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};


export default AdminContext;
