import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServicePopularityChartProps {
  data: Record<string, number>;
}

export function ServicePopularityChart({ data }: ServicePopularityChartProps) {
  const chartData = Object.entries(data)
    .map(([city, count]) => ({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Limit to top 8 cities for better visibility

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis 
          dataKey="city" 
          type="category" 
          tick={{ fontSize: 12 }}
          width={90}
        />
        <Tooltip 
          formatter={(value) => [value, 'Appointments']}
          labelFormatter={(label) => `City: ${label}`}
        />
        <Bar 
          dataKey="count" 
          fill="#2B5C4B"
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 