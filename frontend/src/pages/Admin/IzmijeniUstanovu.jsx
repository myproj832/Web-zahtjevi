import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ValidationContext } from '../../context/ValidationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './IzmijeniUstanovu.css';

import { useDataContext } from '../../context/DataContext';
import { useAdmin } from '../../context/AdminContext.jsx';

const IzmijeniUstanovu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
   const { gradovi } = useDataContext();
  const {
    komitenti,
    ustanove,
    fetchKomitenti,
    fetchUstanove,
    updateUstanova
  } = useAdmin();
  const allowedSigns = useContext(ValidationContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [savedUstanova, setSavedUstanova] = useState(null);
  
  const [formData, setFormData] = useState({
    nazivUstanove: '',
    nazivPoslovneJedinice: '',
    adresaPoslovneJedinice: '',
    komitent: '',
    brojTelefonaPoslovnice: '',
    imeKontaktOsobe: '',
    prezimeKontaktOsobe: '',
    telefonKontaktOsobe: '',
    napomena: ''
  });

  const [errors, setErrors] = useState({});
  // const [selectedDoktori, setSelectedDoktori] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

   // Učitaj liste samo jednom
  useEffect(() => {
    if (komitenti.length === 0) fetchKomitenti().catch(console.error);
    if (ustanove.length === 0) fetchUstanove().catch(console.error);
  }, []);

  // Kada ustanove budu učitane, popuni formu sa podacima izabranog id
  useEffect(() => {
    if (!ustanove.length) return;
    const ust = ustanove.find(u => u.id_ust.toString() === id);
    if (!ust) return;

    // Kontakt osobu razdvojimo na ime i prezime (prva razmak)
    const raw = (ust.kontakt_osoba || '').trim();
    const parts = raw.split(' ');
    const ime = parts[0] || '';
    const prezime = parts.slice(1).join(' ') || '';
       setFormData({
      nazivUstanove: ust.naziv_pravnog || '',
      nazivPoslovneJedinice: ust.naziv_ustanove || '',
      adresaPoslovneJedinice: ust.adresa_ustanove || '',
      komitent: ust.id_kom?.toString() || '',
      grad: ust.grad_ustanove || '',
      brojTelefonaPoslovnice: ust.tel_ustanove || '',
      imeKontaktOsobe: ime,
      prezimeKontaktOsobe: prezime,
      napomena: ust.napomena || ''
    });
  }, [ustanove, id]);


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

  // const handleDoktorAdd = (doktor) => {
  //   if (!selectedDoktori.includes(doktor)) {
  //     setSelectedDoktori(prev => [...prev, doktor]);
  //   }
  //   setDropdownOpen(false);
  // };

  // const handleDoktorRemove = (doktor) => {
  //   setSelectedDoktori(prev => prev.filter(d => d !== doktor));
  // };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nazivUstanove.trim()) {
      newErrors.nazivUstanove = 'Naziv pravnog lica je obavezan';
    }
    
    if (!formData.nazivPoslovneJedinice.trim()) {
      newErrors.nazivPoslovneJedinice = 'Naziv poslovne jedinice (Ustanove) je obavezan';
    }
    
    if (!formData.adresaPoslovneJedinice.trim()) {
      newErrors.adresaPoslovneJedinice = 'Adresa poslovne jedinice (Ustanove) je obavezna';
    }
    
    // if (!formData.komitent.trim()) {
    //   newErrors.komitent = 'Komitent je obavezan';
    // }
    
    // if (!formData.brojTelefonaPoslovnice.trim()) {
    //   newErrors.brojTelefonaPoslovnice = 'Broj telefona poslovnice je obavezan';
    // }
    
    // if (!formData.imeKontaktOsobe.trim()) {
    //   newErrors.imeKontaktOsobe = 'Ime kontakt osobe je obavezno';
    // }
    
    // if (!formData.prezimeKontaktOsobe.trim()) {
    //   newErrors.prezimeKontaktOsobe = 'Prezime kontakt osobe je obavezno';
    // }
    
    // if (!formData.telefonKontaktOsobe.trim()) {
    //   newErrors.telefonKontaktOsobe = 'Telefon kontakt osobe je obavezan';
    // }
    
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

   const handleSacuvaj = async () => {
    if (!validateForm()) return;

    const payload = {
      id: Number(id),
      nazivPravnog: formData.nazivUstanove,
      nazivUstanove: formData.nazivPoslovneJedinice,
      adresaUstanove: formData.adresaPoslovneJedinice,
      gradUstanove: formData.grad,
      telUstanove: formData.brojTelefonaPoslovnice,
      kontaktOsoba: `${formData.imeKontaktOsobe} ${formData.prezimeKontaktOsobe}`.trim(),
      idKom: formData.komitent,
      napomena: formData.napomena
    };

    try {
      await updateUstanova(payload);
      setSavedUstanova({ ...formData });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Greška pri izmjeni ustanove:', err);
      // po potrebi možeš prikazati toast ili inline error
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
    navigate('/AdminUstanove');
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    // Stay on current page - do nothing else
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/AdminUstanove');
  };

  // const availableDoktori = dostupniDoktori.filter(doktor => !selectedDoktori.includes(doktor));

  return (
    <div className="izmijeni-ustanovu-page background">
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
                <h3 className="card-title mb-1">Izmijeni Ustanovu</h3>
                <p className="card-subtitle">Uredite podatke o zdravstvenoj ustanovi</p>
              </div>
              
              <div className="card-body">
                <div className="row g-3">
                  {/* Osnovni podaci */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact">
                      <div className="section-header compact">
                        <span className="section-number compact">1</span>
                        <h6>Osnovni podaci</h6>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">NAZIV PRAVNOG LICA</label>
                        <input
                        name="nazivUstanove"
                          type="text"
                          className={`form-control compact ${errors.nazivUstanove ? 'is-invalid' : ''}`}
                          placeholder="Unesite naziv ustanove"
                          value={formData.nazivUstanove}
                          onChange={(e) => handleInputChange('nazivUstanove', e.target.value)}
                          onBeforeInput={handleBeforeInput}
                        />
                        {errors.nazivUstanove && <div className="invalid-feedback">{errors.nazivUstanove}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">NAZIV POSLOVNE JEDINICE (USTANOVE)</label>
                        <input
                          name="nazivPoslovneJedinice"
                          type="text"
                          className={`form-control compact ${errors.nazivPoslovneJedinice ? 'is-invalid' : ''}`}
                          placeholder="Unesite naziv poslovne jedinice"
                          value={formData.nazivPoslovneJedinice}
                          onChange={(e) => handleInputChange('nazivPoslovneJedinice', e.target.value)}
                          onBeforeInput={handleBeforeInput}
                        />
                        {errors.nazivPoslovneJedinice && <div className="invalid-feedback">{errors.nazivPoslovneJedinice}</div>}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact required">ADRESA POSLOVNE JEDINICE (USTANOVE)</label>
                        <input
                          name="adresaPoslovneJedinice"
                          type="text"
                          className={`form-control compact ${errors.adresaPoslovneJedinice ? 'is-invalid' : ''}`}
                          placeholder="Unesite adresu poslovne jedinice"
                          value={formData.adresaPoslovneJedinice}
                          onChange={(e) => handleInputChange('adresaPoslovneJedinice', e.target.value)}
                          onBeforeInput={handleBeforeInput}
                        />
                        {errors.adresaPoslovneJedinice && <div className="invalid-feedback">{errors.adresaPoslovneJedinice}</div>}
                      </div>
                               <div className="mb-3">
                               <label className="form-label compact required">GRAD POSLOVNE JEDINICE (USTANOVE)</label>
                               <select
                               className={`form-select compact ${errors.grad ? 'is-invalid' : ''}`}
                               value={formData.grad}
                               onChange={e => handleInputChange('grad', e.target.value)}
                                >
                           <option value="">Izaberite grad...</option>
                           {gradovi.map(grad => (
                         <option key={grad.code} value={grad.code}>
                           {grad.name}
                           </option>
                             ))}
                             </select>
                         {errors.grad && <div className="invalid-feedback">{errors.grad}</div>}
                         </div>

                      <div className="mb-3">
                        <label className="form-label compact">BROJ TELEFONA POSLOVNE JEDINICE (USTANOVE)</label>
                        <div className="phone-input-wrapper">
                          <PhoneInput
                            country={'me'}
                            value={formData.brojTelefonaPoslovnice}
                            onChange={(value) => handleInputChange('brojTelefonaPoslovnice', value)}
                              masks={{ me: '.. ... ...' }}
                            inputClass={`phone-input-field ${errors.brojTelefonaPoslovnice ? 'is-invalid' : ''}`}
                            buttonClass="phone-button"
                            containerClass="phone-container"
                          />
                        </div>
                        {errors.brojTelefonaPoslovnice && <div className="text-danger small mt-1">{errors.brojTelefonaPoslovnice}</div>}
                      </div>
                       <div className="mb-3">
                        <label className="form-label compact">KOMITENT</label>
                        <select
                          className={`form-select compact ${errors.komitent ? 'is-invalid' : ''}`}
                          value={formData.komitent}
                          onChange={e => handleInputChange('komitent', e.target.value)}
                        >
                          <option value="">Izaberite komitenta...</option>
                          {komitenti.map(k => (
                            <option key={k.id_kom} value={k.id_kom}>
                              {k.naziv_kom}
                            </option>
                          ))}
                        </select>
                        {errors.komitent && <div className="invalid-feedback">{errors.komitent}</div>}
                      </div>
                      
                    </div>
                  </div>
                  
                  {/* Lista doktora */}
                  <div className="col-12 col-md-6">
                    <div className="form-section compact">
                      <div className="section-header compact">
                        <span className="section-number compact">2</span>
                        <h6>Lista doktora</h6>
                      </div>
                      
                      <label className="form-label compact">DODAJ DOKTORA</label>
                      
                      <div className="dropdown-container disabled w-100"  data-tooltip="Ova akcija trenutno nije dostupna">
                        <button
                          type="button"
                          className="btn dropdown-button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                           disabled
                        >
                          {/* <span>{availableDoktori.length > 0 ? 'Izaberite doktora...' : 'Svi doktori su dodati'}</span> */}
                          <span className="dropdown-plus">+</span>
                        </button>
                        
                        {/* {dropdownOpen && availableDoktori.length > 0 && (
                          <div className="dropdown-menu-custom">
                            {availableDoktori.map((doktor, index) => (
                              <button
                                key={index}
                                type="button"
                                className="dropdown-item-custom"
                                onClick={() => handleDoktorAdd(doktor)}
                              >
                                {doktor}
                              </button>
                            ))}
                          </div>
                        )} */}
                      </div>
                      
                      {/* Selected doktori */}
                      {/* {selectedDoktori.length > 0 && (
                        <div className="selected-doktori">
                          {selectedDoktori.map((doktor, index) => (
                            <div key={index} className="selected-item">
                              <span>{doktor}</span>
                              <button
                                type="button"
                                className="btn btn-sm remove-button"
                                onClick={() => handleDoktorRemove(doktor)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )} */}
                      
                      <p className="form-text success-text compact">✓ Dodeljeni doktori iz liste</p>
                    </div>
                  </div>
                  
                  {/* Kontakt osoba */}
                  <div className="col-12">
                    <div className="form-section compact contact-section">
                      <div className="section-header compact">
                        <span className="section-number compact">3</span>
                        <h6>Kontakt osoba</h6>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label compact">IME</label>
                          <input
                            name="imeKontaktOsobe"
                            type="text"
                            className={`form-control compact ${errors.imeKontaktOsobe ? 'is-invalid' : ''}`}
                            placeholder="Ime kontakt osobe"
                            value={formData.imeKontaktOsobe}
                            onChange={(e) => handleInputChange('imeKontaktOsobe', e.target.value)}
                            onBeforeInput={handleBeforeInput}
                          />
                          {errors.imeKontaktOsobe && <div className="invalid-feedback">{errors.imeKontaktOsobe}</div>}
                        </div>
                        
                        <div className="col-12 col-md-6">
                          <label className="form-label compact">PREZIME</label>
                          <input
                            name="prezimeKontaktOsobe"
                            type="text"
                            className={`form-control compact ${errors.prezimeKontaktOsobe ? 'is-invalid' : ''}`}
                            placeholder="Prezime kontakt osobe"
                            value={formData.prezimeKontaktOsobe}
                            onChange={(e) => handleInputChange('prezimeKontaktOsobe', e.target.value)}
                            onBeforeInput={handleBeforeInput}
                          />
                          {errors.prezimeKontaktOsobe && <div className="invalid-feedback">{errors.prezimeKontaktOsobe}</div>}
                        </div>
                        
                        {/* <div className="col-12 col-md-4">
                          <label className="form-label compact required">TELEFON</label>
                          <div className="phone-input-wrapper">
                            <PhoneInput
                              country={'me'}
                              value={formData.telefonKontaktOsobe}
                              onChange={(value) => handleInputChange('telefonKontaktOsobe', value)}
                              inputClass={`phone-input-field ${errors.telefonKontaktOsobe ? 'is-invalid' : ''}`}
                              buttonClass="phone-button"
                              containerClass="phone-container"
                            />
                          </div>
                          {errors.telefonKontaktOsobe && <div className="text-danger small mt-1">{errors.telefonKontaktOsobe}</div>}
                        </div> */}
                      </div>
                    </div>
                  </div>
                  
                  {/* Napomena */}
                  <div className="col-12">
                    <div className="form-section compact napomena-section">
                      <div className="section-header compact">
                        <span className="section-number compact">4</span>
                        <h6>Napomena</h6>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label compact">DODATNE INFORMACIJE</label>
                        <textarea
                          name="napomena"
                          className="form-control compact"
                          rows="4"
                          placeholder="Unesite napomenu..."
                          value={formData.napomena}
                          onChange={(e) => handleInputChange('napomena', e.target.value)}
                          onBeforeInput={handleBeforeInput}
                        />{errors.napomena && (
                        <div className="invalid-feedback d-block mt-1">
                        {errors.napomena}
                        </div>
                         )}
                      </div>
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
                  <p className="mb-3">Podaci ustanove su uspešno ažurirani!</p>
                  <div className="saved-info">
                    <p><strong>Ustanova:</strong> {savedUstanova?.nazivUstanove}</p>
                    <p><strong>Sa poslovnom jedinicom:</strong> {savedUstanova?.nazivPoslovneJedinice}</p>
                    <p><strong>Broj telefona:</strong> {savedUstanova?.brojTelefonaPoslovnice}</p>
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

export default IzmijeniUstanovu;