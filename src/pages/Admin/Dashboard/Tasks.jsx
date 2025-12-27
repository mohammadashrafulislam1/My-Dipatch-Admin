import { useState, useEffect } from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";

const Tasks = () => {
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");

  // Fetch rides
useEffect(() => {
  const fetchRidesAndCustomers = async () => {
    const { data } = await axios.get(`${endPoint}/rides`);
    const ridesWithCustomers = await Promise.all(
      data.rides.map(async (ride) => {
        const customer = await fetchUserById(ride?.customerId?.$oid || ride?.customerId);
        return {
          ...ride,
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
        };
      })
    );
    setRides(ridesWithCustomers);
  };

  fetchRidesAndCustomers();

  const fetchDrivers = async () => {
  try {
    const { data } = await axios.get(`${endPoint}/user`);
    // Filter only drivers
    const driversOnly = data.filter(user => user.role === "driver");
    console.log(driversOnly);
    setDrivers(driversOnly);
  } catch (err) {
    console.error("Failed to fetch drivers:", err);
  }
};


  fetchDrivers();
}, []);


  const handleAssign = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };
const fetchUserById = async (id) => {
  try {
    const { data } = await axios.get(`${endPoint}/user/${id}`);
    return data; // Assuming it returns the user object { _id, name, email, ... }
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
};

  const confirmAssign = async () => {
    try {
      await axios.put(`${endPoint}/rides/${selectedTask._id}/assign`, {
        driverId: selectedDriver,
      });
      // Update the ride locally to reflect the new status
      setRides((prev) =>
        prev.map((r) =>
          r._id === selectedTask._id
            ? { ...r, status: "Assigned", driver: selectedDriver }
            : r
        )
      );
      setOpen(false);
      setSelectedDriver("");
    } catch (err) {
      console.error("Failed to assign driver:", err);
    }
  };

  const pendingTasks = rides.filter(
  (task) => task.status?.trim().toLowerCase() === "pending"
);

  console.log(pendingTasks)
  const completedTasks = rides.filter((task) => task.status?.trim().toLowerCase() === "completed");

  const renderTaskTable = (tasks, isPending = false) => (
    <div className="overflow-x-auto border rounded-xl shadow bg-white mb-8">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Pickup</th>
            <th className="px-4 py-3">Dropoff</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            {isPending && <th className="px-4 py-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{task?.customerName}</td>
              <td className="px-4 py-3">{task.pickup?.address || "N/A"}</td>
              <td className="px-4 py-3">{task.dropoff?.address|| "N/A"}</td>
              <td className="px-4 py-3">
  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}
</td>

              <td className="px-4 py-3">${task.price.toFixed(2)}</td>
              <td className="px-4 py-3">
              <span
  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
    task.status?.trim().toLowerCase() === "pending"
      ? "text-yellow-700 bg-yellow-50"
      : "text-green-800 bg-green-100"
  }`}
>
  {task.status}
</span>

              </td>
              {isPending && (
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleAssign(task)}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
                  >
                    Assign
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-6">Task Management</h1>

      <h2 className="text-lg font-semibold mb-2">Pending Tasks</h2>
      {renderTaskTable(pendingTasks, true)}

      <h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
      {renderTaskTable(completedTasks)}

      {/* Modal */}
    {open && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-md p-6 relative transform transition-transform duration-300 scale-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Assign Task
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-700 transition text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Select Driver */}
      <div className="relative w-full mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Driver
        </label>

        {/* DaisyUI Dropdown */}
        <div className="dropdown w-full">
          <label
            tabIndex={0}
            className="btn w-full justify-between bg-white border rounded-lg text-left hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
          >
            {selectedDriver
              ? `${drivers.find(d => d._id === selectedDriver)?.firstName} ${drivers.find(d => d._id === selectedDriver)?.lastName}`
              : "Choose a driver"}
            <span className="ml-2">&#x25BC;</span>
          </label>
          <ul
  tabIndex={0}
  className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl w-full max-h-60 overflow-auto animate-slideDown"
>
  {drivers.map(driver => (
    <li
      key={driver._id}
      onClick={() => setSelectedDriver(driver._id)}
      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-blue-100 rounded-lg transition"
    >
      {/* Profile Image on Left */}
      <img
        src={driver.profileImage || "/default-avatar.png"}
        alt={driver.firstName}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
      />
      
      {/* Name on Right */}
      <span className="font-medium text-gray-700">{driver.firstName} {driver.lastName}</span>
    </li>
  ))}
</ul>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={confirmAssign}
          disabled={!selectedDriver}
          className={`px-4 py-2 text-sm text-white rounded-lg transition-all shadow-sm ${
            selectedDriver
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Tasks;
