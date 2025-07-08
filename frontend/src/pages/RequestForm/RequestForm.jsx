import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";
import { Form, Button } from "react-bootstrap";
import PatientInfo from "../../components/RequestForm/PatientInfo";
import DiagnosisBlock from "../../components/RequestForm/DiagnosisBlock";
import PrescriptionCard from "../../components/RequestForm/PrescriptionCard";
import FileUpload from "../../components/RequestForm/FileUpload";
import AddPrescriptionButton from "../../components/RequestForm/AddPrescriptionButton";
import Header from "../../components/Header";
import "./RequestForm.css";
import { flushSync } from "react-dom";

function RequestForm() {
  const navigate = useNavigate();
  const {
    indikacije,
    indikLijek,
    lijekNormativ,
    gradovi,
    pacijenti,
    submitZahtjev,
  } = useDataContext();

  const [recepti, setRecepti] = useState([
    {
      tipRecepta: "obrazac",
      tekstRecepta: "",
      odabraniObrazac: "",
      vrstaRecepta: "neobn",
      kolicina: "",
      brojPonavljanja: "",
      vremenskiPeriod: "",
      napomena: "",
      grupa: "",
      obrazac: "",
      odabrani: "",
    },
  ]);
  const [dijagnoza, setDijagnoza] = useState("");
  const [files, setFiles] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    city: "",
  });

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const result = await submitZahtjev({
        patientInfo,
        dijagnoza,
        recepti,
        files,
      });

      console.log("✅ Uspješno snimljeno:", result);

      flushSync(() => {
        // možeš setovati state ovdje ako treba, npr. clear form
      });

      navigate("/requests");
    } catch (err) {
      console.error("❌ Greška:", err);
      alert("Greška pri snimanju zahtjeva.");
    }
  };

  return (
    <>
      <div className="background text-dark position-relative">
        <Header />
        <div>
          <div className="p-4 mx-auto" style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="mb-1">Unos zahtjeva</h1>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/requests")}
              >
                Lista zahtjeva
              </Button>
            </div>

            <Form>
              <PatientInfo
                patientInfo={patientInfo}
                setPatientInfo={setPatientInfo}
                pacijenti={pacijenti}
                gradovi={gradovi}
              />
              <DiagnosisBlock onChangeDijagnoza={setDijagnoza} />

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

              <AddPrescriptionButton
                setRecepti={setRecepti}
                recepti={recepti}
              />
              <FileUpload setFiles={setFiles} />

              <div className="d-flex gap-2 mt-4">
                <Button variant="primary" onClick={handleSubmit}>
                  Snimi zahtjev
                </Button>
                <Button variant="secondary" onClick={() => navigate("/requests")}>
                  Odustani
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestForm;
