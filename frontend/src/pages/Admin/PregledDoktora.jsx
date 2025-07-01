import React, { useState, useEffect, useRef } from 'react';
import PregledUstanove from './PregledUstanova'; // Import komponente za pregled ustanove
import PregledZahtjeva from './PregledZahtjeva'; // Import komponente za pregled zahtjeva

const PregledDoktora = ({ doktor, onBack, onEdit, onNavigateToDoktori, onNavigateToUstanove, showDoctorsButton = false, fromUstanova = false }) => {
  const [showPregledUstanove, setShowPregledUstanove] = useState(false);
  const [showPregledZahtjeva, setShowPregledZahtjeva] = useState(false);
  const [selectedUstanova, setSelectedUstanova] = useState(null);
  const [selectedZahtjev, setSelectedZahtjev] = useState(null);
  const [ustanoveFilter, setUstanoveFilter] = useState('');
  const [zahtjeviFilter, setZahtjeviFilter] = useState('');
  
  // Ref za sinhronizaciju skrolovanja
  const tableContainerRef = useRef(null);
  const statusColumnRef = useRef(null);

  // Funkcija za sinhronizaciju skrolovanja
  const handleTableScroll = () => {
    if (tableContainerRef.current && statusColumnRef.current) {
      statusColumnRef.current.scrollTop = tableContainerRef.current.scrollTop;
    }
  };

  // Browser back dugme funkcionalnost
  useEffect(() => {
    const handlePopState = (event) => {
      // Ako je otvoren pregled ustanove ili zahtjeva, zatvaramo ih prvo
      if (showPregledUstanove) {
        setShowPregledUstanove(false);
        setSelectedUstanova(null);
        // Sprečavamo da se ide dalje nazad
        window.history.pushState(null, '', window.location.href);
        return;
      }
      
      if (showPregledZahtjeva) {
        setShowPregledZahtjeva(false);
        setSelectedZahtjev(null);
        // Sprečavamo da se ide dalje nazad
        window.history.pushState(null, '', window.location.href);
        return;
      }
      
      // Ako nema otvorenih modala, pozivamo onBack funkciju
      if (onBack) {
        onBack();
      }
    };

    // Dodajemo trenutnu stranicu u history kada se komponenta mount-uje
    window.history.pushState(null, '', window.location.href);
    
    // Dodajemo event listener za popstate
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup funkcija
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showPregledUstanove, showPregledZahtjeva, onBack]);

  // Funkcija za otvaranje pregleda ustanove
  const handleUstanovaDoubleClick = (ustanova) => {
    setSelectedUstanova(ustanova);
    setShowPregledUstanove(true);
    // Dodajemo novi state u history
    window.history.pushState({ view: 'ustanova' }, '', window.location.href);
  };

  // Funkcija za otvaranje pregleda zahtjeva
  const handleZahtjevDoubleClick = (zahtjev) => {
    setSelectedZahtjev(zahtjev);
    setShowPregledZahtjeva(true);
    // Dodajemo novi state u history
    window.history.pushState({ view: 'zahtjev' }, '', window.location.href);
  };

  // Establishe za koje je ovaj doktor zadužen - trebalo bi da se učitaju iz doktor.ustanove
  const ustanoveData = doktor.ustanove ? doktor.ustanove.map((ustanova, index) => ({
    id: index + 1,
    nazivUstanove: ustanova,
    nazivPoslovneJedinice: 'Glavna poslovnica', // Default vrijednost
    adresaPoslovneJedinice: 'Nije uneseno',
    brojTelefonaPoslovnice: 'Nije uneseno',
    kontaktOsoba: 'Nije uneseno'
  })) : [
    {
      id: 1,
      nazivUstanove: 'Dom zdravlja Nikšić',
      nazivPoslovneJedinice: 'Odjeljenje ortopedije',
      adresaPoslovneJedinice: 'Sutjeska 2',
      brojTelefonaPoslovnice: '+382 40 234 567',
      kontaktOsoba: 'Dr. Milan Petrović'
    },
    {
      id: 2,
      nazivUstanove: 'Specijalna bolnica Brezovik',
      nazivPoslovneJedinice: 'Odjeljenje opšte medicine',
      adresaPoslovneJedinice: 'Brezovik bb',
      brojTelefonaPoslovnice: '+382 40 567 890',
      kontaktOsoba: 'Dr. Ana Marković'
    }
  ];

  // Zahtjevi data vezani za konkretnog doktora - filtriramo po ljekaru
  const allZahtjevi = [
    {
      id: 1,
      datum: '2024-06-24',
      vreme: '20:15:18',
      tipRecepta: 'obrasac',
      datumKreiranja: '24.6.2025. 20:15:18',
      datumIzdavanja: '—',
      pacijent: 'Marko Marković',
      telefon: '+23456789',
      lijek: 'N/A',
      ljekar: doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`,
      ustanova: doktor.institucija || (doktor.ustanove && doktor.ustanove[0]) || 'Dom zdravlja Beograd',
      farmaceut: '—',
      napomena: 'JDSLFAKFNLKAFHA94AK',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 2,
      datum: '2024-06-24',
      vreme: '20:30:52',
      tipRecepta: 'obrasac',
      datumKreiranja: '24.6.2025. 20:30:52',
      datumIzdavanja: '—',
      pacijent: 'Marko Marković',
      telefon: '+23456789',
      lijek: 'N/A',
      ljekar: doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`,
      ustanova: doktor.institucija || (doktor.ustanove && doktor.ustanove[0]) || 'Dom zdravlja Beograd',
      farmaceut: '—',
      napomena: '—',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 3,
      datum: '2024-06-27',
      vreme: '08:14:07',
      tipRecepta: 'obrasac',
      datumKreiranja: '27.6.2025. 08:14:07',
      datumIzdavanja: '28.6.2025. 10:30:15',
      pacijent: 'Ana Petrović',
      telefon: '+23456789',
      lijek: 'Aspirin 100mg',
      ljekar: doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`,
      ustanova: doktor.institucija || (doktor.ustanove && doktor.ustanove[0]) || 'Dom zdravlja Beograd',
      farmaceut: 'Dr. Milica Jovanović',
      napomena: '—',
      status: 'odobren',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 4,
      datum: '2024-06-27',
      vreme: '08:18:17',
      tipRecepta: 'obrasac',
      datumKreiranja: '27.6.2025. 08:18:17',
      datumIzdavanja: '—',
      pacijent: 'Petar Milanović',
      telefon: '+23456789',
      lijek: 'Paracetamol 500mg',
      ljekar: doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`,
      ustanova: doktor.institucija || (doktor.ustanove && doktor.ustanove[0]) || 'Dom zdravlja Beograd',
      farmaceut: '—',
      napomena: '—',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 5,
      datum: '2024-06-27',
      vreme: '08:20:51',
      tipRecepta: 'obrasac',
      datumKreiranja: '27.6.2025. 08:20:51',
      datumIzdavanja: '—',
      pacijent: 'Milica Đorđević',
      telefon: '+23456789',
      lijek: 'Ibuprofen 400mg',
      ljekar: doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`,
      ustanova: doktor.institucija || (doktor.ustanove && doktor.ustanove[0]) || 'Dom zdravlja Beograd',
      farmaceut: '—',
      napomena: 'Uzeti nakon jela',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    }
  ];

  // Filtriramo zahtjeve za konkretnog doktora
  const zahtjeviData = allZahtjevi.filter(zahtjev => {
    const doktorIme = doktor.imePrezime || `Dr. ${doktor.ime} ${doktor.prezime}`;
    return zahtjev.ljekar === doktorIme;
  });

  // Filtriranje ustanova
  const filteredUstanoveData = ustanoveData.filter(ustanova => {
    const searchTerm = ustanoveFilter.toLowerCase();
    return ustanova.nazivUstanove.toLowerCase().includes(searchTerm) ||
           ustanova.nazivPoslovneJedinice.toLowerCase().includes(searchTerm) ||
           ustanova.adresaPoslovneJedinice.toLowerCase().includes(searchTerm) ||
           ustanova.brojTelefonaPoslovnice.toLowerCase().includes(searchTerm) ||
           ustanova.kontaktOsoba.toLowerCase().includes(searchTerm);
  });

  // Filtriranje zahtjeva
  const filteredZahtjeviData = zahtjeviData.filter(zahtjev => {
    const searchTerm = zahtjeviFilter.toLowerCase();
    return zahtjev.tipRecepta.toLowerCase().includes(searchTerm) ||
           zahtjev.datumKreiranja.toLowerCase().includes(searchTerm) ||
           zahtjev.datumIzdavanja.toLowerCase().includes(searchTerm) ||
           zahtjev.pacijent.toLowerCase().includes(searchTerm) ||
           zahtjev.telefon.toLowerCase().includes(searchTerm) ||
           zahtjev.lijek.toLowerCase().includes(searchTerm) ||
           zahtjev.ljekar.toLowerCase().includes(searchTerm) ||
           zahtjev.ustanova.toLowerCase().includes(searchTerm) ||
           zahtjev.farmaceut.toLowerCase().includes(searchTerm) ||
           zahtjev.napomena.toLowerCase().includes(searchTerm);
  });

  if (!doktor) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Doktor nije pronađen</h4>
            <button className="button" onClick={onBack} style={{ marginTop: '1rem' }}>
              ← Nazad
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ako je pregled ustanove aktivan
  if (showPregledUstanove) {
    return (
      <PregledUstanove 
        ustanova={selectedUstanova} 
        onBack={() => {
          setShowPregledUstanove(false);
          setSelectedUstanova(null);
          // Vraćamo se na prethodnu stranicu u history
          window.history.back();
        }}
        onNavigateToDoktori={onNavigateToDoktori}
        onNavigateToUstanove={onNavigateToUstanove}
        fromDoktor={true}
      />
    );
  }

  // Ako je pregled zahtjeva aktivan
  if (showPregledZahtjeva) {
    return (
      <PregledZahtjeva 
        zahtjev={selectedZahtjev} 
        onBack={() => {
          setShowPregledZahtjeva(false);
          setSelectedZahtjev(null);
          // Vraćamo se na prethodnu stranicu u history
          window.history.back();
        }}
      />
    );
  }

  const getStatusIcon = (status) => {
    if (status === 'kreiran') return 'K';
    if (status === 'odobren') return 'O';
    if (status === 'odbačen') return 'X';
    return 'I';
  };

  const getStatusColor = (status) => {
    if (status === 'kreiran') return '#3b82f6';
    if (status === 'odobren') return '#10b981';
    if (status === 'odbačen') return '#ef4444';
    return '#10b981';
  };

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

        /* Header sa AdminPage stilom */
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
          gap: 16px;
        }

        .back-button {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .button-secondary {
          background: #6b7280;
        }

        .button-secondary:hover {
          background: #4b5563;
        }

        .header-right {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d29;
        }

        /* Main Content */
        .main-content {
          margin-top: 64px;
          padding: 20px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          min-height: calc(100vh - 64px);
        }

        /* Doctor Card */
        .doctor-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          height: calc(100vh - 104px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          overflow-y: auto;
        }

        .doctor-header {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          margin-bottom: 16px;
        }

        .doctor-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 18px;
          color: white;
          font-weight: 600;
        }

        .doctor-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }

        .doctor-licence {
          font-size: 12px;
          color: #3b82f6;
          font-weight: 600;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .info-section {
          background: #f8fafc;
          border-radius: 8px;
          padding: 12px;
        }

        .info-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-item {
          margin-bottom: 8px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 500;
          color: #6b7280;
          font-size: 10px;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 12px;
          color: #1a1d29;
          font-weight: 500;
          line-height: 1.3;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .button {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .button:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Right Content */
        .right-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: calc(100vh - 104px);
        }

        .content-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          flex: 1;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(10px);
          min-height: 0;
        }

        .card-header {
          padding: 16px 16px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1d29;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-input {
          padding: 6px 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 6px;
          font-size: 12px;
          width: 160px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* Tables */
        .table-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .table-with-status {
          flex: 1;
          display: flex;
          min-height: 0;
          position: relative;
        }

        .table-container,
        .table-container-with-status {
          flex: 1;
          overflow: auto;
          min-height: 0;
        }

        .table-container-with-status {
          /* Dodajemo padding-right da ostavimo mesto za status kolonu */
          padding-right: 60px;
        }

        .status-column {
          width: 60px;
          background: #f8fafc;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          border-left: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 15;
          /* Pointer events da ne blokira skrolovanje */
          pointer-events: none;
        }

        .status-column-content {
          overflow: hidden;
          flex: 1;
          /* Vraćamo pointer events samo za sadržaj */
          pointer-events: auto;
        }

        .side-table {
          width: 100%;
          font-size: 11px;
          border-collapse: collapse;
          min-width: 800px;
        }

        .side-table th {
          background: #f8fafc;
          color: #374151;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 12px 8px;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
        }

        .side-table th:nth-child(odd) {
          background: rgba(59, 130, 246, 0.12);
        }

        .side-table td {
          padding: 12px 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          vertical-align: top;
          font-size: 13px;
          line-height: 1.4;
        }

        .side-table td:nth-child(odd) {
          background: rgba(59, 130, 246, 0.06);
        }

        .side-table tr {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .side-table tr:hover {
          background-color: #f8fafc;
        }

        .side-table tr:hover td {
          background-color: #f8fafc !important;
        }

        .status-header {
          background: #f8fafc;
          color: #374151;
          padding: 12px 8px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          min-height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-item {
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 45px; /* Fiksirana visina da se poklapaju sa redovima tabele */
        }

        /* Scrollbars za doktor karticu */
        .doctor-card::-webkit-scrollbar {
          width: 6px;
        }

        .doctor-card::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .doctor-card::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .doctor-card::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Scrollbars za tabele */
        .table-container::-webkit-scrollbar,
        .table-container-with-status::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .table-container::-webkit-scrollbar-track,
        .table-container-with-status::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb,
        .table-container-with-status::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb:hover,
        .table-container-with-status::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Horizontalni i vertikalni skrolbar corner */
        .table-container::-webkit-scrollbar-corner,
        .table-container-with-status::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .doctor-card {
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 16px;
          }
          
          .main-content {
            padding: 16px;
            gap: 16px;
          }
          
          .doctor-card,
          .content-card {
            padding: 16px;
          }
          
          .card-header {
            padding: 16px 16px 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .filter-input {
            width: 100%;
          }
          
          .doctor-name {
            font-size: 18px;
          }
          
          .doctor-avatar {
            width: 60px;
            height: 60px;
            font-size: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <span>←</span>
            Nazad
          </button>
          {fromUstanova && onNavigateToUstanove && (
            <button className="back-button button-secondary" onClick={onNavigateToUstanove}>
              <span>🏥</span>
              Ustanove
            </button>
          )}
        </div>
        
        <div className="header-right">
          Administrator
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Content - Doctor Details */}
        <div className="doctor-card">
          {/* Doctor Header */}
          <div className="doctor-header">
            <div className="doctor-avatar">
              {doktor.imePrezime ? doktor.imePrezime.split(' ')[0]?.charAt(0) : 'D'}
              {doktor.imePrezime ? doktor.imePrezime.split(' ')[1]?.charAt(0) : 'R'}
            </div>
            <div className="doctor-name">
              Dr. {doktor.imePrezime || `${doktor.ime} ${doktor.prezime}`}
            </div>
            <div className="doctor-licence">
              Licenca: {doktor.brojLicence}
            </div>
          </div>

          {/* Doctor Information */}
          <div className="info-grid">
            {/* Lični podaci */}
            <div className="info-section">
              <div className="info-title">
                <span>👤</span>
                Lični podaci
              </div>
              <div className="info-item">
                <div className="info-label">Ime i prezime</div>
                <div className="info-value">{doktor.imePrezime || `${doktor.ime} ${doktor.prezime}`}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Broj licence</div>
                <div className="info-value">{doktor.brojLicence}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Specijalizacija</div>
                <div className="info-value">{doktor.specijalizacija || 'Opšta medicina'}</div>
              </div>
            </div>

            {/* Kontakt informacije */}
            <div className="info-section">
              <div className="info-title">
                <span>📞</span>
                Kontakt
              </div>
              <div className="info-item">
                <div className="info-label">Broj telefona</div>
                <div className="info-value">
                  {doktor.countryCode && doktor.brojTelefona 
                    ? `${doktor.countryCode} ${doktor.brojTelefona}`
                    : doktor.brojTelefona || 'Nije uneseno'
                  }
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Email adresa</div>
                <div className="info-value">{doktor.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Adresa</div>
                <div className="info-value">{doktor.adresa || 'Nije uneseno'}</div>
              </div>
            </div>

            {/* Ustanove */}
            <div className="info-section">
              <div className="info-title">
                <span>🏥</span>
                Ustanove
              </div>
              <div className="info-item">
                <div className="info-value">
                  {doktor.ustanove ? (
                    <div>
                      {doktor.ustanove.map((ustanova, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>{ustanova}</div>
                      ))}
                    </div>
                  ) : (
                    doktor.institucija || 'Nije uneseno'
                  )}
                </div>
              </div>
            </div>

            {/* Napomena */}
            <div className="info-section">
              <div className="info-title">
                <span>📝</span>
                Napomena
              </div>
              <div className="info-item">
                <div className="info-label">Dodatne informacije</div>
                <div className="info-value" style={{fontStyle: 'italic'}}>
                  {doktor.napomena || 'Nema dodatnih napomena'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Kreiran</div>
                <div className="info-value">{doktor.kreiran || 'Nepoznato'}</div>
              </div>
            </div>

            {/* Pristupni podaci */}
            <div className="info-section">
              <div className="info-title">
                <span>🔐</span>
                Pristupni podaci
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="info-item">
                  <div className="info-label">Korisničko ime</div>
                  <div className="info-value">{doktor.login}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Lozinka</div>
                  <div className="info-value" style={{fontFamily: 'monospace'}}>
                    {doktor.password}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="button" onClick={onEdit}>
              ✏️ Izmijeni
            </button>
          </div>
        </div>

        {/* Right Content - Ustanove i Zahtjevi */}
        <div className="right-content">
          {/* Ustanove Card */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                🏥 Ustanove
              </div>
              <input
                type="text"
                placeholder="Pretraži ustanove..."
                className="filter-input"
                value={ustanoveFilter}
                onChange={(e) => setUstanoveFilter(e.target.value)}
              />
            </div>
            <div className="card-content">
              <div className="table-wrapper">
                <div className="table-container">
                  <table className="side-table">
                    <thead>
                      <tr>
                        <th>Naziv Ustanove</th>
                        <th>Naziv Poslovne Jedinice</th>
                        <th>Adresa Poslovne Jedinice</th>
                        <th>Broj telefona poslovnice</th>
                        <th>Kontakt osoba</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUstanoveData.map(ustanova => (
                        <tr 
                          key={ustanova.id}
                          onDoubleClick={() => handleUstanovaDoubleClick(ustanova)}
                          title="Dupli klik za pregled"
                        >
                          <td>{ustanova.nazivUstanove}</td>
                          <td>{ustanova.nazivPoslovneJedinice}</td>
                          <td>{ustanova.adresaPoslovneJedinice}</td>
                          <td>{ustanova.brojTelefonaPoslovnice}</td>
                          <td>{ustanova.kontaktOsoba}</td>
                        </tr>
                      ))}
                      {filteredUstanoveData.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', fontStyle: 'italic', color: '#666', padding: '2rem'}}>
                            {ustanoveFilter ? 'Nema rezultata za pretragu' : 'Nema ustanova'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Lista zahtjeva Card */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                📋 Lista zahtjeva ({filteredZahtjeviData.length})
              </div>
              <input
                type="text"
                placeholder="Pretraži zahtjeve..."
                className="filter-input"
                value={zahtjeviFilter}
                onChange={(e) => setZahtjeviFilter(e.target.value)}
              />
            </div>
            <div className="card-content">
              <div className="table-wrapper">
                <div className="table-with-status">
                  <div 
                    className="table-container-with-status"
                    ref={tableContainerRef}
                    onScroll={handleTableScroll}
                  >
                    <table className="side-table">
                      <thead>
                        <tr>
                          <th>Tip Recepta</th>
                          <th>Datum kreiranja recepta</th>
                          <th>Datum izdavanja Recepta</th>
                          <th>Pacijent</th>
                          <th>Telefon</th>
                          <th>Lijek</th>
                          <th>Ljekar</th>
                          <th>Ustanova</th>
                          <th>Farmaceut</th>
                          <th>Napomena</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredZahtjeviData.map(zahtjev => (
                          <tr 
                            key={zahtjev.id}
                            onDoubleClick={() => handleZahtjevDoubleClick(zahtjev)}
                            title="Dupli klik za pregled zahtjeva"
                          >
                            <td>{zahtjev.tipRecepta}</td>
                            <td>{zahtjev.datumKreiranja}</td>
                            <td>{zahtjev.datumIzdavanja}</td>
                            <td>{zahtjev.pacijent}</td>
                            <td>{zahtjev.telefon}</td>
                            <td>{zahtjev.lijek}</td>
                            <td>{zahtjev.ljekar}</td>
                            <td>{zahtjev.ustanova}</td>
                            <td>{zahtjev.farmaceut}</td>
                            <td>{zahtjev.napomena}</td>
                          </tr>
                        ))}
                        {filteredZahtjeviData.length === 0 && (
                          <tr>
                            <td colSpan="10" style={{textAlign: 'center', fontStyle: 'italic', color: '#666', padding: '2rem'}}>
                              {zahtjeviFilter ? 'Nema rezultata za pretragu' : 'Nema zahtjeva za ovog doktora'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="status-column">
                    <div className="status-header">
                      Status
                    </div>
                    <div className="status-column-content" ref={statusColumnRef}>
                      {filteredZahtjeviData.map(zahtjev => (
                        <div 
                          key={zahtjev.id}
                          className="status-item"
                          style={{ color: getStatusColor(zahtjev.status) }}
                          title={zahtjev.status}
                        >
                          {getStatusIcon(zahtjev.status)}
                        </div>
                      ))}
                      {filteredZahtjeviData.length === 0 && (
                        <div className="status-item" style={{ color: '#666', fontSize: '12px' }}>
                          —
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregledDoktora;