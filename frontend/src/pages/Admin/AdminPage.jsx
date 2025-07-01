import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

import DodajDoktora   from './DodajDoktora.jsx';
import DodajUstanovu  from './DodajUstanovu.jsx';
import AdminIzvjestaj from './AdminIzvjestaj.jsx';

const AdminPage = () => {
  /* ──────────────────────────────────────────────────────────── */
  /*  1)   Provjera autentifikacije + debug poruka               */
  /* ──────────────────────────────────────────────────────────── */
  const auth     = useAuth();
  const navigate = useNavigate();

  console.log('🔧 AdminPage mount → auth =', auth);

  if (!auth?.isAuthenticated) {
    return <div style={{ padding: '2rem' }}>⏳ Učitavanje podataka...</div>;
  }
  if (auth.rola !== 'Admin') {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        ⛔ Nemate administratorski pristup.
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────── */
  /*  2)   State + demo podaci                                   */
  /* ──────────────────────────────────────────────────────────── */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDodajDoktora, setShowDodajDoktora] = useState(false);
  const [showDodajUstanovu, setShowDodajUstanovu] = useState(false);
  const [showIzvjestaji,  setShowIzvjestaji]     = useState(false);
  const [currentTime,    setCurrentTime]         = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stats = {
    ukupnoLjekara:   8,
    aktivniLjekari:  7,
    ukupnoUstanova:  8,
    aktivneUstanove: 8,
    ukupnoZahtjeva:  247,
    zahtjeviKreiran: 89,
    zahtjeviIzdat:   158,
    todayRequests:   12,
    weeklyGrowth: {
      ljekari:  12.5,
      ustanove: 8.3,
      zahtjevi: 15.7,
      recepti:  9.2,
    },
  };

  const recentActivities = [
    { id: 1, icon: '👨‍⚕️', color: '#28a745', type: 'doctor_added',
      title: 'Dodan novi ljekar', description: 'Dr. Marko Petrović - Kardiolog',
      timestamp: '28.6.2025. 14:30' },
    { id: 2, icon: '📋', color: '#17a2b8', type: 'request_created',
      title: 'Kreiran novi zahtjev', description: 'Zahtjev za Paracetamol 500mg',
      timestamp: '28.6.2025. 13:45' },
    { id: 3, icon: '🏥', color: '#ffc107', type: 'institution_updated',
      title: 'Ažurirana ustanova',
      description: 'Dom zdravlja Podgorica - kontakt podaci',
      timestamp: '28.6.2025. 12:15' },
    { id: 4, icon: '✅', color: '#28a745', type: 'request_issued',
      title: 'Izdat recept',
      description: 'Aspirin 100mg - izdao Dr. Petar Nikolić',
      timestamp: '28.6.2025. 11:20' },
    { id: 5, icon: '✏️', color: '#6c757d', type: 'doctor_updated',
      title: 'Ažuriran ljekar',
      description: 'Dr. Ana Jovanović - dodana nova ustanova',
      timestamp: '28.6.2025. 10:05' },
  ];

  const quickActions = [
    { title: 'Dodaj novog ljekara', description: 'Registruj novog ljekara u sistem',
      icon: '👨‍⚕️', color: '#3B82F6', action: () => setShowDodajDoktora(true) },
    { title: 'Dodaj novu ustanovu', description: 'Registruj novu zdravstvenu ustanovu',
      icon: '🏥', color: '#10B981', action: () => setShowDodajUstanovu(true) },
    { title: 'Pregled zahtjeva', description: 'Pogledaj sve zahtjeve za recepte',
      icon: '📋', color: '#F59E0B', action: () => navigate('/AdminZahtjevi') },
    { title: 'Izvještaji', description: 'Generiši izvještaje o aktivnostima',
      icon: '📊', color: '#8B5CF6', action: () => setShowIzvjestaji(true) },
  ];

  const sidebarItems = [
    { icon: '⚡', title: 'Admin Panel',  active: true,  path: '/' },
    { icon: '👥', title: 'Ljekari',      active: false, path: '/AdminDoktori',  count: stats.aktivniLjekari },
    { icon: '🏢', title: 'Ustanove',     active: false, path: '/AdminUstanove', count: stats.aktivneUstanove },
    { icon: '📄', title: 'Zahtjevi',     active: false, path: '/AdminZahtjevi', count: stats.todayRequests },
  ];

  /* Čuvanje novih entiteta */
  const handleSaveNewDoktor = (d) => {
    console.log('Novi doktor:', d);
    alert(`Doktor ${d.imePrezime} je dodan!`);
    setShowDodajDoktora(false);
  };
  const handleSaveNewUstanovu = (u) => {
    console.log('Nova ustanova:', u);
    alert(`Ustanova ${u.nazivUstanove} je dodana!`);
    setShowDodajUstanovu(false);
  };

  /* ──────────────────────────────────────────────────────────── */
  /*  3)   Uslovni render forme / izvještaja                     */
  /* ──────────────────────────────────────────────────────────── */
  if (showDodajDoktora) {
    return (
      <DodajDoktora onBack={() => setShowDodajDoktora(false)}
                    onSave={handleSaveNewDoktor} />
    );
  }
  if (showDodajUstanovu) {
    return (
      <DodajUstanovu onBack={() => setShowDodajUstanovu(false)}
                     onSave={handleSaveNewUstanovu} />
    );
  }
  if (showIzvjestaji) {
    return <AdminIzvjestaj onBack={() => setShowIzvjestaji(false)} />;
  }

  /* ──────────────────────────────────────────────────────────── */
  /*  4)   Glavni prikaz Admin panela                            */
  /* ──────────────────────────────────────────────────────────── */
  return (
    <div className="admin-dashboard">
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .admin-dashboard {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
                       'Segoe UI', Roboto, sans-serif;
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
          top: 0; left: 0; right: 0;
          z-index: 1000;
        }
        .header-left  { display: flex; align-items: center; flex: 1; }
        .logo         { display: flex; align-items: center; gap: 12px;
                        font-size: 20px; font-weight: 700; color: #1a1d29; }
        .logo-icon    { width: 32px; height: 32px; border-radius: 8px;
                        display: flex; align-items: center; justify-content: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white; font-size: 16px; }
        .header-right { display: flex; align-items: center; gap: 16px; }

        /* Search */
        .search-bar   { position: relative; width: 320px; }
        .search-input {
          width: 100%; height: 36px; padding: 0 12px 0 36px;
          border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 18px;
          background: #f8fafc; font-size: 14px; outline: none;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #3b82f6; background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .search-icon  {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%); color: #9ca3af; font-size: 14px;
        }

        /* Header icons */
        .notifications, .sidebar-toggle, .logout-btn {
          width: 36px; height: 36px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(0,0,0,0.08); background: white;
          cursor: pointer; transition: all 0.2s ease;
        }
        .notifications:hover, .sidebar-toggle:hover {
          background: #f8fafc; transform: scale(1.05);
        }
        .notification-badge {
          position: absolute; top: -4px; right: -4px; width: 16px; height: 16px;
          background: #ef4444; border-radius: 8px; border: 2px solid white;
          font-size: 10px; color: white; display: flex;
          align-items: center; justify-content: center; font-weight: 600;
        }
        .time-display {
          background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
          color: white; padding: 8px 16px; border-radius: 18px;
          font-size: 13px; font-weight: 600;
          font-family: 'SF Mono', Monaco, monospace; letter-spacing: 0.5px;
        }
        .logout-btn    {
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.1); color: #ef4444;
        }
        .logout-btn:hover {
          background: #ef4444; color: white; transform: scale(1.05);
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          left: 0; top: 64px;
          width: ${sidebarCollapsed ? '72px' : '240px'};
          height: calc(100vh - 64px);
          background: white;
          border-right: 1px solid rgba(0, 0, 0, 0.06);
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 999; overflow: hidden;
        }
        .sidebar-content { padding: 24px 0; height: 100%; overflow-y: auto; }
        .sidebar-section { margin-bottom: 32px; }
        .sidebar-label {
          padding: 0 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;
          color: #9ca3af; letter-spacing: 1px; margin-bottom: 8px;
          opacity: ${sidebarCollapsed ? '0' : '1'}; transition: opacity 0.3s ease;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; margin: 0 12px; border-radius: 12px;
          color: #6b7280; cursor: pointer; transition: all 0.2s ease;
          position: relative;
        }
        .sidebar-item:hover { background: #f8fafc; color: #374151; }
        .sidebar-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white; box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .sidebar-item.active::before {
          content: ''; position: absolute; left: -12px; top: 50%;
          transform: translateY(-50%); width: 3px; height: 20px;
          background: #3b82f6; border-radius: 2px;
        }
        .sidebar-icon { font-size: 16px; min-width: 16px; text-align: center; }
        .sidebar-text, .sidebar-count {
          opacity: ${sidebarCollapsed ? '0' : '1'}; transition: opacity 0.3s ease;
        }
        .sidebar-count {
          margin-left: auto; background: #f3f4f6; color: #6b7280;
          font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 10px;
        }
        .sidebar-item.active .sidebar-count {
          background: rgba(255,255,255,0.2); color: white;
        }

        /* Main Content */
        .main-content {
          margin-left: ${sidebarCollapsed ? '72px' : '240px'};
          padding: 88px 32px 32px;
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
          min-height: 100vh;
        }
        .page-header  { margin-bottom: 32px; }
        .page-title   { font-size: 32px; font-weight: 700; color: #1a1d29;
                        margin-bottom: 8px; letter-spacing: -1px; }
        .page-subtitle{ font-size: 16px; color: #6b7280; font-weight: 400; }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
          gap: 16px; margin-bottom: 32px;
        }
        .stat-card {
          background: white; border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px; padding: 18px; cursor: pointer;
          position: relative; overflow: hidden; transition: all 0.2s ease;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,#3b82f6,#1d4ed8);
          transform: scaleX(0); transition: transform 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(59,130,246,0.2);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px);
        }
        .stat-card:hover::before { transform: scaleX(1); }
        .stat-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .stat-icon {
          width: 32px; height: 32px; border-radius: 10px; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          background: #f8fafc;
        }
        .stat-trend {
          background: #dcfce7; color: #16a34a; padding: 3px 6px;
          border-radius: 16px; font-size: 10px; font-weight: 700;
        }
        .stat-number { font-size: 24px; font-weight: 700; color: #1a1d29;
                       letter-spacing: -1px; margin-bottom: 4px; }
        .stat-label  { color: #6b7280; font-size: 13px; font-weight: 500; }

        /* Content layout */
        .content-layout {
          display: grid; grid-template-columns: 2fr 1fr; gap: 24px;
          margin-bottom: 32px;
        }
        .content-card {
          background: white; border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px; overflow: hidden;
        }
        .card-header { padding: 24px 24px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .card-title  { font-size: 18px; font-weight: 600; color: #1a1d29; }
        .card-subtitle{ font-size: 14px; color: #6b7280; }
        .card-content { padding: 24px; }

        /* Quick actions */
        .quick-actions-grid {
          display: grid; grid-template-columns: repeat(2,1fr); gap: 16px;
        }
        .quick-action {
          display: flex; align-items: center; gap: 16px; cursor: pointer;
          padding: 20px; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px;
          background: white; transition: all 0.2s ease;
        }
        .quick-action:hover {
          background: var(--color); border-color: var(--color); color: white;
          transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .quick-action-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: var(--color); color: white; font-size: 20px;
          transition: all 0.2s ease;
        }
        .quick-action:hover .quick-action-icon { background: rgba(255,255,255,0.2); }

        /* Activities */
        .activities-list { max-height: 400px; overflow-y: auto; }
        .activity-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px 0; border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .activity-icon {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; flex-shrink: 0;
        }
        .activity-content { flex: 1; }
        .activity-title { font-size: 14px; font-weight: 600; color: #1a1d29; }
        .activity-desc  { font-size: 13px; color: #6b7280; }
        .activity-time  { font-size: 11px; color: #9ca3af; font-weight: 500; }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-layout { grid-template-columns: 1fr; }
          .search-bar     { width: 240px; }
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(${sidebarCollapsed ? '-100%' : '0'});
                     width: 240px; }
          .main-content { margin-left: 0; padding: 88px 16px 32px; }
          .header { padding: 0 16px; }
          .search-bar { display: none; }
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 16px; }
          .quick-actions-grid { grid-template-columns: 1fr; }
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
              hour: '2-digit', minute: '2-digit', second: '2-digit',
            })}
          </div>

          <div
            className="logout-btn"
            title="Odjavi se"
            onClick={() => {
              if (window.confirm('Da li ste sigurni da se želite odjaviti?')) {
                alert('Odjavljujete se...');
                // auth.logout(); navigate('/');
              }
            }}
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
            {sidebarItems.map((item, i) => (
              <div
                key={i}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                onClick={() => {
                  if (item.path) navigate(item.path);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
                {item.count && <span className="sidebar-count">{item.count}</span>}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">
            Pratite i upravljajte vašim zdravstvenim sistemom efikasno
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/AdminDoktori')}>
            <div className="stat-header">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-trend">+{stats.weeklyGrowth.ljekari}%</div>
            </div>
            <div className="stat-number">{stats.ukupnoLjekara}</div>
            <div className="stat-label">Ukupno Ljekara</div>
          </div>

          <div className="stat-card" onClick={() => navigate('/AdminUstanove')}>
            <div className="stat-header">
              <div className="stat-icon">🏢</div>
              <div className="stat-trend">+{stats.weeklyGrowth.ustanove}%</div>
            </div>
            <div className="stat-number">{stats.ukupnoUstanova}</div>
            <div className="stat-label">Zdravstvene Ustanove</div>
          </div>

          <div className="stat-card" onClick={() => navigate('/AdminZahtjevi')}>
            <div className="stat-header">
              <div className="stat-icon">📄</div>
              <div className="stat-trend">+{stats.weeklyGrowth.zahtjevi}%</div>
            </div>
            <div className="stat-number">{stats.ukupnoZahtjeva}</div>
            <div className="stat-label">Ukupno Zahtjeva</div>
          </div>

          <div className="stat-card" onClick={() => navigate('/AdminZahtjevi')}>
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend">+{stats.weeklyGrowth.recepti}%</div>
            </div>
            <div className="stat-number">{stats.zahtjeviIzdat}</div>
            <div className="stat-label">Izdati Recepti</div>
          </div>
        </div>

        {/* Content layout */}
        <div className="content-layout">
          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">Brze Akcije</div>
              <div className="card-subtitle">Često korišćene operacije</div>
            </div>
            <div className="card-content">
              <div className="quick-actions-grid">
                {quickActions.map((qa, i) => (
                  <div
                    key={i}
                    className="quick-action"
                    style={{ '--color': qa.color }}
                    onClick={qa.action}
                  >
                    <div className="quick-action-icon">{qa.icon}</div>
                    <div className="quick-action-content">
                      <h4>{qa.title}</h4>
                      <p>{qa.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">Notifikacije</div>
              <div className="card-subtitle">Poslednji sistemski događaji</div>
            </div>
            <div className="card-content">
              <div className="activities-list">
                {recentActivities.map((a) => (
                  <div key={a.id} className="activity-item">
                    <div className="activity-icon"
                         style={{ backgroundColor: `${a.color}20`, color: a.color }}>
                      {a.icon}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{a.title}</div>
                      <div className="activity-desc">{a.description}</div>
                      <div className="activity-time">{a.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
