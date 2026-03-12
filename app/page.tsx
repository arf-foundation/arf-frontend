'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_risk`, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRisk(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading risk data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ARF Dashboard</h1>
      <pre>{JSON.stringify(risk, null, 2)}</pre>
    </div>
  );
}