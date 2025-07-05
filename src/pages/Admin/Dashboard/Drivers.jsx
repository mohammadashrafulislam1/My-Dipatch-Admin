import { useState, useEffect } from "react";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Replace with real API call
    const dummyDrivers = [
      {
        id: 1,
        name: "Alice Johnson",
        phone: "+1 234 567 890",
        email: "alice@example.com",
        status: "Active",
        joinedAt: "2023-12-01",
      },
      {
        id: 2,
        name: "Bob Smith",
        phone: "+1 987 654 321",
        email: "bob@example.com",
        status: "Inactive",
        joinedAt: "2024-01-15",
      },
    ];
    setDrivers(dummyDrivers);
  }, []);

  // Example: toggle driver status
  const toggleStatus = (id) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === "Active" ? "Inactive" : "Active",
            }
          : driver
      )
    );
  };

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Drivers List</h1>
      {drivers.length === 0 ? (
        <p>No drivers found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow bg-white">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Joined At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="border px-4 py-2">{driver.name}</td>
                  <td className="border px-4 py-2">{driver.phone}</td>
                  <td className="border px-4 py-2">{driver.email}</td>
                  <td className="border px-4 py-2">{driver.status}</td>
                  <td className="border px-4 py-2">{driver.joinedAt}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleStatus(driver.id)}
                      className={`px-3 py-1 rounded text-white ${
                        driver.status === "Active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {driver.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    {/* You can add more buttons like View, Remove etc */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Drivers;
