import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Header from "../../components/Header";
import PatientInfo from "../../components/RequestForm/PatientInfo";
import DiagnosisBlock from "../../components/RequestForm/DiagnosisBlock";
import PrescriptionCard from "../../components/RequestForm/PrescriptionCard";
import AddPrescriptionButton from "../../components/RequestForm/AddPrescriptionButton";
import FileUpload from "../../components/RequestForm/FileUpload";
import { useDataContext } from "../../context/DataContext";
import "../RequestForm/RequestForm.css";

function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    listaZahtjeva,
    indikacije,
    indikLijek,
    lijekNormativ,
    gradovi,
    pacijenti,
  } = useDataContext();
  const [recepti, setRecepti] = useState([]);
  const [dijagnoza, setDijagnoza] = useState("");
  const [files, setFiles] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let found = location.state?.request;
    if (!found && listaZahtjeva?.P_OUT_JSON) {
      found = listaZahtjeva.P_OUT_JSON.find(
        (z) => String(z.id_zah) === String(id)
      );
    }
    if (found) {
      setPatientInfo({
        phone: found.br_tel || "",
        firstName: found.pacijent_ime || "",
        lastName: found.pacijent_prezime || "",
        birthDate: found.pacijent_dat_rodj || "",
        city: found.grad || "",
      });
      setDijagnoza(found.dijagnoza || "");
      setRecepti(
        found.rp?.map((rp) => {
          const odabraniObj = lijekNormativ.find(
            (l) => l.lijek_name === (rp.naziv || rp.r_art_naziv)
          ) || null;
          return {
            tipRecepta: rp.tip_rp === "OB" ? "obrazac" : "blanko",
            grupa: rp.grupa || rp.r_indikacija || "",
            obrazac: rp.rp_obrazac || "",
            odabraniObrazac: odabraniObj,
            tekstRecepta: rp.rp_blanko || rp.rp_obrazac || "",
            tekstObrasca: rp.rp_obrazac || "",
            vrstaRecepta: rp.vrsta_rp === "OB" ? "obn" : "neobn",
            kolicina: rp.kolicina || rp.r_kol || "",
            brojPonavljanja: rp.broj_ponavljanja || rp.r_br_ponavljanja || "",
            vremenskiPeriod: rp.vremenski_period || rp.r_br_mjeseci || "",
            napomena: rp.napomena || rp.r_napomena || "",
            odabrani: rp.naziv || rp.r_art_naziv || "",
          };
        }) || []
      );
      setFiles([]);
      setLoading(false);
    }
  }, [listaZahtjeva, id, location.state]);

  const isValidPhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 11 && cleaned.length <= 12;
  };

  const validateForm = () => {
    if (
      !patientInfo.firstName ||
      !patientInfo.lastName ||
      !patientInfo.birthDate
    ) {
      alert("Molimo popunite sve podatke o pacijentu.");
      return false;
    }
    if (!isValidPhone(patientInfo.phone)) {
      alert("Molimo unesite ispravan broj telefona.");
      return false;
    }
    if (recepti.length === 0) {
      alert("Dodajte bar jedan recept.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // LOGIKA ZA IZMJENU - DODATI ažuriranje konteksta
    alert("Izmjene su potvrđene!");
    navigate("/requests");
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="background text-dark position-relative">
      <Header />
      <div>
        <div className="p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-1">Izmjena zahtjeva</h1>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/requests")}
            >
              Lista zahtjeva
            </Button>
          </div>

          <Form onSubmit={handleSubmit}>
            <PatientInfo
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              pacijenti={pacijenti}
              gradovi={gradovi}
            />
            <DiagnosisBlock
              onChangeDijagnoza={setDijagnoza}
              dijagnoza={dijagnoza}
            />
            {recepti.map((recept, index) => (
              <PrescriptionCard
                key={index}
                recept={recept}
                index={index}
                recepti={recepti}
                setRecepti={setRecepti}
                indikLijek={indikLijek}
                indikacije={indikacije}
                lijekNormativ={lijekNormativ}
              />
            ))}
            <AddPrescriptionButton setRecepti={setRecepti} recepti={recepti} />
            <FileUpload setFiles={setFiles} />
            <Button className="mt-4" variant="primary" type="submit">
              Potvrdi Izmjene
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditRequest;
