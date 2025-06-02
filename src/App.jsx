// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Mumbai } from '@thirdweb-dev/chains';

import store from './redux/store';
import { AuthProvider } from './contexts/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import VoterRegistration from './pages/VoterRegistration';
import RegistrationPending from './pages/RegistrationPending';

// Voter Pages
import VoterDashboard from './pages/voter/Dashboard';
import VotingPage from './pages/voter/VotingPage';
import ResultsPage from './pages/voter/ResultsPage';

// Electoral Commission Pages
import ECDashboard from './pages/ec/Dashboard';
import VoterManagement from './pages/ec/VoterManagement';
import CandidateManagement from './pages/ec/CandidateManagement';
import ElectionManagement from './pages/ec/ElectionManagement';
import ECResultsPage from './pages/ec/ElectionResults';

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ThirdwebProvider 
      activeChain={Mumbai}
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || ""}
    >
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow bg-gray-50">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/register" element={<VoterRegistration />} />
                  <Route path="/registration-pending" element={<RegistrationPending />} />
                  
                  {/* Voter Routes */}
                  <Route path="/voter/dashboard" element={
                    <ProtectedRoute role="voter">
                      <VoterDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/voter/vote" element={
                    <ProtectedRoute role="voter">
                      <VotingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/voter/results" element={
                    <ProtectedRoute role="voter">
                      <ResultsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Electoral Commission Routes */}
                  <Route path="/ec/dashboard" element={
                    <ProtectedRoute role="admin">
                      <ECDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ec/voters" element={
                    <ProtectedRoute role="admin">
                      <VoterManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/ec/candidates" element={
                    <ProtectedRoute role="admin">
                      <CandidateManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/ec/election" element={
                    <ProtectedRoute role="admin">
                      <ElectionManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/ec/results" element={
                    <ProtectedRoute role="admin">
                      <ECResultsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="top-right" autoClose={5000} />
            </div>
          </Router>
        </AuthProvider>
      </Provider>
    </ThirdwebProvider>
  );
}

export default App;