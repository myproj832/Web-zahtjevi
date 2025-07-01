import React, { useState, useEffect } from 'react';

const AdminIzvjestaj = ({ onBack }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-06-28'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data za različite izvještaje
  const reportTypes = [
    {
      id: 'doctors',
      title: 'Izvještaj o ljekarima',
      description: 'Pregled aktivnosti ljekara, broj izdatih recepata',
      icon: '👨‍⚕️',
      color: '#3B82F6'
    },
    {
      id: 'institutions',
      title: 'Izvještaj o ustanovama',
      description: 'Statistike po zdravstvenim ustanovama',
      icon: '🏥',
      color: '#10B981'
    },
    {
      id: 'prescriptions',
      title: 'Izvještaj o receptima',
      description: 'Analiza izdatih i kreiranih recepata',
      icon: '📋',
      color: '#F59E0B'
    },
    {
      id: 'medications',
      title: 'Izvještaj o lijekovima',
      description: 'Najčešće propisivani lijekovi',
      icon: '💊',
      color: '#8B5CF6'
    },
    {
      id: 'activity',
      title: 'Izvještaj o aktivnostima',
      description: 'Sistemske aktivnosti i logovi',
      icon: '📈',
      color: '#EF4444'
    },
    {
      id: 'performance',
      title: 'Izvještaj o performansama',
      description: 'Brzina obrade zahtjeva i sistemske metrike',
      icon: '⚡',
      color: '#06B6D4'
    }
  ];

  const doctorsReportData = {
    totalDoctors: 8,
    activeDoctors: 7,
    topDoctors: [
      { name: 'Dr. Marko Petrović', prescriptions: 45, specialty: 'Kardiolog' },
      { name: 'Dr. Ana Jovanović', prescriptions: 38, specialty: 'Neurolog' },
      { name: 'Dr. Petar Nikolić', prescriptions: 32, specialty: 'Ortoped' },
      { name: 'Dr. Milica Stanković', prescriptions: 28, specialty: 'Internista' },
      { name: 'Dr. Stefan Milanović', prescriptions: 21, specialty: 'Dermatolog' }
    ],
    monthlyData: [
      { month: 'Januar', prescriptions: 145 },
      { month: 'Februar', prescriptions: 167 },
      { month: 'Mart', prescriptions: 189 },
      { month: 'April', prescriptions: 203 },
      { month: 'Maj', prescriptions: 178 },
      { month: 'Jun', prescriptions: 234 }
    ]
  };

  const institutionsReportData = {
    totalInstitutions: 8,
    activeInstitutions: 8,
    topInstitutions: [
      { name: 'Dom zdravlja Podgorica', requests: 89, doctors: 3 },
      { name: 'Klinički centar Crne Gore', requests: 67, doctors: 2 },
      { name: 'Dom zdravlja Nikšić', requests: 45, doctors: 1 },
      { name: 'Bolnica Cetinje', requests: 32, doctors: 1 },
      { name: 'Institut za javno zdravlje', requests: 14, doctors: 1 }
    ]
  };

  const prescriptionsReportData = {
    totalRequests: 247,
    issuedPrescriptions: 158,
    pendingRequests: 89,
    successRate: 64.0,
    dailyAverage: 4.1,
    statusBreakdown: [
      { status: 'Izdato', count: 158, percentage: 64.0, color: '#10B981' },
      { status: 'Kreiran', count: 89, percentage: 36.0, color: '#F59E0B' }
    ]
  };

  const medicationsReportData = {
    topMedications: [
      { name: 'Paracetamol 500mg', count: 34, percentage: 21.5 },
      { name: 'Aspirin 100mg', count: 28, percentage: 17.7 },
      { name: 'Ibuprofen 400mg', count: 22, percentage: 13.9 },
      { name: 'Brufen 600mg', count: 19, percentage: 12.0 },
      { name: 'Andol C', count: 15, percentage: 9.5 },
      { name: 'Ostalo', count: 40, percentage: 25.4 }
    ]
  };

  const handleGenerateReport = (reportId) => {
    setSelectedReport(reportId);
  };

  const handleExportPDF = () => {
    alert('Izvještaj bi bio exportovan kao PDF - funkcionalnost će biti dodana!');
  };

  const handleExportExcel = () => {
    alert('Izvještaj bi bio exportovan kao Excel - funkcionalnost će biti dodana!');
  };

  const renderReportContent = () => {
    switch(selectedReport) {
      case 'doctors':
        return (
          <div className="report-content">
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon">👨‍⚕️</div>
                <div className="summary-number">{doctorsReportData.totalDoctors}</div>
                <div className="summary-label">Ukupno ljekara</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">✅</div>
                <div className="summary-number">{doctorsReportData.activeDoctors}</div>
                <div className="summary-label">Aktivni ljekari</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📋</div>
                <div className="summary-number">164</div>
                <div className="summary-label">Ukupno recepata</div>
              </div>
            </div>

            <div className="report-section">
              <h3 className="section-title">🏆 Top 5 ljekara po broju recepata</h3>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Rang</th>
                      <th>Ime i prezime</th>
                      <th>Specijalizacija</th>
                      <th>Broj recepata</th>
                      <th>Procenat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorsReportData.topDoctors.map((doctor, index) => (
                      <tr key={index}>
                        <td><span className="rank-badge">{index + 1}</span></td>
                        <td className="doctor-name">{doctor.name}</td>
                        <td>{doctor.specialty}</td>
                        <td className="number-cell">{doctor.prescriptions}</td>
                        <td className="percentage-cell">{((doctor.prescriptions / 164) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-section">
              <h3 className="section-title">📊 Mjesečni trend izdavanja recepata</h3>
              <div className="chart-container">
                {doctorsReportData.monthlyData.map((item, index) => (
                  <div key={index} className="chart-bar">
                    <div className="bar-label">{item.month}</div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{width: `${(item.prescriptions / 250) * 100}%`}}
                      ></div>
                    </div>
                    <div className="bar-value">{item.prescriptions}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'institutions':
        return (
          <div className="report-content">
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon">🏥</div>
                <div className="summary-number">{institutionsReportData.totalInstitutions}</div>
                <div className="summary-label">Ukupno ustanova</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">✅</div>
                <div className="summary-number">{institutionsReportData.activeInstitutions}</div>
                <div className="summary-label">Aktivne ustanove</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📋</div>
                <div className="summary-number">247</div>
                <div className="summary-label">Ukupno zahtjeva</div>
              </div>
            </div>

            <div className="report-section">
              <h3 className="section-title">🏆 Top ustanove po broju zahtjeva</h3>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Rang</th>
                      <th>Naziv ustanove</th>
                      <th>Broj zahtjeva</th>
                      <th>Broj ljekara</th>
                      <th>Procenat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutionsReportData.topInstitutions.map((institution, index) => (
                      <tr key={index}>
                        <td><span className="rank-badge">{index + 1}</span></td>
                        <td className="institution-name">{institution.name}</td>
                        <td className="number-cell">{institution.requests}</td>
                        <td className="number-cell">{institution.doctors}</td>
                        <td className="percentage-cell">{((institution.requests / 247) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'prescriptions':
        return (
          <div className="report-content">
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon">📋</div>
                <div className="summary-number">{prescriptionsReportData.totalRequests}</div>
                <div className="summary-label">Ukupno zahtjeva</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">✅</div>
                <div className="summary-number">{prescriptionsReportData.issuedPrescriptions}</div>
                <div className="summary-label">Izdato recepata</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">⏳</div>
                <div className="summary-number">{prescriptionsReportData.pendingRequests}</div>
                <div className="summary-label">Na čekanju</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📈</div>
                <div className="summary-number">{prescriptionsReportData.successRate}%</div>
                <div className="summary-label">Uspješnost</div>
              </div>
            </div>

            <div className="report-section">
              <h3 className="section-title">📊 Distribucija po statusu</h3>
              <div className="status-chart">
                {prescriptionsReportData.statusBreakdown.map((status, index) => (
                  <div key={index} className="status-item">
                    <div className="status-info">
                      <div className="status-name">{status.status}</div>
                      <div className="status-count">{status.count} zahtjeva</div>
                    </div>
                    <div className="status-bar">
                      <div 
                        className="status-fill" 
                        style={{
                          width: `${status.percentage}%`,
                          backgroundColor: status.color
                        }}
                      ></div>
                    </div>
                    <div className="status-percentage">{status.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'medications':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3 className="section-title">💊 Najčešće propisivani lijekovi</h3>
              <div className="medications-chart">
                {medicationsReportData.topMedications.map((med, index) => (
                  <div key={index} className="medication-item">
                    <div className="medication-info">
                      <div className="medication-name">{med.name}</div>
                      <div className="medication-count">{med.count} recepata</div>
                    </div>
                    <div className="medication-bar">
                      <div 
                        className="medication-fill" 
                        style={{width: `${med.percentage}%`}}
                      ></div>
                    </div>
                    <div className="medication-percentage">{med.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="report-placeholder">
            <div className="placeholder-icon">📊</div>
            <h3>Izaberite tip izvještaja</h3>
            <p>Kliknite na jedan od tipova izvještaja da biste vidjeli detaljnu analizu podataka.</p>
          </div>
        );
    }
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
          background: #fafbfc;
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

        .breadcrumb {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          margin-left: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
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

        .back-btn {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 18px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .back-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }

        /* Main Content */
        .main-content {
          padding: 88px 32px 32px;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
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

        .date-range {
          display: flex;
          gap: 12px;
          align-items: center;
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .date-input {
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          color: #1a1d29;
          background: #f8fafc;
        }

        .date-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .date-separator {
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
        }

        /* Report Types Grid */
        .report-types {
          margin-bottom: 32px;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .type-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .type-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .type-card:hover {
          border-color: var(--color);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .type-card:hover::before,
        .type-card.active::before {
          transform: scaleX(1);
        }

        .type-card.active {
          border-color: var(--color);
          background: rgba(59, 130, 246, 0.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .type-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .type-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .type-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 4px;
        }

        .type-description {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Report Display */
        .report-display {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .report-content {
          padding: 32px;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          position: relative;
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 12px 12px 0 0;
        }

        .summary-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .summary-number {
          font-size: 28px;
          font-weight: 700;
          color: #1a1d29;
          margin-bottom: 4px;
          letter-spacing: -1px;
        }

        .summary-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
        }

        .report-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1d29;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Table Styles */
        .table-container {
          background: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
        }

        .report-table th {
          background: #374151;
          color: white;
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-table td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          font-size: 14px;
        }

        .report-table tr:hover {
          background: rgba(59, 130, 246, 0.02);
        }

        .rank-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .doctor-name, .institution-name {
          font-weight: 600;
          color: #1a1d29;
        }

        .number-cell {
          font-weight: 600;
          color: #3b82f6;
        }

        .percentage-cell {
          font-weight: 600;
          color: #10b981;
        }

        /* Chart Styles */
        .chart-container {
          background: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .chart-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          padding: 8px 0;
        }

        .bar-label {
          min-width: 80px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .bar-track {
          flex: 1;
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 6px;
          transition: width 0.6s ease;
        }

        .bar-value {
          min-width: 40px;
          text-align: right;
          font-weight: 600;
          color: #1a1d29;
          font-size: 13px;
        }

        /* Status and Medications Charts */
        .status-chart, .medications-chart {
          background: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .status-item, .medication-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .status-info, .medication-info {
          min-width: 160px;
        }

        .status-name, .medication-name {
          font-weight: 600;
          color: #1a1d29;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .status-count, .medication-count {
          font-size: 12px;
          color: #6b7280;
        }

        .status-bar, .medication-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .status-fill, .medication-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .status-percentage, .medication-percentage {
          min-width: 50px;
          text-align: right;
          font-weight: 600;
          color: #1a1d29;
          font-size: 13px;
        }

        /* Placeholder */
        .report-placeholder {
          text-align: center;
          padding: 80px 32px;
          color: #6b7280;
        }

        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .report-placeholder h3 {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .report-placeholder p {
          font-size: 16px;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Export Buttons */
        .export-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          padding: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: #f8fafc;
        }

        .export-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .export-btn.secondary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .export-btn.secondary:hover {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .types-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
          
          .page-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 88px 16px 32px;
          }
          
          .header {
            padding: 0 16px;
          }
          
          .types-grid {
            grid-template-columns: 1fr;
          }
          
          .summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
          }
          
          .chart-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .bar-label, .bar-value {
            text-align: left;
          }
          
          .status-item, .medication-item {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .export-buttons {
            flex-direction: column;
          }
          
          .date-range {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🏥</div>
            Cosmetic
          </div>
        </div>
        
        <div className="header-right">
          <div className="time-display">
            {currentTime.toLocaleTimeString('sr-RS', { 
              hour12: false,
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          
          <button className="back-btn" onClick={onBack}>
            ← Nazad
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">📊 Izvještaji</h1>
            <p className="page-subtitle">
              Detaljne analize i statistike sistema
            </p>
          </div>
          
          <div className="date-range">
            <input 
              type="date" 
              className="date-input"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
            />
            <span className="date-separator">do</span>
            <input 
              type="date" 
              className="date-input"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
            />
          </div>
        </div>

        {/* Report Types */}
        <div className="report-types">
          <div className="types-grid">
            {reportTypes.map(type => (
              <div 
                key={type.id}
                className={`type-card ${selectedReport === type.id ? 'active' : ''}`}
                style={{'--color': type.color}}
                onClick={() => handleGenerateReport(type.id)}
              >
                <div className="type-header">
                  <div className="type-icon" style={{background: type.color}}>
                    {type.icon}
                  </div>
                  <div>
                    <div className="type-title">{type.title}</div>
                  </div>
                </div>
                <div className="type-description">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Display */}
        <div className="report-display">
          {renderReportContent()}
          
          {selectedReport && (
            <div className="export-buttons">
              <button className="export-btn" onClick={handleExportPDF}>
                📄 Exportuj PDF
              </button>
              <button className="export-btn secondary" onClick={handleExportExcel}>
                📊 Exportuj Excel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminIzvjestaj;