import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FilterForm from '../../components/RequestsList/FilterForm';
import RequestTable from '../../components/RequestsList/RequestTable';
import RequestCard from '../../components/RequestsList/RequestCard';
import ActionButtons from '../../components/RequestsList/ActionButtons';
import Header from "../../components/Header";
import "./RequestList.css";

function RequestList() {
  const navigate = useNavigate();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filters, setFilters] = useState({
    datumOd: "",
    datumDo: "",
    pacijent: "",
    lijek: "",
    status: "",
  });

  // Dummy podaci - zameni sa stvarnim API pozivom ili podacima
  const allRequests = [
    {
      id: 1,
      datum: "24.05.2025 15:20",
      pacijent: "Marko Marković",
      tipRecepta: "Blanko",
      telefon: "38269344557",
      obrazac: "",
      lijek: "Andol",
      sastav: ["Paracetamol 500mg", "3x dnevno", "Uzeti nakon obroka"],
      ustanova: "Dom zdravlja Beograd",
      ljekarId: 1,
      ljekar: "Dr Ivana Ivković",
      status: "Kreiran",
      datumStatusa: "20.06.2025",
      napomena: "Doziranje po potrebi",
      faksimil: "Dr. MN",
      farmaceut: "Petar Petrović",
      datumIzdavanja: "21.06.2025",
    },
    {
      id: 2,
      datum: "31.05.2025 15:20",
      pacijent: "Ana Anić",
      tipRecepta: "Obrazac lijeka",
      telefon: "38269344556",
      obrazac: "Blanko",
      sastav: ["neki sastav 500mg", "3x dnevno", "Uzeti nakon obroka"],
      status: "Na čekanju",
      datumStatusa: "2025-05-25",
      ustanova: "KBC Zvezdara",
      ljekarId: 1,
      ljekar: "Dr Milan Nikolić",
      napomena: "",
      faksimil: "Dr. MN",
      farmaceut: "Farm. Luka Ilić",
      datumIzdavanja: "05.06.2025",
      lijek: "Neki lijek",
    },
  ];

  const doctorId = 1; // Prijavljeni ljekar
  const requests = allRequests.filter((r) => r.ljekarId === doctorId);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRequests = requests.filter((r) => {
    const datum = new Date(r.datum);
    const od = filters.datumOd ? new Date(filters.datumOd) : null;
    const doD = filters.datumDo ? new Date(filters.datumDo) : null;

    const combinedPacijentTelefon = (r.pacijent + r.telefon).toLowerCase();
    const combinedLijekSastav = (
      r.lijek +
      (Array.isArray(r.sastav) ? r.sastav.join(" ") : r.sastav)
    ).toLowerCase();

    return (
      (!od || datum >= od) &&
      (!doD || datum <= doD) &&
      combinedPacijentTelefon.includes(filters.pacijent.toLowerCase()) &&
      combinedLijekSastav.includes(filters.lijek.toLowerCase()) &&
      r.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite da izbrišete zahtjev?"
    );
    if (confirmed) {
      alert(`Zahtjev ID ${id} je sada pasivan.`);
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

      <FilterForm filters={filters} handleFilterChange={handleFilterChange} />

      <ActionButtons
        selectedRequest={filteredRequests.find((r) => r.id === selectedRowId)}
        handleDelete={handleDelete}
      />

      <RequestTable 
        filteredRequests={filteredRequests} 
        setSelectedRowId={setSelectedRowId} 
        selectedRowId={selectedRowId}
      />

      <div className="d-md-none">
        {filteredRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
    </>
  );
}

export default RequestList;