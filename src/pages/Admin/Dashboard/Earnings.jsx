import { useState, useEffect } from "react";

const Earnings = () => {
  // Dummy earnings data (each row = one ride/payment)
  const dummyEarnings = [
    {
      id: 1,
      driver: "Alice Johnson",
      date: "2025-07-04",
      amount: 45.5,
      status: "Pending",
    },
    {
      id: 2,
      driver: "Bob Smith",
      date: "2025-07-03",
      amount: 30.0,
      status: "Paid",
    },
    {
      id: 3,
      driver: "Charlie Lee",
      date: "2025-07-02",
      amount: 50.75,
      status: "Pending",
    },
    {
      id: 4,
      driver: "Diana Adams",
      date: "2025-07-01",
      amount: 25.0,
      status: "Paid",
    },
    {
      id: 5,
      driver: "Alice Johnson",
      date: "2025-06-30",
      amount: 60.0,
      status: "Paid",
    },
    // add more as needed
  ];

  const [earnings, setEarnings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    // load dummy data (replace with API call)
    setEarnings(dummyEarnings);
  }, []);

  // Apply filters + search
  useEffect(() => {
    let data = [...earnings];

    // Search by driver name
    if (searchTerm.trim()) {
      data = data.filter((e) =>
        e.driver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "All") {
      data = data.filter((e) => e.status === filterStatus);
    }

    // Filter by date range
    if (filterDateFrom) {
      data = data.filter((e) => new Date(e.date) >= new Date(filterDateFrom));
    }
    if (filterDateTo) {
      data = data.filter((e) => new Date(e.date) <= new Date(filterDateTo));
    }

    setFilteredEarnings(data);
    setCurrentPage(1); // reset to first page on filter change
  }, [earnings, searchTerm, filterStatus, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);
  const pagedData = filteredEarnings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle payment status between Paid and Pending
  const toggleStatus = (id) => {
    setEarnings((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "Paid" ? "Pending" : "Paid" }
          : e
      )
    );
  };

  // Calculate total earnings shown in current filtered data
  const totalEarnings = filteredEarnings.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <div className="md:p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Earnings Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by driver name..."
          className="border rounded px-3 py-2 flex-grow min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <label>
          From:{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
          />
        </label>

        <label>
          To:{" "}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
          />
        </label>
      </div>

      {/* Total earnings summary */}
      <div className="bg-gray-100 p-4 rounded shadow text-right font-semibold">
        Total Earnings:{" "}
        <span className="text-green-600">${totalEarnings.toFixed(2)}</span>
      </div>

      {/* Earnings Table */}
      <div className="overflow-x-auto border rounded shadow bg-white">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Driver</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Amount ($)</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 font-semibold"
                >
                  No earnings found.
                </td>
              </tr>
            ) : (
              pagedData.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {earning.driver}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {earning.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {earning.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-white text-sm ${
                        earning.status === "Paid"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {earning.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => toggleStatus(earning.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      title="Toggle Paid/Pending"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Earnings;
