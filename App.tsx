import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { getStoredUser, loginMock, logoutMock } from './services/storageService';
import { User } from './types';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    const newUser = loginMock(email);
    setUser(newUser);
  };

  const handleLogout = () => {
    logoutMock();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-bg">
        <div className="w-12 h-12 border-4 border-black border-t-neo-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <MemoryRouter>
      <PwaUpdatePrompt />
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </MemoryRouter>
  );
};

export default App;