import React, { useState } from 'react';
import './components.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const DataIngestion: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!file) {
      setError('Please select a CSV file');
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/ingest_data`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStatus(`Ingested: ${json.investors_created} investors, ${json.commitments_created} commitments.`);
      setFile(null);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Data Ingestion</h1>
      <p className="stats" style={{ marginTop: 0 }}>
        Upload a CSV with the following headers: <code>Investor Name</code>, <code>Investory Type</code>,
        <code> Investor Country</code>, <code>Investor Date Added</code>, <code>Investor Last Updated</code>,
        <code> Commitment Asset Class</code>, <code>Commitment Amount</code>, <code>Commitment Currency</code>.
      </p>

      <form onSubmit={onSubmit} className="filterBar">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="input"
        />
        <button type="submit" disabled={submitting} className="button">
          {submitting ? 'Uploading…' : 'Upload CSV'}
        </button>
      </form>
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'tomato' }}>Error: {error}</p>}
    </section>
  );
};

export default DataIngestion; 