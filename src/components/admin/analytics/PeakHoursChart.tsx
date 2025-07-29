import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  data: Record<string, number>;
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  // Convert data to array format for recharts
  const chartData = Object.entries(data)
    .map(([hour, count]) => ({
      hour: formatHour(hour),
      count,
      rawHour: parseInt(hour)
    }))
    .sort((a, b) => a.rawHour - b.rawHour);

  function formatHour(hour: string): string {
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12 AM';
    if (hourNum === 12) return '12 PM';
    return hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
  }

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No appointment data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value: number | string) => [`${value} appointments`, 'Count']} />
          <Bar dataKey="count" name="Appointments" fill="#2B5C4B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 