import { Card } from "react-bootstrap";
import "./MedicalPrescriptionContent.css";

export default function MedicalPrescriptionContent({ request, recept }) {
  // Patient info
  const pacijent = request;
  // Doctor and institution
  const lekar = request.izdao_recept_lj;
  const ustanova = request.izdao_recept_u;

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
  }

  return (
    <Card className="medical-prescription-card">
      <div>
        {/* Naziv, adresa i telefon */}
        <div className="medical-section-with-line">
          <div className="medical-section">
            Naziv, adresa i telefon zdr. ustanove/privatne prakse
          </div>
          <div className="medical-input-line">
            <p className="px-1 pt-1">{ustanova || "-"}</p>
          </div>
        </div>
        {/* Prezime i ime pacijenta */}
        <div
          className="medical-section-with-line"
          style={{ borderTop: "none" }}
        >
          <div
            className="medical-section"
            style={{ borderTop: "none", borderBottom: "none" }}
          >
            Prezime i ime pacijenta, br. telefona
          </div>
          <div className="medical-input-line" style={{ borderTop: "none" }}>
            <p className="px-1 pt-1">
              {pacijent
                ? toTitleCase(
                    `${pacijent.pacijent_ime} ${pacijent.pacijent_prezime}, ${pacijent.br_tel}`
                  )
                : "-"}
            </p>
          </div>
        </div>
        {/* Datum rođenja */}
        <div
          className="medical-section-with-line"
          style={{ borderTop: "none" }}
        >
          <div
            className="medical-section"
            style={{ borderTop: "none", borderBottom: "none" }}
          >
            Datum rođenja
          </div>
          <div className="medical-input-line" style={{ borderTop: "none" }}>
            <p className="px-1 pt-1">
              {pacijent ? pacijent.pacijent_dat_rodj : "-"}
            </p>
          </div>
        </div>
        {/* Naziv ili šifra dijagnoze */}
        <div
          className="medical-section-with-line"
          style={{ borderTop: "none" }}
        >
          <div
            className="medical-section"
            style={{ borderTop: "none", borderBottom: "none" }}
          >
            Naziv ili šifra dijagnoze
          </div>
          <div className="medical-input-line" style={{ borderTop: "none" }}>
            <p className="px-1 pt-1">{request?.dijagnoza || "/"}</p>
          </div>
        </div>
        {/* Vrsta recepta header */}
        <div
          className="medical-section"
          style={{
            borderTop: "none",
            minHeight: "25px",
            padding: "4px 8px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span>Vrsta recepta</span>
          <span className="medical-small-text" style={{ marginLeft: "8px" }}>
            (upisati x ispred vrste recepta)
          </span>
        </div>
        {/* Neobnavljiv */}
        <div className={`medical-checkbox-row`}>
          <div className={`medical-square${recept?.vrsta_rp === "NO" ? " checked" : ""}`}>
            <p style={{ position: "relative", top: 8 }}>
              {recept?.vrsta_rp === "NO" ? "X" : ""}
            </p>
          </div>
          <span style={{ fontWeight: "bold" }}>Neobnavljiv</span>
          <span className="medical-small-text" style={{ marginLeft: "4px" }}>
            - Non repetatur <span className="fs-6"></span>
          </span>
        </div>
        {/* Obnavljiv */}
        <div className={`medical-checkbox-row`} style={{ borderTop: "none" }}>
          <div className={`medical-square${recept?.vrsta_rp === "OB" ? " checked" : ""}`}>
            <p style={{ position: "relative", top: 8 }}>
              {recept?.vrsta_rp === "OB" ? "X" : ""}
            </p>
          </div>
          <span style={{ fontWeight: "bold" }}>Obnavljiv</span>
          <span className="medical-small-text" style={{ marginLeft: "4px" }}>
            - Repetatur (upisati broj ponavljanja)
          </span>
        </div>
        {/* Poseban */}
        <div
          className="medical-checkbox-row"
          style={{
            borderTop: "none",
            minHeight: "40px",
            alignItems: "flex-start",
            paddingTop: "6px",
          }}
        >
          <div className="medical-square" style={{ marginTop: "2px" }}></div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "85%" }}
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontWeight: "bold" }}>Poseban</span>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  height: "1px",
                  width: "240px",
                  marginLeft: "4px",
                }}
              ></div>
            </div>
            <div
              className="medical-small-text"
              style={{
                marginTop: "4px",
                textAlign: "center",
                paddingRight: "20px",
              }}
            >
              (upisati redni br. iz knjige izdatih narkotika)
            </div>
          </div>
        </div>
        {/* Ograničen */}
        <div className="medical-checkbox-row" style={{ borderTop: "none" }}>
          <div className="medical-square"></div>
          <span style={{ fontWeight: "bold" }}>Ograničen</span>
          <span className="medical-small-text" style={{ marginLeft: "4px" }}>
            - Ad usum medici
          </span>
        </div>
        {/* Rp./ sekcija */}
        <div className="medical-rp-section">
          <div
            style={{
              fontSize: "36px",
              fontStyle: "italic",
              fontWeight: "normal",
              color: "#000",
              fontFamily: '"Brush Script MT", cursive',
            }}
          >
            Rp./
          </div>
          <br />
          <p className="py-0 my-0">{recept?.grupa || "-"}</p>
          <p>{recept?.obrazac || recept?.naziv || "-"}</p>
          <pre
            style={{
              all: "unset",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {recept?.rp_obrazac || "-"}
          </pre>
          <br></br>
          <p>excipiens ad {recept?.kolicina || recept?.kol || "-"}</p>
        </div>
        {/* Napomene */}
        <div className="medical-bottom-section">
          Napomene: {recept?.napomena || "-"}
        </div>
        {/* Br. potvrde */}
        <div className="medical-final-section">
          Br. potvrde: {recept?.id_det || "-"}
        </div>
        {/* Bottom section with four separate rectangles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            border: "1px solid #999",
            borderTop: "none",
          }}
        >
          {/* Top left - Datum propisivanja lijeka */}
          <div className="medical-bottom-cell">
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Datum propisivanja lijeka
            </div>
            <div
              style={{
                borderBottom: "1px solid #000",
                height: "15px",
                marginBottom: "4px",
              }}
            >
              <p className="mx-5 px-3">{recept?.datum_prijema || ""}</p>
            </div>
            <div
              className="medical-small-text"
              style={{ fontSize: "8px", textAlign: "center" }}
            >
              (Pečat zdr. ustanove/privatne
              <br />
              prakse u kojoj je lijek propisan)
            </div>
          </div>
          {/* Top right - Potpis i faksimil ljekara */}
          <div className="medical-bottom-cell" style={{ borderLeft: "none" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Potpis i faksimil ljekara
            </div>
            <div style={{ borderBottom: "1px solid #000", height: "15px" }}>
              <p className="mx-1 px-2">{lekar || ""}</p>
            </div>
          </div>
          {/* Bottom left - Datum izdavanja lijeka */}
          <div className="medical-bottom-cell" style={{ borderTop: "none" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Datum izdavanja lijeka
            </div>
            <div
              style={{
                borderBottom: "1px solid #000",
                height: "15px",
                marginBottom: "4px",
              }}
            ></div>
            <div
              className="medical-small-text"
              style={{ fontSize: "8px", textAlign: "center" }}
            >
              (Pečat zdr. ustanove/privatne
              <br />
              prakse u kojoj je lijek izdan)
            </div>
          </div>
          {/* Bottom right - Potpis farmaceuta and Lijek primio */}
          <div
            className="medical-bottom-cell"
            style={{ borderTop: "none", borderLeft: "none" }}
          >
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "10px",
                  textAlign: "center",
                }}
              >
                Potpis i faksimil farmaceuta
              </div>
              <div
                style={{ borderBottom: "1px solid #000", height: "15px" }}
              ></div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div style={{ fontWeight: "bold", fontSize: "10px" }}>
                Lijek primio:
              </div>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  height: "1px",
                  flexGrow: 1,
                  marginLeft: "4px",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
