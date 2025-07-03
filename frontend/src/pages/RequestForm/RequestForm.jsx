import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDataContext } from "../../context/DataContext";
import { Form, Button } from "react-bootstrap";
import PatientInfo from "../../components/RequestForm/PatientInfo";
import DiagnosisBlock from "../../components/RequestForm/DiagnosisBlock";
import PrescriptionCard from "../../components/RequestForm/PrescriptionCard";
import FileUpload from "../../components/RequestForm/FileUpload";
import AddPrescriptionButton from "../../components/RequestForm/AddPrescriptionButton";
import Header from "../../components/Header";
import "./RequestForm.css";

function RequestForm() {
  const navigate = useNavigate();
  const {
    indikacije,
    indikLijek,
    lijekNormativ,
    gradovi,
    pacijenti,
    submitZahtjev,
    loading,
  } = useDataContext();
  const { tokenApp, korisnickoIme, tokenUser } = useAuth();
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
    const cleaned = phone.replace(/\D/g, ""); // izbaci sve osim brojeva
    return cleaned.length >= 11 && cleaned.length <= 12;
  };

  return (
    <>
      <Header />
      <div className="background text-dark position-relative">
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
            {/* <InstitutionDetails /> */}
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

            <AddPrescriptionButton setRecepti={setRecepti} recepti={recepti} />
            <FileUpload setFiles={setFiles} />
            <Button
              className="mt-4"
              variant="primary"
              onClick={async () => {
                if (!isValidPhone(patientInfo.phone)) {
                  alert("Molimo unesite ispravan broj telefona");
                  return;
                }

                try {
                  const result = await submitZahtjev({
                    patientInfo,
                    dijagnoza,
                    recepti,
                    files,
                    tokenApp,
                    korisnickoIme,
                    tokenUser,
                  });

                  console.log("Uspješno snimljeno:", result);
                  navigate("/requests");
                } catch (err) {
                  alert("Greška pri snimanju zahtjeva");
                }
              }}
            >
              Snimi zahtjev
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default RequestForm;
