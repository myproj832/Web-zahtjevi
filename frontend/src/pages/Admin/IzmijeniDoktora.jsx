import { useState, useEffect, useContext } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ValidationContext } from '../../context/ValidationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './IzmijeniDoktora.css';

const IzmijeniDoktora = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchLjekari, updateLjekar, ustanove } = useAdmin(); 
  const allowedSigns = useContext(ValidationContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [savedDoctor, setSavedDoctor] = useState(null);
  const [originalEmail, setOriginalEmail] = useState('');
  
  const [formData, setFormData] = useState({
    imeIPrezime: '',
    brojLicence: '',
    specijalizacija: '',
    brojTelefona: '',
    emailAdresa: '',
    adresa: '',
    napomena: '',
    ustanove: [],
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedUstanove, setSelectedUstanove] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);


  // Dostupne ustanove iz Contexta
 const dostupneUstanove = ustanove; 
  // Load existing doctor data on component mount
  useEffect(() => {
   fetchLjekari()
   .then(list => {
    const d = list.find(x => x.id_kor === id);
    if (!d) return;
     setFormData({
          imeIPrezime: d.ime,
          brojLicence: d.licenca,
          specijalizacija: d.specijalizacija,
         brojTelefona: d.telefon,
          emailAdresa: d.email,
          adresa: d.adresa || '',           // ako nema, ostaje prazno
          napomena: '',
          ustanove: d.ustanove.map(u => u.id_ust),
          username: d.kor_ime,
          password: ''           // korisnik sam unosi ili regeneriše
        });
        setSelectedUstanove(d.ustanove.map(u => u.id_ustanove));
        setOriginalEmail(d.email);
      })
      .catch(console.error);
   }, [id]);

 const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.+]).{8,}$/;

  const isValid = passwordRegex.test(password);

  // 2) handleChange i handleBlur
  const handleChange = (e) => {
    setPassword(e.target.value);
    // ... eventualno briši errors.password ako ga imaš ...
  };
  const handleBlur = () => {
    setTouched(true);
  };

  // Generate password (5 letters + 3 numbers = 8 characters)
  const generatePassword = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    
    let password = '';
    
    // Add 5 random letters
    for (let i = 0; i < 5; i++) {
      password += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Add 3 random numbers
    for (let i = 0; i < 3; i++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Update username only when email changes
  useEffect(() => {
    if (formData.emailAdresa !== originalEmail) {
      setFormData(prev => ({
        ...prev,
        username: prev.emailAdresa
      }));
    }
  }, [formData.emailAdresa, originalEmail]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUstanovaAdd = (ustanova) => {
    if (!selectedUstanove.includes(ustanova)) {
      setSelectedUstanove(prev => [...prev, ustanova]);
    }
    setDropdownOpen(false);
  };

  const handleUstanovaRemove = (ustanova) => {
    setSelectedUstanove(prev => prev.filter(u => u !== ustanova));
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.imeIPrezime.trim()) {
      newErrors.imeIPrezime = 'Ime i prezime je obavezno';
    }
    
    if (!formData.brojLicence.trim()) {
      newErrors.brojLicence = 'Broj licence je obavezan';
    }
    
    if (!formData.specijalizacija.trim()) {
      newErrors.specijalizacija = 'Specijalizacija je obavezna';
    }
    
    if (!formData.brojTelefona.trim()) {
      newErrors.brojTelefona = 'Broj telefona je obavezan';
    }
    
    if (!formData.emailAdresa.trim()) {
      newErrors.emailAdresa = 'Email adresa je obavezna';
    } else if (!validateEmail(formData.emailAdresa)) {
      newErrors.emailAdresa = 'Email adresa nije u ispravnom formatu';
    }
    
    // if (!formData.adresa.trim()) {
    //   newErrors.adresa = 'Adresa je obavezna';
    // }
    
    if (selectedUstanove.length === 0) {
      newErrors.ustanove = 'Morate odabrati najmanje jednu ustanovu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // 2. generički handler za validaciju dozvoljenih karaktera
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

    const handleSacuvaj = async () => {                                       // + sada zovemo updateLjekar
    if (!validateForm()) return;
    try {
      await updateLjekar({
        idKor: id,
        imeIPrezime: formData.imeIPrezime,
        licenca: formData.brojLicence,
        specijalizacija: formData.specijalizacija,
        tel: formData.brojTelefona,
        email: formData.emailAdresa,
        adresa: formData.adresa,
        username: formData.username,
        password: formData.password,
        listaUstanova: selectedUstanove
      });
      setSavedDoctor({ ...formData });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert('Greška pri ažuriranju: ' + err.message);
    }
  };
  const handleBackClick = () => {
    setShowCancelModal(true);
  };

  const handleOtkazi = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate('/AdminDoktori');
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    // Stay on current page - do nothing else
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/AdminDoktori');
  };

  const availableUstanove = ustanove.filter(u => !selectedUstanove.includes(u.id_ust));

  return (
    <div className="izmijeni-doktora-page background">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Back Button */}
            <button 
              className="btn btn-link mb-3 back-button"
              onClick={handleBackClick}
            >
              ← Nazad
            </button>
            
            {/* Main Card */}
            <div className="card main-card compact">
              <div className="card-header text-center">
                <h3 className="card-title mb-1">Izmijeni ljekara</h3>
                <p className="card-subtitle">Uredite podatke o ljekaru u sistemu</p>
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
                          onChange={(e) => handleInputChange('imeIPrezime', e.target.value)}
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
                          onChange={(e) => handleInputChange('brojLicence', e.target.value)}
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
                          onChange={(e) => handleInputChange('specijalizacija', e.target.value)}
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
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          <span>{availableUstanove.length > 0 ? 'Izaberite ustanovu...' : 'Sve ustanove su dodate'}</span>
                          <span className="dropdown-plus">+</span>
                        </button>
                        
                        {dropdownOpen &&  availableUstanove.length > 0 && (
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
                      
                      {/* Selected ustanove */}
                      {selectedUstanove.length > 0 && (
                         <div className="selected-ustanove">
                    {selectedUstanove.map(id_ust => {
                     // пронађи објекат установе
                    const ust = ustanove.find(u => u.id_ust === id_ust);
                    return (
                   <div key={id_ust} className="selected-item">
                  {/* Ако није пронађена, прикажи само #id */}
                  <span>{ust?.naziv_ustanove || `#${id_ust}`}</span>
                              <button
                                type="button"
                                className="btn btn-sm remove-button"
                                onClick={() => handleUstanovaRemove(id_ust)}
                              >
                               <span className="remove-icon">&times;</span> 
                              </button>
                            </div>
                           );
                          })}
                      </div>
                      )}
                      
                      {errors.ustanove && <div className="text-danger small mt-1">{errors.ustanove}</div>}
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
                            country={'me'}
                            value={formData.brojTelefona}
                            onChange={(value) => handleInputChange('brojTelefona', value)}
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
                          onChange={(e) => handleInputChange('emailAdresa', e.target.value)}
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
                          onChange={(e) => handleInputChange('adresa', e.target.value)}
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
                      
                      <p className="form-text success-text compact">
                        {formData.emailAdresa === originalEmail 
                          ? "✓ Username ostaje isti osim ako se email ne promijeni" 
                          : "✓ Username ažuriran na osnovu novog email-a"
                        }
                      </p>
                      
                      <div className="mb-3">
                        <label className="form-label compact">KORISNIČKO IME</label>
                        <input
                          type="text"
                          className="form-control compact"
                          value={formData.username}
                          disabled
                        />
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
                        <label className="form-label compact">LOZINKA</label>
                        <div className="password-input-group">
                          <input
                            name="password"
                            type="text"
                             className={`form-control compact ${
                              touched ? (isValid ? 'is-valid' : 'is-invalid') : ''
                            }`}
                            value={password}
                            onBeforeInput={handleBeforeInput}
                            onChange={handleChange}
                             onBlur={handleBlur}
                              placeholder="Unesite lozinku"
                          />
                           
                          {/* <button 
                            type="button" 
                            className="btn btn-outline-primary btn-sm regenerate-btn compact"
                            onClick={handleRegeneratePassword}
                            title="Generiši novu lozinku"
                          >
                            🔄
                          </button> */}
                          </div>
</div>
                          {errors.password && <div className="invalid-feedback d-block mt-1">{errors.password}</div>}

                           {touched && !isValid && (
        <div id="passwordHelp" className="invalid-feedback d-block mt-1">
          Lozinka ne ispunjava sve tražene kriterijume.
  </div>
      )}
                        
                      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Buttons */}
              <div className="card-footer text-center compact">
                <button className="btn btn-success compact me-3" onClick={handleSacuvaj}>
                  ✓ Sačuvaj izmjene
                </button>
                <button className="btn btn-secondary compact" onClick={handleOtkazi}>
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
                  <h5 className="modal-title">✓ Uspešno ažurirano</h5>
                </div>
                <div className="modal-body text-center">
                  <p className="mb-3">Podaci ljekara su uspešno ažurirani!</p>
                  <div className="saved-info">
                    <p><strong>Doktor:</strong> {savedDoctor?.imeIPrezime}</p>
                    <p><strong>Username:</strong> {savedDoctor?.username}</p>
                    <p><strong>Password:</strong> {savedDoctor?.password}</p>
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
                  <p className="mb-3">Da li ste sigurni da želite da otkažete izmjene?</p>
                  <p className="text-muted small">Sve nesačuvane promjene će biti izgubljene.</p>
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

export default IzmijeniDoktora;