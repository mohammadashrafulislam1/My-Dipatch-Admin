import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

export default function Pricing() {
  const [pricePerKm, setPricePerKm] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [editingPrice, setEditingPrice] = useState(false);

  const [commissionRate, setCommissionRate] = useState(0);
  const [editingCommission, setEditingCommission] = useState(false);
  const {user, token} = useAuth()
  const [loading, setLoading] = useState(true);

  // Fetch pricing from backend
  const fetchPricing = async () => {
    try {
      const res = await axios.get(`${endPoint}/admin/pricing`, { withCredentials: true }, {
  headers: { Authorization: `Bearer ${token}` }
});

      setPricePerKm(res.data.pricePerKm);
      setNewPrice(res.data.pricePerKm);

      setCommissionRate(res.data.adminCommission);
    } catch (error) {
      console.log("Failed to load pricing:", error);
      toast.error("Failed to load pricing settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Save price per km
  const handlePriceSave = async () => {
    try {
      const res = await axios.put(
        `${endPoint}/admin/pricing`, 
        {
          pricePerKm: newPrice,
          adminCommission: commissionRate,
        },
        { withCredentials: true }, {
  headers: { Authorization: `Bearer ${token}` }
}
      );

      setPricePerKm(res.data.pricePerKm);
      setEditingPrice(false);

      toast.success("Price per KM updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update price");
    }
  };

  // Save commission rate
  const handleCommissionSave = async () => {
    try {
      const res = await axios.put(
        `${endPoint}/admin/pricing`,
        {
          pricePerKm,
          adminCommission: commissionRate,
        },
        { withCredentials: true }, {
  headers: { Authorization: `Bearer ${token}` }
}
      );

      toast.success("Commission updated");
      setEditingCommission(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update commission");
    }
  };

  const commissionPerDollar = (commissionRate / 100).toFixed(2);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        Loading pricing settings...
      </div>
    );

  return (
  <div className="md:p-10 px-4 py-10 max-w-3xl mx-auto">

    <Toaster position="top-center" />

    {/* Page Title */}
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        🚖 Pricing & Commission Settings
      </h1>
      <p className="text-gray-500 mt-2">
        Manage how ride pricing and admin commissions work in your platform.
      </p>
    </div>

    {/* Card Wrapper */}
    <div className="space-y-8">

      {/* PRICE PER KM CARD */}
      <div className="bg-white/60 backdrop-blur-md border shadow-xl rounded-xl p-7 transition-all hover:shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            💵 Price per Kilometer
          </h2>
        </div>

        {!editingPrice ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-600">
                ${pricePerKm.toFixed(2)}
                <span className="text-lg font-normal text-gray-500"> / km</span>
              </p>

              <button
                onClick={() => setEditingPrice(true)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fadeIn flex flex-col gap-4">
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              className="border px-4 py-3 rounded-lg text-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingPrice(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handlePriceSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COMMISSION RATE CARD */}
      <div className="bg-white/60 backdrop-blur-md border shadow-xl rounded-xl p-7 transition-all hover:shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            🏦 Admin Commission
          </h2>
        </div>

        {!editingCommission ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-600">
                {commissionRate}%
              </p>

              <button
                onClick={() => setEditingCommission(true)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fadeIn flex flex-col gap-4">
            <input
              type="number"
              step="1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
              className="border px-4 py-3 rounded-lg text-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingCommission(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCommissionSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CALCULATED COMMISSION CARD */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl shadow-xl p-7 hover:shadow-2xl transition-all">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          💰 Commission per $1
        </h2>
        <p className="text-lg leading-relaxed">
          Admin earns
          <span className="font-bold text-yellow-300"> ${commissionPerDollar} </span>
          for every $1 paid by the customer.
        </p>
      </div>
    </div>
  </div>
);

}
