import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { tokenApp, korisnickoIme, tokenUser, rola } = useAuth();

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

  // SLANJE PODATAKA BAZI
  const submitZahtjev = async ({ patientInfo, dijagnoza, recepti, files, id_zah = "", status_zah = "" }) => {
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
      const res = await fetch("http://62.4.59.86:3334/api/upisi_zahtjev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("Greška pri slanju zahtjeva");

      const result = await res.json();
      return result;
    } catch (error) {
      console.error("❌ Greška prilikom slanja zahtjeva:", error);
      throw error;
    }
  };

  const fetchGradovi = async () => {
    if (!tokenApp || !korisnickoIme || !tokenUser) return;
    try {
      const res = await fetch("http://62.4.59.86:3334/api/gradovi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_app: tokenApp,
          in_auten: JSON.stringify({
            username_u: korisnickoIme,
            token_user: tokenUser,
          }),
        }),
      });
      const data = await res.json();
      const lista = data?.P_OUT_JSON || [];
      setGradovi(lista);
      console.log("✅ Gradovi:", lista);
    } catch (error) {
      console.error("❌ Greška pri fetchGradovi:", error);
    }
  };

  const fetchPacijenti = async () => {
    try {
      const res = await fetch("http://62.4.59.86:3334/api/pacijenti");
      const data = await res.json();
      const lista = data?.P_OUT_JSON || [];
      setPacijenti(lista);
      console.log("✅ Pacijenti:", lista);
    } catch (error) {
      console.error("❌ Greška pri fetchPacijenti:", error);
    }
  };

  const fetchNormativi = async () => {
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
  };

  const fetchListaZahtjeva = async () => {
    try {
      const res = await fetch("http://62.4.59.86:3334/api/lista_zahtjeva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_app: tokenApp,
          in_auten: {
            KORISNIK: korisnickoIme,
            LOZINKA: tokenUser,
          },
        }),
      });
      const data = await res.json();
      setListaZahtjeva(data);
      console.log("✅ Lista zahtjeva:", data);
    } catch (error) {
      console.error("❌ Greška pri fetchListaZahtjeva:", error);
    }
  };

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
            fetchListaZahtjeva(),
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

  const refreshListaZahtjeva = async () => {
    try {
      const resLista = await fetch(
        "http://62.4.59.86:3334/api/lista_zahtjeva",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token_app: tokenApp,
            in_auten: {
              KORISNIK: korisnickoIme,
              LOZINKA: tokenUser,
            },
          }),
        }
      );
      const listaJson = await resLista.json();
      setListaZahtjeva(listaJson);
      console.log("✅ Lista zahtjeva refreshovana:", listaJson);
    } catch (error) {
      console.error("❌ Greška pri refreshu liste zahtjeva:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
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
        submitZahtjev,
        loading,
        setListaZahtjeva,
        refreshListaZahtjeva,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
