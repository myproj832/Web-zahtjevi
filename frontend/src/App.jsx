import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import InstitutionModal from "./components/InstitutionModal";
import LoginModal from "./components/LoginModal";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import RequestList from "./pages/RequestList/RequestList.jsx";
import RequestForm from "./pages/RequestForm/RequestForm.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import MedicalPrescription from "./pages/MedicalPrescription/MedicalPrescription.jsx";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const containerRef = useRef();
  const auth = useAuth();

  useEffect(() => {
    if (auth.tokenKorisnik && !auth.isAuthenticated) {
      setShowInstitutionModal(true);
    }
  }, [auth.tokenKorisnik, auth.isAuthenticated]);

  const handleLoginClick = () => setShowLoginModal(true);

  return (
    <div ref={containerRef}>
      <LoginModal
        show={!auth.tokenKorisnik && showLoginModal}
        onHide={() => setShowLoginModal(false)}
        container={containerRef.current}
      />

      <InstitutionModal
        show={
          !!auth.tokenKorisnik && !auth.isAuthenticated && showInstitutionModal
        }
        onHide={() => setShowInstitutionModal(false)}
        container={containerRef.current}
      />

      <Routes>
        <Route
          path="/admin"
          element={
            auth.isAuthenticated && auth.rola === "Admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/" element={<Dashboard openLogin={handleLoginClick} />} />
        <Route
          path="/requests"
          element={
            auth.isAuthenticated ? (
              auth.rola === "Admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequestList />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/form"
          element={
            auth.isAuthenticated ? <RequestForm /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/med"
          element={
            auth.isAuthenticated ? <MedicalPrescription /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
