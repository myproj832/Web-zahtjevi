import React from "react";

export default function MedicalPrescription() {
  // Dodaj Google Fonts link u head
  React.useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const formStyle = {
    width: "400px",
    margin: "20px auto",
    border: "1px solid #000",
    fontFamily: '"Calibri", sans-serif',
    fontSize: "11px",
    backgroundColor: "#fff",
    lineHeight: "1.2",
    fontWeight: "bold",
  };

  const sectionStyle = {
    backgroundColor: "#e8f4d8",
    border: "1px solid #999",
    borderBottom: "1px solid #ccc",
    padding: "4px 8px",
    minHeight: "25px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    fontWeight: "bold",
    margin: 0,
    textAlign: "left",
  };

  const inputLineStyle = {
    backgroundColor: "#fff",
    border: "1px solid #999",
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    height: "20px",
    margin: 0,
  };

  const checkboxRowStyle = {
    backgroundColor: "#fff",
    border: "1px solid #999",
    borderTop: "none",
    borderBottom: "1px solid #999",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    margin: 0,
    minHeight: "25px",
  };

  const rpSectionStyle = {
    backgroundColor: "#e8f4d8",
    border: "1px solid #999",
    borderTop: "none",
    borderBottom: "1px solid #999",
    padding: "15px 8px",
    minHeight: "200px",
    position: "relative",
  };

  const bottomSectionStyle = {
    backgroundColor: "#e8f4d8",
    border: "1px solid #999",
    borderTop: "none",
    borderBottom: "1px solid #999",
    padding: "8px",
    minHeight: "120px",
    fontWeight: "bold",
  };

  const finalSectionStyle = {
    backgroundColor: "#e8f4d8",
    border: "1px solid #999",
    borderTop: "none",
    borderBottom: "1px solid #999",
    padding: "6px 8px",
    minHeight: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontWeight: "bold",
    textAlign: "left",
  };

  const bottomGridStyle = {
    display: "flex",
    border: "1px solid #999",
    borderTop: "none",
  };

  const leftBottomStyle = {
    backgroundColor: "#e8f4d8",
    borderRight: "1px solid #999",
    padding: "8px",
    width: "50%",
    minHeight: "120px",
  };

  const rightBottomStyle = {
    backgroundColor: "#e8f4d8",
    padding: "8px",
    width: "50%",
    minHeight: "120px",
  };

  const smallTextStyle = {
    fontSize: "9px",
    fontStyle: "italic",
    fontWeight: "normal",
    color: "#666",
  };

  const squareStyle = {
    width: "8px",
    height: "8px",
    border: "1px solid #000",
    marginRight: "6px",
    backgroundColor: "#fff",
    flexShrink: 0,
  };

  const sectionWithLineStyle = {
    border: "1px solid #999",
    borderBottom: "1px solid #999",
    margin: 0,
  };

  const bottomCellStyle = {
    border: "1px solid #999",
    padding: "6px",
    minHeight: "45px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={formStyle}>
      {/* Naziv, adresa i telefon */}
      <div style={sectionWithLineStyle}>
        <div style={sectionStyle}>
          Naziv, adresa i telefon zdr. ustanove/privatne prakse
        </div>
        <div style={inputLineStyle}><p className="px-1 pt-1">Milmedika, Ul. Slobode, Podgorica, +382 69 872 342</p></div>
      </div>

      {/* Prezime i ime pacijenta */}
      <div style={{ ...sectionWithLineStyle, borderTop: "none" }}>
        <div
          style={{ ...sectionStyle, borderTop: "none", borderBottom: "none" }}
        >
          Prezime i ime pacijenta, br. telefona
        </div>
        <div style={{ ...inputLineStyle, borderTop: "none" }}><p className="px-1 pt-1">Jovana Jovanovic, +382 67 743 110</p></div>
      </div>

      {/* Datum rođenja */}
      <div style={{ ...sectionWithLineStyle, borderTop: "none" }}>
        <div
          style={{ ...sectionStyle, borderTop: "none", borderBottom: "none" }}
        >
          Datum rođenja
        </div>
        <div style={{ ...inputLineStyle, borderTop: "none" }}><p className="px-1 pt-1">08.12.1998</p></div>
      </div>

      {/* Naziv ili šifra dijagnoze */}
      <div style={{ ...sectionWithLineStyle, borderTop: "none" }}>
        <div
          style={{ ...sectionStyle, borderTop: "none", borderBottom: "none" }}
        >
          Naziv ili šifra dijagnoze
        </div>
        <div style={{ ...inputLineStyle, borderTop: "none" }}><p className="px-1 pt-1">N95 - Menopauzalni i drugi perimenopauzalni poremećaji</p></div>
      </div>

      {/* Vrsta recepta header */}
      <div
        style={{
          ...sectionStyle,
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
        <span style={{ ...smallTextStyle, marginLeft: "8px" }}>
          (upisati x ispred vrste recepta)
        </span>
      </div>

      {/* Neobnavljiv */}
      <div style={checkboxRowStyle}>
        <div style={squareStyle}><p style={{"position": "relative", "top": -3.5}}>x</p> </div>
        <span style={{ fontWeight: "bold" }}>Neobnavljiv</span>
        <span style={{ ...smallTextStyle, marginLeft: "4px" }}>
          - Non repetatur <span className="fs-6"><strong>2</strong></span>
        </span>
      </div>

      {/* Obnavljiv */}
      <div style={{ ...checkboxRowStyle, borderTop: "none" }}>
        <div style={squareStyle}></div>
        <span style={{ fontWeight: "bold" }}>Obnavljiv</span>
        <span style={{ ...smallTextStyle, marginLeft: "4px" }}>
          - Repetatur (upisati broj ponavljanja)
        </span>
      </div>

      {/* Poseban */}
      <div
        style={{
          ...checkboxRowStyle,
          borderTop: "none",
          minHeight: "40px",
          alignItems: "flex-start",
          paddingTop: "6px",
        }}
      >
        <div style={{ ...squareStyle, marginTop: "2px" }}></div>
        <div style={{ display: "flex", flexDirection: "column", width: "85%" }}>
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
            style={{
              ...smallTextStyle,
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
      <div style={{ ...checkboxRowStyle, borderTop: "none" }}>
        <div style={squareStyle}></div>
        <span style={{ fontWeight: "bold" }}>Ograničen</span>
        <span style={{ ...smallTextStyle, marginLeft: "4px" }}>
          - Ad usum medici
        </span>
      </div>

      {/* Rp./ sekcija */}
      <div style={rpSectionStyle}>
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
        <br></br>
        <p className="py-0 my-0">Grupa: Menopauza</p>
        <p>Obrazac: progesteron krem 10mg-0.25ml</p>
        <p className="py-0 my-0">progesteron 10mg/0.25ml</p>
        <p>excipiens ad 15ml</p>
        <p>M.f. cremor</p>
        <p className="py-0 my-0">D.S. Spolja</p>
      </div>

      {/* Napomene */}
      <div style={bottomSectionStyle}>Napomene</div>

      {/* Br. potvrde */}
      <div style={finalSectionStyle}>Br. potvrde: 208</div>

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
        <div style={bottomCellStyle}>
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
          ><p className="mx-5 px-3">29.06.2025</p></div>
          <div
            style={{ ...smallTextStyle, fontSize: "8px", textAlign: "center" }}
          >
            (Pečat zdr. ustanove/privatne
            <br />
            prakse u kojoj je lijek propisan)
          </div>
        </div>

        {/* Top right - Potpis i faksimil ljekara */}
        <div style={{ ...bottomCellStyle, borderLeft: "none" }}>
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
          <div style={{ borderBottom: "1px solid #000", height: "15px" }}><p className="mx-4 px-4">Ivana Ivkovic</p></div>
        </div>

        {/* Bottom left - Datum izdavanja lijeka */}
        <div style={{ ...bottomCellStyle, borderTop: "none" }}>
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
            style={{ ...smallTextStyle, fontSize: "8px", textAlign: "center" }}
          >
            (Pečat zdr. ustanove/privatne
            <br />
            prakse u kojoj je lijek izdan)
          </div>
        </div>

        {/* Bottom right - Potpis farmaceuta and Lijek primio */}
        <div
          style={{ ...bottomCellStyle, borderTop: "none", borderLeft: "none" }}
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
  );
}
