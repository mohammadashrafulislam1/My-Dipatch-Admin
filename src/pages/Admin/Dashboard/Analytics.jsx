import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  // Dummy data for charts
  const [rideData, setRideData] = useState([]);
  const [driverStatusData, setDriverStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Simulate API data fetch here
    setRideData([
      { date: "2025-06-28", rides: 120 },
      { date: "2025-06-29", rides: 98 },
      { date: "2025-06-30", rides: 150 },
      { date: "2025-07-01", rides: 170 },
      { date: "2025-07-02", rides: 200 },
      { date: "2025-07-03", rides: 180 },
      { date: "2025-07-04", rides: 220 },
    ]);

    setDriverStatusData([
      { status: "Active", count: 80 },
      { status: "Inactive", count: 20 },
      { status: "Suspended", count: 5 },
    ]);

    setRevenueData([
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 15000 },
      { month: "Mar", revenue: 18000 },
      { month: "Apr", revenue: 13000 },
      { month: "May", revenue: 17000 },
      { month: "Jun", revenue: 21000 },
    ]);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

  return (
    <div className="md:p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Line Chart - Rides Over Last Week */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rides Over Last Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rideData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rides" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Pie Chart - Driver Status */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Driver Status Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={driverStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {driverStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Bar Chart - Monthly Revenue */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Analytics;
