import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PregledZahtjeva from './PregledZahtjeva';

const AdminZahtjevi = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  
  const [filterData, setFilterData] = useState({
    datumOd: '',
    datumDo: '',
    pacijent: '',
    ustanova: '',
    tipZahtjeva: ''
  });
  
  const [selectedZahtjev, setSelectedZahtjev] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showPregled, setShowPregled] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data za zahtjeve
  const [zahtjevi, setZahtjevi] = useState([
    {
      id: 1,
      datum: '2024-06-24',
      vreme: '20:15:18',
      pacijent: 'Marko Marković',
      telefon: '123456789',
      tipZahtjeva: 'Ljekar',
      ustanova: 'Dom zdravlja Beograd',
      ljekar: 'Dr Ivana Miković',
      status: 'kreiran',
      napomena: 'JOŠĆPKARMAGRAGAAC',
      farmaceut: '',
      datumIzdavanja: ''
    },
    {
      id: 2,
      datum: '2024-06-24',
      vreme: '20:30:52',
      pacijent: 'Marko Marković',
      telefon: '123456789',
      tipZahtjeva: 'Ljekar',
      ustanova: 'Dom zdravlja Beograd',
      ljekar: 'Dr Ivana Miković',
      status: 'kreiran',
      napomena: '',
      farmaceut: '',
      datumIzdavanja: ''
    },
    {
      id: 3,
      datum: '2024-06-27',
      vreme: '08:14:07',
      pacijent: 'Ana Petrović',
      telefon: '987654321',
      tipZahtjeva: 'Apotekar',
      ustanova: 'Apoteka Zdravlje',
      ljekar: 'Dr Marko Jovanović',
      status: 'odobren',
      napomena: '',
      farmaceut: 'Jelena Nikolić',
      datumIzdavanja: '2024-06-27'
    },
    {
      id: 4,
      datum: '2024-06-27',
      vreme: '08:18:17',
      pacijent: 'Petar Stojanović',
      telefon: '456789123',
      tipZahtjeva: 'Ljekar',
      ustanova: 'Klinički centar',
      ljekar: 'Dr Stefan Miličević',
      status: 'odbačen',
      napomena: '',
      farmaceut: '',
      datumIzdavanja: ''
    },
    {
      id: 5,
      datum: '2024-06-27',
      vreme: '09:30:54',
      pacijent: 'Milica Đorđević',
      telefon: '321654987',
      tipZahtjeva: 'Apotekar',
      ustanova: 'Apoteka Benu',
      ljekar: 'Dr Aleksandar Popović',
      status: 'kreiran',
      napomena: '',
      farmaceut: '',
      datumIzdavanja: ''
    }
  ]);

  // Dummy data za istoriju zahtjeva
  const [istorijaZahtjeva, setIstorijaZahtjeva] = useState({
    1: [
      {
        id: 101,
        datum: '2024-06-24',
        vreme: '20:15:18',
        akcija: 'Kreiran zahtjev',
        korisnik: 'Dr Ivana Miković',
        starStatus: '',
        noviStatus: 'kreiran',
        komentar: 'Inicijalni zahtjev za pregled pacijenta'
      },
      {
        id: 102,
        datum: '2024-06-24',
        vreme: '20:45:32',
        akcija: 'Dodana napomena',
        korisnik: 'Dr Ivana Miković',
        starStatus: 'kreiran',
        noviStatus: 'kreiran',
        komentar: 'Dodana napomena: JOŠĆPKARMAGRAGAAC'
      }
    ],
    2: [
      {
        id: 201,
        datum: '2024-06-24',
        vreme: '20:30:52',
        akcija: 'Kreiran zahtjev',
        korisnik: 'Dr Ivana Miković',
        starStatus: '',
        noviStatus: 'kreiran',
        komentar: 'Inicijalni zahtjev za pregled pacijenta'
      }
    ],
    3: [
      {
        id: 301,
        datum: '2024-06-27',
        vreme: '08:14:07',
        akcija: 'Kreiran zahtjev',
        korisnik: 'Dr Marko Jovanović',
        starStatus: '',
        noviStatus: 'kreiran',
        komentar: 'Zahtjev kreiran od strane ljekara'
      },
      {
        id: 302,
        datum: '2024-06-27',
        vreme: '09:22:15',
        akcija: 'Provjera zahtjeva',
        korisnik: 'Admin sistem',
        starStatus: 'kreiran',
        noviStatus: 'u_obradi',
        komentar: 'Automatska provjera validnosti zahtjeva'
      },
      {
        id: 303,
        datum: '2024-06-27',
        vreme: '10:15:30',
        akcija: 'Odobren zahtjev',
        korisnik: 'Jelena Nikolić',
        starStatus: 'u_obradi',
        noviStatus: 'odobren',
        komentar: 'Zahtjev odobren i dodijeljen farmaceut'
      }
    ],
    4: [
      {
        id: 401,
        datum: '2024-06-27',
        vreme: '08:18:17',
        akcija: 'Kreiran zahtjev',
        korisnik: 'Dr Stefan Miličević',
        starStatus: '',
        noviStatus: 'kreiran',
        komentar: 'Zahtjev kreiran od strane ljekara'
      },
      {
        id: 402,
        datum: '2024-06-27',
        vreme: '11:30:45',
        akcija: 'Odbačen zahtjev',
        korisnik: 'Admin sistem',
        starStatus: 'kreiran',
        noviStatus: 'odbačen',
        komentar: 'Zahtjev odbačen zbog nepotpunih informacija'
      }
    ],
    5: [
      {
        id: 501,
        datum: '2024-06-27',
        vreme: '09:30:54',
        akcija: 'Kreiran zahtjev',
        korisnik: 'Dr Aleksandar Popović',
        starStatus: '',
        noviStatus: 'kreiran',
        komentar: 'Zahtjev kreiran od strane apotekara'
      }
    ]
  });

  // Lista ustanova
  const ustanove = [
    'Dom zdravlja Beograd',
    'Dom zdravlja Podgorica',
    'Klinički centar',
    'Apoteka Zdravlje',
    'Apoteka Benu',
    'Dom zdravlja Nikšić',
    'Bolnica Cetinje',
    'Institut za javno zdravlje'
  ];

  const sidebarItems = [
    { icon: '⚡', title: 'Admin Panel', active: false, path: '/AdminPage' },
    { icon: '👥', title: 'Ljekari', active: false, path: '/AdminDoktori' },
    { icon: '🏢', title: 'Ustanove', active: false, path: '/AdminUstanove' },
    { icon: '📄', title: 'Zahtjevi', active: true, path: '/AdminZahtjevi' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'kreiran': { bg: '#e0f2fe', color: '#0369a1', text: 'Kreiran' },
      'u_obradi': { bg: '#fef3c7', color: '#d97706', text: 'U obradi' },
      'odobren': { bg: '#dcfce7', color: '#16a34a', text: 'Odobren' },
      'odbačen': { bg: '#fecaca', color: '#dc2626', text: 'Odbačen' }
    };
    
    const statusStyle = statusColors[status] || statusColors['kreiran'];
    
    return (
      <span style={{
        background: statusStyle.bg,
        color: statusStyle.color,
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {statusStyle.text}
      </span>
    );
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
      setSelectedZahtjev(null);
    } else {
      setShowResults(true);
    }
  };

  const handlePonistiFilter = () => {
    setFilterData({
      datumOd: '',
      datumDo: '',
      pacijent: '',
      ustanova: '',
      tipZahtjeva: ''
    });
  };

  const handleSelectZahtjev = (zahtjev) => {
    setSelectedZahtjev(selectedZahtjev?.id === zahtjev.id ? null : zahtjev);
  };

  const handleClickOutside = () => {
    setSelectedZahtjev(null);
  };

  const handlePregled = () => {
    if (selectedZahtjev) {
      setShowPregled(true);
    }
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredZahtjevi = zahtjevi.filter(zahtjev => {
    const pacijent = zahtjev.pacijent.toLowerCase();
    const filterPacijent = filterData.pacijent.toLowerCase();
    
    // Filter po datumu
    let datumValid = true;
    if (filterData.datumOd) {
      datumValid = datumValid && new Date(zahtjev.datum) >= new Date(filterData.datumOd);
    }
    if (filterData.datumDo) {
      datumValid = datumValid && new Date(zahtjev.datum) <= new Date(filterData.datumDo);
    }
    
    return (
      datumValid &&
      (!filterData.pacijent || pacijent.includes(filterPacijent)) &&
      (!filterData.ustanova || zahtjev.ustanova === filterData.ustanova) &&
      (!filterData.tipZahtjeva || zahtjev.tipZahtjeva === filterData.tipZahtjeva)
    );
  }).sort((a, b) => {
    const dateTimeA = new Date(`${a.datum} ${a.vreme}`);
    const dateTimeB = new Date(`${b.datum} ${b.vreme}`);
    return sortOrder === 'desc' ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
  });

  const selectedIstorija = selectedZahtjev ? istorijaZahtjeva[selectedZahtjev.id] || [] : [];

  // Conditional rendering
  if (showPregled) {
    return (
      <PregledZahtjeva 
        zahtjev={selectedZahtjev} 
        onBack={() => setShowPregled(false)}
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

        /* Filter Card */
        .filter-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          margin-bottom: 20px;
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
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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

        /* Tables Layout */
        .tables-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Table */
        .table-container {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          max-height: 450px;
          overflow-y: auto;
          overflow-x: auto;
        }

        .table-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          background: #f8fafc;
          border-radius: 12px 12px 0 0;
        }

        .table-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d29;
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
          font-size: 11px;
        }

        .table th {
          background: #f8fafc;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 8px 6px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
          min-width: 80px;
        }

        .table th:nth-child(odd) {
          background: rgba(59, 130, 246, 0.08);
        }

        .table td {
          padding: 8px 6px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          vertical-align: top;
          font-size: 10px;
          line-height: 1.3;
        }

        .table td:nth-child(odd) {
          background: rgba(59, 130, 246, 0.03);
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

        .napomena-text {
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-style: italic;
          color: #6b7280;
          font-size: 9px;
        }

        /* History table specific styles */
        .history-table .table th {
          background: rgba(16, 185, 129, 0.08);
        }

        .history-table .table td:nth-child(odd) {
          background: rgba(16, 185, 129, 0.03);
        }

        .history-table .table th:nth-child(odd) {
          background: rgba(16, 185, 129, 0.12);
        }

        .akcija-text {
          font-weight: 600;
          color: #1a1d29;
          font-size: 10px;
        }

        .status-change {
          font-size: 9px;
          color: #6b7280;
        }

        .komentar-text {
          font-style: italic;
          color: #6b7280;
          font-size: 9px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        /* No selection state */
        .no-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: #6b7280;
          text-align: center;
        }

        .no-selection-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-selection-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .no-selection-subtitle {
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .filter-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
          }

          .tables-layout {
            grid-template-columns: 1fr;
            gap: 16px;
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

          .tables-layout {
            grid-template-columns: 1fr;
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
          <h1 className="page-title">Upravljanje Zahtjevima</h1>
          <p className="page-subtitle">
            Pregledajte i upravljajte zahtjevima ljekara i apotekara u sistemu
          </p>
        </div>

        {/* Filter Card */}
        <div className="filter-card">
          <div className="filter-header">
            <h2 className="filter-title">Filteri</h2>
          </div>
          
          <div className="filter-grid">
            <div className="form-group">
              <label className="form-label">Datum od</label>
              <input
                type="date"
                className="form-control"
                value={filterData.datumOd}
                onChange={(e) => handleFilterChange('datumOd', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Datum do</label>
              <input
                type="date"
                className="form-control"
                value={filterData.datumDo}
                onChange={(e) => handleFilterChange('datumDo', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Pacijent</label>
              <input
                type="text"
                className="form-control"
                value={filterData.pacijent}
                onChange={(e) => handleFilterChange('pacijent', e.target.value)}
                placeholder="Unesite ime pacijenta"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Ustanova</label>
              <select
                className="form-select"
                value={filterData.ustanova}
                onChange={(e) => handleFilterChange('ustanova', e.target.value)}
              >
                <option value="">Sve ustanove</option>
                {ustanove.map((ustanova, index) => (
                  <option key={index} value={ustanova}>
                    {ustanova}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Tip zahtjeva</label>
              <select
                className="form-select"
                value={filterData.tipZahtjeva}
                onChange={(e) => handleFilterChange('tipZahtjeva', e.target.value)}
              >
                <option value="">Svi tipovi</option>
                <option value="Ljekar">Ljekar</option>
                <option value="Apotekar">Apotekar</option>
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

        {/* Results */}
        {showResults && (
          <>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="action-btn btn-pregled" 
                disabled={!selectedZahtjev}
                onClick={handlePregled}
              >
                👁️ Pregled
              </button>
            </div>

            {/* Tables Layout */}
            <div className="tables-layout">
              {/* Main Requests Table */}
              <div className="table-container" onClick={handleClickOutside}>
                <div className="table-header">
                  <h3 className="table-title">Lista Zahtjeva</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          Datum
                          <button 
                            className="sort-btn"
                            onClick={handleSortChange}
                            title={sortOrder === 'desc' ? 'Sortiraj rastuće' : 'Sortiraj opadajuće'}
                          >
                            {sortOrder === 'desc' ? '↓' : '↑'}
                          </button>
                        </th>
                        <th>Pacijent / Telefon</th>
                        <th>Tip zahtjeva</th>
                        <th>Ljekar / Savetnik</th>
                        <th>Ustanova / Ljekar</th>
                        <th>Status</th>
                        <th>Napomena</th>
                        <th>Farmaceut</th>
                        <th>Datum izdavanja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredZahtjevi.map(zahtjev => (
                        <tr 
                          key={zahtjev.id}
                          className={`table-row ${selectedZahtjev?.id === zahtjev.id ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectZahtjev(zahtjev);
                          }}
                        >
                          <td>{formatDate(zahtjev.datum)}<br/><small style={{color: '#6b7280', fontSize: '9px'}}>{zahtjev.vreme}</small></td>
                          <td>
                            <div style={{fontWeight: '600', color: '#1a1d29', fontSize: '10px'}}>{zahtjev.pacijent}</div>
                            <div style={{fontSize: '9px', color: '#6b7280'}}>{zahtjev.telefon}</div>
                          </td>
                          <td>
                            <span style={{
                              background: zahtjev.tipZahtjeva === 'Ljekar' ? '#e0f2fe' : '#f0fdf4',
                              color: zahtjev.tipZahtjeva === 'Ljekar' ? '#0369a1' : '#16a34a',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '600'
                            }}>
                              {zahtjev.tipZahtjeva}
                            </span>
                          </td>
                          <td style={{fontSize: '10px'}}>{zahtjev.ljekar}</td>
                          <td>
                            <div style={{fontSize: '9px', lineHeight: '1.2'}}>
                              <div><strong>{zahtjev.ustanova}</strong></div>
                              <div style={{color: '#6b7280'}}>{zahtjev.ljekar}</div>
                            </div>
                          </td>
                          <td>{getStatusBadge(zahtjev.status)}</td>
                          <td>
                            <div className="napomena-text" title={zahtjev.napomena}>
                              {zahtjev.napomena || '—'}
                            </div>
                          </td>
                          <td>{zahtjev.farmaceut || '—'}</td>
                          <td>{zahtjev.datumIzdavanja ? formatDate(zahtjev.datumIzdavanja) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* History Table */}
              <div className="table-container history-table">
                <div className="table-header">
                  <h3 className="table-title">Istorija Zahtjeva</h3>
                </div>
                {selectedZahtjev ? (
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Datum i vreme</th>
                          <th>Akcija</th>
                          <th>Korisnik</th>
                          <th>Status</th>
                          <th>Komentar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedIstorija.map(istorija => (
                          <tr key={istorija.id} className="table-row">
                            <td>
                              <div>{formatDate(istorija.datum)}</div>
                              <div style={{fontSize: '9px', color: '#6b7280'}}>{istorija.vreme}</div>
                            </td>
                            <td>
                              <div className="akcija-text">{istorija.akcija}</div>
                            </td>
                            <td>{istorija.korisnik}</td>
                            <td>
                              {istorija.noviStatus && (
                                <div className="status-change">
                                  {getStatusBadge(istorija.noviStatus)}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="komentar-text" title={istorija.komentar}>
                                {istorija.komentar}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-selection">
                    <div className="no-selection-icon">📋</div>
                    <div className="no-selection-title">Izaberite zahtjev</div>
                    <div className="no-selection-subtitle">
                      Kliknite na zahtjev u tabeli da vidite njegovu istoriju
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards" onClick={handleClickOutside}>
              {filteredZahtjevi.map(zahtjev => (
                <div 
                  key={zahtjev.id} 
                  className={`mobile-card ${selectedZahtjev?.id === zahtjev.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectZahtjev(zahtjev);
                  }}
                >
                  <div className="mobile-card-header">{zahtjev.pacijent}</div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Datum i vreme</div>
                    <div className="mobile-field-value">{formatDate(zahtjev.datum)} {zahtjev.vreme}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Tip zahtjeva</div>
                    <div className="mobile-field-value">{zahtjev.tipZahtjeva}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Ustanova</div>
                    <div className="mobile-field-value">{zahtjev.ustanova}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Ljekar</div>
                    <div className="mobile-field-value">{zahtjev.ljekar}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Status</div>
                    <div className="mobile-field-value">{getStatusBadge(zahtjev.status)}</div>
                  </div>
                  
                  <div className="mobile-field">
                    <div className="mobile-field-label">Telefon</div>
                    <div className="mobile-field-value">{zahtjev.telefon}</div>
                  </div>
                  
                  {zahtjev.napomena && (
                    <div className="mobile-field">
                      <div className="mobile-field-label">Napomena</div>
                      <div className="mobile-field-value" style={{fontStyle: 'italic'}}>{zahtjev.napomena}</div>
                    </div>
                  )}

                  {zahtjev.farmaceut && (
                    <div className="mobile-field">
                      <div className="mobile-field-label">Farmaceut</div>
                      <div className="mobile-field-value">{zahtjev.farmaceut}</div>
                    </div>
                  )}

                  {zahtjev.datumIzdavanja && (
                    <div className="mobile-field">
                      <div className="mobile-field-label">Datum izdavanja</div>
                      <div className="mobile-field-value">{formatDate(zahtjev.datumIzdavanja)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredZahtjevi.length === 0 && (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
                <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>Nema rezultata</div>
                <div>Nema zahtjeva koji odgovaraju vašem filteru.</div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminZahtjevi;