import React, { useState } from 'react';
import './App.css';
import Investors from './components/Investors';
import Commitments from './components/Commitments';
import DataIngestion from './components/DataIngestion';

type TabKey = 'investors' | 'commitments' | 'data_ingestion';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('investors');

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand">Investment Dashboard</div>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'investors' ? 'active' : ''}`}
            onClick={() => setActiveTab('investors')}
          >
            Investors
          </button>
          <button
            className={`tab ${activeTab === 'commitments' ? 'active' : ''}`}
            onClick={() => setActiveTab('commitments')}
          >
            Commitments
          </button>
          <button
            className={`tab ${activeTab === 'data_ingestion' ? 'active' : ''}`}
            onClick={() => setActiveTab('data_ingestion')}
          >
            Data Ingestion
          </button>
        </div>
      </nav>

      <main className="content">
        {activeTab === 'investors' && <Investors />}
        {activeTab === 'commitments' && <Commitments />}
        {activeTab === 'data_ingestion' && <DataIngestion />}
      </main>
    </div>
  );
}

export default App;
