import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "./RequestList.css";
import { useNavigate } from "react-router-dom";

function RequestList() {
  const navigate = useNavigate();
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Dummy podaci
  const doctorId = 1; // Prijavljeni ljekar

  const allRequests = [
    {
      id: 1,
      datum: "24.05.2025 15:20",
      pacijent: "Marko Marković",
      tipRecepta: "Blanko", // ili "Blanko forma"
      telefon: "38269344557",
      obrazac: "",
      lijek: "Andol",
      sastav: ["Paracetamol 500mg", "3x dnevno", "Uzeti nakon obroka"], // koristi se samo ako je tipRecepta === "Blanko forma"
      ustanova: "Dom zdravlja Beograd",
      ljekarId: 1,
      ljekar: "Dr Ivana Ivković",
      status: "Kreiran",
      datumStatusa: "20.06.2025",
      napomena: "Doziranje po potrebi",
      faksimil: "Dr. MN",
      potpisFarmaceuta: "Petar Petrović",
      datumIzdavanja: "21.06.2025",
      supstanca: "Acetilsalicilna kiselina",
    },

    {
      id: 2,
      datum: "31.05.2025 15:20",
      pacijent: "Ana Anić",
      tipRecepta: "Obrazac lijeka", // ili "Blanko forma"
      telefon: "38269344556",
      obrazac: "Blanko",
      sastav: ["neki sastav 500mg", "3x dnevno", "Uzeti nakon obroka"], // koristi se samo ako je tipRecepta === "Blanko forma"
      status: "Na čekanju",
      datumStatusa: "2025-05-25",
      ustanova: "KBC Zvezdara",
      ljekarId: 1,
      ljekar: "Dr Milan Nikolić",
      napomena: "",
      faksimil: "Dr. MN",
      potpisFarmaceuta: "Farm. Luka Ilić",
      datumIzdavanja: "05.06.2025",
      lijek: "Neki lijek",
      supstanca: "Acetilsalicilna kiselina",
    },
  ];

  // Prikaz samo zahtjeva koje je podnio prijavljeni ljekar
  const requests = allRequests.filter((r) => r.ljekarId === doctorId);

  const [filters, setFilters] = useState({
    datumOd: "",
    datumDo: "",
    pacijent: "",
    lijek: "",
    sastav: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRequests = requests.filter((r) => {
    const datum = new Date(r.datum);
    const od = filters.datumOd ? new Date(filters.datumOd) : null;
    const doD = filters.datumDo ? new Date(filters.datumDo) : null;

    return (
      (!od || datum >= od) &&
      (!doD || datum <= doD) &&
      (r.pacijent + r.telefon)
        .toLowerCase()
        .includes(filters.pacijent.toLowerCase()) &&
      r.lijek.toLowerCase().includes(filters.lijek.toLowerCase()) &&
      (Array.isArray(r.sastav)
        ? r.sastav.some((item) =>
            item.toLowerCase().includes(filters.sastav.toLowerCase())
          )
        : r.sastav.toLowerCase().includes(filters.sastav.toLowerCase())) && // fallback za stare podatke
      r.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite da izbrišete zahtjev?"
    );
    if (confirmed) {
      alert(`Status zahtjeva ${id} promijenjen u 'Pasivan'`);
      // Ovdje bi se u pravoj aplikaciji slao PATCH/PUT zahtjev
    }
  };

  return (
    <div className="background p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-1" style={{ color: "#47466D" }}>
          Lista Zahtjeva
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate("/form")}>
          + Novi Zahtjev
        </Button>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-2">
          <label>Datum od:</label>
          <input
            type="date"
            className="form-control"
            name="datumOd"
            value={filters.datumOd}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <label>Datum do:</label>
          <input
            type="date"
            className="form-control"
            name="datumDo"
            value={filters.datumDo}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <label></label>
          <input
            type="text"
            className="form-control"
            placeholder="Pacijent / Telefon"
            name="pacijent"
            value={filters.pacijent}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <label></label>
          <input
            type="text"
            className="form-control"
            placeholder="Lijek"
            name="lijek"
            value={filters.lijek}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <label></label>
          <input
            type="text"
            className="form-control"
            placeholder="Sastav"
            name="sastav"
            value={filters.sastav}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <label></label>
          <select
            className="form-control"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            <option value="Kreiran">Kreiran</option>
            <option value="Na čekanju">Na čekanju</option>
          </select>
        </div>
      </div>
      {/*ikonice iznad tabele*/}
      <div className="d-none d-md-block">
        <div className="d-flex justify-content-end gap-4 p-2">
          <button className="btn btn-sm btn-outline-primary btn-light btn-30">
            <h5 className="p-0 m-0">🗎</h5>
          </button>
          <button className="btn btn-sm btn-outline-warning btn-light btn-30">
            <h5 className="p-0 m-0">🖉</h5>
          </button>
          <button
            className="btn btn-sm btn-outline-danger btn-light btn-30"
            onClick={() => {
              const selectedRequest = filteredRequests.find(
                (r) => r.id === selectedRowId
              );

              if (!selectedRequest) {
                alert("Molimo selektujte red u tabeli.");
                return;
              }

              if (
                window.confirm(
                  `Jeste li sigurni da želite da obrišete zahtjev za: ${selectedRequest.pacijent}?`
                )
              ) {
                alert(
                  `Zahtjev ID ${selectedRequest.id} je sada pasivan (soft delete)`
                );
                // Pozovi svoju logiku za soft delete ovde
              }
            }}
          >
            <h5 className="p-0 m-0">🗑︎</h5>
          </button>

          <button className="btn btn-sm btn-outline-secondary btn-light btn-30">
            <h5 className="p-0 m-0">🖶</h5>
          </button>
        </div>
      </div>
      <div className="d-none d-md-block">
        <Table bordered hover responsive className="bg-white shadow-sm">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Pacijent / Telefon</th>
              <th>Tip recepta</th>
              <th>Lijek / Sastav</th>
              <th>Ustanova / Ljekar</th>
              <th>Status</th>
              <th>Napomena</th>
              <th>Faksimil</th>
              <th>Potpis farmaceuta</th>
              <th>Datum izdavanja</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((request) => (
              <React.Fragment key={request.id}>
                <tr
                  key={request.id}
                  className={
                    request.id === selectedRowId ? "table-primary" : ""
                  }
                  onClick={() => setSelectedRowId(request.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{request.datum}</td>
                  <td>
                    <div>{request.pacijent}</div>
                    <div>{request.telefon}</div>
                  </td>
                  <td>{request.tipRecepta}</td>
                  <td>
                    <div>
                      <strong>Lijek:</strong> {request.lijek}
                    </div>
                    <div
                      className="p-1 rounded"
                      style={{
                        maxHeight: "100px",
                        overflowY: "auto",
                      }}
                    >
                      {Array.isArray(request.sastav) &&
                        request.sastav.length > 0 && (
                          <div className="mt-2">
                            <strong>Sastav:</strong>
                            <ul className="mb-0 ps-3">
                              {request.sastav.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </td>

                  <td>
                    <div>
                      <strong>Ustanova:</strong> {request.ustanova}
                    </div>
                    <div>
                      <strong>Ljekar:</strong> {request.ljekar}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "Kreiran"
                          ? "badge-status-kreiran"
                          : "badge-status-na-cekanju"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{request.napomena || "—"}</td>
                  <td>{request.faksimil}</td>
                  <td>{request.potpisFarmaceuta}</td>
                  <td>{request.datumIzdavanja}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile View - Kartice */}
      <div className="d-md-none">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              background: "#ffffffe9",
            }}
          >
            <p>
              <strong>Datum podnošenja:</strong> {request.datum}
            </p>
            <p>
              <strong>Pacijent:</strong> {request.pacijent}
            </p>
            <p>
              <strong>Tip recepta:</strong> {request.tipRecepta}
            </p>
            <p>
              <strong>Ustanova:</strong> {request.ustanova}
            </p>
            <p>
              <strong>Ljekar:</strong> {request.ljekar}
            </p>
            <p>
              <strong>Lijek:</strong> {request.lijek || "—"}
            </p>
            <p className="mt-2">
              <strong>Sastav:</strong>
              <ul className="mb-0 ps-3">
                {request.sastav.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  request.status === "Kreiran"
                    ? "badge-status-kreiran"
                    : "badge-status-na-cekanju"
                }`}
              >
                {request.status}
              </span>
            </p>
            <p>
              <strong>Napomena:</strong> {request.napomena || "—"}
            </p>
            <p>
              <strong>Faksimil:</strong> {request.faksimil}
            </p>
            <p>
              <strong>Potpis farmaceuta:</strong> {request.potpisFarmaceuta}
            </p>
            <p>
              <strong>Datum izdavanja lijeka:</strong> {request.datumIzdavanja}
            </p>

            <div className="button-group mt-3 d-flex flex-wrap gap-2">
              <button className="btn btn-pregled btn-sm">Pregled</button>
              {request.status === "Kreiran" && (
                <>
                  <button className="btn btn-izmijeni btn-sm">Izmijeni</button>
                  <button
                    className="btn btn-obrisi btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Jeste li sigurni da želite da obrišete zahtjev?"
                        )
                      ) {
                        // Simulacija promjene statusa
                        alert("Zahtjev je sada pasivan (soft delete)");
                      }
                    }}
                  >
                    Obriši
                  </button>
                </>
              )}
              <button className="btn btn-outline-secondary btn-sm">
                Štampa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RequestList;
