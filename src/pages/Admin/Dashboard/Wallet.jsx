import { useState } from "react";

const mockTransactions = [
  {
    id: "1",
    date: "2025-07-01",
    rider: "John Doe",
    driver: "Driver A",
    totalFare: 100,
    driverEarning: 70,
    adminEarning: 30,
  },
  {
    id: "2",
    date: "2025-07-02",
    rider: "Emily Clark",
    driver: "Driver B",
    totalFare: 80,
    driverEarning: 56,
    adminEarning: 24,
  },
  {
    id: "3",
    date: "2025-07-03",
    rider: "Mike Johnson",
    driver: "Driver C",
    totalFare: 150,
    driverEarning: 105,
    adminEarning: 45,
  },
  {
    id: "4",
    date: "2025-07-04",
    rider: "Ava Lee",
    driver: "Driver A",
    totalFare: 60,
    driverEarning: 42,
    adminEarning: 18,
  },
];

const Wallet = () => {
  const [transactions] = useState(mockTransactions);

  const totalFare = transactions.reduce((sum, t) => sum + t.totalFare, 0);
  const totalDriverPayout = transactions.reduce((sum, t) => sum + t.driverEarning, 0);
  const totalAdminEarning = transactions.reduce((sum, t) => sum + t.adminEarning, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Wallet Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border shadow rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Total Fare Collected (Clients)</p>
          <p className="text-2xl font-bold text-blue-600">${totalFare.toFixed(2)}</p>
        </div>
        <div className="bg-white border shadow rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Total Paid to Drivers</p>
          <p className="text-2xl font-bold text-green-600">${totalDriverPayout.toFixed(2)}</p>
        </div>
        <div className="bg-white border shadow rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Admin Earnings (Commission)</p>
          <p className="text-2xl font-bold text-red-600">${totalAdminEarning.toFixed(2)}</p>
        </div>
      </div>

      {/* Ride Transaction Table */}
      <div className="bg-white border shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Ride Transaction Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Total Fare</th>
                <th className="px-4 py-3">Driver Earning</th>
                <th className="px-4 py-3">Admin Cut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.rider}</td>
                  <td className="px-4 py-3">{t.driver}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    ${t.totalFare.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-green-600">
                    ${t.driverEarning.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-red-500 font-semibold">
                    ${t.adminEarning.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
