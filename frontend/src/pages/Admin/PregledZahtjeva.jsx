import React, { useEffect } from 'react';

const PregledZahtjeva = ({ zahtjev, onBack }) => {
  useEffect(() => {
    const handlePopState = (event) => {
      onBack();
    };

    window.addEventListener('popstate', handlePopState);
    
    // Dodaj entry u browser history
    window.history.pushState({ page: 'pregled-zahtjeva' }, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack]);
  if (!zahtjev) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Zahtjev nije pronađen</h2>
        <button onClick={onBack}>Nazad</button>
      </div>
    );
  }

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
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {statusStyle.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString, timeString) => {
    return `${formatDate(dateString)} u ${timeString}`;
  };

  return (
    <div className="pregled-zahtjeva">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .pregled-zahtjeva {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%);
          min-height: 100vh;
          padding: 32px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #6b7280;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(10px);
        }

        .back-btn:hover {
          background: white;
          color: #374151;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1d29;
          letter-spacing: -1px;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .details-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-icon {
          font-size: 24px;
        }

        .zahtjev-header {
          display: flex;
          justify-content: between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .zahtjev-id {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          backdrop-filter: blur(10px);
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #1a1d29;
        }

        .info-value.large {
          font-size: 18px;
          font-weight: 600;
        }

        .info-value.phone {
          color: #10b981;
          font-weight: 600;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .napomena-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .napomena-content {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          font-style: italic;
          color: #6b7280;
          min-height: 60px;
          margin-top: 8px;
        }

        .side-cards {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(10px);
        }

        .info-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .tip-ljekar {
          background: #e0f2fe;
          color: #0369a1;
        }

        .tip-apotekar {
          background: #f0fdf4;
          color: #16a34a;
        }

        .priority-high {
          color: #ef4444;
          font-weight: 600;
        }

        .priority-normal {
          color: #6b7280;
        }

        /* Timeline Card - Horizontal */
        .timeline-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
          margin-top: 32px;
        }

        .timeline {
          position: relative;
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 20px 0;
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }

        .timeline::-webkit-scrollbar {
          height: 8px;
        }

        .timeline::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .timeline::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .timeline::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .timeline::before {
          content: '';
          position: absolute;
          top: 28px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #10b981);
          z-index: 0;
        }

        .timeline-item {
          position: relative;
          min-width: 280px;
          flex-shrink: 0;
        }

        .timeline-dot {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          z-index: 1;
        }

        .timeline-dot.completed {
          background: #10b981;
          border-color: #10b981;
        }

        .timeline-dot.rejected {
          background: #ef4444;
          border-color: #ef4444;
        }

        .timeline-content {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          margin-top: 36px;
          min-height: 160px;
        }

        .timeline-header {
          margin-bottom: 8px;
        }

        .timeline-action {
          font-weight: 600;
          color: #1a1d29;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .timeline-date {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .timeline-user {
          font-size: 13px;
          color: #3b82f6;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .timeline-comment {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
          font-style: italic;
          margin-bottom: 8px;
        }

        .status-change {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          flex-wrap: wrap;
        }

        .arrow {
          color: #9ca3af;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pregled-zahtjeva {
            padding: 16px;
            padding-top: 80px;
          }

          .header {
            top: 8px;
            left: 8px;
          }

          .page-title {
            margin-top: 60px;
            font-size: 24px;
          }

          .main-content {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .details-card,
          .info-card,
          .timeline-card {
            padding: 20px;
          }

          .timeline {
            flex-direction: column;
            gap: 16px;
            overflow-x: visible;
          }

          .timeline::-webkit-scrollbar {
            display: none;
          }

          .timeline::before {
            top: 0;
            bottom: 0;
            left: 20px;
            width: 2px;
            height: auto;
            background: linear-gradient(to bottom, #3b82f6, #10b981);
          }

          .timeline-item {
            min-width: auto;
            padding-left: 56px;
          }

          .timeline-dot {
            left: 12px;
            top: 0;
            transform: none;
          }

          .timeline-content {
            margin-top: 0;
            min-height: auto;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={onBack}>
            ← Nazad na listu
          </button>
        </div>

        <h1 className="page-title">Pregled Zahtjeva</h1>

        <div className="main-content">
          <div className="details-card">
            <h2 className="card-title">
              <span className="card-icon">📋</span>
              Detalji Zahtjeva
            </h2>

            <div className="zahtjev-header">
              <div className="zahtjev-id">ID: #{zahtjev.id}</div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Datum i vreme kreiranja</div>
                <div className="info-value large">
                  {formatDateTime(zahtjev.datum, zahtjev.vreme)}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">Status zahtjeva</div>
                <div className="info-value">
                  {getStatusBadge(zahtjev.status)}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">Pacijent</div>
                <div className="info-value large">{zahtjev.pacijent}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Kontakt telefon</div>
                <div className="info-value phone">{zahtjev.telefon}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Ustanova</div>
                <div className="info-value">{zahtjev.ustanova}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Ljekar / Savetnik</div>
                <div className="info-value">{zahtjev.ljekar}</div>
              </div>

              {zahtjev.farmaceut && (
                <div className="info-item">
                  <div className="info-label">Dodijeljeni farmaceut</div>
                  <div className="info-value">{zahtjev.farmaceut}</div>
                </div>
              )}

              {zahtjev.datumIzdavanja && (
                <div className="info-item">
                  <div className="info-label">Datum izdavanja</div>
                  <div className="info-value">{formatDate(zahtjev.datumIzdavanja)}</div>
                </div>
              )}
            </div>

            {zahtjev.napomena && (
              <div className="napomena-section">
                <div className="info-label">Napomena</div>
                <div className="napomena-content">
                  {zahtjev.napomena}
                </div>
              </div>
            )}
          </div>

          <div className="side-cards">
            <div className="info-card">
              <h3 className="info-card-title">
                <span>📞</span>
                Kontakt Informacije
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Pacijent</div>
                  <div className="info-value">{zahtjev.pacijent}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Telefon</div>
                  <div className="info-value phone">{zahtjev.telefon}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Ustanova</div>
                  <div className="info-value">{zahtjev.ustanova}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Odgovorni ljekar</div>
                  <div className="info-value">{zahtjev.ljekar}</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-card-title">
                <span>📊</span>
                Statistike Zahtjeva
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Tip zahtjeva</div>
                  <div className="info-value">
                    <span className={`tip-badge ${zahtjev.tipZahtjeva === 'Ljekar' ? 'tip-ljekar' : 'tip-apotekar'}`}>
                      {zahtjev.tipZahtjeva === 'Ljekar' ? '👨‍⚕️' : '💊'} {zahtjev.tipZahtjeva}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Prioritet</div>
                  <div className={`info-value ${zahtjev.napomena ? 'priority-high' : 'priority-normal'}`}>
                    {zahtjev.napomena ? 'Visok' : 'Normalan'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Vreme obrade</div>
                  <div className="info-value">
                    {zahtjev.status === 'odobren' ? '2h 30min' : 
                     zahtjev.status === 'odbačen' ? '3h 15min' : 
                     'U toku...'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Dodijeljeni farmaceut</div>
                  <div className="info-value">
                    {zahtjev.farmaceut || 'Nije dodijeljen'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-card">
          <h2 className="card-title">
            <span className="card-icon">📈</span>
            Istorija Zahtjeva
          </h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot completed"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-action">Zahtjev kreiran</div>
                  <div className="timeline-date">
                    {formatDateTime(zahtjev.datum, zahtjev.vreme)}
                  </div>
                </div>
                <div className="timeline-user">{zahtjev.ljekar}</div>
                <div className="timeline-comment">
                  Inicijalni zahtjev za {zahtjev.tipZahtjeva === 'Ljekar' ? 'medicinski pregled' : 'farmaceutsku uslugu'}
                </div>
                <div className="status-change">
                  {getStatusBadge('kreiran')}
                </div>
              </div>
            </div>

            {zahtjev.napomena && (
              <div className="timeline-item">
                <div className="timeline-dot completed"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="timeline-action">Dodana napomena</div>
                    <div className="timeline-date">
                      {formatDateTime(zahtjev.datum, '20:45:32')}
                    </div>
                  </div>
                  <div className="timeline-user">{zahtjev.ljekar}</div>
                  <div className="timeline-comment">
                    Dodana napomena: "{zahtjev.napomena}"
                  </div>
                </div>
              </div>
            )}

            {zahtjev.status === 'odobren' && zahtjev.farmaceut && (
              <>
                <div className="timeline-item">
                  <div className="timeline-dot completed"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div className="timeline-action">Zahtjev u obradi</div>
                      <div className="timeline-date">
                        {formatDateTime(zahtjev.datum, '09:22:15')}
                      </div>
                    </div>
                    <div className="timeline-user">Admin sistem</div>
                    <div className="timeline-comment">
                      Automatska provjera validnosti zahtjeva
                    </div>
                    <div className="status-change">
                      {getStatusBadge('kreiran')} <span className="arrow">→</span> {getStatusBadge('u_obradi')}
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot completed"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div className="timeline-action">Zahtjev odobren</div>
                      <div className="timeline-date">
                        {formatDateTime(zahtjev.datumIzdavanja || zahtjev.datum, '10:15:30')}
                      </div>
                    </div>
                    <div className="timeline-user">{zahtjev.farmaceut}</div>
                    <div className="timeline-comment">
                      Zahtjev je odobren i dodijeljen farmaceut
                    </div>
                    <div className="status-change">
                      {getStatusBadge('u_obradi')} <span className="arrow">→</span> {getStatusBadge('odobren')}
                    </div>
                  </div>
                </div>
              </>
            )}

            {zahtjev.status === 'odbačen' && (
              <div className="timeline-item">
                <div className="timeline-dot rejected"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="timeline-action">Zahtjev odbačen</div>
                    <div className="timeline-date">
                      {formatDateTime(zahtjev.datum, '11:30:45')}
                    </div>
                  </div>
                  <div className="timeline-user">Admin sistem</div>
                  <div className="timeline-comment">
                    Zahtjev odbačen zbog nepotpunih informacija
                  </div>
                  <div className="status-change">
                    {getStatusBadge('kreiran')} <span className="arrow">→</span> {getStatusBadge('odbačen')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregledZahtjeva;