import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PatientDemographicsChartProps {
  data: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
}

export function PatientDemographicsChart({ data }: PatientDemographicsChartProps) {
  const chartData = Object.entries(data.ageGroups).map(([group, count]) => ({
    group,
    total: count,
    male: (data.genderDistribution.male / Object.values(data.genderDistribution).reduce((a, b) => a + b, 0)) * count,
    female: (data.genderDistribution.female / Object.values(data.genderDistribution).reduce((a, b) => a + b, 0)) * count,
    other: (data.genderDistribution.other / Object.values(data.genderDistribution).reduce((a, b) => a + b, 0)) * count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip formatter={(value: number) => [Math.round(value), 'Patients']} />
        <Legend />
        <Bar dataKey="male" stackId="gender" fill="#2B5C4B" name="Male" />
        <Bar dataKey="female" stackId="gender" fill="#4CAF50" name="Female" />
        <Bar dataKey="other" stackId="gender" fill="#FF5252" name="Other" />
      </BarChart>
    </ResponsiveContainer>
  );
} 