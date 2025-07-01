import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const DodajUstanovu = ({ onBack, onSave }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    nazivUstanove: '',
    nazivPoslovneJedinice: '',
    adresaPoslovneJedinice: '',
    komitent: '',
    brojTelefonaPoslovnice: '',
    kontaktOsoba: {
      ime: '',
      prezime: '',
      telefon: ''
    },
    doktori: [],
    napomena: ''
  });

  const [errors, setErrors] = useState({});
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedDoktor, setSelectedDoktor] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Browser back dugme funkcionalnost
  useEffect(() => {
    const handlePopState = (event) => {
      // Ako je otvoren cancel modal, zatvaramo ga prvo
      if (showCancelAlert) {
        setShowCancelAlert(false);
        // Sprečavamo da se ide dalje nazad
        window.history.pushState(null, '', window.location.href);
        return;
      }
      
      // Ako nema otvorenih modala, pozivamo onBack funkciju
      if (onBack) {
        onBack();
      }
    };

    // Dodajemo trenutnu stranicu u history kada se komponenta mount-uje
    window.history.pushState(null, '', window.location.href);
    
    // Dodajemo event listener za popstate
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup funkcija
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showCancelAlert, onBack]);

  // Lista dostupnih doktora
  const dostupniDoktori = [
    'Dr Marko Petrović - Kardiolog',
    'Dr Ana Nikolić - Neurolog',
    'Dr Petar Jovanović - Ginekolog',
    'Dr Milica Stanković - Dermatolog',
    'Dr Stefan Milanović - Ortoped',
    'Dr Jovana Popović - Pediatar',
    'Dr Nikola Đurović - Hirurg',
    'Dr Dragana Vukčević - Oftalmolog',
    'Dr Aleksandar Milic - Psihijatar',
    'Dr Jelena Stojanović - Anesteziolog'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Ukloni grešku kada korisnik počne da kuca
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      brojTelefonaPoslovnice: value || ''
    }));
    
    if (errors.brojTelefonaPoslovnice) {
      setErrors(prev => ({
        ...prev,
        brojTelefonaPoslovnice: ''
      }));
    }
  };

  const handleContactPhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      kontaktOsoba: {
        ...prev.kontaktOsoba,
        telefon: value || ''
      }
    }));
    
    if (errors['kontaktOsoba.telefon']) {
      setErrors(prev => ({
        ...prev,
        'kontaktOsoba.telefon': ''
      }));
    }
  };

  const handleDodajDoktora = () => {
    if (selectedDoktor && !formData.doktori.includes(selectedDoktor)) {
      setFormData(prev => ({
        ...prev,
        doktori: [...prev.doktori, selectedDoktor]
      }));
      setSelectedDoktor('');
    }
  };

  const handleUkloniDoktora = (doktor) => {
    setFormData(prev => ({
      ...prev,
      doktori: prev.doktori.filter(d => d !== doktor)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nazivUstanove.trim()) newErrors.nazivUstanove = 'Naziv ustanove je obavezan';
    if (!formData.nazivPoslovneJedinice.trim()) newErrors.nazivPoslovneJedinice = 'Naziv poslovne jedinice je obavezan';
    if (!formData.adresaPoslovneJedinice.trim()) newErrors.adresaPoslovneJedinice = 'Adresa poslovne jedinice je obavezna';
    if (!formData.komitent.trim()) newErrors.komitent = 'Komitent je obavezan';
    if (!formData.brojTelefonaPoslovnice.trim()) newErrors.brojTelefonaPoslovnice = 'Broj telefona poslovnice je obavezan';
    if (!formData.kontaktOsoba.ime.trim()) newErrors['kontaktOsoba.ime'] = 'Ime kontakt osobe je obavezno';
    if (!formData.kontaktOsoba.prezime.trim()) newErrors['kontaktOsoba.prezime'] = 'Prezime kontakt osobe je obavezno';
    if (!formData.kontaktOsoba.telefon.trim()) newErrors['kontaktOsoba.telefon'] = 'Telefon kontakt osobe je obavezan';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const novaUstanova = {
        id: Date.now(),
        ...formData,
        kreiran: new Date().toISOString().split('T')[0]
      };
      onSave(novaUstanova);
    }
  };

  const handleCancel = () => {
    setShowCancelAlert(true);
    // Dodajemo novi state u history za modal
    window.history.pushState({ modal: 'cancel' }, '', window.location.href);
  };

  const confirmCancel = () => {
    setShowCancelAlert(false);
    onBack();
  };

  const cancelCancel = () => {
    setShowCancelAlert(false);
    // Vraćamo se na prethodnu stranicu u history
    window.history.back();
  };

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          color: #1a1d29;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .time-display {
          background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 18px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'SF Mono', Monaco, monospace;
          letter-spacing: 0.5px;
        }

        .back-btn {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 18px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .back-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }

        /* Main Content */
        .main-content {
          padding: 88px 32px 32px;
          min-height: 100vh;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          font-weight: 400;
        }

        /* Form Card */
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
        }

        .form-content {
          padding: 32px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        .form-section {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 24px;
        }

        .form-section.full-width {
          grid-column: 1 / -1;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .section-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
        }

        .required {
          color: #ef4444;
        }

        .form-control, .form-select, .form-textarea {
          width: 100%;
          height: 40px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          padding: 0 12px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .form-textarea {
          height: auto;
          padding: 12px;
          resize: vertical;
          min-height: 80px;
        }

        .form-control:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-control.error, .form-select.error, .form-textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }

        /* Phone Input Styling */
        .PhoneInput {
          display: flex;
          gap: 8px;
        }

        .PhoneInputCountrySelect {
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          padding: 0 8px;
          background: white;
          font-size: 14px;
          height: 40px;
        }

        .PhoneInputCountrySelect:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .PhoneInputInput {
          flex: 1;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          padding: 0 12px;
          font-size: 14px;
          background: white;
          height: 40px;
        }

        .PhoneInputInput:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .PhoneInputInput.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        /* Doktori Section */
        .doktori-selector {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .doktori-select {
          flex: 1;
        }

        .add-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px;
          font-weight: 600;
        }

        .add-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .add-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .doktori-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .doktor-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .doktor-name {
          color: #1a1d29;
          font-weight: 500;
        }

        .remove-btn {
          background: #fef2f2;
          color: #dc2626;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .remove-btn:hover {
          background: #dc2626;
          color: white;
        }

        .doktori-placeholder {
          text-align: center;
          padding: 24px;
          color: #6b7280;
          font-style: italic;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 14px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding: 24px 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: #f8fafc;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
          background: #f8fafc;
          color: #6b7280;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
          color: #374151;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 12px;
          text-align: center;
        }

        .modal-message {
          color: #6b7280;
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.5;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .modal-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .modal-btn-cancel {
          background: #f8fafc;
          color: #6b7280;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-cancel:hover {
          background: #f1f5f9;
          color: #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 88px 16px 32px;
          }
          
          .header {
            padding: 0 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .doktori-selector {
            flex-direction: column;
            gap: 8px;
          }
          
          .action-buttons {
            flex-direction: column;
            padding: 20px 16px;
          }
          
          .PhoneInput {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🏥</div>
            Cosmetic
          </div>
        </div>
        
        <div className="header-right">
          <div className="time-display">
            {currentTime.toLocaleTimeString('sr-RS', { 
              hour12: false,
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          
          <button className="back-btn" onClick={handleCancel}>
            ← Nazad
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Nova Ustanova</h1>
          <p className="page-subtitle">
            Unesite podatke o novoj zdravstvenoj ustanovi
          </p>
        </div>

        <div className="form-card">
          <div className="form-content">
            <div className="form-grid">
              {/* Osnovni podaci ustanove */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">🏥</div>
                  <div className="section-title">Osnovni podaci</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Naziv ustanove <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nazivUstanove ? 'error' : ''}`}
                    value={formData.nazivUstanove}
                    onChange={(e) => handleInputChange('nazivUstanove', e.target.value)}
                    placeholder="Unesite naziv ustanove"
                  />
                  {errors.nazivUstanove && <div className="error-message">{errors.nazivUstanove}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Naziv poslovne jedinice <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nazivPoslovneJedinice ? 'error' : ''}`}
                    value={formData.nazivPoslovneJedinice}
                    onChange={(e) => handleInputChange('nazivPoslovneJedinice', e.target.value)}
                    placeholder="Unesite naziv poslovne jedinice"
                  />
                  {errors.nazivPoslovneJedinice && <div className="error-message">{errors.nazivPoslovneJedinice}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Adresa poslovne jedinice <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.adresaPoslovneJedinice ? 'error' : ''}`}
                    value={formData.adresaPoslovneJedinice}
                    onChange={(e) => handleInputChange('adresaPoslovneJedinice', e.target.value)}
                    placeholder="Unesite adresu poslovne jedinice"
                  />
                  {errors.adresaPoslovneJedinice && <div className="error-message">{errors.adresaPoslovneJedinice}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Komitent <span className="required">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.komitent ? 'error' : ''}`}
                    value={formData.komitent}
                    onChange={(e) => handleInputChange('komitent', e.target.value)}
                  >
                    <option value="">Izaberite komitenta...</option>
                    <option value="Fond zdravstvenog osiguranja">Fond zdravstvenog osiguranja</option>
                    <option value="Ministarstvo zdravlja">Ministarstvo zdravlja</option>
                    <option value="Privatni">Privatni</option>
                  </select>
                  {errors.komitent && <div className="error-message">{errors.komitent}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Broj telefona poslovnice <span className="required">*</span>
                  </label>
                  <PhoneInput
                    placeholder="Broj telefona poslovnice"
                    value={formData.brojTelefonaPoslovnice}
                    onChange={handlePhoneChange}
                    defaultCountry="ME"
                    international
                    countryCallingCodeEditable={false}
                    className={errors.brojTelefonaPoslovnice ? 'error' : ''}
                  />
                  {errors.brojTelefonaPoslovnice && <div className="error-message">{errors.brojTelefonaPoslovnice}</div>}
                </div>
              </div>

              {/* Lista doktora */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">👨‍⚕️</div>
                  <div className="section-title">Lista doktora</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dodaj doktora</label>
                  <div className="doktori-selector">
                    <select
                      className="form-select doktori-select"
                      value={selectedDoktor}
                      onChange={(e) => setSelectedDoktor(e.target.value)}
                    >
                      <option value="">Izaberite doktora...</option>
                      {dostupniDoktori
                        .filter(doktor => !formData.doktori.includes(doktor))
                        .map((doktor, index) => (
                          <option key={index} value={doktor}>
                            {doktor}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleDodajDoktora}
                      disabled={!selectedDoktor}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="doktori-list">
                  {formData.doktori.length > 0 ? (
                    formData.doktori.map((doktor, index) => (
                      <div key={index} className="doktor-item">
                        <span className="doktor-name">{doktor}</span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleUkloniDoktora(doktor)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="doktori-placeholder">
                      Izaberite doktore iz liste iznad
                    </div>
                  )}
                </div>
              </div>

              {/* Kontakt osoba */}
              <div className="form-section full-width">
                <div className="section-header">
                  <div className="section-icon">👤</div>
                  <div className="section-title">Kontakt osoba</div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
                  <div className="form-group">
                    <label className="form-label">
                      Ime <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['kontaktOsoba.ime'] ? 'error' : ''}`}
                      value={formData.kontaktOsoba.ime}
                      onChange={(e) => handleInputChange('kontaktOsoba.ime', e.target.value)}
                      placeholder="Ime kontakt osobe"
                    />
                    {errors['kontaktOsoba.ime'] && <div className="error-message">{errors['kontaktOsoba.ime']}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Prezime <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['kontaktOsoba.prezime'] ? 'error' : ''}`}
                      value={formData.kontaktOsoba.prezime}
                      onChange={(e) => handleInputChange('kontaktOsoba.prezime', e.target.value)}
                      placeholder="Prezime kontakt osobe"
                    />
                    {errors['kontaktOsoba.prezime'] && <div className="error-message">{errors['kontaktOsoba.prezime']}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Telefon <span className="required">*</span>
                    </label>
                    <PhoneInput
                      placeholder="Telefon kontakt osobe"
                      value={formData.kontaktOsoba.telefon}
                      onChange={handleContactPhoneChange}
                      defaultCountry="ME"
                      international
                      countryCallingCodeEditable={false}
                      className={errors['kontaktOsoba.telefon'] ? 'error' : ''}
                    />
                    {errors['kontaktOsoba.telefon'] && <div className="error-message">{errors['kontaktOsoba.telefon']}</div>}
                  </div>
                </div>
              </div>

              {/* Napomena */}
              <div className="form-section full-width">
                <div className="section-header">
                  <div className="section-icon">📝</div>
                  <div className="section-title">Napomena</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dodatne informacije</label>
                  <textarea
                    className="form-textarea"
                    value={formData.napomena}
                    onChange={(e) => handleInputChange('napomena', e.target.value)}
                    placeholder="Unesite napomenu..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleSave}>
              💾 Sačuvaj ustanovu
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              ✕ Otkaži
            </button>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Potvrda otkazivanja</div>
            <div className="modal-message">
              Da li ste sigurni da želite da otkažete dodavanje ustanove? Svi uneseni podaci će biti izgubljeni.
            </div>
            <div className="modal-buttons">
              <button className="modal-btn-danger" onClick={confirmCancel}>
                Da, otkaži
              </button>
              <button className="modal-btn-cancel" onClick={cancelCancel}>
                Ne, nastavi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DodajUstanovu;