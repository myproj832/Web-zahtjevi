import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DodajDoktora.css';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ValidationContext } from '../../context/ValidationContext.jsx';

const DodajDoktora = () => {
  const navigate = useNavigate();
  const { ustanove, addLjekar } = useAdmin();
  const allowedSigns = useContext(ValidationContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [savedDoctor, setSavedDoctor] = useState(null);
  
  const [formData, setFormData] = useState({
    idKor: '',
    imeIPrezime: '',
    brojLicence: '',
    specijalizacija: '',
    brojTelefona: '',
    emailAdresa: '',
    adresa: '',
    napomena: '',
    username: '',
    password: '',
    listaUstanova: []
  });

  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);


   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.+]).{8,}$/;

  const isValid = passwordRegex.test(password);

 const handleChange = (e) => {
  const val = e.target.value;
  setPassword(val);

  // Čistimo grešku čim korisnik počne da kuca
  if (errors.password) {
    setErrors(prev => ({ ...prev, password: '' }));
  }
};


  const handleBlur = () => {
    setTouched(true);
  };

  // Update username when email changes
   useEffect(() => {
    setFormData(prev => ({ ...prev, username: prev.emailAdresa }));
  }, [formData.emailAdresa]);

    // 2. generički handler za dozvoljene karaktere
   const handleBeforeInput = (e) => {
    const char = e.data;
    const field = e.target.name;
    if (!char || !allowedSigns) return;

    if (!allowedSigns.includes(char)) {
      e.preventDefault();
      setErrors(prev => ({
        ...prev,
        [field]: `Znak "${char}" nije dozvoljen.`
      }));
      setTimeout(() => {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }, 3000);
    }
  };

   const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

   const handleUstanovaAdd = id => {
    setFormData(prev => ({
      ...prev,
      listaUstanova: prev.listaUstanova.includes(id)
        ? prev.listaUstanova
        : [...prev.listaUstanova, id]
    }));
    setDropdownOpen(false);
  };

 const handleUstanovaRemove = id => {
    setFormData(prev => ({ ...prev, listaUstanova: prev.listaUstanova.filter(u => u !== id) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.imeIPrezime.trim()) newErrors.imeIPrezime = 'Ime i prezime je obavezno';
    if (!formData.brojLicence.trim()) newErrors.brojLicence = 'Broj licence je obavezan';
    if (!formData.specijalizacija.trim()) newErrors.specijalizacija = 'Specijalizacija je obavezna';
    if (!formData.brojTelefona.trim()) newErrors.brojTelefona = 'Broj telefona je obavezan';
    if (!formData.emailAdresa.trim()) newErrors.emailAdresa = 'Email adresa je obavezna';
    else if (!validateEmail(formData.emailAdresa)) newErrors.emailAdresa = 'Email adresa nije u ispravnom formatu';
    // if (!formData.adresa.trim()) newErrors.adresa = 'Adresa je obavezna';
     if (!password.trim())  newErrors.password = 'Lozinka je obavezna';
  else if (!passwordRegex.test(password)) newErrors.password = 'Lozinka nije u ispravnom formatu';
    if (formData.listaUstanova.length === 0) newErrors.listaUstanova = 'Morate odabrati najmanje jednu ustanovu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSacuvaj = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        idKor: formData.idKor,
        imePrezime: formData.imeIPrezime,
        email: formData.emailAdresa,
        licenca: formData.brojLicence,
        tel: formData.brojTelefona,
        specijalizacija: formData.specijalizacija,
        username: formData.username,
        password: password,
        listaUstanova: formData.listaUstanova
      };
       console.log('[DodajDoktora] Slanje payload za ljekara:', payload);
      await addLjekar(payload);
      setSavedDoctor({ ...formData, password });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert('Greška prilikom dodavanja ljekara');
    }
  };

    const handleCancel        = () => setShowCancelModal(true);
  // potvrdili otkazivanje
  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate('/AdminDoktori');
  };
  // poništili otkazivanje
  const handleCancelCancel  = () => setShowCancelModal(false);

  // zatvara success-modal i ide nazad
  const handleModalClose    = () => {
    setShowSuccessModal(false);
    navigate('/AdminDoktori');
  };

  const availableUstanove = ustanove.filter(u => !formData.listaUstanova.includes(u.id_ust));
  return (
    <div className="dodaj-doktora-page background">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Back Button */}
            <button 
              className="btn btn-link mb-3 back-button"
              onClick={handleCancel}
            >
              ← Nazad
            </button>
            
            {/* Main Card */}
            <div className="card main-card compact">
              <div className="card-header text-center">
                <h3 className="card-title mb-1">Novi ljekar</h3>
                <p className="card-subtitle">Unesite podatke o novom ljekaru</p>
              </div>
              
              <div className="card-body">
                <div className="row g-3">
                  {/* Lični podaci */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact">
                      <div className="section-header compact">
                        <span className="section-number compact">1</span>
                        <h6>Lični podaci</h6>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">IME I PREZIME</label>
                         <input
                          name="imeIPrezime"
                          type="text"
                          className={`form-control compact ${errors.imeIPrezime ? 'is-invalid' : ''}`}
                          placeholder="Unesite ime i prezime"
                          value={formData.imeIPrezime}
                           onBeforeInput={handleBeforeInput}
                          onChange={e => handleInputChange('imeIPrezime', e.target.value)}
                        />
                        {errors.imeIPrezime && <div className="invalid-feedback">{errors.imeIPrezime}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">BROJ LICENCE</label>
                        <input
                        name="brojLicence"
                          type="text"
                          className={`form-control compact ${errors.brojLicence ? 'is-invalid' : ''}`}
                          placeholder="Unesite broj licence"
                          value={formData.brojLicence}
                          onBeforeInput={handleBeforeInput}
                          onChange={e => handleInputChange('brojLicence', e.target.value)}
                        />
                        {errors.brojLicence && <div className="invalid-feedback">{errors.brojLicence}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">SPECIJALIZACIJA</label>
                        <input
                          name="specijalizacija"
                          type="text"
                          className={`form-control compact ${errors.specijalizacija ? 'is-invalid' : ''}`}
                          placeholder="Unesite specijalizaciju"
                          value={formData.specijalizacija}
                          onBeforeInput={handleBeforeInput}
                          onChange={e => handleInputChange('specijalizacija', e.target.value)}
                        />
                        {errors.specijalizacija && <div className="invalid-feedback">{errors.specijalizacija}</div>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Ustanove */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact">
                      <div className="section-header compact">
                        <span className="section-number compact">2</span>
                        <h6>Ustanove</h6>
                      </div>
                      
                      <label className="form-label compact required">DODAJ USTANOVE</label>
                      
                       <div className="dropdown-container w-100">
                        <button
                          type="button"
                          className="btn dropdown-button w-100"
                          onClick={() => {
                            if (!dropdownOpen && errors.listaUstanova) {
                               setErrors(prev => ({ ...prev, listaUstanova: '' }));
                                }
                             setDropdownOpen(!dropdownOpen);
                              }}
                        >
                          <span>{availableUstanove.length > 0 ? 'Izaberite ustanovu...' : 'Sve ustanove su dodate'}</span>
                          <span className="dropdown-plus">+</span>
                        </button>
                        {dropdownOpen && availableUstanove.length > 0 && (
                          <div className="dropdown-menu-custom">
                            {availableUstanove.map(u => (
                              <button
                                key={u.id_ust}
                                type="button"
                                className="dropdown-item-custom"
                                onClick={() => handleUstanovaAdd(u.id_ust)}
                              >
                                {u.naziv_ustanove}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {formData.listaUstanova.length > 0 && (
                        <div className="selected-ustanove">
                          {formData.listaUstanova.map(id => {
                            const u = ustanove.find(x => x.id_ust === id);
                            return (
                              <div key={id} className="selected-item">
                                <span>{u ? u.naziv_ustanove : id}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm remove-button"
                                  onClick={() => handleUstanovaRemove(id)}
                                >
                                    <span className="remove-icon">&times;</span>     
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {errors.listaUstanova && <div className="text-danger small mt-1">{errors.listaUstanova}</div>}
                    </div>
                  </div>
                  
                  {/* Kontakt informacije */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact contact-section">
                      <div className="section-header compact">
                        <span className="section-number compact">3</span>
                        <h6>Kontakt informacije</h6>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">BROJ TELEFONA</label>
                        <div className="phone-input-wrapper">
                           <PhoneInput
                            country="me"
                            value={formData.brojTelefona}
                            onChange={value => handleInputChange('brojTelefona', value)}
                             masks={{ me: '.. ... ...' }}
                            inputClass={`phone-input-field ${errors.brojTelefona ? 'is-invalid' : ''}`}
                            buttonClass="phone-button"
                            containerClass="phone-container"
                          />
                        </div>
                        {errors.brojTelefona && <div className="text-danger small mt-1">{errors.brojTelefona}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">EMAIL ADRESA</label>
                         <input
                          name="emailAdresa"
                          type="email"
                          className={`form-control compact ${errors.emailAdresa ? 'is-invalid' : ''}`}
                          placeholder="Email adresa"
                          value={formData.emailAdresa}
                          onBeforeInput={handleBeforeInput}
                          onChange={e => handleInputChange('emailAdresa', e.target.value)}
                        />
                        {errors.emailAdresa && <div className="invalid-feedback">{errors.emailAdresa}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact">ADRESA</label>
                        <input
                          name="adresa"
                          type="text"
                          className={`form-control compact ${errors.adresa ? 'is-invalid' : ''}`}
                          placeholder="Adresa"
                          value={formData.adresa}
                          onBeforeInput={handleBeforeInput}
                          onChange={e => handleInputChange('adresa', e.target.value)}
                        />
                        {errors.adresa && <div className="invalid-feedback">{errors.adresa}</div>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Pristupni podaci */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact">
                      <div className="section-header compact">
                        <span className="section-number compact">4</span>
                        <h6>Pristupni podaci</h6>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact">KORISNIČKO IME</label>
                        <input type="text" className="form-control compact" value={formData.username} disabled />
                      </div>
                    <div className="form-text success-text compact">
                         <p className="font-semibold mb-1">✓ Lozinka mora sadržati:</p>
                         <ul className="list-disc list-inside space-y-1">
                         <li>Najmanje 8 karaktera</li>
                         <li>Jedno veliko slovo</li>
                         <li>Jedno malo slovo</li>
                         <li>Jedan broj</li>
                         <li>Jedan specijalni znak ( . ili +)</li>
                       </ul>
                      </div>
                       <div className="mb-3">
      <label htmlFor="password" className="form-label compact required">
        LOZINKA
      </label>
       <div className="input-wrapper">
      <input
      name="password"
        id="password"
        type="text"
        className={`form-control compact ${
          touched ? (isValid ? 'is-valid' : 'is-invalid') : ''
        }`}
        value={password}
        onBeforeInput={handleBeforeInput}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="passwordHelp"
         placeholder="Unesite lozinku"
      />
       {errors.password && (
    <div className="text-danger small mt-1">
      {errors.password}
    </div>
    )}
    
      {touched && !isValid && (
        <div id="passwordHelp" className="invalid-feedback">
             Lozinka ne ispunjava sve tražene kriterijume.
  </div>
      )}
    </div>
    </div>
  

                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Buttons */}
              <div className="card-footer text-center compact">
                <button className="btn btn-success compact me-3" onClick={handleSacuvaj}>
                  ✓ Sačuvaj ljekara
                </button>
                <button className="btn btn-secondary compact" onClick={handleCancel}>
                  ✕ Otkaži
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">✓ Uspešno sačuvano</h5>
                </div>
                <div className="modal-body text-center">
                  <p className="mb-3">Ljekar je uspešno dodat u sistem!</p>
                  <div className="saved-info">
                    <p><strong>Doktor:</strong> {savedDoctor?.imeIPrezime}</p>
                    <p><strong>Username:</strong> {savedDoctor?.username}</p>
                    <p><strong>Password:</strong> {password}</p>
                  </div>
                </div>
                <div className="modal-footer justify-content-center">
                  <button type="button" className="btn btn-success" onClick={handleModalClose}>
                    U redu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
      
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">⚠️ Potvrda otkazivanja</h5>
                </div>
                <div className="modal-body text-center">
                  <p className="mb-3">Da li ste sigurni da želite da otkažete?</p>
                  <p className="text-muted small">Svi uneseni podaci će biti izgubljeni.</p>
                </div>
                <div className="modal-footer justify-content-center">
                  <button 
                    type="button" 
                    className="btn btn-danger me-2 compact" 
                    onClick={handleCancelConfirm}
                  >
                    Da
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary compact" 
                    onClick={handleCancelCancel}
                  >
                    Ne
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
};

export default DodajDoktora;