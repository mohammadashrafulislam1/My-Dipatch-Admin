import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

export default function Wallet() {
  const { token } = useAuth();

  const [summary, setSummary] = useState({
    totalFareCollected: 0,
    totalPaidToDrivers: 0,
    totalAdminEarnings: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${endPoint}/admin/wallet/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setSummary(res.data.dashboard);
      setTransactions(res.data.transactions);

    } catch (error) {
      console.error("Wallet fetch error:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold mb-6">Admin Wallet Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border shadow rounded-lg p-5">
              <p className="text-sm text-gray-500 mb-1">Total Fare Collected (Clients)</p>
              <p className="text-2xl font-bold text-blue-600">
                ${summary.totalFareCollected.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border shadow rounded-lg p-5">
              <p className="text-sm text-gray-500 mb-1">Total Paid to Drivers</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.totalPaidToDrivers.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border shadow rounded-lg p-5">
              <p className="text-sm text-gray-500 mb-1">Admin Earnings (Commission)</p>
              <p className="text-2xl font-bold text-red-600">
                ${summary.totalAdminEarnings.toFixed(2)}
              </p>
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
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Driver</th>
                    <th className="px-4 py-3">Total Fare</th>
                    <th className="px-4 py-3">Driver Earning</th>
                    <th className="px-4 py-3">Admin Cut</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{t.customer}</td>
                      <td className="px-4 py-3">{t.driver}</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        ${t.totalFare.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-green-600">
                        ${t.driverEarning.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-red-500 font-semibold">
                        ${t.adminCut.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
