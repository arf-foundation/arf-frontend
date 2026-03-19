'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryDataPoint } from '../types';

// Define the shape of the tooltip payload based on recharts structure
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
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
        <p className="text-sm font-medium text-gray-900">
          {new Date(label!).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">
          Risk: <span className="font-mono font-bold">{payload[0].value.toFixed(3)}</span>
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
