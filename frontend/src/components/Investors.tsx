import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface Investor {
  id: number;
  name: string;
  investor_type?: string | null;
  country?: string | null;
  date_added?: string | null;
  last_updated?: string | null;
  total_commitment: number;
}

const Investors: React.FC = () => {
  const [data, setData] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/investors`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'tomato' }}>Error: {error}</p>;

  return (
    <section>
      <h1>Investors</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">Name</th>
            <th className="th">Type</th>
            <th className="th">Country</th>
            <th className="th tdRight">Total Commitment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inv) => (
            <tr
              key={inv.id}
              onClick={() => navigate(`/commitments?investor_name=${encodeURIComponent(inv.name)}`)}
              className="tr rowClickable"
            >
              <td className="td">{inv.id}</td>
              <td className="td">{inv.name}</td>
              <td className="td">{inv.investor_type || '-'}</td>
              <td className="td">{inv.country || '-'}</td>
              <td className="td tdRight">{inv.total_commitment.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Investors; 