import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const IzmjenaDoktora = ({ doktor, onBack, onSave, fromPregled = false }) => {
  // Funkcija za generisanje passworda 5 slova + 3 broja
  function generateRandomPassword() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    let lettersPart = '';
    let digitsPart = '';
    for (let i = 0; i < 5; i++) {
      lettersPart += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
      digitsPart += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return lettersPart + digitsPart;
  }

  const [formData, setFormData] = useState({
    imePrezime: doktor?.imePrezime || `${doktor?.ime || ''} ${doktor?.prezime || ''}`.trim(),
    brojLicence: doktor?.brojLicence || '',
    specijalizacija: doktor?.specijalizacija || 'Opšta medicina',
    adresa: doktor?.adresa || '',
    ustanove: doktor?.ustanove || [],
    brojTelefona: doktor?.brojTelefona || '',
    email: doktor?.email || '',
    napomena: doktor?.napomena || '',
    login: doktor?.login || '',
    password: doktor?.password || generateRandomPassword()
  });

  const [errors, setErrors] = useState({});
  const [selectedUstanova, setSelectedUstanova] = useState('');

  // Browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      onBack();
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack]);

  // Lista ustanova
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
    if (!formData.login.trim()) newErrors.login = 'Login je obavezan';
    if (!formData.password.trim()) newErrors.password = 'Password je obavezan';
    if (formData.ustanove.length === 0) newErrors.ustanove = 'Najmanje jedna ustanova je obavezna';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email nije valjan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...doktor, ...formData });
    }
  };

  const handleCancel = () => {
    onBack();
  };

  // Dugme za generisanje nove lozinke
  const handleGeneratePassword = () => {
    setFormData(prev => ({
      ...prev,
      password: generateRandomPassword()
    }));
    if (errors.password) {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  if (!doktor) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Doktor nije pronađen</h4>
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
        .back-button {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .back-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .header-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d29;
        }
        .main-content {
          margin-top: 64px;
          padding: 32px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        .form-header {
          text-align: center;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          margin-bottom: 32px;
        }
        .form-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .form-subtitle {
          font-size: 14px;
          color: #3b82f6;
          font-weight: 600;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
        }
        .form-section-full {
          grid-column: 1 / -1;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group:last-child {
          margin-bottom: 0;
        }
        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 13px;
          margin-bottom: 6px;
          display: block;
        }
        .form-control {
          width: 100%;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 10px 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 14px;
          background: white;
        }
        .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        .form-control.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }
        .ustanove-select-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .ustanove-select {
          flex: 1;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          background: white;
        }
        .add-ustanova-btn {
          background: #10b981;
          border: none;
          border-radius: 6px;
          width: 36px;
          height: 36px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-weight: 600;
        }
        .add-ustanova-btn:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .add-ustanova-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .ustanove-list {
          margin-top: 12px;
        }
        .ustanova-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .button-remove {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .button-remove:hover {
          background: #dc2626;
          transform: scale(1.05);
        }
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        .button {
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .button-success {
          background: #10b981;
          color: white;
        }
        .button-success:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .button-cancel {
          background: #6b7280;
          color: white;
        }
        .button-cancel:hover {
          background: #4b5563;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }
        .PhoneInput {
          display: flex;
        }
        .PhoneInputInput {
          flex: 1;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
        }
        .PhoneInputInput:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        .PhoneInputCountrySelect {
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          margin-right: 8px;
          padding: 10px 12px;
          background: white;
          font-size: 14px;
        }
        .PhoneInputCountrySelect:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        .PhoneInputCountryIcon {
          width: 1.5em;
          height: 1em;
        }
        .empty-state {
          color: #6b7280;
          font-style: italic;
          text-align: center;
          padding: 16px;
          font-size: 13px;
          background: white;
          border: 1px dashed rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .password-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .password-generate-btn {
          background: #e5e7eb;
          border: none;
          color: #444;
          border-radius: 6px;
          padding: 7px 10px;
          cursor: pointer;
          font-size: 17px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 24px;
        }
        .password-generate-btn:hover {
          background: #d1d5db;
        }
        @media (max-width: 768px) {
          .header {
            padding: 0 16px;
          }
          .main-content {
            padding: 16px;
            margin-top: 64px;
          }
          .form-card {
            padding: 20px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .form-title {
            font-size: 20px;
          }
          .action-buttons {
            flex-direction: column;
            gap: 8px;
          }
          .button {
            width: 100%;
            justify-content: center;
          }
          .ustanove-select-container {
            flex-direction: column;
            gap: 8px;
          }
          .add-ustanova-btn {
            width: 100%;
            height: 40px;
          }
          .password-group .password-generate-btn {
            margin-top: 0;
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
          <button className="back-button" onClick={onBack}>
            <span>←</span>
            Nazad
          </button>
          <div className="header-title">
            Administrator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="form-card">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-title">
              Izmjena Ljekara
            </div>
            <div className="form-subtitle">
              Dr. {formData.imePrezime} (Licenca: {formData.brojLicence})
            </div>
          </div>

          {/* Form Content */}
          <div className="form-grid">
            {/* Lični podaci */}
            <div className="form-section">
              <div className="section-title">
                <span>👤</span>
                Lični podaci
              </div>
              <div className="form-group">
                <label className="form-label">Ime i prezime *</label>
                <input
                  type="text"
                  className={`form-control ${errors.imePrezime ? 'error' : ''}`}
                  value={formData.imePrezime}
                  onChange={(e) => handleInputChange('imePrezime', e.target.value)}
                  placeholder="Unesite ime i prezime"
                />
                {errors.imePrezime && <div className="error-message">{errors.imePrezime}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Broj licence *</label>
                <input
                  type="text"
                  className={`form-control ${errors.brojLicence ? 'error' : ''}`}
                  value={formData.brojLicence}
                  onChange={(e) => handleInputChange('brojLicence', e.target.value)}
                  placeholder="Unesite broj licence"
                />
                {errors.brojLicence && <div className="error-message">{errors.brojLicence}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Specijalizacija *</label>
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
              <div className="section-title">
                <span>📞</span>
                Kontakt
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
                <label className="form-label">Email adresa *</label>
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
            </div>

            {/* Ustanove */}
            <div className="form-section">
              <div className="section-title">
                <span>🏥</span>
                Ustanove
              </div>
              {errors.ustanove && <div className="error-message">{errors.ustanove}</div>}
              <div className="ustanove-select-container">
                <select
                  className="ustanove-select"
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
                  className="add-ustanova-btn"
                  onClick={handleDodajUstanovu}
                  disabled={!selectedUstanova}
                >
                  +
                </button>
              </div>
              <div className="ustanove-list">
                {formData.ustanove.map((ustanova, index) => (
                  <div key={index} className="ustanova-item">
                    <span>{ustanova}</span>
                    <button
                      type="button"
                      className="button-remove"
                      onClick={() => handleUkloniUstanovu(ustanova)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {formData.ustanove.length === 0 && (
                  <div className="empty-state">
                    Izaberite ustanovu iz liste iznad
                  </div>
                )}
              </div>
            </div>

            {/* Napomena */}
            <div className="form-section">
              <div className="section-title">
                <span>📝</span>
                Napomena
              </div>
              <div className="form-group">
                <label className="form-label">Dodatne informacije</label>
                <textarea
                  className="form-control"
                  value={formData.napomena}
                  onChange={(e) => handleInputChange('napomena', e.target.value)}
                  placeholder="Unesite napomenu..."
                  rows="4"
                  style={{resize: 'vertical'}}
                />
              </div>
            </div>

            {/* Pristupni podaci */}
            <div className="form-section form-section-full">
              <div className="section-title">
                <span>🔐</span>
                Pristupni podaci
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="form-group">
                  <label className="form-label">Korisničko ime *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.login ? 'error' : ''}`}
                    value={formData.login}
                    onChange={(e) => handleInputChange('login', e.target.value)}
                    placeholder="Korisničko ime"
                  />
                  {errors.login && <div className="error-message">{errors.login}</div>}
                </div>
                <div className="form-group password-group">
                  <div style={{flex: 1}}>
                    <label className="form-label">Lozinka *</label>
                    <input
                      type="text" // VIDLJIVA LOZINKA
                      className={`form-control ${errors.password ? 'error' : ''}`}
                      value={formData.password}
                      readOnly // ne može ručno da se mijenja
                      placeholder="Lozinka"
                      style={{fontFamily: 'monospace', background: '#f3f4f6'}}
                    />
                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </div>
                  <button
                    type="button"
                    className="password-generate-btn"
                    title="Generiši novu lozinku"
                    onClick={handleGeneratePassword}
                  >
                    &#x21bb;
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="button button-success" onClick={handleSave}>
              💾 Sačuvaj izmjene
            </button>
            <button className="button button-cancel" onClick={handleCancel}>
              ✕ Otkaži
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IzmjenaDoktora;
