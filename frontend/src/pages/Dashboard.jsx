import "./Dashboard.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import WaveBackground from "../components/WaveBackground";
import logoSpecija from "../assets/logoSpecija3.png";

const cards = [
  {
    title: "Pravljenje lijekova",
    icon: "💊",
    desc: "Pripremamo lijekove prema vašim receptima i potrebama.",
  },
  {
    title: "Recepti od doktora",
    icon: "🩺",
    desc: "Recepti direktno od vaših doktora, brzo i pouzdano.",
  },
  {
    title: "SMS obavijest",
    icon: "📲",
    desc: "Obavijestit ćemo vas kada je lijek spreman za preuzimanje.",
  },
  {
    title: "Ostale zdravstvene ustanove",
    icon: "🏥",
    desc: "Povezani smo s drugim zdravstvenim ustanovama.",
  },
];

function Dashboard() {
  return (
    <div>
      {/* Header */}
      <header
        className="py-4 text-white d-flex flex-column flex-md-row align-items-center justify-content-between"
        style={{ background: "var(--gradient-dashboard)" }}
      >
        <Container className="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <img
            src={logoSpecija}
            alt="Apoteka logo"
            className="logo mb-3 mb-md-0"
          />
          {/* <h1 className="ms-3 mb-0">Apoteka Cosmetics Special</h1> */}
        </Container>
        <Button
          href="/login"
          className="me-4"
          style={{
            background: "var(--gradient-primary-button)",
            border: "none",
            borderRadius: "50px",
            padding: "0.75rem 1.5rem",
          }}
        >
          Prijavi se
        </Button>
      </header>
      <WaveBackground />
      {/* Card Grid */}
      <Container className="Dashboard__cards py-5">
        <Row xs={1} sm={2} md={2} lg={2} className="g-4">
          {cards.map((c, idx) => (
            <Col key={idx}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{c.title}</Tooltip>}
              >
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
                  onClick={() => (window.location.href = "/login")}
                >
                  <div className="d-flex align-items-center mb-3">
                    {c.icon}
                    <Card.Title className="mb-0 ms-4">{c.title}</Card.Title>
                  </div>
                  <Card.Text className="text-muted">{c.desc}</Card.Text>
                </Card>
              </OverlayTrigger>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
