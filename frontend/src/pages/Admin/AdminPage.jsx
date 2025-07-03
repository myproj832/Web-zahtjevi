import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleDodajDoktora = () => {
    navigate('/DodajDoktora');
  };

  const handleDodajUstanovu = () => {
    navigate('/DodajUstanovu');
  };

  return (
    <div className="admin-page background">
      {/* Fixed Header */}
      <Header />
      
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="admin-main-content">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 col-lg-8 col-xl-6">
              {/* Actions Card */}
              <div className="card admin-actions-card">
                <div className="card-header admin-card-header">
                  <h4 className="card-title mb-0">Akcije</h4>
                </div>
                <div className="card-body admin-card-body">
                  <div className="admin-actions-grid">
                    {/* Dodaj Ljekara Button */}
                    <button
                      className="button admin-action-btn"
                      onClick={handleDodajDoktora}
                    >
                      <div className="admin-btn-icon">
                        👨‍⚕️
                      </div>
                      <div className="admin-btn-text">
                        <span className="admin-btn-title">Dodaj Ljekara</span>
                        <small className="admin-btn-subtitle">Dodajte novog ljekara u sistem</small>
                      </div>
                    </button>

                    {/* Dodaj Ustanovu Button */}
                    <button
                      className="button admin-action-btn"
                      onClick={handleDodajUstanovu}
                    >
                      <div className="admin-btn-icon">
                        🏥
                      </div>
                      <div className="admin-btn-text">
                        <span className="admin-btn-title">Dodaj Ustanovu</span>
                        <small className="admin-btn-subtitle">Dodajte novu ustanovu u sistem</small>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;