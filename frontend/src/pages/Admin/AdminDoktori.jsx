import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDoktori.css';

const AdminDoktori = () => {
  const { ljekari, ustanove, fetchLjekari } = useAdmin();
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

  useEffect(() => {
  fetchLjekari().catch(console.error);
}, []);

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
    const doktorData = ljekari.map(d => ({
  id: Number(d.id_kor),
  datumKreiranja: d.dat_kreiranja,      // format ostavljamo kakav backend daje
  datumPasiviziranja: null,            // izbacićemo jer nema u bazi
  imeIPrezime: d.ime,
  kontakt: `${d.telefon || '-'}\n${d.email}`,
  ustanova: d.ustanove
    .map(u => {
      const ust = ustanove.find( item => String(item.id_ust) === String(u.id_ustanove));
      return ust ? ust.naziv_ustanove : `#${u.id_ustanove}`;
    })
    .join('\n'),
  specijalizacija: d.specijalizacija,
  brojLicence: d.licenca,
  napomena: '',                         // nema u bazi
  status: d.status === 'A' ? 'Aktivan' : 'Pasiviziran'
}));

  // Funkcija za filtriranje podataka
  const getFilteredData = () => {
    return doktorData.filter(doktor => {
      const matchesIme = filters.imeIPrezime === '' ||
        doktor.imeIPrezime.toLowerCase().includes(filters.imeIPrezime.toLowerCase());
      
      const matchesBrojLicence = filters.brojLicence === '' || 
        (doktor.brojLicence || '').toLowerCase().includes(filters.brojLicence.toLowerCase());
      
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

const formatPhone = (raw) => {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('382') && digits.length === 11) {
    const rest = digits.slice(3);            // "69123123"
    const part1 = rest.slice(0, 2);          // "69"
    const part2 = rest.slice(2, 5);          // "123"
    const part3 = rest.slice(5, 8);          // "123"
    return `+382 ${part1} ${part2} ${part3}`;
  }
  return raw;  // fallback: vraća nepromijenjeni string
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
                          {showTable ? 'Sakrij listu ljekara' : 'Prikaži listu ljekara'}
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
                    <div className="table-responsive-sm admin-table-container">
                      <table className="table table-hover-sm mb-0">
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
                            {/* <th 
                              scope="col" 
                              className="sortable-header header-col-2"
                              onClick={() => handleSort('datumPasiviziranja')}
                            >
                              Datum pasiviziranja {getSortIcon('datumPasiviziranja')}
                            </th> */}
                            <th scope="col" className="header-col-3">Ime i Prezime</th>
                            <th scope="col" className="header-col-4">Kontakt</th>
                            <th scope="col" className="header-col-5">Ustanova</th>
                            <th scope="col" className="header-col-6">Specijalizacija</th>
                            <th scope="col" className="header-col-7">Broj licence</th>
                            {/* <th scope="col" className="header-col-8">Napomena</th> */}
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
                              {/* <td className="data-col-2">{doktor.datumPasiviziranja || '-'}</td> */}
                              <td className="fw-medium data-col-3">{doktor.imeIPrezime}</td>
                              <td className="data-col-4" style={{fontSize: '0.85rem'}}>
                                 {(() => {
                                 const [phoneRaw, email] = doktor.kontakt.split('\n');
                                 return (
                                  <>
                                 <div>Tel: {formatPhone(phoneRaw)}</div>
                                 <div>Email: {email}</div>
                                 </>
                              );
                               })()}
                                </td>
                              <td className="data-col-5" style={{fontSize: '0.85rem'}}>
                                 {doktor.ustanova.split('\n').map((u, i) => (
                                 <div key={i}>{u}</div>
                                 ))}
                                 </td>
                              
                              <td className="data-col-6">{doktor.specijalizacija}</td>
                              <td className="data-col-7">
                                <span className="badge bg-info">{doktor.brojLicence}</span>
                              </td>
                              {/* <td className="data-col-8">{doktor.napomena}</td> */}
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