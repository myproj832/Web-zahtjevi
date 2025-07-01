import React, { useState, useEffect, useRef } from 'react';
import PregledDoktora from './PregledDoktora'; // Import komponente za pregled doktora
import PregledZahtjeva from './PregledZahtjeva'; // Import komponente za pregled zahtjeva

const PregledUstanove = ({ ustanova, onBack, onEdit, onNavigateToDoktori, onNavigateToUstanove, fromDoktor = false }) => {
  const [showPregledDoktora, setShowPregledDoktora] = useState(false);
  const [showPregledZahtjeva, setShowPregledZahtjeva] = useState(false);
  const [selectedDoktor, setSelectedDoktor] = useState(null);
  const [selectedZahtjev, setSelectedZahtjev] = useState(null);
  const [doktoriFilter, setDoktoriFilter] = useState('');
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
      // Ako je otvoren pregled doktora ili zahtjeva, zatvaramo ih prvo
      if (showPregledDoktora) {
        setShowPregledDoktora(false);
        setSelectedDoktor(null);
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
  }, [showPregledDoktora, showPregledZahtjeva, onBack]);

  // Funkcija za otvaranje pregleda doktora
  const handleDoktorDoubleClick = (doktor) => {
    setSelectedDoktor(doktor);
    setShowPregledDoktora(true);
    // Dodajemo novi state u history
    window.history.pushState({ view: 'doktor' }, '', window.location.href);
  };

  // Funkcija za otvaranje pregleda zahtjeva
  const handleZahtjevDoubleClick = (zahtjev) => {
    setSelectedZahtjev(zahtjev);
    setShowPregledZahtjeva(true);
    // Dodajemo novi state u history
    window.history.pushState({ view: 'zahtjev' }, '', window.location.href);
  };

  // Doktori koji rade u ovoj ustanovi - povlače se iz AdminDoktori.jsx dummy data
  const doktoriData = [
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
      napomena: 'Specijalizovan za sportske povrede',
      login: 'petar.nikolic@email.com',
      password: 'pL3zX7vB9nMk',
      kreiran: '2024-03-10'
    },
    {
      id: 4,
      imePrezime: 'Milica Stanković',
      brojLicence: 'DOK004',
      adresa: 'Cetinjska 10',
      specijalizacija: 'Internista',
      ustanove: ['Bolnica Cetinje'],
      countryCode: '+382',
      brojTelefona: '41 234 567',
      email: 'milica.stankovic@email.com',
      napomena: 'Iskusna u dijagnostici internih bolesti',
      login: 'milica.stankovic@email.com',
      password: 'mS8nV4kL9pRe',
      kreiran: '2024-04-05'
    },
    {
      id: 5,
      imePrezime: 'Stefan Milanović',
      brojLicence: 'DOK005',
      adresa: 'Brezovik bb',
      specijalizacija: 'Fizijatar',
      ustanove: ['Specijalna bolnica Brezovik'],
      countryCode: '+382',
      brojTelefona: '40 678 901',
      email: 'stefan.milanovic@email.com',
      napomena: 'Specijalizovan za rehabilitaciju',
      login: 'stefan.milanovic@email.com',
      password: 'sM3tL8nK2pVb',
      kreiran: '2024-05-12'
    },
    {
      id: 6,
      imePrezime: 'Jovana Popović',
      brojLicence: 'DOK006',
      adresa: 'Džordža Vašingtona 24',
      specijalizacija: 'Mikrobiolog',
      ustanove: ['Institut za javno zdravlje'],
      countryCode: '+382',
      brojTelefona: '20 456 789',
      email: 'jovana.popovic@email.com',
      napomena: 'Ekspert za laboratorijske analize',
      login: 'jovana.popovic@email.com',
      password: 'jP7kM4nL6rTy',
      kreiran: '2024-06-01'
    },
    {
      id: 7,
      imePrezime: 'Nikola Đurović',
      brojLicence: 'DOK007',
      adresa: 'Jovana Tomaševića 1',
      specijalizacija: 'Opšti lekar',
      ustanove: ['Dom zdravlja Bar'],
      countryCode: '+382',
      brojTelefona: '30 345 678',
      email: 'nikola.djurovic@email.com',
      napomena: 'Iskustvo u porodičnoj medicini',
      login: 'nikola.djurovic@email.com',
      password: 'nD9kP5mN3tVx',
      kreiran: '2024-06-15'
    },
    {
      id: 8,
      imePrezime: 'Dragana Vukčević',
      brojLicence: 'DOK008',
      adresa: 'Miloja Pavićevića 1',
      specijalizacija: 'Ginekolog',
      ustanove: ['Dom zdravlja Bijelo Polje'],
      countryCode: '+382',
      brojTelefona: '50 234 567',
      email: 'dragana.vukcevic@email.com',
      napomena: 'Specijalizovana za porodništvo',
      login: 'dragana.vukcevic@email.com',
      password: 'dV6nL9kM2rQw',
      kreiran: '2024-06-20'
    }
  ].filter(doktor => {
    // Filtriramo doktore koji rade u ovoj ustanovi
    return doktor.ustanove.includes(ustanova?.nazivUstanove);
  });

  // Svi zahtjevi data - isti format kao u AdminZahtjevi
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
      ljekar: 'Dr. Marko Petrović',
      ustanova: 'Dom zdravlja Podgorica',
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
      pacijent: 'Ana Petrović',
      telefon: '+38267789012',
      lijek: 'N/A',
      ljekar: 'Dr. Ana Jovanović',
      ustanova: 'Klinički centar Crne Gore',
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
      pacijent: 'Petar Nikolić',
      telefon: '+38269555333',
      lijek: 'Aspirin 100mg',
      ljekar: 'Dr. Petar Nikolić',
      ustanova: 'Dom zdravlja Nikšić',
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
      pacijent: 'Milica Jovanović',
      telefon: '+38241234567',
      lijek: 'Paracetamol 500mg',
      ljekar: 'Dr. Milica Stanković',
      ustanova: 'Bolnica Cetinje',
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
      pacijent: 'Stefan Mitrović',
      telefon: '+38240678901',
      lijek: 'Ibuprofen 400mg',
      ljekar: 'Dr. Stefan Milanović',
      ustanova: 'Specijalna bolnica Brezovik',
      farmaceut: '—',
      napomena: 'Uzeti nakon jela',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 6,
      datum: '2024-06-28',
      vreme: '09:15:33',
      tipRecepta: 'obrasac',
      datumKreiranja: '28.6.2025. 09:15:33',
      datumIzdavanja: '—',
      pacijent: 'Jelena Vasić',
      telefon: '+38220456789',
      lijek: 'Vitamini C',
      ljekar: 'Dr. Jovana Popović',
      ustanova: 'Institut za javno zdravlje',
      farmaceut: '—',
      napomena: '—',
      status: 'kreiran',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 7,
      datum: '2024-06-27',
      vreme: '11:30:45',
      tipRecepta: 'obrasac',
      datumKreiranja: '27.6.2025. 11:30:45',
      datumIzdavanja: '—',
      pacijent: 'Aleksandar Mitrović',
      telefon: '+38230345678',
      lijek: 'Antibiotik',
      ljekar: 'Dr. Nikola Đurović',
      ustanova: 'Dom zdravlja Bar',
      farmaceut: '—',
      napomena: '—',
      status: 'odbačen',
      tipZahtjeva: 'Ljekar'
    },
    {
      id: 8,
      datum: '2024-06-28',
      vreme: '14:22:10',
      tipRecepta: 'obrasac',
      datumKreiranja: '28.6.2025. 14:22:10',
      datumIzdavanja: '28.6.2025. 16:15:30',
      pacijent: 'Milena Jovanović',
      telefon: '+38250234567',
      lijek: 'Folna kiselina',
      ljekar: 'Dr. Dragana Vukčević',
      ustanova: 'Dom zdravlja Bijelo Polje',
      farmaceut: 'Dr. Marija Nikolić',
      napomena: 'Za trudnice',
      status: 'odobren',
      tipZahtjeva: 'Ljekar'
    }
  ];

  // Filtriramo zahtjeve za konkretnu ustanovu
  const zahtjeviData = allZahtjevi.filter(zahtjev => {
    return zahtjev.ustanova === ustanova?.nazivUstanove;
  });

  // Filtriranje doktora
  const filteredDoktoriData = doktoriData.filter(doktor => {
    const searchTerm = doktoriFilter.toLowerCase();
    return doktor.imePrezime.toLowerCase().includes(searchTerm) ||
           doktor.brojLicence.toLowerCase().includes(searchTerm) ||
           doktor.specijalizacija.toLowerCase().includes(searchTerm) ||
           doktor.brojTelefona.toLowerCase().includes(searchTerm) ||
           doktor.email.toLowerCase().includes(searchTerm);
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

  if (!ustanova) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Ustanova nije pronađena</h4>
            <button className="button" onClick={onBack} style={{ marginTop: '1rem' }}>
              ← Nazad
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ako je pregled doktora aktivan
  if (showPregledDoktora) {
    return (
      <PregledDoktora 
        doktor={selectedDoktor} 
        onBack={() => {
          setShowPregledDoktora(false);
          setSelectedDoktor(null);
          // Vraćamo se na prethodnu stranicu u history
          window.history.back();
        }}
        fromUstanova={true}
        onNavigateToDoktori={onNavigateToDoktori}
        onNavigateToUstanove={onNavigateToUstanove}
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

        /* Institution Card */
        .institution-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          height: calc(100vh - 104px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          overflow-y: auto;
        }

        .institution-header {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          margin-bottom: 16px;
        }

        .institution-avatar {
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

        .institution-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }

        .institution-unit {
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
          z-index: 5;
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

        /* Scrollbars za institution karticu */
        .institution-card::-webkit-scrollbar {
          width: 6px;
        }

        .institution-card::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .institution-card::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .institution-card::-webkit-scrollbar-thumb:hover {
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
          
          .institution-card {
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
          
          .institution-card,
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
          
          .institution-name {
            font-size: 18px;
          }
          
          .institution-avatar {
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
          {onNavigateToDoktori && (
            <button className="back-button button-secondary" onClick={onNavigateToDoktori}>
              <span>👨‍⚕️</span>
              Ljekari
            </button>
          )}
          {(fromDoktor && onNavigateToUstanove) && (
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
        {/* Left Content - Institution Details */}
        <div className="institution-card">
          {/* Institution Header */}
          <div className="institution-header">
            <div className="institution-avatar">
              🏥
            </div>
            <div className="institution-name">
              {ustanova.nazivUstanove}
            </div>
            <div className="institution-unit">
              {ustanova.nazivPoslovneJedinice}
            </div>
          </div>

          {/* Institution Information */}
          <div className="info-grid">
            {/* Osnovni podaci ustanove */}
            <div className="info-section">
              <div className="info-item">
                <div className="info-label">Naziv ustanove</div>
                <div className="info-value">{ustanova.nazivUstanove}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Naziv poslovne jedinice</div>
                <div className="info-value">{ustanova.nazivPoslovneJedinice}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Adresa poslovne jedinice</div>
                <div className="info-value">{ustanova.adresaPoslovneJedinice}</div>
              </div>
            </div>

            {/* Komitent i kontakt */}
            <div className="info-section">
              <div className="info-title">
                <span>📋</span>
                Komitent i kontakt
              </div>
              <div className="info-item">
                <div className="info-label">Komitent</div>
                <div className="info-value">{ustanova.komitent}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Broj telefona poslovnice</div>
                <div className="info-value">{ustanova.brojTelefonaPoslovnice}</div>
              </div>
            </div>

            {/* Kontakt osoba */}
            <div className="info-section">
              <div className="info-title">
                <span>👤</span>
                Kontakt osoba
              </div>
              <div className="info-item">
                <div className="info-label">Ime i prezime</div>
                <div className="info-value">
                  {ustanova.kontaktOsoba ? 
                    `${ustanova.kontaktOsoba.ime} ${ustanova.kontaktOsoba.prezime}` : 
                    'Nije uneseno'
                  }
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Telefon</div>
                <div className="info-value">
                  {ustanova.kontaktOsoba?.telefon || 'Nije uneseno'}
                </div>
              </div>
            </div>

            {/* Napomena i datum kreiranja */}
            <div className="info-section">
              <div className="info-title">
                <span>📝</span>
                Dodatne informacije
              </div>
              <div className="info-item">
                <div className="info-label">Napomena</div>
                <div className="info-value" style={{fontStyle: 'italic'}}>
                  {ustanova.napomena || 'Nema dodatnih napomena'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Kreirana</div>
                <div className="info-value">{ustanova.kreiran || 'Nepoznato'}</div>
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

        {/* Right Content - Doktori i Zahtjevi */}
        <div className="right-content">
          {/* Doktori Card */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                👨‍⚕️ Doktori u ustanovi ({filteredDoktoriData.length})
              </div>
              <input
                type="text"
                placeholder="Pretraži doktore..."
                className="filter-input"
                value={doktoriFilter}
                onChange={(e) => setDoktoriFilter(e.target.value)}
              />
            </div>
            <div className="card-content">
              <div className="table-wrapper">
                <div className="table-container">
                  <table className="side-table">
                    <thead>
                      <tr>
                        <th>Ime i prezime</th>
                        <th>Broj licence</th>
                        <th>Specijalizacija</th>
                        <th>Telefon</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoktoriData.map(doktor => (
                        <tr 
                          key={doktor.id}
                          onDoubleClick={() => handleDoktorDoubleClick(doktor)}
                          title="Dupli klik za pregled doktora"
                        >
                          <td style={{fontWeight: '600'}}>{doktor.imePrezime}</td>
                          <td>{doktor.brojLicence}</td>
                          <td>{doktor.specijalizacija}</td>
                          <td>{doktor.countryCode} {doktor.brojTelefona}</td>
                          <td style={{fontSize: '11px'}}>{doktor.email}</td>
                        </tr>
                      ))}
                      {filteredDoktoriData.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', fontStyle: 'italic', color: '#666', padding: '2rem'}}>
                            {doktoriFilter ? 'Nema rezultata za pretragu' : 'Nema doktora u ovoj ustanovi'}
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
                              {zahtjeviFilter ? 'Nema rezultata za pretragu' : 'Nema zahtjeva za ovu ustanovu'}
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

export default PregledUstanove;