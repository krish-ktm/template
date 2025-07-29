import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServicePopularityChartProps {
  data: Record<string, number>;
}

export function ServicePopularityChart({ data }: ServicePopularityChartProps) {
  // Convert data to array format for recharts and sort by count
  const chartData = Object.entries(data)
    .map(([service, count]) => ({
      service,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Limit to top 10 services

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No service data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="service" 
            type="category" 
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip formatter={(value: number | string) => [`${value} appointments`, 'Count']} />
          <Bar dataKey="count" name="Appointments" fill="#2B5C4B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 