import "./Dashboard.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import logoSpecija from "../../assets/logoSpecija0.png";
// laboratorijske slike
import lab1 from "../../assets/DSC_0052.jpg";
import lab2 from "../../assets/DSC_0138.jpg";
import lab3 from "../../assets/DSC_0071.jpg";
import lab4 from "../../assets/DSC_0055.jpg";
import lab5 from "../../assets/DSC_0092.jpg";
import lab6 from "../../assets/DSC_0146.jpg";
import lab7 from "../../assets/DSC_0070-2.jpg";
import lab8 from "../../assets/DSC_0062.jpg";
// dodatne slike za kartice (dodajte ove u assets folder)
import cardBg1 from "../../assets/DSC_0073.jpg"; // dodajte ovu sliku
import cardBg2 from "../../assets/DSC_0133.jpg"; // dodajte ovu sliku
import cardBg3 from "../../assets/DSC_0137.jpg"; // dodajte ovu sliku
import cardBg4 from "../../assets/DSC_0078.jpg"; // dodajte ovu sliku
import cardBg5 from "../../assets/DSC_0104.jpg"; // dodajte ovu sliku
import cardBg6 from "../../assets/DSC_0058.jpg"; // dodajte ovu sliku
import cardBg7 from "../../assets/DSC_0067.jpg"; // dodajte ovu sliku
import cardBg8 from "../../assets/DSC_0082-2.jpg"; // dodajte ovu sliku
import cardBg9 from "../../assets/DSC_0067.jpg"; // dodajte ovu sliku
import LoginModal from "../../components/LoginModal";
import { useState, useRef, useEffect } from "react";

