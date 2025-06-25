import React from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";
import "./InstitutionModal.css"; // Import your custom styles

export default function InstitutionModal({
  show,
  onSelect,
  onHide,
  container,
}) {
  const { institucije, korisnik, selectInstitution } = useAuth();
  return (
    <Modal
      show={show}
      onHide={onHide}
      container={container}
      centered
      fullscreen="sm-down"
      backdropClassName="institution-modal-backdrop"
    >
      <Modal.Body className="p-0">
        <div className="institution-modal-content">
          <h2 className="institution-modal-title">{korisnik}</h2>

          <p className="institution-modal-subtitle">
            Izaberite zdravstvenu ustanovu:
          </p>

          <div className="institution-modal-buttons">
            {institucije.map((inst) => (
              <button
                key={inst.id_institution}
                onClick={() => {
                  selectInstitution(inst);
                  onHide();
                }}
                className={`institution-btn institution-btn--${inst.id_institution}`}
              >
                {inst.name_unit}
              </button>
            ))}
          </div>

          <button onClick={onHide} className="institution-modal-cancel">
            Odustani
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
