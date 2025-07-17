import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Loader from "../../components/Loader";

import Header from "../../components/Header";
import FilterForm from "../../components/RequestsList/FilterForm";
import RequestTable from "../../components/RequestsList/RequestTable";
import RequestCard from "../../components/RequestsList/RequestCard";
import ActionButtons from "../../components/RequestsList/ActionButtons";
import Modal from "../../components/Modal";

import { useAuth } from "../../context/AuthContext";
import { useDataContext } from "../../context/DataContext";

import "./RequestList.css";

function RequestList() {
  const navigate = useNavigate();
  const { rola } = useAuth();
  const { listaZahtjeva, refreshListaZahtjeva } = useDataContext();
  const [loading, setLoading] = useState(true);

     useEffect(() => {
    const fetchData = async () => {
      await refreshListaZahtjeva();
      setLoading(false);
    };
    fetchData();
  }, [refreshListaZahtjeva]);

  const [showRequests, setShowRequests] = useState(
    () => sessionStorage.getItem("showRequests") === "true"
  );
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

  // Memoized initial dates
  const getInitialDates = () => {
    const now = new Date();
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      2
    );
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
  };

  const [filters, setFilters] = useState(() => ({
    ...getInitialDates(),
    pacijent: "",
    lijek: "",
    status: "",
    rola: "",
  }));

  // Memoized data
  const requests = listaZahtjeva?.P_OUT_JSON || [];
  const isAdmin = rola === "admin";
  const requestsPerPage = 10;

  // Date parsing helpers
  const parseDateDDMMYYYY = (dateString) => {
    const [datePart] = dateString.trim().split(" ");
    const [day, month, year] = datePart.split(".").map(Number);
    return new Date(year, month - 1, day);
  };
  const parseDateFromInput = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Memoized lists
  const allUstanove = Array.from(
    new Set(requests.map((r) => r.izdao_recept_u).filter(Boolean))
  );

  // Filtering and sorting
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

  const sortedRequests = [...filteredRequests].sort(
    (a, b) =>
      parseDateDDMMYYYY(b.dat_prijema) - parseDateDDMMYYYY(a.dat_prijema)
  );

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = sortedRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  // Pagination rendering
  const renderPagination = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-between align-items-center gap-2 px-2 rounded">
          <span className="placeholder col-2 placeholder-glow"></span>
          <span className="placeholder col-4 placeholder-glow"></span>
        </div>
      );
    }
    if (totalPages <= 1) return null;
    const handleInputChange = (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (!value) return;
      let page = Math.max(1, Math.min(totalPages, Number(value)));
      setCurrentPage(page);
    };
    const from = sortedRequests.length === 0 ? 0 : indexOfFirstRequest + 1;
    const to = Math.min(indexOfLastRequest, sortedRequests.length);

    const handleCancelClick = () => {
      setShowCancelModal(true);
    };

    const handleCancelConfirm = () => {
      setShowCancelModal(false);
      navigate("/requests");
    };

    const handleCancelCancel = () => {
      setShowCancelModal(false);
    };

    return (
      <div
        className="d-flex justify-content-between align-items-center gap-2 px-2 rounded"
        style={{ border: "1px solid rgb(138, 176, 179)" }}
      >
        <div className="d-none d-md-block">
          <span
            style={{
              minWidth: 60,
              textAlign: "right",
              borderRight: "1px solid rgb(138, 176, 179)",
            }}
            className="px-2"
          >
            {from}–{to}
          </span>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span>
            <strong>1</strong>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(1);
                scrollToPagination();
              }}
              style={{ paddingTop: 1, paddingBottom: 1 }}
              className="mx-1 px-2"
            >
              <span style={{ color: "#007bff" }}>⇐</span>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                scrollToPagination();
              }}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
              }}
              className="px-2"
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
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                scrollToPagination();
              }}
              style={{
                paddingTop: 1,
                paddingBottom: 1,
              }}
              className="px-2"
            >
              <span style={{ color: "#007bff" }}>⟶</span>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(totalPages);
                scrollToPagination();
              }}
              style={{ paddingTop: 1, paddingBottom: 1 }}
              className="mx-1 px-2"
            >
              <span style={{ color: "#007bff" }}>⇒</span>
            </Button>
          </div>
          <span>
            <strong>{totalPages}</strong>
          </span>
        </div>
      </div>
    );
  };

  // Scroll helper
  function scrollToPagination() {
    setTimeout(() => {
      const el = document.getElementById("pagination-card");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }

  const { submitDelete } = useDataContext();
  const handleDelete = async (id) => {
    console.log("handleDelete called with id:", id);
    let req = filteredRequests.find((r) => String(r.id_zah) === String(id));
    console.log("Trying filteredRequests for delete:", req);
    if (!req) {
      req = requests.find((r) => String(r.id_zah) === String(id));
      console.log("Trying requests for delete:", req);
    }
    if (!req) {
      console.error("❌ Greška pri brisanju zahtjeva: Zahtjev nije pronađen.");
      alert("Greška pri brisanju zahtjeva: Zahtjev nije pronađen.");
      return;
    }
    if (window.confirm("Jeste li sigurni da želite da izbrišete zahtjev?")) {
      try {
        await submitDelete({
          id_zah: req.id_zah,
          status_zah: "8",
        });
        console.log("submitDelete called for delete");
        if (typeof refreshListaZahtjeva === "function") {
          await refreshListaZahtjeva();
          console.log("refreshListaZahtjeva called after delete");
        }
        alert("Zahtjev je uspješno izbrisan.");
      } catch (err) {
        console.error("❌ Greška pri brisanju zahtjeva:", err);
        alert("Greška pri brisanju zahtjeva.");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Data refresh
  useEffect(() => {
    if (typeof refreshListaZahtjeva === "function") {
      refreshListaZahtjeva();
    }
  }, []);

  // Render
  return (
    <div className="background">
       {loading && <div className="global-blocker" />}
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
                  sessionStorage.setItem("showRequests", !prev);
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
            {" "}
            <div className="d-flex align-items-center mb-3 justify-content-between">
              <Loader className="ms-5"  variant="roller" size="small" isLoading={loading}>
             
          
              {renderPagination() && (
                <div style={{ marginRight: "auto" }}>{renderPagination()}</div>
              )}
              </Loader>
              <ActionButtons
                selectedRequest={filteredRequests.find(
                  (r) => r.id_zah === selectedRowId
                )}
                handleDelete={handleDelete}
              />
            </div>
            <div
              className="d-none d-md-block"
              tabIndex={0}
              onBlur={(e) => {
                if (
                  e.relatedTarget &&
                  e.relatedTarget.closest &&
                  e.relatedTarget.closest(".action-buttons")
                ) {
                  return;
                }
                setSelectedRowId(null);
              }}
            >
              <Loader variant="skeleton" isLoading={loading}>
              <div className="position-relative" tabIndex={0} onBlur={e => {/* unchanged blur logic */}}>
              <RequestTable
                listaZahtjeva={listaZahtjeva}
                filteredRequests={currentRequests}
                setSelectedRowId={setSelectedRowId}
                selectedRowId={selectedRowId}
                rola={rola}
                indexOfFirstRequest={indexOfFirstRequest}
              />
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
              </Loader>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RequestList;
