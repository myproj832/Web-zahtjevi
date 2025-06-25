import { Button } from "react-bootstrap";

function AddPrescriptionButton({ setRecepti, recepti }) {
  return (
    <Button
      className="mt-0 mb-3 btn btn-light btn-outline-success"
      onClick={() =>
        setRecepti([
          ...recepti,
          {
            tipRecepta: "obrazac",
            tekstRecepta: "",
            grupa: "",
            obrazac: "",
            odabraniObrazac: null,
            vrstaRecepta: "neobn",
            kolicina: "",
            brojPonavljanja: "",
            vremenskiPeriod: "",
            napomena: "",
          },
        ])
      }
    >
      + Dodaj lijek
    </Button>
  );
}

export default AddPrescriptionButton;
