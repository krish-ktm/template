import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  data: Record<string, number>;
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const chartData = Object.entries(data)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }))
    .sort((a, b) => a.hour - b.hour)
    .map(({ hour, count }) => ({
      hour: hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : hour === 0 ? '12 AM' : `${hour} AM`,
      count
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip formatter={(value) => [value, 'Appointments']} />
        <Bar dataKey="count" fill="#2B5C4B" />
      </BarChart>
    </ResponsiveContainer>
  );
} 