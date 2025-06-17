import React from 'react';
import { Modal} from 'react-bootstrap';
import './InstitutionModal.css'; // Import your custom styles

export default function InstitutionModal({ show, onSelect, onHide, container }) {
  const institutions = [
    { label: 'DOM ZDRAVLJA', value: 'dom_zdravlja', variant: 'primary' },
    { label: 'POLIKLINIKA', value: 'poliklinika', variant: 'info' },
    { label: 'KLINIKA MED', value: 'klinika_med', variant: 'success' },
  ];

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
          <h2 className="institution-modal-title">MARKO MARKOVIĆ</h2>
          <p className="institution-modal-subtitle">Ljekar</p>
          <p className="institution-modal-subtitle">Izaberite zdravstvenu ustanovu:</p>

          <div className="institution-modal-buttons">
            {institutions.map((inst) => (
              <button
                key={inst.value}
                onClick={() => onSelect(inst.value)}
                className={`institution-btn institution-btn--${inst.value}`}
              >
                {inst.label}
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