function Dashboard({ openLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCardBgIndex, setCurrentCardBgIndex] = useState(0);
  const dashboardRef = useRef();

  const labImages = [lab1, lab2, lab3, lab4, lab5, lab6, lab7,lab8];
  const cardBgImages = [cardBg4, cardBg5, cardBg6, cardBg7, cardBg8];

  // automatsko mijenjanje slika u pozadini
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === labImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [labImages.length]);

  // automatsko mijenjanje pozadinskih slika za kartice
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardBgIndex((prev) =>
        prev === cardBgImages.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [cardBgImages.length]);

  const qualityStandards = [
    { icon: "🏆", title: "ISO 9001", desc: "Sertifikovani sistem upravljanja kvalitetom" },
    { icon: "✅", title: "Kontrola kvaliteta", desc: "Svaki proizvod prolazi rigorozne testove" },
    { icon: "🛡️", title: "Sigurnost", desc: "Striktni protokoli sigurnosti i sterilnosti" },
  ];

  const services = [
    {
      icon: "💊",
      title: "Magistralni lijekovi",
      description: "Individualno prilagođeni lijekovi prema receptu ljekara",
      features: ["Personalizovane doze", "Specijalni oblici", "Alergijske modifikacije"],
    },
    {
      icon: "⚗️",
      title: "Dermato-kozmetika",
      description: "Specijalizovani dermatološki preparati",
      features: ["Za problematičnu kožu", "Hipoalergijski", "Dermatološki testirani"],
    },
  ];

  return (
    <div className="dashboard-wrapper" ref={dashboardRef}>
      {/* ---------- HERO SEKTOR ---------- */}
      <section className="hero-section-animated">
        <div className="background-slideshow">
          {labImages.map((img, i) => (
            <div
              key={i}
              className={`slide ${i === currentImageIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <header className="hero-header">
          <div className="hero-header-container">
            <div className="hero-header-left">
              <img src={logoSpecija} alt="Specija logo" className="logo-large" />
            </div>
            <div className="hero-header-right">
              <Button onClick={openLogin} className="hero-login-btn">
                Prijavi se
              </Button>
            </div>
          </div>
        </header>

        <div className="hero-content">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="hero-main-title">
                  COSMETICS SPECIJA
                  <span className="subtitle">Privatna zdravstvena ustanova</span>
                </h1>
                <p className="hero-description">
                  Najsavremenija laboratorija za izradu magistralnih lijekova u
                  Crnoj Gori. Koristimo najnoviju tehnologiju i pridržavamo se najviših
                  međunarodnih standarda kvaliteta.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Godina iskustva</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5000+</span>
                    <span className="stat-label">Zadovoljnih pacijenata</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Kontrola kvaliteta</span>
                  </div>
                </div>
                <Button size="lg" onClick={openLogin} className="hero-main-cta">
                  Kreiraj recept
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* ---------- GLAVNI SADRŽAJ ---------- */}
      <section className="main-content-section">
        {/* Pozadinske slike za kartice */}
        <div className="cards-background-slideshow">
          {cardBgImages.map((img, i) => (
            <div
              key={i}
              className={`cards-bg-slide ${i === currentCardBgIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="cards-bg-overlay" />
        </div>

        <Container>
          {/* --- USLUGE & STANDARDI --- */}
          <Row className="g-4">
            {/* USLUGE */}
            <Col lg={6}>
              <div className="content-card services-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">💊</span> Naše usluge
                  </h3>
                  <p className="card-subtitle">Kompletna farmaceutska rješenja</p>
                </div>
                <div className="card-body">
                  <Row className="g-3">
                    {services.map((s, idx) => (
                      <Col sm={6} key={idx}>
                        <div className="service-item">
                          <div className="service-icon-small">{s.icon}</div>
                          <div className="service-content">
                            <h5>{s.title}</h5>
                            <p>{s.description}</p>
                            <ul className="service-features-compact">
                              {s.features.slice(0, 2).map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>

            {/* STANDARDI */}
            <Col lg={6}>
              <div className="content-card quality-card-main">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">🏆</span> Standardi kvaliteta
                  </h3>
                  <p className="card-subtitle">Najviši međunarodni standardi</p>
                </div>
                <div className="card-body">
                  <Row className="g-3">
                    {qualityStandards.map((q, idx) => (
                      <Col sm={6} key={idx}>
                        <div className="quality-item">
                          <div className="quality-icon-small">{q.icon}</div>
                          <div className="quality-content">
                            <h5>{q.title}</h5>
                            <p>{q.desc}</p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* --- PROCES & TEHNOLOGIJA --- */}
          <Row className="g-4 mt-4">
            {/* PROCES */}
            <Col lg={6}>
              <div className="content-card process-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">⚗️</span> Naš proces rada
                  </h3>
                  <p className="card-subtitle">Od recepta do gotovog lijeka</p>
                </div>
                <div className="card-body">
                  <div className="process-steps-compact">
                    <div className="process-step-compact">
                      <div className="step-number-small">1</div>
                      <div className="step-content-small">
                        <h6>Prijem recepta</h6>
                        <p>Elektronski prijem i analiza</p>
                      </div>
                    </div>
                    <div className="process-step-compact">
                      <div className="step-number-small">2</div>
                      <div className="step-content-small">
                        <h6>Priprema sastojaka</h6>
                        <p>Precizno mjerenje komponenti</p>
                      </div>
                    </div>
                    <div className="process-step-compact">
                      <div className="step-number-small">3</div>
                      <div className="step-content-small">
                        <h6>Izrada</h6>
                        <p>Kontrolisana izrada</p>
                      </div>
                    </div>
                    <div className="process-step-compact">
                      <div className="step-number-small">4</div>
                      <div className="step-content-small">
                        <h6>Kontrola kvaliteta</h6>
                        <p>Finalna provjera i pakovanje</p>
                      </div>
                    </div>
                    <div className="process-step-compact">
                      <div className="step-number-small">5</div>
                      <div className="step-content-small">
                        <h6>Obavještenje pacijenta</h6>
                        <p>Slanje SMS poruka za preuzimanje lijeka</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* TEHNOLOGIJA */}
            <Col lg={6}>
              <div className="content-card technology-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">🔬</span> Naša tehnologija
                  </h3>
                  <p className="card-subtitle">Najsavremenija oprema</p>
                </div>
                <div className="card-body">
                  <div className="tech-image-slideshow mb-3">
                    <div className="tech-slide-container">
                      <img
                        src={lab1}
                        alt="Precizno mjerenje"
                        className={`tech-slide ${currentImageIndex % 2 === 0 ? "active" : ""}`}
                      />
                      <img
                        src={lab4}
                        alt="Moderna oprema"
                        className={`tech-slide ${currentImageIndex % 2 === 1 ? "active" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="tech-features-compact">
                    <div className="tech-feature-compact">
                      <i className="fas fa-microscope"></i>
                      <span>Analitička vaga visokih performansi</span>
                    </div>
                    <div className="tech-feature-compact">
                      <i className="fas fa-shield-alt"></i>
                      <span>Laminar flow komore</span>
                    </div>
                    <div className="tech-feature-compact">
                      <i className="fas fa-thermometer-half"></i>
                      <span>Kontrolisani temperaturni uslovi</span>
                    </div>
                    <div className="tech-feature-compact">
                      <i className="fas fa-cogs"></i>
                      <span>Automatizovani sistemi</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* --- STRUČNI TIM (full width) --- */}
          <Row className="g-4 mt-4">
            <Col lg={12}>
              <div className="content-card team-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">🎓</span> Naš stručni tim
                  </h3>
                <p className="card-subtitle">
  🔬 Specijalisti farmaceutske tehnologije • 
  🧪 Specijalizanti ispitivanja i kontrole kvaliteta lijekova • 
  👨‍🎓 Magistri farmacije • 
  💊 Farmaceutski tehničari 
</p>
                </div>
                <div className="card-body">
                  <div className="team-image-slideshow mb-3">
                    <div className="team-slide-container">
                      <img
                        src={cardBg1}
                        alt="Tim u laboratoriji"
                        className={`team-slide ${currentImageIndex % 3 === 0 ? "active" : ""}`}
                      />
                      <img
                        src={cardBg2}
                        alt="Rad u sigurnosnoj komori"
                        className={`team-slide ${currentImageIndex % 3 === 1 ? "active" : ""}`}
                      />
                      <img
                        src={cardBg3}
                        alt="Priprema kapsula"
                        className={`team-slide ${currentImageIndex % 3 === 2 ? "active" : ""}`}
                      />
                    </div>
                  </div>
                <div className="team-stats">
  <div className="team-stat">
    <div className="stat-icon">⚕️</div>
    <div className="stat-content">
      <h6>15+ godina iskustva</h6>
      <p>Dugogodišnje iskustvo u struci</p>
    </div>
  </div>
  <div className="team-stat">
    <div className="stat-icon">📚</div>
    <div className="stat-content">
      <h6>Kontinuirana edukacija</h6>
      <p>Redovno usavršavanje znanja</p>
    </div>
  </div>
  <div className="team-stat">
    <div className="stat-icon">🏆</div>
    <div className="stat-content">
      <h6>Sertifikati</h6>
      <p>Međunarodne farmaceutske licence</p>
    </div>
  </div>
</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

     {/* ---------- GALERIJA (proširena sa tri slike) ---------- */}
<section className="gallery-section-simple">
  <Container>
    <div className="text-center mb-4">
      <h4 className="mb-3">Pogled u našu laboratoriju</h4>
      <Row className="g-3">
        <Col md={4}>
          <div className="simple-gallery-item">
            <img
              src={lab6}
              alt="Miješanje komponenti"
              className="img-fluid rounded-3"
            />
            <div className="simple-overlay">
              <span>Precizno miješanje komponenti</span>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="simple-gallery-item">
            <img
              src={lab4}
              alt="Kontrola kvaliteta"
              className="img-fluid rounded-3"
            />
            <div className="simple-overlay">
              <span>Kontrola kvaliteta svakog proizvoda</span>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="simple-gallery-item">
            <img
              src={lab2}
              alt="Stručni tim u akciji"
              className="img-fluid rounded-3"
            />
            <div className="simple-overlay">
              <span>Stručni tim u akciji</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </Container>
</section>

      {/* ---------- FOOTER (full width) ---------- */}
      <footer className="enhanced-footer full-width-footer">
        <div className="footer-container">
          <div className="footer-main py-5">
            <div className="footer-row">
              <div className="footer-col footer-brand-col">
                <div className="footer-brand">
                  <img src={logoSpecija} alt="Specija logo" className="footer-logo mb-3" />
                  <h5 className="footer-company-name">COSMETICS SPECIJA</h5>
                  <p className="footer-company-subtitle">Privatna Zdravstvena Ustanova</p>
                  <p className="footer-description">
                    Najsavremenija laboratorija za izradu magistralnih lijekova 
                    u Crnoj Gori sa više od 15 godina iskustva.
                  </p>
                </div>
              </div>
              
              <div className="footer-col footer-services-col">
                <h6 className="footer-section-title">Naše usluge</h6>
                <ul className="footer-services-list">
                  <li><i className="fas fa-pills footer-list-icon"></i> Magistralni lijekovi</li>
                  <li><i className="fas fa-heartbeat footer-list-icon"></i> Dermato-kozmetika</li>
                </ul>
                
          
              </div>
              
              <div className="footer-col footer-contact-col">
                <h6 className="footer-section-title">Kontakt informacije</h6>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <i className="fas fa-map-marker-alt footer-icon"></i>
                    <div>
                      <strong>Adresa:</strong><br />
                      Vojvode Ilije Plamenca bb<br />
                      81000 Podgorica, Crna Gora
                    </div>
                  </div>
                  
                  <div className="footer-contact-item">
                    <i className="fas fa-phone footer-icon"></i>
                    <div>
                      <strong>Telefon:</strong><br />
                      <a href="tel:+382 69 317 719">+382 20 123 456</a>
                    </div>
                  </div>
                  
                  <div className="footer-contact-item">
                    <i className="fas fa-envelope footer-icon"></i>
                    <div>
                      <strong>Email:</strong><br />
                      <a href="mail:">cmlaboratory@mpm.co.me</a>
                    </div>
                  </div>
                  
                  <div className="footer-contact-item">
                    <i className="fas fa-clock footer-icon"></i>
                    <div>
                      <strong>Radno vrijeme:</strong><br />
                      Pon-Sub: 08:00-21:00<br />
                      Ned: Zatvoreno
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom py-3">
            <div className="footer-bottom-row">
              <div className="footer-bottom-left">
                <p className="footer-copyright mb-0">
                  &copy; 2025 <strong>COSMETICS SPECIJA</strong> - Sva prava zadržana.
                </p>
              </div>
              <div className="footer-bottom-right">
                <div className="footer-legal-links">
                  <a href="#" className="footer-link">Pravila privatnosti</a>
                  <span className="footer-divider">|</span>
                  <a href="#" className="footer-link">Uslovi korištenja</a>
                  <span className="footer-divider">|</span>
                  <a href="#" className="footer-link">GDPR</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        container={dashboardRef.current}
      />
    </div>
  );
}

export default Dashboard;