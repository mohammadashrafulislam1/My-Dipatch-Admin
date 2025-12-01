import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../Components/useAuth"; 
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
} from "recharts";
import { endPoint } from "../../../Components/ForAPIs";

const Analytics = () => {
  const { token } = useAuth(); 

  const [rideData, setRideData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      // 🚗 GET RIDES with token
      const rideRes = await axios.get(`${endPoint}/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rides = rideRes.data?.rides || [];

      // 1️⃣ Rides Over Last 7 Days
      const last7 = [];
      for (let i = 6; i >= 0; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const dateKey = d.toISOString().split("T")[0];
        const ridesToday = rides.filter(
          (r) => r.createdAt?.split("T")[0] === dateKey
        ).length;

        last7.push({ date: dateKey, rides: ridesToday });
      }
      setRideData(last7);

      // 2️⃣ Monthly Revenue
      const months = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
      };

      rides.forEach((ride) => {
        if (ride.status === "completed") {
          const date = new Date(ride.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          const adminCut = Number(ride.adminCut || 0);

          months[month] += adminCut;
        }
      });

      const revenueArr = Object.keys(months).map((m) => ({
        month: m,
        revenue: months[m],
      }));

      setRevenueData(revenueArr);

    } catch (error) {
      console.error("Analytics Fetch Error:", error);
    }
  };

  return (
    <div className="md:p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Rides Over Last Week */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rides Over Last Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rideData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rides" stroke="#006FFF" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Monthly Revenue */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="revenue" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Analytics;
