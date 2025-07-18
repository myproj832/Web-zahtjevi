import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { tokenApp, korisnickoIme, tokenUser, rola, izabranaInstitucija } = useAuth();

  const [gradovi, setGradovi] = useState([]);
  const [pacijenti, setPacijenti] = useState([]);
  const [dijagnoze, setDijagnoze] = useState([]);
  const [indikacije, setIndikacije] = useState([]);
  const [indikLijek, setIndikLijek] = useState([]);
  const [lijekNormativ, setLijekNormativ] = useState([]);
  const [listaZahtjeva, setListaZahtjeva] = useState([]);
  const [loading, setLoading] = useState(true);

function deepTrimStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepTrimStrings);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepTrimStrings(v)])
    );
  } else if (typeof obj === "string") {
    return obj.trim();
  }
  return obj;
}

async function postFetch(url, body, headers = { "Content-Type": "application/json" }) {
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Greška pri fetchu: ${url}`);
  return await res.json();
}

  // SLANJE PODATAKA BAZI
  const submitZahtjev = useCallback(async ({ patientInfo, dijagnoza, recepti, files, id_zah = "", status_zah = "" }) => {
    const cleanPatientInfo = deepTrimStrings(patientInfo);
    const cleanDijagnoza = deepTrimStrings(dijagnoza);
    const cleanRecepti = deepTrimStrings(recepti);
    const requestBody = {
      token_app: tokenApp,
      in_auten: JSON.stringify({
        username_u: korisnickoIme,
        token_user: tokenUser,
      }),
      in_json: JSON.stringify({
        id_zah: id_zah,
        status_zah: status_zah,
        p_br_tel: cleanPatientInfo.phone.replace(/\D/g, ""),
        p_ime: cleanPatientInfo.firstName,
        p_prezime: cleanPatientInfo.lastName,
        p_dat_rodj: cleanPatientInfo.birthDate,
        p_grad: cleanPatientInfo.city,
        p_dijagnoza: cleanDijagnoza,
        p_napomena: "",
        p_rp: cleanRecepti.map((recept) => ({
          r_indikacija: recept.grupa || "",
          r_id_det: "",
          r_tip_rp: recept.tipRecepta === "obrazac" ? "OB" : "BL",
          r_id_art:
            recept.tipRecepta === "obrazac"
              ? recept.odabraniObrazac?.id_art || ""
              : recept.odabrani?.id_art || "",
          r_id_normativ:
            recept.tipRecepta === "obrazac"
              ? recept.odabraniObrazac?.id_normativ || ""
              : recept.odabrani?.id_normativ || "",
          r_lijek_name:
            recept.tipRecepta === "obrazac"
              ? recept.odabraniObrazac?.lijek_name || ""
              : recept.odabrani?.lijek_name || "",
          r_rp_obrazac:
            recept.tipRecepta === "obrazac"
              ? recept.tekstObrasca || recept.tekstRecepta || ""
              : "",
          r_rp_obrazac_org:
            recept.tipRecepta === "obrazac" && recept.odabraniObrazac
              ? `${recept.odabraniObrazac.lijek_normativ
                  .map((n) => n.normativ_name)
                  .join("\n")}` +
                `\n${recept.odabraniObrazac.lijek_m_f}\n${recept.odabraniObrazac.lijek_d_s}`
              : "",
          r_rp_blanko:
            recept.tipRecepta === "blanko" ? recept.tekstRecepta : "",
          r_vrsta_rp: recept.vrstaRecepta === "obn" ? "OB" : "NO",
          r_kol: recept.kolicina || "",
          r_br_ponavljanja: recept.brojPonavljanja || "",
          r_br_mjeseci: recept.vremenskiPeriod || "",
          r_napomena: recept.napomena || "",
        })),
      }),
      sken: files.length > 0 ? files[0] : "",
      type_sken:
        files.length > 0
          ? files[0].substring(0, files[0].indexOf(";")).replace("data:", "")
          : "",
    };
    console.log("✅ Zahtjev:", requestBody);
    try {
      return await postFetch("http://62.4.59.86:3334/api/upisi_zahtjev", requestBody);
    } catch (error) {
      console.error("❌ Greška prilikom slanja zahtjeva:", error);
      throw error;
    }
  }, [tokenApp, korisnickoIme, tokenUser]);

  
  // SLANJE ZAHTJEVA ZA BRISANJE
  const submitDelete = useCallback(async ({ id_zah, status_zah }) => {
    const requestBody = {
      token_app: tokenApp,
      in_auten: JSON.stringify({
        username_u: korisnickoIme,
        token_user: tokenUser,
      }),
      in_json: JSON.stringify({
        id_zah,
        status_zah
      })
    };
    console.log("✅ Delete zahtjev:", requestBody);
    try {
      return await postFetch("http://62.4.59.86:3334/api/upisi_zahtjev", requestBody);
    } catch (error) {
      console.error("❌ Greška prilikom brisanja zahtjeva:", error);
      throw error;
    }
  }, [tokenApp, korisnickoIme, tokenUser]);

  const fetchGradovi = useCallback(async () => {
    if (!tokenApp || !korisnickoIme || !tokenUser) return;
    try {
      const data = await postFetch("http://62.4.59.86:3334/api/gradovi", {
        token_app: tokenApp,
        in_auten: JSON.stringify({
          username_u: korisnickoIme,
          token_user: tokenUser,
        }),
      });
      const lista = data?.P_OUT_JSON || [];
      setGradovi(lista);
      console.log("✅ Gradovi:", lista);
    } catch (error) {
      console.error("❌ Greška pri fetchGradovi:", error);
    }
  }, [tokenApp, korisnickoIme, tokenUser]);

  const fetchPacijenti = useCallback(async () => {
    try {
      const res = await fetch("http://62.4.59.86:3334/api/pacijenti");
      const data = await res.json();
      const lista = data?.P_OUT_JSON || [];
      setPacijenti(lista);
      console.log("✅ Pacijenti:", lista);
    } catch (error) {
      console.error("❌ Greška pri fetchPacijenti:", error);
    }
  }, []);

  const fetchNormativi = useCallback(async () => {
    try {
      const res = await fetch("http://62.4.59.86:3334/api/normativi");
      const data = await res.json();
      setDijagnoze(data?.P_DIJAGNOZE_JSON || []);
      setIndikacije(data?.P_INDIKACIJE_JSON || []);
      setIndikLijek(data?.P_INDIK_LIJEK_JSON || []);
      setLijekNormativ(data?.P_LIJEK_NORMATIV_JSON || []);
      console.log("✅ Normativi:", data);
    } catch (error) {
      console.error("❌ Greška pri fetchNormativi:", error);
    }
  }, []);

  const fetchListaZahtjeva = useCallback(async () => {
    try {
      const data = await postFetch("http://62.4.59.86:3334/api/lista_zahtjeva", {
        token_app: tokenApp,
        in_auten: {
          KORISNIK: korisnickoIme,
          LOZINKA: tokenUser,
        },
      });
      setListaZahtjeva(data);
      console.log("✅ Lista zahtjeva:", data);
    } catch (error) {
      console.error("❌ Greška pri fetchListaZahtjeva:", error);
    }
  }, [tokenApp, korisnickoIme, tokenUser]);

  useEffect(() => {
    if (!tokenApp || !korisnickoIme || !tokenUser || !rola) return;

    const fetchByRole = async () => {
      try {
        if (rola === "Admin" || rola === "Ljekar") {
          await fetchGradovi();
        }
        if (rola === "Ljekar") {
          await Promise.all([
            fetchPacijenti(),
            fetchNormativi(),
            // fetchListaZahtjeva(), // Uklonjeno automatsko refreshanje liste zahtjeva
          ]);
        }
      } catch (err) {
        console.error("❌ Greška u lazy loadingu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByRole();
  }, [tokenApp, korisnickoIme, tokenUser, rola]);

    // Dohvati jedan zahtjev po id-ju
  const fetchJedanZahtjev = useCallback(async ({ id_zah, id_institution, id_unit } = {}) => {
    const inst = izabranaInstitucija || {};
    const final_id_institution = id_institution || inst.id_institution;
    const final_id_unit = id_unit || inst.id_unit;
    if (!id_zah || !final_id_institution || !final_id_unit) {
      throw new Error("Nedostaju id_zah, id_institution ili id_unit za fetchJedanZahtjev");
    }
    try {
      return await postFetch("http://62.4.59.86:3334/api/lista_zahtjeva_jedan", {
        token_app: tokenApp,
        in_auten: {
          KORISNIK: korisnickoIme,
          LOZINKA: tokenUser,
          id_institution: final_id_institution,
          id_unit: final_id_unit
        },
        id_zah
      });
    } catch (error) {
      console.error("❌ Greška pri fetchJedanZahtjev:", error);
      throw error;
    }
  }, [tokenApp, korisnickoIme, tokenUser, izabranaInstitucija]);

  const contextValue = useMemo(() => ({
    gradovi,
    pacijenti,
    dijagnoze,
    indikacije,
    indikLijek,
    lijekNormativ,
    listaZahtjeva,
    fetchGradovi,
    fetchPacijenti,
    fetchNormativi,
    fetchListaZahtjeva,
    fetchJedanZahtjev,
    submitZahtjev,
    submitDelete,
    loading,
    setListaZahtjeva,
  }), [
    gradovi,
    pacijenti,
    dijagnoze,
    indikacije,
    indikLijek,
    lijekNormativ,
    listaZahtjeva,
    fetchGradovi,
    fetchPacijenti,
    fetchNormativi,
    fetchListaZahtjeva,
    fetchJedanZahtjev,
    submitZahtjev,
    submitDelete,
    loading,
    setListaZahtjeva,
  ]);
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
