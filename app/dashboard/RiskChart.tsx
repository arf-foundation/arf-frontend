'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryDataPoint } from '../types';

interface TooltipPayload {
  value: number;
  payload: HistoryDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
        <p className="text-sm font-medium text-gray-300">
          {new Date(label!).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">
          Risk: <span className="font-mono font-bold text-blue-400">{payload[0].value.toFixed(3)}</span>
        </p>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(t) => new Date(t).toLocaleTimeString()}
          stroke="#9ca3af"
        />
        <YAxis domain={[0, 1]} stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
