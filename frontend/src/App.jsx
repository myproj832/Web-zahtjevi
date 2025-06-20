import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import InstitutionModal from './components/InstitutionModal';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import RequestList from './pages/RequestList/RequestList.jsx'; 

function App() {
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);

  const handleSelect = (value) => {
    console.log('Odabrana ustanova:', value);
    // kasnije tu ide logika nakon logina
  };

  return (
    <Router>
      <div>
        <InstitutionModal
          show={showInstitutionModal}
          onSelect={handleSelect}
          onClose={() => setShowInstitutionModal(false)}
        />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<RequestList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
