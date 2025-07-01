import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const IzmjenaUstanove = ({ ustanova, onBack, onSave, fromPregled = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    nazivUstanove: ustanova?.nazivUstanove || '',
    nazivPoslovneJedinice: ustanova?.nazivPoslovneJedinice || '',
    adresaPoslovneJedinice: ustanova?.adresaPoslovneJedinice || '',
    komitent: ustanova?.komitent || '',
    brojTelefonaPoslovnice: ustanova?.brojTelefonaPoslovnice || '',
    kontaktOsoba: {
      ime: ustanova?.kontaktOsoba?.ime || '',
      prezime: ustanova?.kontaktOsoba?.prezime || '',
      telefon: ustanova?.kontaktOsoba?.telefon || ''
    },
    napomena: ustanova?.napomena || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Browser back dugme funkcionalnost
  useEffect(() => {
    const handlePopState = (event) => {
      // Pozivamo onBack funkciju kada korisnik koristi browser back dugme
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
  }, [onBack]);

  // Lista komitenata
  const komitenti = [
    'Fond zdravstvenog osiguranja',
    'Ministarstvo zdravlja',
    'Privatni vlasnik',
    'Opština',
    'Grad',
    'Javno-privatno partnerstvo',
    'Ostalo'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      // Nested field (kontakt osoba)
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
      const updatedUstanova = {
        ...ustanova,
        ...formData
      };
      onSave(updatedUstanova);
    }
  };

  const handleCancel = () => {
    onBack();
  };

  if (!ustanova) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Ustanova nije pronađena</h4>
            <button className="button" onClick={onBack} style={{ marginTop: '1rem' }}>
              ← Nazad
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Cosmetics
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
          <h1 className="page-title">Izmjena Ustanove</h1>
          <p className="page-subtitle">
            {formData.nazivUstanove} - {formData.nazivPoslovneJedinice}
          </p>
        </div>

        <div className="form-card">
          <div className="form-content">
            <div className="form-grid">
              {/* Osnovni podaci ustanove */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">🏥</div>
                  <div className="section-title">Podaci ustanove</div>
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
              </div>

              {/* Komitent i kontakt */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">📋</div>
                  <div className="section-title">Komitent i kontakt</div>
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
                    <option value="">Izaberite komitenta</option>
                    {komitenti.map((komitent, index) => (
                      <option key={index} value={komitent}>
                        {komitent}
                      </option>
                    ))}
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
                      Telefon kontakt osobe <span className="required">*</span>
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
              💾 Sačuvaj izmjene
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              ✕ Otkaži
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IzmjenaUstanove;