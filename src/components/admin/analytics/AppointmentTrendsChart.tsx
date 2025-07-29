import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface AppointmentTrendsChartProps {
  data: Record<string, number>;
}

export function AppointmentTrendsChart({ data }: AppointmentTrendsChartProps) {
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
          formatter={(value) => [value, 'Appointments']}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#2B5C4B" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 