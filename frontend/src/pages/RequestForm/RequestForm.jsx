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
import Modal from "../../components/Modal";
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
   const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ Greška:", err);
      setShowErrorModal(true);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate("/requests");
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
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
                onClick={handleCancelClick}
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
                <Button variant="secondary" onClick={handleCancelClick}>
                  Odustani
                </Button>
              </div>
            </Form>
          </div>
        </div>

      </div>
       {/* Cancel Confirmation Modal */}
      <Modal
        show={showCancelModal}
        type="warning"
        title="⚠️ Potvrda otkazivanja"
        confirmText="Da"
        cancelText="Ne"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
      >
        <p className="mb-3">Da li ste sigurni da želite da odustanete?</p>
        <p className="text-muted small">Svi uneseni podaci će biti izgubljeni.</p>
      </Modal>
       {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        type="success"
        title="✔️ Uspješno"
        confirmText="OK"
       
        onConfirm={() => navigate("/requests")}
        
      >
        <p className="mb-3">Zahtjev je uspješno kreiran.</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        type="danger"
        title="❌ Greška"
        confirmText="OK"
        
        onConfirm={() => setShowErrorModal(false)}
        
      >
        <p className="mb-3">Greška pri kreiranju zahtjeva. Pokušajte ponovo.</p>
      </Modal>
    </>
  );
}

export default RequestForm;
