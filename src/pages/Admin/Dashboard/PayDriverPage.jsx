import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint } from "../../../Components/ForAPIs";
import BankInfoModalExample from "../../../Components/BankInfoModalExample";

export default function PayDriverPage() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState({}); // driver names
  const [driverBanks, setDriverBanks] = useState({}); // driver bank info
  const [showBankFor, setShowBankFor] = useState({}); // track which rows should show bank info
 console.log(pendingPayments)
  useEffect(() => {
    fetchPendingPayments();
  }, []);
console.log(pendingPayments)
  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(`${endPoint}/admin/wallet/withdrawal-requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const payments = res.data.requests || [];
      setPendingPayments(payments);

      const driverIds = payments.filter(p => p.driverId).map(p => p.driverId);
      fetchDriverNames(driverIds);
      fetchDriverBankInfo(driverIds);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverNames = async (driverIds) => {
    try {
      const uniqueIds = [...new Set(driverIds)];
      const names = {};
      for (let id of uniqueIds) {
        const res = await axios.get(`${endPoint}/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const user = res.data; 
        if (user) names[id.toString()] = `${user.firstName} ${user.lastName}`;
      }
      setDrivers(names);
    } catch (err) {
      console.error("Error fetching driver names:", err);
    }
  };

  const fetchDriverBankInfo = async (driverIds) => {
    try {
      const uniqueIds = [...new Set(driverIds)];
      const banks = {};
      for (let id of uniqueIds) {
        const res = await axios.get(`${endPoint}/payment/square-payout/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const bank = res.data?.cards?.[0];
        if (bank) banks[id.toString()] = bank;
      }
      setDriverBanks(banks);
    } catch (err) {
      console.error("Error fetching driver bank info:", err);
    }
  };

  const toggleBankInfo = (driverId) => {
    setShowBankFor((prev) => ({
      ...prev,
      [driverId]: !prev[driverId],
    }));
  };

  const confirmPayToast = (rideId, driverId) => {
    const driverName = drivers[driverId?.toString()] || "Driver";
    toast.info(
      <div>
        <p>Do you want to mark {driverName} as paid for this ride?</p>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss();
              payDriver(rideId, driverId);
            }}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            Mark as Paid
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        position: "top-center",
        transition: Slide,
      }
    );
  };

  const payDriver = async (rideId, driverId) => {
    if (!driverId) {
      toast.warn("Driver not assigned for this ride.");
      return;
    }
    try {
      const res = await axios.post(
        `${endPoint}/payment/driver-paid`,
        { rideId, driverId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(`Marked as paid for $${Number(res.data.amount).toFixed(2)}`);
      fetchPendingPayments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark driver as paid");
    }
  };

  return (
   <div className="p-6 bg-gray-50 min-h-screen">
  <ToastContainer />
  <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Pay Drivers</h1>

  {loading ? (
    <div className="flex justify-center items-center py-10">
      <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
    </div>
  ) : pendingPayments.length === 0 ? (
    <div className="flex flex-col justify-center items-center py-16">
      <svg
        className="w-20 h-20 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 12h.01M12 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <p className="text-gray-500 text-lg font-semibold">No pending payments!</p>
      <p className="text-gray-400 mt-2">You're all caught up 🎉</p>
    </div>
  ) : (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <table className="w-full text-left table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Driver Name</th>
            <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
            <th className="px-4 py-3 font-medium text-gray-600">Bank Info</th>
            <th className="px-4 py-3 font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.map((p) => {
            const driverIdStr = p.driverId?.toString();
            const bank = driverBanks[driverIdStr];
            return (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 font-medium text-gray-700">
                  {driverIdStr ? drivers[driverIdStr] || driverIdStr : "Not assigned"}
                </td>
                <td className="px-4 py-3 text-gray-700">${Number(p.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {bank ? <BankInfoModalExample bank={bank} /> : "No bank info"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => confirmPayToast(p.rideId, p.driverId)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                  >
                    Mark Paid
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}
