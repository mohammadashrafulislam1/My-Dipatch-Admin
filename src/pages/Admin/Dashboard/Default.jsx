import { useState } from "react";
import { DateRange } from "react-date-range";
import { IoChevronDown } from "react-icons/io5";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme style
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaClipboardList } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { FaCircleCheck, FaSackDollar } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { GrDeliver } from "react-icons/gr";
import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar
} from 'recharts';
  import { Download } from 'lucide-react'; 
import ReviewCarousel from "../../../Components/ReviewCarousel";
import { useMediaQuery } from "react-responsive";

const statsData = [
  {
    label: "Total Orders",
    value: 75,
    icon: <FaClipboardList className="text-[#006FFF]" />,
    trend: -5,
    trendIcon: <FaArrowAltCircleDown />,
    trendColor: "red-500",
    bgGradient: "from-blue-100 to-blue-200",
  },
  {
    label: "Total Delivered",
    value: 85,
    icon: <TbTruckDelivery className="text-[#006FFF]" />,
    trend: 8,
    trendIcon: <FaArrowAltCircleUp />,
    trendColor: "green-500",
    bgGradient: "from-blue-100 to-blue-200",
  },
  {
    label: "Total Customers",
    value: 95,
    icon: <GrDeliver className="text-[#006FFF]" />,
    trend: 2,
    trendIcon: <FaArrowAltCircleUp />,
    trendColor: "green-500",
    bgGradient: "from-blue-100 to-blue-200",
  },
  {
    label: "Total Revenue",
    value: "$175",
    icon: <FaSackDollar className="text-[#006FFF]" />,
    trend: 12,
    trendIcon: <FaArrowAltCircleUp />,
    trendColor: "green-500",
    bgGradient: "from-blue-100 to-blue-200",
  },
];

const pieData = {
  totalOrder: 81,
  customerGrowth: 22,
  totalRevenue: 62,
};
const downloadReport = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
const COLORS = ['#DF3336', '#F7C604', '#3B82F6'];
// Sample Customer Map Data
const customerMapData = [
  { day: "Sun", new: 80, returning: 65 },
  { day: "Sun", new: 40, returning: 50 },
  { day: "Sun", new: 70, returning: 60 },
  { day: "Sun", new: 60, returning: 55 },
  { day: "Sun", new: 90, returning: 75 },
  { day: "Sun", new: 50, returning: 45 },
];

// Sample data for Total Revenue
const revenueData = [
  { month: "Jan", "2020": 10000, "2021": 30000 },
  { month: "Feb", "2020": 25000, "2021": 18000 },
  { month: "Mar", "2020": 18000, "2021": 22000 },
  { month: "Apr", "2020": 20000, "2021": 28000 },
  { month: "May", "2020": 30000, "2021": 25000 },
  { month: "Jun", "2020": 38753, "2021": 27000 },
  { month: "Jul", "2020": 29000, "2021": 32000 },
  { month: "Aug", "2020": 32000, "2021": 34000 },
  { month: "Sept", "2020": 28000, "2021": 37000 },
  { month: "Oct", "2020": 26000, "2021": 12657 },
  { month: "Nov", "2020": 23000, "2021": 29000 },
  { month: "Dec", "2020": 31000, "2021": 33000 },
];

