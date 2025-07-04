import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FilterForm from "../../components/RequestsList/FilterForm";
import RequestTable from "../../components/RequestsList/RequestTable";
import RequestCard from "../../components/RequestsList/RequestCard";
import ActionButtons from "../../components/RequestsList/ActionButtons";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useDataContext } from "../../context/DataContext";
import "./RequestList.css";

function RequestList() {
  const navigate = useNavigate();
  const { rola } = useAuth();
  const { listaZahtjeva } = useDataContext();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filters, setFilters] = useState({
    datumOd: "",
    datumDo: "",
    pacijent: "",
    lijek: "",
    status: "",
    rola: "",
  });

  const isAdmin = rola === "admin";

  /* const requests = allRequests.filter((r) => r.ljekarId === doctorId); */
  /* const all = JSON.parse(localStorage.getItem("requests")) || []; */
  const requests = listaZahtjeva?.P_OUT_JSON || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  function parseDateDDMMYYYY(dateString) {
    // Radi i za "02.07.2025" i "02.07.2025 18:53"
    const [datePart] = dateString.trim().split(" ");
    const [day, month, year] = datePart.split(".").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }
  function parseDateFromInput(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const filteredRequests = requests.filter((r) => {
    const datum = parseDateDDMMYYYY(r.dat_prijema); // dat_prijema je "02.07.2025 18:53"
    const od = filters.datumOd ? parseDateFromInput(filters.datumOd) : null; // ISO: "2025-07-01"
    const doD = filters.datumDo ? parseDateFromInput(filters.datumDo) : null;

    const combinedPacijentTelefon =
      `${r.pacijent_ime} ${r.pacijent_prezime}`.toLowerCase();
    const combinedLijekSastav = r.rp
      ?.map((el) => el.naziv || el.rp_blanko || el.rp_obrazac)
      .join(" ")
      .toLowerCase();

    return (
      (!od || datum >= od) &&
      (!doD || datum <= doD) &&
      combinedPacijentTelefon.includes(filters.pacijent.toLowerCase()) &&
      combinedLijekSastav.includes(filters.lijek.toLowerCase()) &&
      r.status.toString().includes(filters.status.toLowerCase()) &&
      (!filters.rola || rola.toLowerCase() === filters.rola.toLowerCase())
    );
  });

  /* const r = { dat_prijema: "02.07.2025 18:53" };
  console.log(parseDateDDMMYYYY(r.dat_prijema)); // Tue Jul 02 2025
  console.log(filters.datumOd); */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite da izbrišete zahtjev?"
    );
    if (confirmed) {
      const existing = JSON.parse(localStorage.getItem("requests")) || [];
      const updated = existing.filter((req) => req.id !== id);
      localStorage.setItem("requests", JSON.stringify(updated));
      window.location.reload(); // ili refetch lokalno
    }
  };

  return (
    <>
      <Header />
      <div className="background p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-1" style={{ color: "#47466D" }}>
            Lista Zahtjeva
          </h2>
          <Button variant="outline-secondary" onClick={() => navigate("/form")}>
            + Novi Zahtjev
          </Button>
        </div>

        <FilterForm
          filters={filters}
          handleFilterChange={handleFilterChange}
          isAdmin={isAdmin}
        />

        <ActionButtons
          selectedRequest={filteredRequests.find((r) => r.id === selectedRowId)}
          handleDelete={handleDelete}
        />

        <RequestTable
          listaZahtjeva={listaZahtjeva}
          filteredRequests={filteredRequests}
          setSelectedRowId={setSelectedRowId}
          selectedRowId={selectedRowId}
          rola={rola}
        />

        <div className="d-md-none">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req.id_zah}
              request={req}
              rola={rola}
              onSelect={setSelectedRowId}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default RequestList;
