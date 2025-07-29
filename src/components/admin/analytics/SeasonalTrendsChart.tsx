import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SeasonalTrendsChartProps {
  data: Record<string, number>;
}

export function SeasonalTrendsChart({ data }: SeasonalTrendsChartProps) {
  // Month order for proper sorting
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Convert data to array format for recharts and sort by month
  const chartData = Object.entries(data)
    .map(([month, count]) => ({
      month,
      count
    }))
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  if (chartData.length === 0 || chartData.every(item => item.count === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No seasonal data available</p>
      </div>
    );
  }

  // Calculate quarterly averages
  const quarters = [
    { name: 'Q1 (Jan-Mar)', months: ['Jan', 'Feb', 'Mar'] },
    { name: 'Q2 (Apr-Jun)', months: ['Apr', 'May', 'Jun'] },
    { name: 'Q3 (Jul-Sep)', months: ['Jul', 'Aug', 'Sep'] },
    { name: 'Q4 (Oct-Dec)', months: ['Oct', 'Nov', 'Dec'] }
  ];

  const quarterlyData = quarters.map(quarter => {
    const monthsData = chartData.filter(item => quarter.months.includes(item.month));
    const total = monthsData.reduce((sum, item) => sum + item.count, 0);
    const average = monthsData.length > 0 ? total / monthsData.length : 0;
    
    return {
      quarter: quarter.name,
      average: Math.round(average * 10) / 10 // Round to 1 decimal place
    };
  });

  return (
    <div className="space-y-6">
      {/* Monthly Trends */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-2">Monthly Appointment Distribution</h5>
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
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: number | string) => [`${value} appointments`, 'Count']} />
              <Bar dataKey="count" name="Appointments" fill="#2B5C4B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarterly Trends */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-2">Quarterly Average</h5>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={quarterlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: number | string) => [`${value} appointments (avg)`, 'Average']} />
              <Bar dataKey="average" name="Average Appointments" fill="#3498DB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 