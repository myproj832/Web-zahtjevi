import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import InstitutionDetails from "../../components/RequestForm/InstitutionDetails";
import PatientInfo from "../../components/RequestForm/PatientInfo";
import DiagnosisBlock from "../../components/RequestForm/DiagnosisBlock";
import PrescriptionCard from "../../components/RequestForm/PrescriptionCard";
import FileUpload from "../../components/RequestForm/FileUpload";
import AddPrescriptionButton from "../../components/RequestForm/AddPrescriptionButton";
import Header from "../../components/Header";

function RequestForm() {
  const [grupa, setGrupa] = useState("sve");
  const navigate = useNavigate();
  const [recepti, setRecepti] = useState([
    {
      tipRecepta: "obrazac",
      tekstRecepta: "",
      odabraniObrazac: null,
      vrstaRecepta: "neobn",
      kolicina: "",
      brojPonavljanja: "",
      vremenskiPeriod: "",
      napomena: "",
      grupa: "sve",
    },
  ]);

  const grupe = [
    { id: "sve", naziv: "Sve grupe" },
    { id: "grupa1", naziv: "Grupa 1" },
    { id: "grupa2", naziv: "Grupa 2" },
  ];

  const obrasci = [
    {
      id: "obrazac1",
      naziv: "Obrazac A",
      grupa: "grupa1",
      sastavnica: ["Lijek 1", "Lijek 2"],
    },
    {
      id: "obrazac2",
      naziv: "Obrazac B",
      grupa: "grupa2",
      sastavnica: ["Lijek 3"],
    },
  ];

  const filtriraniObrasci =
    grupa === "sve" ? obrasci : obrasci.filter((o) => o.grupa === grupa);

  return (
    <>
    <Header />
    <div className="background text-dark">
      <div className="p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-1">Unos Zahtjeva</h1>
          <Button variant="outline-secondary" onClick={() => navigate("/requests")}>
            Pregled zahtjeva
          </Button>
        </div>

        <Form>
          <InstitutionDetails />
          <PatientInfo />
          <DiagnosisBlock />

          {recepti.map((recept, index) => (
            <PrescriptionCard
              key={index}
              recept={recept}
              index={index}
              recepti={recepti}
              setRecepti={setRecepti}
              grupe={grupe}
              obrasci={obrasci}
              filtriraniObrasci={filtriraniObrasci}
            />
          ))}

          <AddPrescriptionButton setRecepti={setRecepti} recepti={recepti} />

          <FileUpload />
          <Button className="mt-4" variant="primary">
            Snimi zahtjev
          </Button>
        </Form>
      </div>
    </div>
    </>
  );
}

export default RequestForm;
