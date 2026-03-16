// app/dashboard/RiskChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryDataPoint } from '../types';

export default function RiskChart({ data }: { data: HistoryDataPoint[] }) {
  if (!data.length) {
    return <div className="text-gray-500 text-center py-8">No risk history available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={(t) => new Date(t).toLocaleTimeString()} 
        />
        <YAxis domain={[0, 1]} />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value: number | undefined) => (value?.toFixed(3) ?? 'N/A')}
        />
        <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
