import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Investors from './components/Investors';
import Commitments from './components/Commitments';
import DataIngestion from './components/DataIngestion';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar">
          <div className="brand">Investment Dashboard</div>
          <div className="tabs">
            <NavLink to="/investors" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
              Investors
            </NavLink>
            <NavLink to="/commitments" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
              Commitments
            </NavLink>
            <NavLink to="/data-ingestion" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
              Data Ingestion
            </NavLink>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/investors" replace />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/commitments" element={<Commitments />} />
            <Route path="/data-ingestion" element={<DataIngestion />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
