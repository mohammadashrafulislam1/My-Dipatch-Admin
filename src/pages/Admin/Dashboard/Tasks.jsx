import { useState } from "react";

const mockTasks = [
  {
    id: "1",
    customer: "John Doe",
    pickup: "123 Main St",
    dropoff: "456 Market St",
    date: "2025-07-05",
    price: 25,
    status: "Pending",
  },
  {
    id: "2",
    customer: "Jane Smith",
    pickup: "789 Elm St",
    dropoff: "321 Pine St",
    date: "2025-07-04",
    price: 32,
    status: "Pending",
  },
  {
    id: "3",
    customer: "Mike Johnson",
    pickup: "22 Sunset Blvd",
    dropoff: "91 Central Ave",
    date: "2025-07-01",
    price: 40,
    status: "Completed",
  },
  {
    id: "4",
    customer: "Emily Clark",
    pickup: "11 River Rd",
    dropoff: "88 Forest Ln",
    date: "2025-07-02",
    price: 18,
    status: "Completed",
  },
];

const drivers = ["Driver A", "Driver B", "Driver C"];

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleAssign = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const confirmAssign = () => {
    console.log("Assigning", selectedTask, "to", selectedDriver);
    setOpen(false);
    setSelectedDriver("");
  };

  const pendingTasks = mockTasks.filter((task) => task.status === "Pending");
  const completedTasks = mockTasks.filter((task) => task.status === "Completed");

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
            <tr key={task.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{task.customer}</td>
              <td className="px-4 py-3">{task.pickup}</td>
              <td className="px-4 py-3">{task.dropoff}</td>
              <td className="px-4 py-3">{task.date}</td>
              <td className="px-4 py-3">${task.price.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    task.status === "Pending"
                      ? "text-yellow-800 bg-yellow-100"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative">
            <h2 className="text-lg font-bold mb-4">Assign Task</h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Driver
            </label>
            <select
              className="w-full border px-3 py-2 rounded text-sm mb-4 focus:outline-none focus:ring focus:border-blue-500"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Choose a driver</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={!selectedDriver}
                className={`px-4 py-2 text-sm text-white rounded ${
                  selectedDriver
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