const chartData = [
  { day: 'Sun', orders: 100 },
  { day: 'Mon', orders: 150 },
  { day: 'Tues', orders: 456 },
  { day: 'Wed', orders: 120 },
  { day: 'Thu', orders: 110 },
  { day: 'Fri', orders: 180 },
  { day: 'Sat', orders: 240 },
];
const Default = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date("2024-04-17"),
      endDate: new Date("2025-05-21"),
      key: "selection",
    },
  ]);
  const isTablet = useMediaQuery({ minWidth: 1024, maxWidth: 1120 });


  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const formattedRange = `${format(range[0].startDate, "dd MMMM yyyy")} - ${format(
    range[0].endDate,
    "dd MMMM yyyy"
  )}`;
  const pieCharts = [
    { name: 'Total Driver', value: pieData.totalOrder, color: COLORS[0] },
    { name: 'Total Customers', value: pieData.customerGrowth, color: COLORS[1] },
    { name: 'Total Revenue', value: pieData.totalRevenue, color: COLORS[2] },
  ];
  
  return (
   <div className="overflow-hidden">
    {/* Date Range Filter (styled) */}
    <div className="pt-2 relative overflow-visible">
        {/* Header */}
        <button
          onClick={toggleCalendar}
          className="flex items-center gap-2 text-gray-700 text-sm font-medium"
        >
          <span>{formattedRange}</span>
          <IoChevronDown className="text-base" />
        </button>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className="absolute mt-2 z-30 bg-white shadow-lg rounded-md md:p-2">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                console.log("DateRange onChange", item);
                setRange([item.selection]);
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#006FFF"]}
            />
          </div>
        )}
      </div>


    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {statsData.map(({ label, value, icon, trend, trendIcon, trendColor, bgGradient }, i) => (
        <div
          key={i}
          className={`stat flex items-center gap-4 p-5 rounded-xl shadow-md bg-gradient-to-br ${bgGradient} hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
          title={`Change: ${trend > 0 ? "+" : ""}${trend}% from last period`}
        >
          <div className="stat-icon relative rounded-full bg-white w-16 h-16 flex items-center justify-center text-3xl">
            {icon}
            <span
              className={`absolute top-1 right-1 rounded-full text-white p-[2px] text-xs bg-${trendColor} flex items-center justify-center w-6 h-6`}
              aria-label={`${trend > 0 ? "increase" : "decrease"}`}
            >
              {trendIcon}
              <span className="sr-only">{trend > 0 ? "Increase" : "Decrease"}</span>
            </span>
          </div>
          <div>
            <div className="stat-value text-2xl font-semibold">{value}</div>
            <div className="stat-label text-gray-700 font-medium">{label}</div>
            <div
              className={`text-sm mt-1 font-light text-${trendColor}`}
            >{`${trend > 0 ? "+" : ""}${trend}% vs last week`}</div>
          </div>
        </div>
      ))}
    </div>

{/* charts */}
<div className="flex lg:flex-nowrap flex-wrap gap-6 mt-6">

  {/* Left: Pie Charts Grouped Together */}
  <div className="bg-white rounded-xl shadow p-4 flex flex-col lg:w-[45%] w-full">
      <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
      <div className="flex flex-col md:flex-row justify-around items-center gap-1">
        {pieCharts.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <ResponsiveContainer width={isTablet ? 80 : 100} height={isTablet ? 80 : 100}>
              <PieChart>
                <Pie
                  data={[
                    { name: item.name, value: item.value },
                    { name: 'Remaining', value: 100 - item.value },
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
                      {item.value}%
                    </text>
                  )}
                  labelLine={false}
                >
                  <Cell fill={item.color} />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <h4 className="md:text-sm text-xl font-medium mt-2">{item.name}</h4>
          </div>
        ))}
      </div>
    </div>

  {/* Right: Line Chart */}
  <div className="bg-white rounded-xl shadow p-4 w-full lg:w-[55%] relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Chart Order</h3>
        </div>

        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-1.5 rounded-lg text-sm font-medium"
        >
          <Download size={16} />
          Save Report
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={150}>
  <AreaChart
    data={chartData}
    margin={{ top: 10, right: 15, left: 15, bottom: 0 }}
  >
    <defs>
      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
      </linearGradient>
    </defs>

    {/* Hide all axis lines and ticks */}
    <XAxis
      dataKey="day"
      axisLine={false}
      tickLine={false}
      padding={{ left: 10, right: 10 }}
      tick={{ fill: "#6B7280", fontSize: 12 }} // Optional styling for ticks
    />
    {/* No YAxis at all */}

    {/* Remove background grid lines */}
    <CartesianGrid strokeDasharray="0" stroke="transparent" />

    <Tooltip  className="rounded-xl"/>
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

{/* Total review & Customer Map */}
   <div className="lg:flex gap-6 my-6">
    {/* Total Revenue Line Chart */}
<div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/2">
  <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
      <Tooltip />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="2020" stroke="#3B82F6" strokeWidth={2} dot />
      <Line type="monotone" dataKey="2021" stroke="#EF4444" strokeWidth={2} dot />
    </LineChart>
  </ResponsiveContainer>
</div>
{/* Customer Map Bar Chart */}
<div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/2">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">Customer Map</h3>
    <div className="text-sm bg-gray-100 px-2 py-1 rounded">Weekly</div>
  </div>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={customerMapData}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="new" fill="#FACC15" name="New Customers" className="md:mt-0 mt-8" />
      <Bar dataKey="returning" fill="#EF4444" name="Returning Customers" />
    </BarChart>
  </ResponsiveContainer>
</div>

</div>



   </div>
  );
};

export default Default;
