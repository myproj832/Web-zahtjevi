import {
  Routes,
  Route,
  Navigate,
  
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext.jsx';

/* ───────  Modali  ─────── */
import InstitutionModal from './components/InstitutionModal.jsx';
import LoginModal       from './components/LoginModal.jsx';
import SessionMessages from './components/Messages/SessionMessage.jsx';

/* ───────  "Obične" stranice  ─────── */
import Dashboard           from './pages/Dashboard/Dashboard.jsx';
import RequestList         from './pages/RequestList/RequestList.jsx';
import RequestForm         from './pages/RequestForm/RequestForm.jsx';
import MedicalPrescription from './pages/MedicalPrescription/MedicalPrescription.jsx';
import RequestDetailsPage from './pages/RequestDetailsPage/RequestDetailsPage.jsx';

/* ───────  ADMIN stranice  ─────── */
import { AdminLayout } from './layouts/AdminLayout.jsx';

import AdminPage       from './pages/Admin/AdminPage.jsx';
import AdminDoktori    from './pages/Admin/AdminDoktori.jsx';
import AdminUstanove   from './pages/Admin/AdminUstanove.jsx';
import DodajDoktora    from './pages/Admin/DodajDoktora.jsx';
import DodajUstanovu   from './pages/Admin/DodajUstanovu.jsx';
import IzmijeniDoktora from './pages/Admin/IzmijeniDoktora.jsx';
import IzmijeniUstanovu from './pages/Admin/IzmijeniUstanovu.jsx';

function App() {
  const [showLoginModal, setShowLoginModal]             = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const containerRef = useRef(null);

  const auth      = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  /*─────────────────────────────────────────────────────────
    1)  Ako se korisnik tek logovao (ima token, ali nije
        izabrao ustanovu) — prikaži InstitutionModal.
  ─────────────────────────────────────────────────────────*/
  useEffect(() => {
    if (auth.tokenKorisnik && !auth.isAuthenticated) {
      setShowInstitutionModal(true);
    }
  }, [auth.tokenKorisnik, auth.isAuthenticated]);

  /*─────────────────────────────────────────────────────────
    2)  Kada se rola postavi na "Admin", a korisnik je
        još uvijek na početnoj ("/") → automatski ga preusmjeri
        na admin panel.
  ─────────────────────────────────────────────────────────*/
  useEffect(() => {
    if (
      auth.isAuthenticated &&
      auth.rola === 'Admin' &&
      location.pathname === '/'
    ) {
      navigate('/AdminPage', { replace: true });
    }
  }, [auth.isAuthenticated, auth.rola, location.pathname, navigate]);

  /*─────────────────────────────────────────────────────────
    3)  Helperi za rute
  ─────────────────────────────────────────────────────────*/
  const requireLogin = (Component) =>
    auth.isAuthenticated ? <Component /> : <Navigate to="/" replace />;

  // const requireAdmin = (Component) =>
  //   auth.isAuthenticated && auth.rola === 'Admin'
  //     ? <Component />
  //     : <Navigate to="/" replace />;

  /*─────────────────────────────────────────────────────────
                     JSX
  ─────────────────────────────────────────────────────────*/
  return (
    <div ref={containerRef}>
      {/* ───────  Modali  ─────── */}
      <LoginModal
        show={!auth.tokenKorisnik && showLoginModal}
        onHide={() => setShowLoginModal(false)}
        container={containerRef.current}
      />

      <InstitutionModal
        show={!!auth.tokenKorisnik && !auth.isAuthenticated && showInstitutionModal}
        onHide={() => setShowInstitutionModal(false)}
        container={containerRef.current}
      />

      <SessionMessages />

      {/* ───────  Rute  ─────── */}
      <Routes>
        <Route
          path="/"
          element={<Dashboard openLogin={() => setShowLoginModal(true)} />}
        />

        <Route path="/form"     element={requireLogin(RequestForm)} />
        <Route path="/med"      element={requireLogin(MedicalPrescription)} />
        <Route path="/details/:id" element={requireLogin(RequestDetailsPage)} />
        
        {/* Ako je admin, preusmjeri /requests na admin verziju liste */}
        <Route
          path="/requests"
          element={
            auth.isAuthenticated
              ? auth.rola === 'Admin'
                ? <Navigate to="/AdminPage" replace />
                : <RequestList />
              : <Navigate to="/" replace />
          }
        />
        <Route element={<AdminLayout />}>

        {/* ───────  ADMIN RUTE  ─────── */}
        <Route path="/AdminPage"              element={<AdminPage/>} />
        <Route path="/AdminDoktori"           element={<AdminDoktori/>} />
        <Route path="/AdminUstanove"          element={<AdminUstanove/>} />
        <Route path="/DodajDoktora"           element={<DodajDoktora/>} />
        <Route path="/DodajUstanovu"          element={<DodajUstanovu/>} />
        <Route path="/IzmijeniDoktora/:id"    element={<IzmijeniDoktora/>} />
        <Route path="/IzmijeniUstanovu/:id"   element={<IzmijeniUstanovu/>} />
</Route>
        {/* Fallback → sve nepoznato vodi na početnu  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;