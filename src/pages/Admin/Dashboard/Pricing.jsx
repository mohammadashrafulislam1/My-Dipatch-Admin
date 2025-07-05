import { useState } from "react";

const Pricing = () => {
  const [pricePerKm, setPricePerKm] = useState(1.5); // base price
  const [newPrice, setNewPrice] = useState(pricePerKm);
  const [editingPrice, setEditingPrice] = useState(false);

  const [commissionRate, setCommissionRate] = useState(20); // % commission
  const [editingCommission, setEditingCommission] = useState(false);

  const handlePriceSave = () => {
    setPricePerKm(newPrice);
    setEditingPrice(false);
    console.log("Updated price per km:", newPrice);
  };

  const handleCommissionSave = () => {
    setEditingCommission(false);
    console.log("Updated commission rate:", commissionRate + "%");
  };

  // Admin earns this per $1 the customer pays
  const commissionPerDollar = (commissionRate / 100).toFixed(2);

  return (
    <div className="md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pricing Settings</h1>

      {/* Price Per KM Section */}
      <div className="bg-white shadow rounded-lg p-6 border mb-6">
        <h2 className="text-lg font-semibold mb-4">Price per Kilometer</h2>

        {!editingPrice ? (
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-blue-600">${pricePerKm.toFixed(2)} / km</p>
            <button
              onClick={() => setEditingPrice(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              className="border px-4 py-2 rounded text-sm focus:ring focus:outline-none w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingPrice(false)}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePriceSave}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Commission Section */}
      <div className="bg-white shadow rounded-lg p-6 border mb-6">
        <h2 className="text-lg font-semibold mb-4">Admin Commission</h2>

        {!editingCommission ? (
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-green-600">{commissionRate}%</p>
            <button
              onClick={() => setEditingCommission(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="number"
              step="1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
              className="border px-4 py-2 rounded text-sm focus:ring focus:outline-none w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCommission(false)}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCommissionSave}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Commission per $1 info */}
      <div className="bg-white border shadow rounded-lg p-5">
        <h2 className="text-md font-medium text-gray-700 mb-2">Commission per Dollar</h2>
        <p className="text-lg text-gray-800">
          Admin earns <span className="font-semibold text-red-600">${commissionPerDollar}</span>{" "}
          for every $1 spent by a customer.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
