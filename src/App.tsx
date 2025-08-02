import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import DiagnosticInterface from './components/Diagnostics/DiagnosticInterface';
import AdminPanel from './components/Admin/AdminPanel';
import { Patient } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  const handleNewPatient = () => {
    setEditingPatient(undefined);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    // Ici vous intégreriez l'API pour sauvegarder
    console.log('Sauvegarde patient:', patientData);
    setShowPatientForm(false);
    setEditingPatient(undefined);
  };

  const handleClosePatientForm = () => {
    setShowPatientForm(false);
    setEditingPatient(undefined);
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="min-h-screen">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'patients' && (
          <PatientList 
            onNewPatient={handleNewPatient}
            onEditPatient={handleEditPatient}
          />
        )}
        {currentPage === 'diagnostics' && <DiagnosticInterface />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>

      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onClose={handleClosePatientForm}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;