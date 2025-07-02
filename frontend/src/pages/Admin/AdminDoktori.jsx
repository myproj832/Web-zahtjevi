import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Dodao import za Header komponentu
import PregledDoktora from './PregledDoktora';
import IzmjenaDoktora from './IzmjenaDoktora';
import DodajDoktora from './DodajDoktora';

const AdminDoktori = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  
  const [filterData, setFilterData] = useState({
    imeIPrezime: '',
    brojLicence: '',
    institucija: ''
  });
  
  const [selectedDoktor, setSelectedDoktor] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showPregled, setShowPregled] = useState(false);
  const [showIzmjena, setShowIzmjena] = useState(false);
  const [fromPregled, setFromPregled] = useState(false);
  const [showDodaj, setShowDodaj] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data za testiranje sa dodanim datumima
  const [doktori, setDoktori] = useState([
    {
      id: 1,
      imePrezime: 'Marko Petrović',
      brojLicence: 'DOK001',
      adresa: 'Bulevar Oslobođenja 12',
      specijalizacija: 'Kardiolog',
      ustanove: ['Dom zdravlja Podgorica', 'Klinički centar Crne Gore'],
      countryCode: '+382',
      brojTelefona: '67 123 456',
      email: 'marko.petrovic@email.com',
      napomena: 'Iskusan doktor sa 15 godina prakse',
      login: 'marko.petrovic@email.com',
      password: 'mG7xK9pL2qWe',
      kreiran: '2024-01-15'
    },
    {
      id: 2,
      imePrezime: 'Ana Jovanović',
      brojLicence: 'DOK002',
      adresa: 'Njegoševa 25',
      specijalizacija: 'Neurolog',
      ustanove: ['Klinički centar Crne Gore'],
      countryCode: '+382',
      brojTelefona: '67 789 012',
      email: 'ana.jovanovic@email.com',
      napomena: 'Specijalizovana za dečju neurologiju',
      login: 'ana.jovanovic@email.com',
      password: 'aH5mN8qR4tYu',
      kreiran: '2024-02-20'
    },
    {
      id: 3,
      imePrezime: 'Petar Nikolić',
      brojLicence: 'DOK003',
      adresa: 'Cetinjska 45',
      specijalizacija: 'Ortoped',
      ustanove: ['Dom zdravlja Nikšić', 'Specijalna bolnica Brezovik'],
      countryCode: '+382',
      brojTelefona: '69 555 333',
      email: 'petar.nikolic@email.com',
      napomena: '',
      login: 'petar.nikolic@email.com',
      password: 'pL3zX7vB9nMk',
      kreiran: '2024-03-10'
    }
  ]);

  // Lista ustanova
  const ustanove = [
    'Dom zdravlja Podgorica',
    'Klinički centar Crne Gore',
    'Dom zdravlja Nikšić',
    'Bolnica Cetinje',
    'Specijalna bolnica Brezovik',
    'Institut za javno zdravlje',
    'Dom zdravlja Bar',
    'Dom zdravlja Bijelo Polje'
  ];

  const sidebarItems = [
    { icon: '⚡', title: 'Admin Panel', active: false, path: '/AdminPage' },
    { icon: '👥', title: 'Ljekari', active: true, path: '/AdminDoktori' },
    { icon: '🏢', title: 'Ustanove', active: false, path: '/AdminUstanove' },
    { icon: '📄', title: 'Zahtjevi', active: false, path: '/AdminZahtjevi' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrikazi = () => {
    const svaPoljaVrazna = Object.values(filterData).every(value => value === '');
    
    if (svaPoljaVrazna && showResults) {
      setShowResults(false);
      setSelectedDoktor(null);
    } else {
      setShowResults(true);
    }
  };

  const handlePonistiFilter = () => {
    setFilterData({
      imeIPrezime: '',
      brojLicence: '',
      institucija: ''
    });
  };

  const handleSelectDoktor = (doktor) => {
    setSelectedDoktor(selectedDoktor?.id === doktor.id ? null : doktor);
  };

  const handleClickOutside = () => {
    setSelectedDoktor(null);
  };

  const handlePregled = () => {
    if (selectedDoktor) {
      setShowPregled(true);
    }
  };

  const handleIzmjena = () => {
    if (selectedDoktor) {
      setFromPregled(false);
      setShowIzmjena(true);
    }
  };

  const handleBrisanje = () => {
    if (selectedDoktor) {
      setShowDeleteAlert(true);
    }
  };

  const confirmDelete = () => {
    if (selectedDoktor) {
      setDoktori(prev => prev.filter(doktor => doktor.id !== selectedDoktor.id));
      setSelectedDoktor(null);
      setShowDeleteAlert(false);
      alert(`Doktor ${selectedDoktor.imePrezime} je uspješno obrisan!`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const handleDodaj = () => {
    setShowDodaj(true);
  };

  const handleSaveNewDoktor = (newDoktor) => {
    const formattedDoktor = {
      ...newDoktor,
      kreiran: new Date().toISOString().split('T')[0]
    };
    setDoktori(prev => [...prev, formattedDoktor]);
    setShowDodaj(false);
    alert(`Doktor ${newDoktor.imePrezime} je uspješno dodan!`);
  };

  const handleSaveDoktor = (updatedDoktor) => {
    console.log('Čuvanje doktora:', updatedDoktor);
    alert(`Doktor ${updatedDoktor.imePrezime} je uspješno ažuriran!`);
    setShowIzmjena(false);
    setFromPregled(false);
    setSelectedDoktor(null);
  };

  const handleBackFromIzmjena = () => {
    if (fromPregled) {
      setShowIzmjena(false);
      setShowPregled(true);
    } else {
      setShowIzmjena(false);
      setSelectedDoktor(null);
    }
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredDoktori = doktori.filter(doktor => {
    const imeIPrezime = doktor.imePrezime.toLowerCase();
    const filterImeIPrezime = filterData.imeIPrezime.toLowerCase();
    
    return (
      (!filterData.imeIPrezime || imeIPrezime.includes(filterImeIPrezime)) &&
      (!filterData.brojLicence || doktor.brojLicence.toLowerCase().includes(filterData.brojLicence.toLowerCase())) &&
      (!filterData.institucija || doktor.ustanove.includes(filterData.institucija))
    );
  }).sort((a, b) => {
    const dateA = new Date(a.kreiran);
    const dateB = new Date(b.kreiran);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Conditional rendering
  if (showDodaj) {
    return (
      <DodajDoktora
        onBack={() => setShowDodaj(false)}
        onSave={handleSaveNewDoktor}
      />
    );
  }

  if (showPregled) {
    return (
      <PregledDoktora 
        doktor={selectedDoktor} 
        onBack={() => setShowPregled(false)}
        onEdit={() => {
          setShowPregled(false);
          setFromPregled(true);
          setShowIzmjena(true);
        }}
      />
    );
  }

  if (showIzmjena) {
    return (
      <IzmjenaDoktora 
        doktor={selectedDoktor} 
        onBack={handleBackFromIzmjena}
        onSave={handleSaveDoktor}
        fromPregled={fromPregled}
      />
    );
  }

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Uklonili smo sve header stilove jer koristimo Header komponentu */

        /* Sidebar */
        .sidebar {
          position: fixed;
          left: 0;
          top: 64px; /* Zadržavamo offset za header */
          width: ${sidebarCollapsed ? '72px' : '240px'};
          height: calc(100vh - 64px);
          background: white;
          border-right: 1px solid rgba(0, 0, 0, 0.06);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999;
          overflow: hidden;
        }

        .sidebar-content {
          padding: 24px 0;
          height: 100%;
          overflow-y: auto;
        }

        .sidebar-section {
          margin-bottom: 32px;
        }

        .sidebar-label {
          padding: 0 20px;
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          margin: 0 12px;
          border-radius: 12px;
        }

        .sidebar-item:hover {
          background: #f8fafc;
          color: #374151;
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #3b82f6;
          border-radius: 2px;
        }

        .sidebar-icon {
          font-size: 16px;
          min-width: 16px;
          text-align: center;
        }

        .sidebar-text {
          font-weight: 500;
          font-size: 14px;
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
        }

        /* Header fiksiran na vrhu */
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        /* Sidebar toggle dugme u sidebar-u */
        .sidebar-toggle {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 1001;
          font-size: 14px;
          color: #6b7280;
        }

        .sidebar-toggle:hover {
          background: #e2e8f0;
          color: #374151;
          transform: scale(1.05);
        }

        /* Main Content - povećan top padding */
        .main-content {
          margin-left: ${sidebarCollapsed ? '72px' : '240px'};
          padding: 100px 32px 32px; /* Povećao sa 88px na 100px */
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          font-weight: 400;
        }

        /* Cards Layout */
        .cards-layout {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Filter Card - made smaller */
        .filter-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
        }

        /* Add Doctor Card - UPDATED TO MATCH AdminUstanove */
        .add-doctor-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          padding: 20px 16px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
          backdrop-filter: blur(10px);
          min-width: 240px;
          height: auto;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 12px;
        }

        .add-doctor-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
        }

        .add-doctor-plus-icon {
          color: #10b981;
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
        }

        .add-doctor-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
        }

        .add-doctor-main-icon {
          font-size: 36px;
          color: #3b82f6;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-control, .form-select {
          height: 40px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          padding: 0 12px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .form-control:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-secondary {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #6b7280;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
          color: #374151;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          align-items: center;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-pregled {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #e0f2fe;
        }

        .btn-pregled:hover:not(:disabled) {
          background: #e0f2fe;
        }

        .btn-izmijeni {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fef3c7;
        }

        .btn-izmijeni:hover:not(:disabled) {
          background: #fef3c7;
        }

        .btn-obrisi {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .btn-obrisi:hover:not(:disabled) {
          background: #fecaca;
        }

        /* Table */
        .table-container {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          max-height: 500px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .table-container::-webkit-scrollbar {
          width: 8px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .table th:nth-child(odd) {
          background: rgba(59, 130, 246, 0.12);
        }

        .table td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          vertical-align: top;
        }

        .table td:nth-child(odd) {
          background: rgba(59, 130, 246, 0.06);
        }

        .table-row {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8fafc !important;
        }

        .table-row:hover td {
          background: #f8fafc !important;
        }

        .table-row.selected {
          background: rgba(107, 114, 128, 0.1) !important;
        }

        .table-row.selected td {
          background: rgba(107, 114, 128, 0.1) !important;
        }

        .sort-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          margin-left: 8px;
          font-size: 12px;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .sort-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #374151;
        }

        .ustanove-list {
          max-height: 60px;
          overflow-y: auto;
          font-size: 12px;
          line-height: 1.3;
        }

        .ustanova-item {
          margin-bottom: 2px;
          padding: 1px 0;
        }

        .contact-info {
          font-size: 12px;
          line-height: 1.3;
        }

        .contact-info div:last-child {
          color: #6b7280;
        }

        .napomena-text {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-style: italic;
          color: #6b7280;
          font-size: 12px;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: none;
        }

        .mobile-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .mobile-card.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.02);
        }

        .mobile-card-header {
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .mobile-field {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .mobile-field-label {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-field-value {
          color: #1a1d29;
          margin-top: 2px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 12px;
          text-align: center;
        }

        .modal-message {
          color: #6b7280;
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.5;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .modal-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .modal-btn-cancel {
          background: #f8fafc;
          color: #6b7280;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-cancel:hover {
          background: #f1f5f9;
          color: #374151;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .cards-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .add-doctor-card {
            min-width: auto;
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(${sidebarCollapsed ? '-100%' : '0'});
            width: 240px;
          }
          
          .main-content {
            margin-left: 0;
            padding: 88px 16px 32px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .quick-actions-card {
            min-width: auto;
            width: 100%;
          }
          
          .filter-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .filter-buttons {
            flex-direction: column;
          }
          
          .table-container {
            display: none;
          }
          
          .mobile-cards {
            display: block;
          }
          
          .action-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* Header fiksiran na vrhu */}
      <div className="header-container">
        <Header />
      </div>

      {/* Sidebar */}
      <nav className="sidebar">
        {/* Sidebar toggle dugme u sidebar-u */}
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Proširi sidebar' : 'Suzi sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="sidebar-label">Administrator</div>
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Upravljanje Ljekarima</h1>
          <p className="page-subtitle">
            Pregledajte, dodajte i upravljajte ljekarima u sistemu
          </p>
        </div>

        {/* Cards Layout */}
        <div className="cards-layout">
          {/* Filter Card */}
          <div className="filter-card">
            <div className="filter-header">
              <h2 className="filter-title">Filteri</h2>
            </div>
            
            <div className="filter-grid">
              <div className="form-group">
                <label className="form-label">Ime i prezime</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.imeIPrezime}
                  onChange={(e) => handleFilterChange('imeIPrezime', e.target.value)}
                  placeholder="Unesite ime i prezime"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Broj licence</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.brojLicence}
                  onChange={(e) => handleFilterChange('brojLicence', e.target.value)}
                  placeholder="Unesite broj licence"
                  maxLength="10"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Ustanova</label>
                <select
                  className="form-select"
                  value={filterData.institucija}
                  onChange={(e) => handleFilterChange('institucija', e.target.value)}
                >
                  <option value="">Sve ustanove</option>
                  {ustanove.map((ustanova, index) => (
                    <option key={index} value={ustanova}>
                      {ustanova}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-buttons">
              <button className="btn-secondary" onClick={handlePonistiFilter}>
                Poništi filter
              </button>
              <button className="btn-primary" onClick={handlePrikazi}>
                {showResults && Object.values(filterData).every(value => value === '') ? 'Sakrij' : 'Prikaži'}
              </button>
            </div>
          </div>

          {/* Add Doctor Card - UPDATED TO MATCH AdminUstanove */}
          <div className="add-doctor-card" onClick={handleDodaj}>
            <div className="add-doctor-plus-icon">+</div>
            <div className="add-doctor-title">Dodaj novog ljekara</div>
            <div className="add-doctor-main-icon">👨‍⚕️</div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="action-btn btn-pregled" 
                disabled={!selectedDoktor}
                onClick={handlePregled}
              >
                👁️ Pregled
              </button>
              <button 
                className="action-btn btn-izmijeni" 
                disabled={!selectedDoktor}
                onClick={handleIzmjena}
              >
                ✏️ Izmijeni
              </button>
              <button 
                className="action-btn btn-obrisi" 
                disabled={!selectedDoktor}
                onClick={handleBrisanje}
              >
                🗑️ Obriši
              </button>
            </div>

            {/* Desktop Table */}
            <div className="table-container" onClick={handleClickOutside}>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        Datum Kreiranja
                        <button 
                          className="sort-btn"
                          onClick={handleSortChange}
                          title={sortOrder === 'desc' ? 'Sortiraj rastuće' : 'Sortiraj opadajuće'}
                        >
                          {sortOrder === 'desc' ? '↓' : '↑'}
                        </button>
                      </th>
                      <th>Ime i Prezime</th>
                      <th>Kontakt</th>
                      <th>Ustanova</th>
                      <th>Specijalizacija</th>
                      <th>Broj licence</th>
                      <th>Napomena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoktori.map(doktor => (
                      <tr 
                        key={doktor.id}
                        className={`table-row ${selectedDoktor?.id === doktor.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDoktor(doktor);
                        }}
                      >
                        <td>{formatDate(doktor.kreiran)}</td>
                        <td style={{fontWeight: '600', color: '#1a1d29'}}>{doktor.imePrezime}</td>
                        <td>
                          <div className="contact-info">
                            <div>{doktor.countryCode} {doktor.brojTelefona}</div>
                            <div>{doktor.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="ustanove-list" title={doktor.ustanove.join(', ')}>
                            {doktor.ustanove.map((ustanova, index) => (
                              <div key={index} className="ustanova-item">{ustanova}</div>
                            ))}
                          </div>
                        </td>
                        <td>{doktor.specijalizacija}</td>
                        <td>{doktor.brojLicence}</td>
                        <td>
                          <div className="napomena-text" title={doktor.napomena}>
                            {doktor.napomena || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards" onClick={handleClickOutside}>
              {filteredDoktori.map(doktor => (
                <div 
                  key={doktor.id} 
                  className={`mobile-card ${selectedDoktor?.id === doktor.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDoktor(doktor);
                  }}
                >
                  <div className="mobile-card-header">{doktor.imePrezime}</div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Datum Kreiranja</div>
                    <div className="mobile-field-value">{formatDate(doktor.kreiran)}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Licenca</div>
                    <div className="mobile-field-value">{doktor.brojLicence}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Specijalizacija</div>
                    <div className="mobile-field-value">{doktor.specijalizacija}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Ustanove</div>
                    <div className="mobile-field-value">{doktor.ustanove.join(', ')}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Kontakt</div>
                    <div className="mobile-field-value">
                      {doktor.countryCode} {doktor.brojTelefona}<br />
                      {doktor.email}
                    </div>
                  </div>
                  
                  {doktor.napomena && (
                    <div className="mobile-field">
                      <div className="mobile-field-label">Napomena</div>
                      <div className="mobile-field-value" style={{fontStyle: 'italic'}}>{doktor.napomena}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredDoktori.length === 0 && (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
                <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>Nema rezultata</div>
                <div>Nema doktora koji odgovaraju vašem filteru.</div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Potvrda brisanja</div>
            <div className="modal-message">
              Da li ste sigurni da želite da obrišete doktora <strong>{selectedDoktor?.imePrezime}</strong>?
              <br />Ova akcija se ne može poništiti.
            </div>
            <div className="modal-buttons">
              <button className="modal-btn-danger" onClick={confirmDelete}>
                Da, obriši
              </button>
              <button className="modal-btn-cancel" onClick={cancelDelete}>
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoktori;