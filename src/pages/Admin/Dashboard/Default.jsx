import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { IoChevronDown } from "react-icons/io5";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaClipboardList } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { FaSackDollar } from "react-icons/fa6";
import { GrDeliver } from "react-icons/gr";
import React from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar
} from "recharts";
import { Download } from "lucide-react";
import { useMediaQuery } from "react-responsive";

// Pie chart example data
const COLORS = ["#DF3336", "#F7C604", "#3B82F6"];




export default function Default() {
  const { token } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);
const [customerMap, setCustomerMap] = useState([]);
const [chartOrders, setChartOrders] = useState([]);
const [revenueData, setRevenueData] = useState([]);


const [range, setRange] = useState([
  {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    endDate: new Date(),
    key: "selection",
  },
]);

  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    totalDelivered: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

const year = new Date().getFullYear();
const lastYear = year - 1;

  const isTablet = useMediaQuery({ minWidth: 1024, maxWidth: 1120 });

  // Fetch backend dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch all rides
      const rideRes = await axios.get(`${endPoint}/rides`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // Reset stats INSIDE fetch (not global)
const orderStats = {
  Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0,
};

const revenueStats = {
  thisYear: {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0,
    May: 0, Jun: 0, Jul: 0, Aug: 0,
    Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  },
  lastYear: {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0,
    May: 0, Jun: 0, Jul: 0, Aug: 0,
    Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  }
};

      let rides = rideRes.data?.rides || [];

const start = range[0].startDate;
const end   = range[0].endDate;

// Filter rides by date range
rides = rides.filter((ride) => {
  const d = new Date(ride.createdAt);
  return d >= start && d <= end;
});

// Create dynamic Customer Map
const customerStats = {};

rides.forEach((ride) => {
  const day = format(new Date(ride.createdAt), "EEE"); // Sun, Mon, Tue...
  const customerId = ride.customerId;

  if (!customerStats[day]) {
    customerStats[day] = { new: 0, returning: 0, seen: new Set() };
  }

  if (customerStats[day].seen.has(customerId)) {
    customerStats[day].returning++;
  } else {
    customerStats[day].new++;
    customerStats[day].seen.add(customerId);
  }
  // Convert EEE → fixed format (Tue → Tue, Wed → Wed)
  const normalized = {
    Sun: "Sun",
    Mon: "Mon",
    Tue: "Tue",
    Wed: "Wed",
    Thu: "Thu",
    Fri: "Fri",
    Sat: "Sat",
  }[day];

  if (normalized) {
    orderStats[normalized]++;
  }
  if (ride.status === "completed") {
  const date = new Date(ride.createdAt);
  const month = format(date, "MMM");
  const rideYear = date.getFullYear();
  const adminCut = ride.adminCut ? Number(ride.adminCut) : 0;

  if (rideYear === year) {
    revenueStats.thisYear[month] += adminCut;
  } else if (rideYear === lastYear) {
    revenueStats.lastYear[month] += adminCut;
  }
}

});

const dynamicCustomerMap = Object.keys(customerStats).map((day) => ({
  day,
  new: customerStats[day].new,
  returning: customerStats[day].returning
}));
// Convert object to array for recharts
const dynamicChartOrders = Object.keys(orderStats).map((day) => ({
  day,
  orders: orderStats[day],
}));
// Convert object to array for Recharts
const dynamicRevenue = Object.keys(revenueStats.thisYear).map((month) => ({
  month,
  thisYear: revenueStats.thisYear[month],
  lastYear: revenueStats.lastYear[month],
}));

setRevenueData(dynamicRevenue);

setChartOrders(dynamicChartOrders);
setCustomerMap(dynamicCustomerMap);


      // Fetch users (admin only)
      const userRes = await axios.get(`${endPoint}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      let users = userRes.data || [];
users = users.filter((u) => {
  const d = new Date(u.created_at || u.createdAt);
  return d >= range[0].startDate && d <= range[0].endDate;
});


      // Fetch revenue
      const walletRes = await axios.get(`${endPoint}/admin/wallet/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(walletRes)
      const walletRaw = walletRes.data.dashboard || {};

// Apply date filter to daily revenue entries
const filteredWallet = walletRaw.dailyAdminEarnings
  ? walletRaw.dailyAdminEarnings.filter((w) => {
      const d = new Date(w.date);
      return d >= range[0].startDate && d <= range[0].endDate;
    })
  : [];

// Total Revenue inside date range
const totalAdminEarned = filteredWallet.reduce(
  (sum, w) => sum + Number(w.amount || 0),
  0
);

      const delivered = rides.filter((r) => r.status === "completed").length;

        console.log(walletRaw)
      setDashboard({
        totalOrders: rides.length,
        totalDelivered: delivered,
        totalCustomers: users.filter((u) => u.role === "customer").length,
        totalRevenue: Number(walletRaw.totalAdminEarnings || 0),


      });
    } catch (err) {
      console.log("Dashboard API Error:", err);
    }
  };

  useEffect(() => {
  fetchDashboardData();
}, [range]);


  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const formattedRange = `${format(range[0].startDate, "dd MMM yyyy")} - ${format(
    range[0].endDate,
    "dd MMM yyyy"
  )}`;

  // Stats dynamic
  const statsData = [
    {
      label: "Total Orders",
      value: dashboard.totalOrders,
      icon: <FaClipboardList className="text-[#006FFF]" />,
      trend: 0,
      trendIcon: <FaArrowAltCircleUp />,
      trendColor: "green-500",
      bgGradient: "from-blue-100 to-blue-200",
    },
    {
      label: "Total Delivered",
      value: dashboard.totalDelivered,
      icon: <TbTruckDelivery className="text-[#006FFF]" />,
      trend: 0,
      trendIcon: <FaArrowAltCircleUp />,
      trendColor: "green-500",
      bgGradient: "from-blue-100 to-blue-200",
    },
    {
      label: "Total Customers",
      value: dashboard.totalCustomers,
      icon: <GrDeliver className="text-[#006FFF]" />,
      trend: 0,
      trendIcon: <FaArrowAltCircleUp />,
      trendColor: "green-500",
      bgGradient: "from-blue-100 to-blue-200",
    },
    {
      label: "Total Revenue",
      value: "$" + dashboard.totalRevenue.toFixed(2),
      icon: <FaSackDollar className="text-[#006FFF]" />,
      trend: 0,
      trendIcon: <FaArrowAltCircleUp />,
      trendColor: "green-500",
      bgGradient: "from-blue-100 to-blue-200",
    },
  ];

  const pieData = {
    totalOrder: dashboard.totalOrders || 0,
    customerGrowth: dashboard.totalCustomers || 0,
    totalRevenue: dashboard.totalRevenue || 0,
  };

  const totalPieSum =
  pieData.totalOrder +
  pieData.customerGrowth +
  pieData.totalRevenue;

