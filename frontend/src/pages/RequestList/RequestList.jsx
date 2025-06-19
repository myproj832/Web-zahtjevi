import React, { useState } from "react";
import "./RequestList.css";
import { Table } from "react-bootstrap";

function RequestList() {
  // Dummy data
  const requests = [
    {
      id: 1,
      datum: "19.06.2025",
      pacijent: "Marko Marković",
      tipRecepta: "Hronični",
      ustanova: "Dom zdravlja Beograd",
      status: "Kreiran",
    },
    {
      id: 2,
      datum: "24.05.2025",
      pacijent: "Ana Anić",
      tipRecepta: "Akutni",
      ustanova: "KBC Zvezdara",
      status: "Na čekanju",
    },
  ];

  const [filters, setFilters] = useState({
    datum: "",
    pacijent: "",
    tipRecepta: "",
    ustanova: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredRequests = requests.filter((r) => {
    return (
      r.datum.toLowerCase().includes(filters.datum.toLowerCase()) &&
      r.pacijent.toLowerCase().includes(filters.pacijent.toLowerCase()) &&
      r.tipRecepta.toLowerCase().includes(filters.tipRecepta.toLowerCase()) &&
      r.ustanova.toLowerCase().includes(filters.ustanova.toLowerCase()) &&
      r.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  return (
    <div className="background" style={{ padding: "20px" }}>
      <h1 style={{ color: "#47466D" }}>Request List</h1>

      <div className="mb-3">
  <div className="row">
    <div className="col-12 col-md">
      <input
        type="text"
        className="form-control mb-2 mb-md-0"
        placeholder="Filter po datumu"
        name="datum"
        value={filters.datum}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-12 col-md">
      <input
        type="text"
        className="form-control mb-2 mb-md-0"
        placeholder="Filter po pacijentu"
        name="pacijent"
        value={filters.pacijent}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-12 col-md">
      <input
        type="text"
        className="form-control mb-2 mb-md-0"
        placeholder="Tip recepta"
        name="tipRecepta"
        value={filters.tipRecepta}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-12 col-md">
      <input
        type="text"
        className="form-control mb-2 mb-md-0"
        placeholder="Ustanova"
        name="ustanova"
        value={filters.ustanova}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-12 col-md">
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
</div>


      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Pacijent</th>
              <th>Tip recepta</th>
              <th>Ustanova</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((row) => (
              <tr key={row.id}>
                <td>{row.datum}</td>
                <td>{row.pacijent}</td>
                <td>{row.tipRecepta}</td>
                <td>{row.ustanova}</td>
                <td>
                  <span
                    className={`badge ${
                      row.status === "Kreiran"
                        ? "badge-status-kreiran"
                        : "badge-status-na-cekanju"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-pregled btn-sm">Pregled</button>
                    <button className="btn btn-izmijeni btn-sm">
                      Izmijeni
                    </button>
                    <button className="btn btn-obrisi btn-sm">Obriši</button>
                  </div>
                </td>
              </tr>
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
            <p style={{ margin: 0 }}>
              <strong>Datum:</strong> {request.datum}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Pacijent:</strong> {request.pacijent}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Tip Recepta:</strong> {request.tipRecepta}
            </p>
            <p>
              <strong>Ustanova:</strong> {request.ustanova}
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
            <div className="button-group mt-3">
              <button className="button">Pregled</button>
              <button className="buttoni">Izmjena</button>
              <button className="buttonx">Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RequestList;
