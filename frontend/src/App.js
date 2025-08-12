// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Simulation from './components/Simulation';
import DriverManagement from './components/DriverManagement';
import RouteManagement from './components/RouteManagement';
import OrderManagement from './components/OrderManagement';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar />}
        <div className={user ? "main-content" : "login-container"}>
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/simulation" 
              element={user ? <Simulation /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/drivers" 
              element={user ? <DriverManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/routes" 
              element={user ? <RouteManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/orders" 
              element={user ? <OrderManagement /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;