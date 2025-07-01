import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PregledUstanove from './PregledUstanova';
import DodajUstanovu from './DodajUstanovu';
import IzmijenaUstanova from './IzmjenaUstanove';

const AdminUstanove = ({ onNavigateToDoktori }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  
  const [filterData, setFilterData] = useState({
    nazivUstanove: '',
    nazivPoslovneJedinice: '',
    komitent: ''
  });
  
  const [selectedUstanova, setSelectedUstanova] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showPregled, setShowPregled] = useState(false);
  const [showDodaj, setShowDodaj] = useState(false);
  const [showIzmjena, setShowIzmjena] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [ustanove, setUstanove] = useState([
    {
      id: 1,
      nazivUstanove: 'Dom zdravlja Podgorica',
      nazivPoslovneJedinice: 'Ambulanta Centar',
      adresaPoslovneJedinice: 'Bulevar Oslobođenja 15',
      komitent: 'Fond zdravstvenog osiguranja',
      brojTelefonaPoslovnice: '+382 20 412 345',
      kontaktOsoba: {
        ime: 'Marko',
        prezime: 'Petrović',
        telefon: '+382 69 123 456'
      },
      kreiran: '2024-01-15'
    },
    {
      id: 2,
      nazivUstanove: 'Klinički centar Crne Gore',
      nazivPoslovneJedinice: 'Urgentni centar',
      adresaPoslovneJedinice: 'Ljubljanska bb',
      komitent: 'Ministarstvo zdravlja',
      brojTelefonaPoslovnice: '+382 20 412 111',
      kontaktOsoba: {
        ime: 'Ana',
        prezime: 'Nikolić',
        telefon: '+382 69 234 567'
      },
      kreiran: '2024-02-20'
    },
    {
      id: 3,
      nazivUstanove: 'Dom zdravlja Nikšić',
      nazivPoslovneJedinice: 'Poliklinika',
      adresaPoslovneJedinice: 'Sutjeska 2',
      komitent: 'Fond zdravstvenog osiguranja',
      brojTelefonaPoslovnice: '+382 40 213 456',
      kontaktOsoba: {
        ime: 'Petar',
        prezime: 'Jovanović',
        telefon: '+382 69 345 678'
      },
      kreiran: '2024-03-10'
    },
    {
      id: 4,
      nazivUstanove: 'Bolnica Cetinje',
      nazivPoslovneJedinice: 'Interno odeljenje',
      adresaPoslovneJedinice: 'Bajova 1',
      komitent: 'Ministarstvo zdravlja',
      brojTelefonaPoslovnice: '+382 41 234 567',
      kontaktOsoba: {
        ime: 'Milica',
        prezime: 'Stanković',
        telefon: '+382 69 456 789'
      },
      kreiran: '2024-04-05'
    },
    {
      id: 5,
      nazivUstanove: 'Specijalna bolnica Brezovik',
      nazivPoslovneJedinice: 'Rehabilitacija',
      adresaPoslovneJedinice: 'Brezovik bb',
      komitent: 'Fond zdravstvenog osiguranja',
      brojTelefonaPoslovnice: '+382 40 678 901',
      kontaktOsoba: {
        ime: 'Stefan',
        prezime: 'Milanović',
        telefon: '+382 69 567 890'
      },
      kreiran: '2024-05-12'
    },
    {
      id: 6,
      nazivUstanove: 'Institut za javno zdravlje',
      nazivPoslovneJedinice: 'Laboratorija',
      adresaPoslovneJedinice: 'Džordža Vašingtona 24',
      komitent: 'Ministarstvo zdravlja',
      brojTelefonaPoslovnice: '+382 20 456 789',
      kontaktOsoba: {
        ime: 'Jovana',
        prezime: 'Popović',
        telefon: '+382 69 678 901'
      },
      kreiran: '2024-06-01'
    },
    {
      id: 7,
      nazivUstanove: 'Dom zdravlja Bar',
      nazivPoslovneJedinice: 'Ambulanta Bar',
      adresaPoslovneJedinice: 'Jovana Tomaševića 1',
      komitent: 'Fond zdravstvenog osiguranja',
      brojTelefonaPoslovnice: '+382 30 345 678',
      kontaktOsoba: {
        ime: 'Nikola',
        prezime: 'Đurović',
        telefon: '+382 69 789 012'
      },
      kreiran: '2024-06-15'
    },
    {
      id: 8,
      nazivUstanove: 'Dom zdravlja Bijelo Polje',
      nazivPoslovneJedinice: 'Opšta medicina',
      adresaPoslovneJedinice: 'Miloja Pavićevića 1',
      komitent: 'Fond zdravstvenog osiguranja',
      brojTelefonaPoslovnice: '+382 50 234 567',
      kontaktOsoba: {
        ime: 'Dragana',
        prezime: 'Vukčević',
        telefon: '+382 69 890 123'
      },
      kreiran: '2024-06-20'
    }
  ]);

  const sidebarItems = [
    { icon: '⚡', title: 'Admin Panel', active: false, path: '/AdminPage' },
    { icon: '👥', title: 'Ljekari', active: false, path: '/AdminDoktori' },
    { icon: '🏢', title: 'Ustanove', active: true, path: '/AdminUstanove' },
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

  const handleNavigateToDoktori = () => {
    navigate('/AdminDoktori');
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
      setSelectedUstanova(null);
    } else {
      setShowResults(true);
    }
  };

  const handlePonistiFilter = () => {
    setFilterData({
      nazivUstanove: '',
      nazivPoslovneJedinice: '',
      komitent: ''
    });
  };

  const handleSelectUstanova = (ustanova) => {
    setSelectedUstanova(selectedUstanova?.id === ustanova.id ? null : ustanova);
  };

  const handleClickOutside = () => {
    setSelectedUstanova(null);
  };

  const handlePregled = () => {
    if (selectedUstanova) {
      setShowPregled(true);
    }
  };

  const handleIzmjena = () => {
    if (selectedUstanova) {
      setShowIzmjena(true);
    }
  };

  const handleBrisanje = () => {
    if (selectedUstanova) {
      setShowDeleteAlert(true);
    }
  };

  const confirmDelete = () => {
    if (selectedUstanova) {
      setUstanove(prev => prev.filter(ustanova => ustanova.id !== selectedUstanova.id));
      setSelectedUstanova(null);
      setShowDeleteAlert(false);
      alert(`Ustanova ${selectedUstanova.nazivUstanove} je uspješno obrisana!`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const handleDodaj = () => {
    setShowDodaj(true);
  };

  const handleBackFromPregled = () => {
    setShowPregled(false);
    setSelectedUstanova(null);
  };

  const handleBackFromDodaj = () => {
    setShowDodaj(false);
  };

  const handleBackFromIzmjena = () => {
    setShowIzmjena(false);
    setSelectedUstanova(null);
  };

  const handleEditFromPregled = () => {
    setShowPregled(false);
    setShowIzmjena(true);
  };

  const handleAddUstanova = (novaUstanova) => {
    const novaUstanovaId = Math.max(...ustanove.map(u => u.id)) + 1;
    const ustanovaZaDodavanje = {
      ...novaUstanova,
      id: novaUstanovaId,
      kreiran: new Date().toISOString().split('T')[0]
    };
    setUstanove(prev => [...prev, ustanovaZaDodavanje]);
    setShowDodaj(false);
  };

  const handleUpdateUstanova = (izmenjenaUstanova) => {
    setUstanove(prev => 
      prev.map(ustanova => 
        ustanova.id === izmenjenaUstanova.id ? izmenjenaUstanova : ustanova
      )
    );
    setShowIzmjena(false);
    setSelectedUstanova(null);
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredUstanove = ustanove.filter(ustanova => {
    return Object.keys(filterData).every(key => {
      if (!filterData[key]) return true;
      
      if (key === 'kontaktOsoba') {
        const kontaktInfo = `${ustanova.kontaktOsoba.ime} ${ustanova.kontaktOsoba.prezime} ${ustanova.kontaktOsoba.telefon}`;
        return kontaktInfo.toLowerCase().includes(filterData[key].toLowerCase());
      }
      
      return ustanova[key].toLowerCase().includes(filterData[key].toLowerCase());
    });
  }).sort((a, b) => {
    const dateA = new Date(a.kreiran);
    const dateB = new Date(b.kreiran);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Conditional rendering
  if (showPregled) {
    return (
      <PregledUstanove
        ustanova={selectedUstanova}
        onBack={handleBackFromPregled}
        onEdit={handleEditFromPregled}
        onNavigateToDoktori={onNavigateToDoktori}
      />
    );
  }

  if (showDodaj) {
    return (
      <DodajUstanovu
        onBack={handleBackFromDodaj}
        onSave={handleAddUstanova}
      />
    );
  }

  if (showIzmjena) {
    return (
      <IzmijenaUstanova
        ustanova={selectedUstanova}
        onBack={handleBackFromIzmjena}
        onSave={handleUpdateUstanova}
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

        /* Header */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          color: #1a1d29;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notifications {
          position: relative;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 18px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notifications:hover {
          background: #f8fafc;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          border-radius: 8px;
          border: 2px solid white;
          font-size: 10px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .time-display {
          background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 18px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'SF Mono', Monaco, monospace;
          letter-spacing: 0.5px;
        }

        .logout-btn {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 18px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        .sidebar-toggle {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 18px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-toggle:hover {
          background: #f8fafc;
          transform: scale(1.05);
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          left: 0;
          top: 64px;
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

        /* Main Content */
        .main-content {
          margin-left: ${sidebarCollapsed ? '72px' : '240px'};
          padding: 88px 32px 32px;
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

        /* Filter Card */
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

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        /* Add Institution Card - UPDATED */
        .add-institution-card {
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

        .add-institution-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
        }

        .add-institution-plus-icon {
          color: #10b981;
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
        }

        .add-institution-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
        }

        .add-institution-main-icon {
          font-size: 36px;
          color: #3b82f6;
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

        /* Table - UPDATED TO MATCH AdminDoktori */
        .table-container {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          /* Ograniči visinu i dodaj skrol */
          max-height: 500px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Dodajte i ovo za lepši skrol bar */
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

        .kontakt-info {
          font-size: 12px;
          line-height: 1.3;
        }

        .kontakt-info div:first-child {
          font-weight: 600;
          color: #1a1d29;
        }

        .kontakt-info div:last-child {
          color: #6b7280;
          margin-top: 2px;
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

          .add-institution-card {
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
          
          .header {
            padding: 0 16px;
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

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🏥</div>
            Cosmetics
          </div>
        </div>
        
        <div className="header-right">
          <div className="notifications">
            🔔
            <div className="notification-badge">3</div>
          </div>
          
          <div className="time-display">
            {currentTime.toLocaleTimeString('sr-RS', { 
              hour12: false,
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          
          <div 
            className="logout-btn"
            onClick={() => {
              if (window.confirm('Da li ste sigurni da se želite odjaviti?')) {
                alert('Odjavljujete se...');
              }
            }}
            title="Odjavi se"
          >
            🚪
          </div>
          
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="sidebar-label">Administrator</div>
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                onClick={() => {
                  if (item.path === '/AdminDoktori') handleNavigateToDoktori();
                  else navigate(item.path);
                }}
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
          <h1 className="page-title">Upravljanje Ustanovama</h1>
          <p className="page-subtitle">
            Pregledajte, dodajte i upravljajte zdravstvenim ustanovama u sistemu
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
                <label className="form-label">Naziv ustanove</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.nazivUstanove}
                  onChange={(e) => handleFilterChange('nazivUstanove', e.target.value)}
                  placeholder="Unesite naziv ustanove"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Naziv poslovne jedinice</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.nazivPoslovneJedinice}
                  onChange={(e) => handleFilterChange('nazivPoslovneJedinice', e.target.value)}
                  placeholder="Unesite naziv poslovne jedinice"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Komitent</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterData.komitent}
                  onChange={(e) => handleFilterChange('komitent', e.target.value)}
                  placeholder="Unesite komitenta"
                />
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

          {/* Add Institution Card - UPDATED */}
          <div className="add-institution-card" onClick={handleDodaj}>
            <div className="add-institution-plus-icon">+</div>
            <div className="add-institution-title">Dodaj novu ustanovu</div>
            <div className="add-institution-main-icon">🏥</div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="action-btn btn-pregled" 
                disabled={!selectedUstanova}
                onClick={handlePregled}
              >
                👁️ Pregled
              </button>
              <button 
                className="action-btn btn-izmijeni" 
                disabled={!selectedUstanova}
                onClick={handleIzmjena}
              >
                ✏️ Izmijeni
              </button>
              <button 
                className="action-btn btn-obrisi" 
                disabled={!selectedUstanova}
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
                      <th>Naziv ustanove</th>
                      <th>Naziv poslovne jedinice</th>
                      <th>Adresa poslovne jedinice</th>
                      <th>Komitent</th>
                      <th>Broj telefona poslovnice</th>
                      <th>Kontakt osoba</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUstanove.map(ustanova => (
                      <tr 
                        key={ustanova.id}
                        className={`table-row ${selectedUstanova?.id === ustanova.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUstanova(ustanova);
                        }}
                      >
                        <td>{formatDate(ustanova.kreiran)}</td>
                        <td style={{fontWeight: '600', color: '#1a1d29'}}>{ustanova.nazivUstanove}</td>
                        <td>{ustanova.nazivPoslovneJedinice}</td>
                        <td>{ustanova.adresaPoslovneJedinice}</td>
                        <td>{ustanova.komitent}</td>
                        <td>{ustanova.brojTelefonaPoslovnice}</td>
                        <td>
                          <div className="kontakt-info">
                            <div>{ustanova.kontaktOsoba.ime} {ustanova.kontaktOsoba.prezime}</div>
                            <div>{ustanova.kontaktOsoba.telefon}</div>
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
              {filteredUstanove.map(ustanova => (
                <div 
                  key={ustanova.id} 
                  className={`mobile-card ${selectedUstanova?.id === ustanova.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectUstanova(ustanova);
                  }}
                >
                  <div className="mobile-card-header">{ustanova.nazivUstanove}</div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Datum Kreiranja</div>
                    <div className="mobile-field-value">{formatDate(ustanova.kreiran)}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Poslovnica</div>
                    <div className="mobile-field-value">{ustanova.nazivPoslovneJedinice}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Adresa</div>
                    <div className="mobile-field-value">{ustanova.adresaPoslovneJedinice}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Komitent</div>
                    <div className="mobile-field-value">{ustanova.komitent}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Telefon poslovnice</div>
                    <div className="mobile-field-value">{ustanova.brojTelefonaPoslovnice}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Kontakt osoba</div>
                    <div className="mobile-field-value">
                      <strong>{ustanova.kontaktOsoba.ime} {ustanova.kontaktOsoba.prezime}</strong><br />
                      {ustanova.kontaktOsoba.telefon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUstanove.length === 0 && (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
                <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>Nema rezultata</div>
                <div>Nema ustanova koje odgovaraju vašem filteru.</div>
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
              Da li ste sigurni da želite da obrišete ustanovu <strong>{selectedUstanova?.nazivUstanove}</strong>?
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

export default AdminUstanove; 