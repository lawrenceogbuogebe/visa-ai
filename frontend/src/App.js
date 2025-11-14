import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ClientView from './pages/ClientView';
import Templates from './pages/Templates';
import Training from './pages/Training';
import PetitionBuilder from './pages/PetitionBuilder';

function App() {
  const [token, setToken] = useState(localStorage.getItem('visar_token'));
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('visar_token', token);
    } else {
      localStorage.removeItem('visar_token');
    }
  }, [token]);
  
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Auth setToken={setToken} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard setToken={setToken} /></ProtectedRoute>} />
          <Route path="/client/:clientId" element={<ProtectedRoute><ClientView setToken={setToken} /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates setToken={setToken} /></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute><Training setToken={setToken} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
