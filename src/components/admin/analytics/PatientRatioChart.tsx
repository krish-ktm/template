import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PatientRatioChartProps {
  data: {
    new: number;
    returning: number;
  };
}

const COLORS = ['#2B5C4B', '#4CAF50'];

export function PatientRatioChart({ data }: PatientRatioChartProps) {
  const chartData = [
    { name: 'New Patients', value: data.new },
    { name: 'Returning Patients', value: data.returning }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 