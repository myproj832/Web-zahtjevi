import "./Dashboard.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import logoSpecija from "../../assets/logoSpecija0.png";
import LoginModal from "../../components/LoginModal";
import { useState, useRef } from "react";

const cards = [
  {
    title: "Pravljenje lijekova",
    icon: "💊",
    desc: "Pripremamo lijekove prema vašim receptima i potrebama.Pripremamo lijekove prema vašim receptima i potrebama.Pripremamo lijekove prema vašim receptima i potrebama.",
  },
  {
    title: "Recepti od doktora",
    icon: "🩺",
    desc: "Recepti direktno od vaših doktora, brzo i pouzdano.Recepti direktno od vaših doktora, brzo i pouzdanoRecepti direktno od vaših doktora, brzo i pouzdano.",
  },
  {
    title: "SMS obavijest",
    icon: "📲",
    desc: "Obavijestit ćemo vas kada je lijek spreman za preuzimanje.Obavijestit ćemo vas kada je lijek spreman za preuzimanje.",
  },
  {
    title: "Ostale zdravstvene ustanove",
    icon: "🏥",
    desc: "Povezani smo s drugim zdravstvenim ustanovama.Povezani smo s drugim zdravstvenim ustanovama.Povezani smo s drugim zdravstvenim ustanovama.",
  },
];

function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
const dashboardRef = useRef();
  return (
    <div className="dashboard-wrapper" ref={dashboardRef}>
      {/* Header */}
      <header className=" header py-4 text-white d-flex flex-column flex-md-row align-items-center justify-content-between">
        <Container className="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <img
            src={logoSpecija}
            alt="Apoteka logo"
            className="logo mb-3 mb-md-0"
            style={{ transform: 'scale(0.7)' }}
          />
          <Button
            type="button"
            onClick={() => setShowLogin(true)}
            className="loginButton me-4 mb-3 text-nowrap"
          >
            Prijavi se
          </Button>
        </Container>
      </header>
      {/* Card Grid */}
      <Container  className="Dashboard__cards py-5">
        <Row xs={1} sm={2} md={2} lg={2} className="g-4">
          {cards.map((c, idx) => (
            <Col key={idx}>
              <Card
                className="Dashboard__card h-100 p-5"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(37, 37, 37, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "var(--box-shadow)";
                }}
                onClick={() => setShowLogin(true)}
              >
                <div className="d-flex align-items-center mb-3">
                  <span className="card-icon me-3">{c.icon}</span>
                  <Card.Title className="mb-0 ">{c.title}</Card.Title>
                </div>
                <Card.Text className="text-muted">{c.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} container={dashboardRef.current} />
    </div>
  );
}

export default Dashboard;
