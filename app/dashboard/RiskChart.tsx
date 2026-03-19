'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { HistoryDataPoint } from '../types';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
        <p className="text-sm font-medium text-gray-900">
          {new Date(label).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">
          Risk: <span className="font-mono font-bold">{payload[0].value?.toFixed(3)}</span>
        </p>
        {data.incident && (
          <p className="text-xs text-gray-500 mt-1">Incident: {data.incident}</p>
        )}
      </div>
    );
  }
  return null;
};

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
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
