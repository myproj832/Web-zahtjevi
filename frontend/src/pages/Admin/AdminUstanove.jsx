import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminUstanove.css';

const AdminUstanove = () => {
  const navigate = useNavigate();
  const { ustanove } = useAdmin();
  const [filters, setFilters] = useState({
    nazivUstanove: '',
    nazivPoslovneJedinice: '',
    komitent: '',
    status: ''
  });
  
  const [showTable, setShowTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // Promenjeno sa selectedRows na selectedRow
  const [sortConfig, setSortConfig] = useState({
    key: 'datumKreiranja',
    direction: 'desc'
  });

   // formatiranje telefona: "38269123123" → "+382 69 123 123"
 const formatPhone = (phone) => {
  if (!phone) return '-';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('382') && digits.length === 11) {
    return `+${digits.slice(0,3)} ${digits.slice(3,5)} ${digits.slice(5,8)} ${digits.slice(8)}`;
  }
  return phone;
};

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      nazivUstanove: '',
      nazivPoslovneJedinice: '',
      komitent: '',
      status: ''
    });
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const handleDodajUstanovu = () => {
    navigate('/DodajUstanovu');
  };

  const handleRowSelect = (id) => {
    setSelectedRow(selectedRow === id ? null : id); // Toggle selection - može da se deselektuje
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleIzmijeniUstanovu = () => {
    if (selectedRow) {
      navigate(`/IzmijeniUstanovu/${selectedRow}`);
    }
  };

  // Funkcija za filtriranje podataka
  const getFilteredData = () => {
   
       return ustanove.filter(u => {
    const nazivUstanoveFilter = filters.nazivUstanove.trim().toLowerCase();
    const nazivPJFilter = filters.nazivPoslovneJedinice.trim().toLowerCase();
    const statusFilter       = filters.status;

    const matchUstanova =
      !nazivUstanoveFilter ||
      (u.naziv_ustanove && u.naziv_ustanove.toLowerCase().includes(nazivUstanoveFilter));

    const matchPJ =
      !nazivPJFilter ||
      (u.naziv_pravnog && u.naziv_pravnog.toLowerCase().includes(nazivPJFilter));

      // const matchesKomitent = filters.komitent === '' || 
      //   ustanova.naziv_pravnog.toLowerCase().includes(filters.komitent.toLowerCase());
      
       const matchStatus = filters.status === '' || 
        u.status && u.status.toLowerCase() === filters.status.toLowerCase();
      return matchUstanova && matchPJ  && matchStatus;
    });
  };

  // Funkcija za sortiranje podataka
   const getSortedData = () => {
    const items = [...getFilteredData()];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '↕';
  };


  return (
    <div className="admin-ustanove-page background">
      {/* Fixed Header */}
      <Header />
      
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="admin-ustanove-main-content">
        <div className="container-fluid p-0">
          <div className="row g-3">
            {/* Filters Card */}
            <div className="col-12 col-lg-9">
              <div className="card admin-filters-card">
                <div className="card-header admin-card-header">
                  <h5 className="card-title mb-0">Filteri</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6 col-lg-4">
                      <label htmlFor="nazivUstanove" className="form-label">Naziv Pravnog Lica</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nazivUstanove"
                        value={filters.nazivUstanove}
                        onChange={(e) => handleFilterChange('nazivUstanove', e.target.value)}
                        placeholder="Unesite pravnog lica"
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <label htmlFor="nazivPoslovneJedinice" className="form-label">Naziv Poslovne Jedinice (Ustanove)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nazivPoslovneJedinice"
                        value={filters.nazivPoslovneJedinice}
                        onChange={(e) => handleFilterChange('nazivPoslovneJedinice', e.target.value)}
                        placeholder="Unesite naziv poslovne jedinice"
                      />
                    </div>
                    {/* <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="komitent" className="form-label">Komitent</label>
                        <div
                         className="dropdown-container"
                         data-tooltip="Ova akcija trenutno nije dostupna"
                         >
                      <select
                        className="form-select"
                        id="komitent"
                        value={filters.komitent}
                        onChange={(e) => handleFilterChange('komitent', e.target.value)}
                        disabled
                      >
                        <option value="">Odaberite komitenta</option>
                        <option value="Fond zdravstvenog osiguranja">Fond zdravstvenog osiguranja</option>
                        <option value="Ministarstvo zdravlja">Ministarstvo zdravlja</option>
                        <option value="Privatni">Privatni</option>
                      </select>
                      </div>
                    </div> */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">Odaberite status</option>
                        <option value="A">Aktivan</option>
                        <option value="P">Pasiviziran</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="button-group">
                        <button
                          className="button"
                          onClick={handleShowTable}
                        >
                          {showTable ? 'Sakrij listu ustanova' : 'Prikaži listu ustanova'}
                        </button>
                        <button
                          className="buttonx"
                          onClick={handleResetFilters}
                        >
                          Poništi filtere
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Institution Card */}
            <div className="col-12 col-lg-3">
              <div className="card admin-add-card">
                <div className="card-body text-center">
                  <button
                    className="button admin-add-btn"
                    onClick={handleDodajUstanovu}
                  >
                    <div className="admin-add-icon">
                      🏥
                    </div>
                    <span>Dodaj ustanovu</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table Section */}
            {showTable && (
              <div className="col-12">
                {selectedRow && (
                  <div className="selected-actions mb-3">
                    <button
                      className="button"
                      onClick={handleIzmijeniUstanovu}
                    >
                      Izmjeni ustanovu (1 označena)
                    </button>
                  </div>
                )}
                
                <div className="card admin-table-card">
                  <div className="card-header admin-card-header">
                    <h5 className="card-title mb-0">Lista ustanova</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive admin-table-container">
                      <table className="table table-hover mb-0">
                        <thead className="table-header">
                          <tr>
                            <th scope="col" className="header-col-0">
                              Odabir
                            </th>
                            <th 
                              scope="col" 
                              className="sortable-header header-col-1"
                              onClick={() => handleSort('datum_kreiranja')}
                            >
                              Datum kreiranja {getSortIcon('datumKreiranja')}
                            </th>
                            {/* <th 
                              scope="col" 
                              className="sortable-header header-col-2"
                              onClick={() => handleSort('datum_pasiviziranja')}
                            >
                              Datum pasiviziranja {getSortIcon('datumPasiviziranja')}
                            </th> */}
                            <th scope="col" className="header-col-3">Naziv Pravnog lica</th>
                            <th scope="col" className="header-col-4">Naziv Poslovne Jedinice (Ustanove)</th>
                            <th scope="col" className="header-col-5">Adresa Poslovne Jedinice (Ustanove)</th>
                            <th scope="col" className="header-col-6">Grad Poslovne Jedinice (Ustanove)</th>
                            <th scope="col" className="header-col-7">Broj Telefona Poslovnice (Ustanove)</th>
                            {/* <th scope="col" className="header-col-8">Kontakt Osoba</th> */}
                            {/* <th scope="col" className="header-col-9">Napomena</th> */}
                            <th scope="col" className="header-col-10">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                           {getSortedData().map(u => (
                            <tr key={u.id_ust} className={selectedRow === u.id_ust ? 'table-row-selected' : ''}>
                            
                              <td className="data-col-0">
                                <input
                                  type="radio"
                                  name="selectedUstanova"
                                  checked={selectedRow === u.id_ust}
                                  onChange={() => handleRowSelect(u.id_ust)}
                                  onClick={() => handleRowSelect(u.id_ust)}
                                />
                              </td>
                              <td className="data-col-1">{u.datum_kreiranja}</td>
                              {/* <td className="data-col-2">{u.datum_pasiviziranja || '-'}</td> */}
                              <td className="fw-medium data-col-3">{u.naziv_pravnog}</td>
                              <td className="data-col-4">{u.naziv_ustanove}</td>
                              <td className="data-col-5">{u.adresa_ustanove}</td>
                              <td className="data-col-6">
                                <span className={`badge ${u.naziv_mjesto === 'Podgorica' ? 'bg-info' : 'bg-info'}`}>
                                {u.naziv_mjesto}
                                </span>
                              </td>
                              <td className="data-col-7">{formatPhone(u.tel_ustanove)}</td>
                              {/* <td className="data-col-8">{u.kontakt_osoba}</td> */}
                              {/* <td className="data-col-9">{u.napomena}</td> */}
                              <td className="data-col-10">
                              <span
  className={`badge ${
    u.status === 'A'
      ? 'badge-status-aktivan'
      : u.status === 'P'
      ? 'badge-status-pasiviziran'
      : ''
  }`}
>
  {u.status === 'A' ? 'Aktivan' : u.status === 'P' ? 'Pasivan' : u.status}
</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUstanove;