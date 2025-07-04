import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { tokenApp, korisnickoIme, tokenUser } = useAuth();

  const [gradovi, setGradovi] = useState([]);
  const [pacijenti, setPacijenti] = useState([]);
  const [dijagnoze, setDijagnoze] = useState([]);
  const [indikacije, setIndikacije] = useState([]);
  const [indikLijek, setIndikLijek] = useState([]);
  const [lijekNormativ, setLijekNormativ] = useState([]);
  const [listaZahtjeva, setListaZahtjeva] = useState([]);
  const [loading, setLoading] = useState(true);

  // SLANJE PODATAKA BAZI
  const submitZahtjev = async ({ patientInfo, dijagnoza, recepti, files }) => {
    const requestBody = {
      token_app: tokenApp,
      in_auten: JSON.stringify({
        username_u: korisnickoIme,
        token_user: tokenUser,
      }),
      in_json: JSON.stringify({
        id_zah: "",
        status_zah: "1",
        p_br_tel: patientInfo.phone.replace(/\D/g, ""),
        p_ime: patientInfo.firstName,
        p_prezime: patientInfo.lastName,
        p_dat_rodj: patientInfo.birthDate,
        p_grad: patientInfo.city,
        p_dijagnoza: dijagnoza,
        p_napomena: "",
        p_rp: recepti.map((recept) => ({
          r_indikacija: recept.grupa || "",
          r_id_det: "",
          r_tip_rp: recept.tipRecepta === "obrazac" ? "OB" : "BL",
          r_art_id:
            recept.tipRecepta === "obrazac"
              ? recept.odabraniObrazac?.lijek_id || ""
              : recept.odabrani?.id || "",
          r_art_naziv:
            recept.tipRecepta === "obrazac"
              ? recept.odabraniObrazac?.lijek_name || ""
              : recept.odabrani?.naziv || "",
          r_rp_obrazac:
            recept.tipRecepta === "obrazac"
              ? recept.tekstObrasca || recept.tekstRecepta || ""
              : "",
          r_rp_blanko:
            recept.tipRecepta === "blanko" ? recept.tekstRecepta : "",
          r_vrsta_rp: recept.vrstaRecepta === "obn" ? "OB" : "NO",
          r_kol: recept.kolicina || "1",
          r_br_ponavljanja: recept.brojPonavljanja || "0",
          r_br_mjeseci: recept.vremenskiPeriod || "0",
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

  // PREUZIMANJE PODATAKA IZ BAZE
  useEffect(() => {
    if (!tokenApp || !korisnickoIme || !tokenUser) return;

    const fetchAll = async () => {
      try {
        // Gradovi
        const resGradovi = await fetch("http://62.4.59.86:3334/api/gradovi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token_app: tokenApp,
            in_auten: JSON.stringify({
              username_u: korisnickoIme,
              token_user: tokenUser,
            }),
          }),
        });
        const gradoviData = (await resGradovi.json())?.P_OUT_JSON || [];
        setGradovi(gradoviData);
        console.log("✅ Gradovi:", gradoviData);

        // Pacijenti
        const resPacijenti = await fetch(
          "http://62.4.59.86:3334/api/pacijenti"
        );
        const pacijentiData = (await resPacijenti.json())?.P_OUT_JSON || [];
        setPacijenti(pacijentiData);
        console.log("✅ Pacijenti:", pacijentiData);

        // Normativi (dijagnoze, indikacije, itd.)
        const resNormativi = await fetch(
          "http://62.4.59.86:3334/api/normativi"
        );
        const normativiJson = await resNormativi.json();
        setDijagnoze(normativiJson?.P_DIJAGNOZE_JSON || []);
        setIndikacije(normativiJson?.P_INDIKACIJE_JSON || []);
        setIndikLijek(normativiJson?.P_INDIK_LIJEK_JSON || []);
        setLijekNormativ(normativiJson?.P_LIJEK_NORMATIV_JSON || []);
        console.log("✅ Normativi:", normativiJson);

        // Lista zahtjeva
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
        console.log("✅ Lista zahtjeva:", listaJson);
      } catch (error) {
        console.error("❌ Greška pri dohvaćanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [tokenApp, korisnickoIme, tokenUser]);

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
        submitZahtjev,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
