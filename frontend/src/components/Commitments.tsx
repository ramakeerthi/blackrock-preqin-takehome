import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './components.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface Commitment {
  id: number;
  investor_id: number;
  investor_name: string;
  asset_class?: string | null;
  amount: number;
  currency?: string | null;
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Commitments: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [data, setData] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assetClass, setAssetClass] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>(query.get('investor_name') || '');
  const [investorOptions, setInvestorOptions] = useState<string[]>([]);

  // Load investor options for dropdown (all investors)
  useEffect(() => {
    fetch(`${API_URL}/investors`)
      .then((r) => r.json())
      .then((json) => {
        const names = (json as Array<{ id: number; name: string }>).map((x) => x.name);
        names.sort((a, b) => a.localeCompare(b));
        setInvestorOptions(names);
      })
      .catch(() => setInvestorOptions([]));
  }, []);

  // Fetch commitments with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (assetClass) params.set('asset_class', assetClass);
    if (investorName) params.set('investor_name', investorName);

    const url = `${API_URL}/commitments${params.toString() ? `?${params.toString()}` : ''}`;

    setLoading(true);
    setError(null);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [assetClass, investorName]);

  // Keep URL in sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (assetClass) params.set('asset_class', assetClass);
    if (investorName) params.set('investor_name', investorName);
    navigate(`/commitments${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  }, [assetClass, investorName, navigate]);

  const uniqueAssetClasses = useMemo(() => {
    const set = new Set<string>();
    data.forEach((c) => c.asset_class && set.add(c.asset_class));
    return Array.from(set).sort();
  }, [data]);

  const totalAmount = useMemo(() => data.reduce((sum, c) => sum + (c.amount || 0), 0), [data]);

  const resetFilters = () => {
    setAssetClass('');
    setInvestorName('');
  };

  return (
    <section>
      <h1>Commitments</h1>

      <div className="filterBar">
        <div className="field">
          <label className="label">Investor</label>
          <select
            value={investorName}
            onChange={(e) => setInvestorName(e.target.value)}
            className="select"
          >
            <option value="">All</option>
            {investorOptions.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Asset Class</label>
          <select
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value)}
            className="select"
          >
            <option value="">All</option>
            {uniqueAssetClasses.map((ac) => (
              <option value={ac} key={ac}>
                {ac}
              </option>
            ))}
          </select>
        </div>
        <div className="buttonRight">
          <button onClick={resetFilters} className="button">Reset</button>
        </div>
      </div>

      <div className="stats">
        <span style={{ marginRight: 12 }}>Results: {data.length.toLocaleString()}</span>
        <span>Total Amount: {totalAmount.toLocaleString()}</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'tomato' }}>Error: {error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">Asset Class</th>
              <th className="th tdRight">Amount</th>
              <th className="th">Currency</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="tr">
                <td className="td">{c.id}</td>
                <td className="td">{c.asset_class || '-'}</td>
                <td className="td tdRight">{c.amount.toLocaleString()}</td>
                <td className="td">{c.currency || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Commitments; 