const pieCharts = [
  {
    name: "Total Orders",
    value: totalPieSum ? (pieData.totalOrder / totalPieSum) * 100 : 0,
    color: COLORS[0],
  },
  {
    name: "Total Customers",
    value: totalPieSum ? (pieData.customerGrowth / totalPieSum) * 100 : 0,
    color: COLORS[1],
  },
  {
    name: "Total Revenue",
    value: totalPieSum ? (pieData.totalRevenue / totalPieSum) * 100 : 0,
    color: COLORS[2],
  },
];


  const downloadReport = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "chart-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Starts
  return (
    <div className="overflow-hidden">

      {/* Date Picker */}
      <div className="pt-2 relative overflow-visible">
        <button
          onClick={toggleCalendar}
          className="flex items-center gap-2 text-gray-700 text-sm font-medium"
        >
          <span>{formattedRange}</span>
          <IoChevronDown className="text-base" />
        </button>

        {showCalendar && (
          <div className="absolute mt-2 z-30 bg-white shadow-lg rounded-md md:p-2">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#006FFF"]}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {statsData.map(
          (
            { label, value, icon, trend, trendIcon, trendColor, bgGradient },
            i
          ) => (
            <div
              key={i}
              className={`stat flex items-center gap-4 p-5 rounded-xl shadow-md bg-gradient-to-br ${bgGradient}`}
            >
              <div className="stat-icon relative rounded-full bg-white w-16 h-16 flex items-center justify-center text-3xl">
                {icon}
              </div>
              <div>
                <div className="stat-value text-2xl font-semibold">{value}</div>
                <div className="stat-label text-gray-700 font-medium">
                  {label}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Charts */}
      <div className="flex lg:flex-nowrap flex-wrap gap-6 mt-6">

        {/* Pie Charts */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col lg:w-[45%] w-full">
          <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
          <div className="flex flex-col md:flex-row justify-around items-center gap-1">
            {pieCharts.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <ResponsiveContainer
                  width={isTablet ? 80 : 100}
                  height={isTablet ? 80 : 100}
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: item.name, value: item.value },
                        { name: "Remaining", value: 100 - item.value },
                      ]}
                      dataKey="value"
                      outerRadius={isTablet ? 40 : 50}
                      innerRadius={isTablet ? 25 : 30}
                      startAngle={90}
                      endAngle={-270}
                      label={({ cx, cy }) => (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-base font-bold"
                          fill="#111827"
                        >
                          {item.value.toFixed(2) + "%"}

                        </text>
                      )}
                      labelLine={false}
                    >
                      <Cell fill={item.color} />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <h4 className="md:text-sm text-xl font-medium mt-2">
                  {item.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-4 w-full lg:w-[55%] relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Chart Order
            </h3>

            <button
              onClick={downloadReport}
              className="flex items-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-1.5 rounded-lg text-sm font-medium"
            >
              <Download size={16} />
              Save Report
            </button>
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={chartOrders}
              margin={{ top: 10, right: 15, left: 15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />

              <CartesianGrid strokeDasharray="0" stroke="transparent" />

              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3B82F6"
                fill="url(#colorOrders)"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="lg:flex gap-6 my-6">

        {/* Revenue Line Chart */}
        <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
           <LineChart data={revenueData}>
  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
  <YAxis tickFormatter={(value) => `$${value}`} />
  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
  <CartesianGrid strokeDasharray="3 3" />
  <Legend />
  <Line
    type="monotone"
    dataKey="thisYear"
    stroke="#3B82F6"
    strokeWidth={2}
    dot
    name={`${year} Revenue`}
  />
  <Line
    type="monotone"
    dataKey="lastYear"
    stroke="#EF4444"
    strokeWidth={2}
    dot
    name={`${lastYear} Revenue`}
  />
</LineChart>


          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Customer Map
            </h3>
            <div className="text-sm bg-gray-100 px-2 py-1 rounded">Weekly</div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerMap}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="new" fill="#FACC15" name="New Customers" />
              <Bar
                dataKey="returning"
                fill="#EF4444"
                name="Returning Customers"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
