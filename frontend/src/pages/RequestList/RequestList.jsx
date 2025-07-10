import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

import Header from "../../components/Header";
import FilterForm from "../../components/RequestsList/FilterForm";
import RequestTable from "../../components/RequestsList/RequestTable";
import RequestCard from "../../components/RequestsList/RequestCard";
import ActionButtons from "../../components/RequestsList/ActionButtons";

import { useAuth } from "../../context/AuthContext";
import { useDataContext } from "../../context/DataContext";

import "./RequestList.css";

function RequestList() {
  const navigate = useNavigate();
  const { rola } = useAuth();
  const { listaZahtjeva, refreshListaZahtjeva } = useDataContext();

  // Inicijalno stanje iz localStorage
  const [showRequests, setShowRequests] = useState(() => {
    const stored = localStorage.getItem("showRequests");
    return stored === null ? false : stored === "true";
  });
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function getInitialDates() {
    const now = new Date();
    // Prvi dan proslog mjeseca
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      2
    );
    // Zadnji dan tekuceg mjeseca
    const lastDayCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const toISO = (d) => d.toISOString().slice(0, 10);

    return {
      datumOd: toISO(firstDayLastMonth),
      datumDo: toISO(lastDayCurrentMonth),
    };
  }

  const [filters, setFilters] = useState({
    ...getInitialDates(),
    pacijent: "",
    lijek: "",
    status: "",
    rola: "",
  });

  const requests = listaZahtjeva?.P_OUT_JSON || [];
  const isAdmin = rola === "admin";
  const requestsPerPage = 10;

  const parseDateDDMMYYYY = (dateString) => {
    const [datePart] = dateString.trim().split(" ");
    const [day, month, year] = datePart.split(".").map(Number);
    return new Date(year, month - 1, day);
  };

  const parseDateFromInput = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Lista svih ustanova iz zahtjeva
  // Koristi Set da ukloni duplikate
  const allUstanove = Array.from(
    new Set(requests.map((r) => r.izdao_recept_u).filter(Boolean))
  );

  const filteredRequests = requests.filter((r) => {
    const datum = parseDateDDMMYYYY(r.dat_prijema);
    const od = filters.datumOd ? parseDateFromInput(filters.datumOd) : null;
    const doD = filters.datumDo ? parseDateFromInput(filters.datumDo) : null;

    const combinedPacijent =
      `${r.pacijent_ime} ${r.pacijent_prezime}`.toLowerCase();
    const combinedLijek = r.rp
      ?.map((el) => el.naziv || el.rp_blanko || el.rp_obrazac)
      .join(" ")
      .toLowerCase();

    return (
      (!od || datum >= od) &&
      (!doD || datum <= doD) &&
      combinedPacijent.includes(filters.pacijent.toLowerCase()) &&
      combinedLijek.includes(filters.lijek.toLowerCase()) &&
      (!filters.status ||
        r.status.toString().toLowerCase() === filters.status.toLowerCase()) &&
      (!filters.rola || rola.toLowerCase() === filters.rola.toLowerCase()) &&
      (!filters.ustanova || r.izdao_recept_u === filters.ustanova)
    );
  });

  // poredjaj filtrirane zahtjeve po datumu prijema silazno (najnoviji prvi)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = parseDateDDMMYYYY(a.dat_prijema);
    const dateB = parseDateDDMMYYYY(b.dat_prijema);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = sortedRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const handleInputChange = (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (!value) return;
      let page = Math.max(1, Math.min(totalPages, Number(value)));
      setCurrentPage(page);
    };

    return (
      <Card
        className=" mt-2 mx-auto w-50 rounded-pill"
        style={{
          background: "rgba(255,255,255,0.7)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span>1</span>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
              }}
              className="mx-1 px-20"
            >
              <span style={{ color: "#007bff" }}>⇐</span>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <span style={{ color: "#007bff" }}>⟵</span>
            </Button>
            <input
              type="text"
              value={currentPage}
              onChange={handleInputChange}
              style={{
                width: 60,
                textAlign: "center",
                borderRadius: "4px",
                border: "1px solid #ccc",
                margin: "0.5rem",
              }}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <span style={{ color: "#007bff" }}>⟶</span>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
              }}
              className="mx-1 px-20"
            >
              <span style={{ color: "#007bff" }}>⇒</span>
            </Button>
          </div>
          <span>{totalPages}</span>
        </div>
      </Card>
    );
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite da izbrišete zahtjev?"
    );
    if (confirmed) {
      const existing = JSON.parse(localStorage.getItem("requests")) || [];
      const updated = existing.filter((req) => req.id !== id);
      localStorage.setItem("requests", JSON.stringify(updated));
      // Ako koristiš kontekst, treba refetch, a ne reload:
      // refetchZahtjeve(); // ili neka funkcija iz DataContext
      window.location.reload();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (typeof refreshListaZahtjeva === "function") {
      refreshListaZahtjeva();
    }
  }, []);

  return (
    <div className="background">
      <Header />
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-1" style={{ color: "#47466D" }}>
            Lista Zahtjeva
          </h2>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setShowRequests((prev) => {
                  localStorage.setItem("showRequests", !prev);
                  return !prev;
                });
              }}
            >
              {showRequests
                ? "˄   Sakrij listu zahtjeva"
                : "˅   Prikaži listu zahtjeva"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/form")}
            >
              + Novi Zahtjev
            </Button>
          </div>
        </div>

        <FilterForm
          filters={filters}
          handleFilterChange={handleFilterChange}
          isAdmin={isAdmin}
          rola={rola}
          listaUstanova={allUstanove}
        />

        {showRequests && (
          <>
            <ActionButtons
              selectedRequest={filteredRequests.find(
                (r) => r.id_zah === selectedRowId
              )}
              handleDelete={handleDelete}
            />

            <div className="d-none d-md-block">
              <RequestTable
                listaZahtjeva={listaZahtjeva}
                filteredRequests={currentRequests}
                setSelectedRowId={setSelectedRowId}
                selectedRowId={selectedRowId}
                rola={rola}
              />
              {renderPagination()}
            </div>

            <div className="d-md-none">
              {currentRequests.map((req) => (
                <RequestCard
                  key={req.id_zah}
                  request={req}
                  rola={rola}
                  onSelect={setSelectedRowId}
                />
              ))}
              {renderPagination()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RequestList;
