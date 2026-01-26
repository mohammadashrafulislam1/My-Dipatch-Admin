import { useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${endPoint}/payment/status/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.payments || []);
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Ride ID</th>
              <th className="border px-2 py-1">Customer ID</th>
              <th className="border px-2 py-1">Driver ID</th>
              <th className="border px-2 py-1">Amount (CAD)</th>
              <th className="border px-2 py-1">Driver Paid</th>
              <th className="border px-2 py-1">Payment Status</th>
              <th className="border px-2 py-1">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="border px-2 py-1">{tx.rideId}</td>
                <td className="border px-2 py-1">{tx.customerId}</td>
                <td className="border px-2 py-1">{tx.driverId || "-"}</td>
                <td className="border px-2 py-1">{tx.totalAmount}</td>
                <td className="border px-2 py-1">{tx.driverPaid ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">{tx.paymentStatus}</td>
                <td className="border px-2 py-1">
                  <a
                    href={tx.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Receipt
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
