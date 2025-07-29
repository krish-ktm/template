import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SeasonalTrendsChartProps {
  data: Record<string, number>;
}

export function SeasonalTrendsChart({ data }: SeasonalTrendsChartProps) {
  const chartData = Object.entries(data)
    .map(([month, count]) => ({
      month,
      count
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [value, 'Appointments']} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#2B5C4B" 
          strokeWidth={2}
          dot={{ fill: '#2B5C4B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 