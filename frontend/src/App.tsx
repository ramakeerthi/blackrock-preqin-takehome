import React, { useState } from 'react';
import './App.css';

type TabKey = 'investors' | 'commitments' | 'about';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('investors');

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand">YourBrand</div>
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
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>
      </nav>

      <main className="content">
        {activeTab === 'investors' && (
          <section>
            <h1>Investors</h1>
            <p>Placeholder content for Investors tab.</p>
          </section>
        )}
        {activeTab === 'commitments' && (
          <section>
            <h1>Commitments</h1>
            <p>Placeholder content for Commitments tab.</p>
          </section>
        )}
        {activeTab === 'about' && (
          <section>
            <h1>About</h1>
            <p>Placeholder content for About tab.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
