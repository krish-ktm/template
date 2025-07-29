import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface AppointmentTrendsChartProps {
  data: Record<string, number>;
}

export function AppointmentTrendsChart({ data }: AppointmentTrendsChartProps) {
  // Convert data to array format for recharts
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const formatXAxis = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

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
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            minTickGap={15}
          />
          <YAxis allowDecimals={false} />
          <Tooltip 
            labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
            formatter={(value: number | string) => [`${value} appointments`, 'Count']}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2B5C4B"
            activeDot={{ r: 8 }}
            name="Appointments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 