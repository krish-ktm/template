import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientDemographicsChartProps {
  data: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
}

export function PatientDemographicsChart({ data }: PatientDemographicsChartProps) {
  // Prepare age group data
  const ageGroupData = Object.entries(data.ageGroups).map(([group, count]) => ({
    group,
    count
  }));

  // Prepare gender data
  const genderData = Object.entries(data.genderDistribution).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count
  }));

  // Determine which chart to show based on data availability
  const showAgeChart = ageGroupData.some(item => item.count > 0);
  const showGenderChart = genderData.some(item => item.count > 0);

  if (!showAgeChart && !showGenderChart) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No demographic data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showAgeChart && (
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Age Distribution</h5>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: number | string) => [`${value} patients`, 'Count']} />
                <Bar dataKey="count" name="Patients" fill="#2B5C4B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showGenderChart && (
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Gender Distribution</h5>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genderData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: number | string) => [`${value} patients`, 'Count']} />
                <Bar dataKey="count" name="Patients" fill="#3498DB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 