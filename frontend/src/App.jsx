import InstitutionModal from './components/InstitutionModal';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';


function App() {
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
   const handleSelect = (value) => {
    console.log('Odabrana ustanova:', value);
    // kasnije tu ide logika nakon logina
  };
  return (
    <div>
       <InstitutionModal
         show={showInstitutionModal} 
        onSelect={handleSelect}
        onClose={() => setShowInstitutionModal(false)}
      />
      <Dashboard />
    </div>
  );
}

export default App;
