import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [gradovi, setGradovi] = useState([]);
  const [pacijenti, setPacijenti] = useState([]);
  const [dijagnoze, setDijagnoze] = useState([]);
  const [indikacije, setIndikacije] = useState([]);
  const [indikLijek, setIndikLijek] = useState([]);
  const [lijekNormativ, setLijekNormativ] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resGradovi = await fetch("http://62.4.59.86:3334/api/gradovi");
        const gradoviJson = await resGradovi.json();
        const gradoviData = gradoviJson?.P_OUT_JSON || [];
        setGradovi(gradoviData);
        console.log("✅ Gradovi:", gradoviData);

        const resPacijenti = await fetch("http://62.4.59.86:3334/api/pacijenti");
        const pacijentiJson = await resPacijenti.json();
        const pacijentiData = pacijentiJson?.P_OUT_JSON || [];
        setPacijenti(pacijentiData);
        console.log("✅ Pacijenti:", pacijentiData);

        const resNormativi = await fetch("http://62.4.59.86:3334/api/normativi");
        const normativiJson = await resNormativi.json();
        const dijagnozeData = normativiJson?.P_DIJAGNOZE_JSON || [];
        const indikacijeData = normativiJson?.P_INDIKACIJE_JSON || [];
        const indikLijekData = normativiJson?.P_INDIK_LIJEK_JSON || [];
        const lijekNormativData = normativiJson?.P_LIJEK_NORMATIV_JSON || [];

        setDijagnoze(dijagnozeData);
        setIndikacije(indikacijeData);
        setIndikLijek(indikLijekData);
        setLijekNormativ(lijekNormativData);

        console.log("✅ Dijagnoze:", dijagnozeData);
        console.log("✅ Indikacije:", indikacijeData);
        console.log("✅ IndikLijek:", indikLijekData);
        console.log("✅ LijekNormativ:", lijekNormativData);
      } catch (error) {
        console.error("❌ Greška pri dohvaćanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DataContext.Provider
      value={{
        gradovi,
        pacijenti,
        dijagnoze,
        indikacije,
        indikLijek,
        lijekNormativ,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
