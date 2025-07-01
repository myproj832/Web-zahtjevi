import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './InstitutionModal.css';

/* Naziv (ili ID) ustanove koja otvara Admin panel */
const ADMIN_UNIT_NAME = 'Administracija sistema';   // promijeni po potrebi
// const ADMIN_UNIT_ID   = 999;                     // primjer ako radiš po ID-u

export default function InstitutionModal({ show, onHide, container }) {
  const { institucije, korisnik, selectInstitution, logout } = useAuth();
  const navigate = useNavigate();

  /* Klik na dugme ustanove */
  const handleChoose = (inst) => {
    console.log('👉 Odabrana ustanova:', inst);

    /* 1. Zapiši u kontekst (token, rola, itd.) */
    selectInstitution(inst);

    /* 2. Zatvori modal */
    onHide();

    /* 3. Ako je to Admin ustanova, preusmjeri na /AdminPage */
    const isAdminUnit =
      inst.name_unit?.toLowerCase() === ADMIN_UNIT_NAME.toLowerCase();
      // ili npr. inst.id_unit === ADMIN_UNIT_ID;

    if (isAdminUnit) {
      /*  Mali timeout (≈ jedan “tick”) da stignu
          asinkrono da se upišu podaci u context  */
      setTimeout(() => {
        console.log('➡️ Navigacija na /AdminPage');
        navigate('/AdminPage', { replace: true });
      }, 50); // 50 ms je sasvim dovoljno
    }
  };

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
                key={inst.id_unit}
                onClick={() => handleChoose(inst)}
                className={`institution-btn institution-btn--${inst.id_unit}`}
              >
                {inst.name_unit}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              console.log('🚪 Odjava korisnika');
              logout();
              onHide();
            }}
            className="institution-modal-cancel"
          >
            Odustani
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
