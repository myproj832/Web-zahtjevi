import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const DodajDoktora = ({ onBack, onSave }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    imePrezime: '',
    brojLicence: '',
    specijalizacija: '',
    adresa: '',
    ustanove: [],
    brojTelefona: '',
    email: '',
    napomena: '',
    login: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedUstanova, setSelectedUstanova] = useState('');

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

  // Lista ustanova iz AdminUstanove.jsx
  const dostupneUstanove = [
    'Dom zdravlja Podgorica',
    'Klinički centar Crne Gore',
    'Dom zdravlja Nikšić',
    'Bolnica Cetinje',
    'Specijalna bolnica Brezovik',
    'Institut za javno zdravlje',
    'Dom zdravlja Bar',
    'Dom zdravlja Bijelo Polje'
  ];

  // Auto-generisanje username-a i password-a kada se unese email
  useEffect(() => {
    if (formData.email && formData.email.includes('@')) {
      setFormData(prev => ({
        ...prev,
        login: formData.email,
        password: generateRandomPassword()
      }));
    }
  }, [formData.email]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
      brojTelefona: value || ''
    }));
    
    if (errors.brojTelefona) {
      setErrors(prev => ({
        ...prev,
        brojTelefona: ''
      }));
    }
  };

  const handleDodajUstanovu = () => {
    if (selectedUstanova && !formData.ustanove.includes(selectedUstanova)) {
      setFormData(prev => ({
        ...prev,
        ustanove: [...prev.ustanove, selectedUstanova]
      }));
      setSelectedUstanova('');
    }
  };

  const handleUkloniUstanovu = (ustanova) => {
    setFormData(prev => ({
      ...prev,
      ustanove: prev.ustanove.filter(u => u !== ustanova)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.imePrezime.trim()) newErrors.imePrezime = 'Ime i prezime je obavezno';
    if (!formData.brojLicence.trim()) newErrors.brojLicence = 'Broj licence je obavezan';
    if (!formData.specijalizacija.trim()) newErrors.specijalizacija = 'Specijalizacija je obavezna';
    if (!formData.email.trim()) newErrors.email = 'Email je obavezan';
    if (formData.ustanove.length === 0) newErrors.ustanove = 'Najmanje jedna ustanova je obavezna';
    
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email mora sadržavati @ znak';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email nije valjan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newDoktor = {
        id: Date.now(),
        ...formData
      };
      onSave(newDoktor);
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
          grid-template-columns: 400px 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        .form-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .form-section.compact {
          padding: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .section-icon {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d29;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group.compact {
          margin-bottom: 12px;
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
          height: 36px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 0 10px;
          font-size: 13px;
          background: white;
          transition: all 0.2s ease;
        }

        .form-textarea {
          height: auto;
          padding: 10px;
          resize: vertical;
          min-height: 70px;
        }

        .form-control:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .form-control.error, .form-select.error, .form-textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }

        .form-control.auto-filled {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
        }

        .error-message {
          color: #ef4444;
          font-size: 11px;
          margin-top: 3px;
          font-weight: 500;
        }

        .auto-filled-label {
          background: #ecfdf5;
          color: #059669;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Ustanove Section */
        .ustanove-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .ustanove-select {
          flex: 1;
        }

        .add-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
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

        .ustanove-list {
          max-height: 160px;
          overflow-y: auto;
        }

        .ustanova-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .ustanova-name {
          color: #1a1d29;
          font-weight: 500;
        }

        .remove-btn {
          background: #fef2f2;
          color: #dc2626;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 10px;
        }

        .remove-btn:hover {
          background: #dc2626;
          color: white;
        }

        .ustanove-placeholder {
          text-align: center;
          padding: 16px;
          color: #6b7280;
          font-style: italic;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 12px;
        }

        /* Phone Input Styling */
        .PhoneInput {
          display: flex;
          gap: 6px;
        }

        .PhoneInputCountrySelect {
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 0 6px;
          background: white;
          font-size: 13px;
          height: 36px;
        }

        .PhoneInputCountrySelect:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .PhoneInputInput {
          flex: 1;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 0 10px;
          font-size: 13px;
          background: white;
          height: 36px;
        }

        .PhoneInputInput:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding: 24px 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(5px);
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
          background: rgba(248, 250, 252, 0.9);
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
          backdrop-filter: blur(5px);
        }

        .btn-secondary:hover {
          background: rgba(241, 245, 249, 0.9);
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
          
          .ustanove-selector {
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
          <h1 className="page-title">Novi Ljekar</h1>
          <p className="page-subtitle">
            Unesite podatke o novom ljekaru u sistem
          </p>
        </div>

        <div className="form-card">
          <div className="form-content">
            <div className="form-grid">
              {/* Left Column */}
              <div className="form-left">
                {/* Lični podaci */}
                <div className="form-section compact">
                  <div className="section-header">
                    <div className="section-icon">👤</div>
                    <div className="section-title">Lični podaci</div>
                  </div>
                  
                  <div className="form-group compact">
                    <label className="form-label">
                      Ime i prezime <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.imePrezime ? 'error' : ''}`}
                      value={formData.imePrezime}
                      onChange={(e) => handleInputChange('imePrezime', e.target.value)}
                      placeholder="Unesite ime i prezime"
                    />
                    {errors.imePrezime && <div className="error-message">{errors.imePrezime}</div>}
                  </div>

                  <div className="form-group compact">
                    <label className="form-label">
                      Broj licence <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.brojLicence ? 'error' : ''}`}
                      value={formData.brojLicence}
                      onChange={(e) => handleInputChange('brojLicence', e.target.value)}
                      placeholder="Unesite broj licence"
                    />
                    {errors.brojLicence && <div className="error-message">{errors.brojLicence}</div>}
                  </div>

                  <div className="form-group compact">
                    <label className="form-label">
                      Specijalizacija <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.specijalizacija ? 'error' : ''}`}
                      value={formData.specijalizacija}
                      onChange={(e) => handleInputChange('specijalizacija', e.target.value)}
                      placeholder="Unesite specijalizaciju"
                    />
                    {errors.specijalizacija && <div className="error-message">{errors.specijalizacija}</div>}
                  </div>
                </div>

                {/* Kontakt informacije */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">📞</div>
                    <div className="section-title">Kontakt informacije</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Broj telefona</label>
                    <PhoneInput
                      placeholder="Broj telefona"
                      value={formData.brojTelefona}
                      onChange={handlePhoneChange}
                      defaultCountry="ME"
                      international
                      countryCallingCodeEditable={false}
                    />
                    {errors.brojTelefona && <div className="error-message">{errors.brojTelefona}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email adresa <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email adresa"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Adresa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.adresa}
                      onChange={(e) => handleInputChange('adresa', e.target.value)}
                      placeholder="Adresa"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Napomena</label>
                    <textarea
                      className="form-textarea"
                      value={formData.napomena}
                      onChange={(e) => handleInputChange('napomena', e.target.value)}
                      placeholder="Dodatne informacije..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-right">
                {/* Ustanove */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">🏥</div>
                    <div className="section-title">Ustanove</div>
                  </div>

                  {errors.ustanove && <div className="error-message" style={{marginBottom: '12px'}}>{errors.ustanove}</div>}

                  <div className="form-group">
                    <label className="form-label">
                      Dodaj ustanovu <span className="required">*</span>
                    </label>
                    <div className="ustanove-selector">
                      <select
                        className="form-select ustanove-select"
                        value={selectedUstanova}
                        onChange={(e) => setSelectedUstanova(e.target.value)}
                      >
                        <option value="">Izaberite ustanovu...</option>
                        {dostupneUstanove
                          .filter(ustanova => !formData.ustanove.includes(ustanova))
                          .map((ustanova, index) => (
                            <option key={index} value={ustanova}>
                              {ustanova}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="add-btn"
                        onClick={handleDodajUstanovu}
                        disabled={!selectedUstanova}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="ustanove-list">
                    {formData.ustanove.length > 0 ? (
                      formData.ustanove.map((ustanova, index) => (
                        <div key={index} className="ustanova-item">
                          <span className="ustanova-name">{ustanova}</span>
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleUkloniUstanovu(ustanova)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="ustanove-placeholder">
                        Izaberite ustanovu iz liste iznad
                      </div>
                    )}
                  </div>
                </div>

                {/* Pristupni podaci */}
                <div className="form-section compact">
                  <div className="section-header">
                    <div className="section-icon">🔐</div>
                    <div className="section-title">Pristupni podaci</div>
                  </div>

                  <div className="auto-filled-label">
                    ✓ Automatski generisano na osnovu email adrese
                  </div>

                  <div className="form-group compact">
                    <label className="form-label">Korisničko ime</label>
                    <input
                      type="text"
                      className="form-control auto-filled"
                      value={formData.login}
                      readOnly
                      placeholder="Automatski se generiše"
                    />
                  </div>

                  <div className="form-group compact">
                    <label className="form-label">Lozinka</label>
                    <input
                      type="text"
                      className="form-control auto-filled"
                      value={formData.password}
                      readOnly
                      placeholder="Automatski se generiše"
                      style={{fontFamily: 'monospace'}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleSave}>
              💾 Sačuvaj ljekara
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
              Da li ste sigurni da želite da otkažete dodavanje ljekara? Svi uneseni podaci će biti izgubljeni.
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

export default DodajDoktora;