import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDoktori.css';

const AdminDoktori = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    imeIPrezime: '',
    brojLicence: '',
    ustanova: '',
    status: ''
  });
  
  const [showTable, setShowTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'datumKreiranja',
    direction: 'desc'
  });

  // Mock data based on the image - replace with actual API call
  const [doktori, setDoktori] = useState([
    {
      id: 1,
      datumKreiranja: '2024-01-15',
      datumPasiviziranja: null,
      imeIPrezime: 'Marko Petrović',
      kontakt: '+382 67 123 456\nmarko.petrovic@email.com',
      ustanova: 'Dom zdravlja Podgorica\nKlinički centar Crne Gore\nSpecijalna bolnica Brezovik',
      specijalizacija: 'Kardiolog',
      brojLicence: 'DOK001',
      napomena: 'Iskusan doktor sa 15 godina...',
      status: 'Aktivan'
    },
    {
      id: 2,
      datumKreiranja: '2024-02-20',
      datumPasiviziranja: null,
      imeIPrezime: 'Ana Jovanović',
      kontakt: '+382 67 789 012\nana.jovanovic@email.com',
      ustanova: 'Klinički centar Crne Gore\nDom zdravlja Podgorica',
      specijalizacija: 'Neurolog',
      brojLicence: 'DOK002',
      napomena: 'Specijalizovana za dečiju...',
      status: 'Aktivan'
    },
    {
      id: 3,
      datumKreiranja: '2024-03-10',
      datumPasiviziranja: '2024-06-15',
      imeIPrezime: 'Petar Nikolić',
      kontakt: '+382 69 555 333\npetar.nikolic@email.com',
      ustanova: 'Dom zdravlja Nikšić\nSpecijalna bolnica Brezovik\nKlinički centar Crne Gore',
      specijalizacija: 'Ortoped',
      brojLicence: 'DOK003',
      napomena: '',
      status: 'Pasiviziran'
    }
  ]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      imeIPrezime: '',
      brojLicence: '',
      ustanova: '',
      status: ''
    });
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const handleDodajDoktora = () => {
    navigate('/DodajDoktora');
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

  const handleIzmijeniDoktora = () => {
    if (selectedRow) {
      navigate(`/IzmijeniDoktora/${selectedRow}`);
    }
  };

  // Funkcija za filtriranje podataka
  const getFilteredData = () => {
    return doktori.filter(doktor => {
      const matchesIme = filters.imeIPrezime === '' || 
        doktor.imeIPrezime.toLowerCase().includes(filters.imeIPrezime.toLowerCase());
      
      const matchesBrojLicence = filters.brojLicence === '' || 
        doktor.brojLicence.toLowerCase().includes(filters.brojLicence.toLowerCase());
      
      const matchesUstanova = filters.ustanova === '' || 
        doktor.ustanova.toLowerCase().includes(filters.ustanova.toLowerCase());
      
      const matchesStatus = filters.status === '' || 
        doktor.status.toLowerCase() === filters.status.toLowerCase();
      
      return matchesIme && matchesBrojLicence && matchesUstanova && matchesStatus;
    });
  };

  const getSortedData = () => {
    const filteredData = getFilteredData();
    const sortableItems = [...filteredData];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '↕';
  };

  return (
    <div className="admin-doktori-page background">
      {/* Fixed Header */}
      <Header />
      
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="admin-doktori-main-content">
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
                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="imeIPrezime" className="form-label">Ime i Prezime</label>
                      <input
                        type="text"
                        className="form-control"
                        id="imeIPrezime"
                        value={filters.imeIPrezime}
                        onChange={(e) => handleFilterChange('imeIPrezime', e.target.value)}
                        placeholder="Unesite ime i prezime"
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="brojLicence" className="form-label">Broj licence</label>
                      <input
                        type="text"
                        className="form-control"
                        id="brojLicence"
                        value={filters.brojLicence}
                        onChange={(e) => handleFilterChange('brojLicence', e.target.value)}
                        placeholder="Unesite broj licence"
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="ustanova" className="form-label">Ustanova</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ustanova"
                        value={filters.ustanova}
                        onChange={(e) => handleFilterChange('ustanova', e.target.value)}
                        placeholder="Unesite naziv ustanove"
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">Odaberite status</option>
                        <option value="aktivan">Aktivan</option>
                        <option value="pasiviziran">Pasiviziran</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="button-group">
                        <button
                          className="button"
                          onClick={handleShowTable}
                        >
                          {showTable ? 'Sakrij' : 'Prikaži'}
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

            {/* Add Doctor Card */}
            <div className="col-12 col-lg-3">
              <div className="card admin-add-card">
                <div className="card-body text-center">
                  <button
                    className="button admin-add-btn"
                    onClick={handleDodajDoktora}
                  >
                    <div className="admin-add-icon">
                      👨‍⚕️
                    </div>
                    <span>Dodaj ljekara</span>
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
                      onClick={handleIzmijeniDoktora}
                    >
                      Izmjeni doktora (1 označen)
                    </button>
                  </div>
                )}
                
                <div className="card admin-table-card">
                  <div className="card-header admin-card-header">
                    <h5 className="card-title mb-0">Lista ljekara</h5>
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
                              onClick={() => handleSort('datumKreiranja')}
                            >
                              Datum kreiranja {getSortIcon('datumKreiranja')}
                            </th>
                            <th 
                              scope="col" 
                              className="sortable-header header-col-2"
                              onClick={() => handleSort('datumPasiviziranja')}
                            >
                              Datum pasiviziranja {getSortIcon('datumPasiviziranja')}
                            </th>
                            <th scope="col" className="header-col-3">Ime i Prezime</th>
                            <th scope="col" className="header-col-4">Kontakt</th>
                            <th scope="col" className="header-col-5">Ustanova</th>
                            <th scope="col" className="header-col-6">Specijalizacija</th>
                            <th scope="col" className="header-col-7">Broj licence</th>
                            <th scope="col" className="header-col-8">Napomena</th>
                            <th scope="col" className="header-col-9">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSortedData().map((doktor) => (
                            <tr 
                              key={doktor.id}
                              className={selectedRow === doktor.id ? 'table-row-selected' : ''}
                            >
                              <td className="data-col-0">
                                <input
                                  type="radio"
                                  name="selectedDoktor"
                                  checked={selectedRow === doktor.id}
                                  onChange={() => handleRowSelect(doktor.id)}
                                  onClick={() => handleRowSelect(doktor.id)}
                                />
                              </td>
                              <td className="data-col-1">{doktor.datumKreiranja}</td>
                              <td className="data-col-2">{doktor.datumPasiviziranja || '-'}</td>
                              <td className="fw-medium data-col-3">{doktor.imeIPrezime}</td>
                              <td className="data-col-4" style={{fontSize: '0.85rem'}}>
                                {doktor.kontakt}
                              </td>
                              <td className="data-col-5" style={{fontSize: '0.85rem'}}>
                                {doktor.ustanova}
                              </td>
                              <td className="data-col-6">{doktor.specijalizacija}</td>
                              <td className="data-col-7">
                                <span className="badge bg-info">{doktor.brojLicence}</span>
                              </td>
                              <td className="data-col-8">{doktor.napomena}</td>
                              <td className="data-col-9">
                                <span className={`badge ${doktor.status === 'Aktivan' ? 'badge-status-aktivan' : 'badge-status-pasiviziran'}`}>
                                  {doktor.status}
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

export default AdminDoktori;