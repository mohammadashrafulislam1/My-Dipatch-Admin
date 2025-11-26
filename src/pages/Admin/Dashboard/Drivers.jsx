import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { endPoint } from "../../../Components/ForAPIs";

const API = `${endPoint}/user`;

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users (admin only)
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(API, {
        withCredentials: true,
      });

      // Only drivers
      const onlyDrivers = res.data.filter((u) => u.role === "driver");
      setDrivers(onlyDrivers);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Toggle isActive (true <-> false)
  const toggleStatus = async (id, currentState) => {
    const newState = !currentState;

    try {
      await axios.put(
        `${API}/${id}/status`,
        { isActive: newState },
        { withCredentials: true }
      );

      toast.success(`Driver ${newState ? "Activated" : "Deactivated"}`);

      // update UI instantly
      setDrivers((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, isActive: newState } : d
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-lg">Loading drivers...</p>;
  }

  return (
    <div className="md:p-6">
      <Toaster position="top-center" />

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
                <tr key={driver._id}>
                  <td className="border px-4 py-2">
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td className="border px-4 py-2">{driver.phone}</td>
                  <td className="border px-4 py-2">{driver.email}</td>

                  <td className="border px-4 py-2 capitalize">
                    {driver.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleStatus(driver._id, driver.isActive)}
                      className={`px-3 py-1 rounded text-white ${
                        driver.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {driver.isActive ? "Deactivate" : "Activate"}
                    </button>
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
