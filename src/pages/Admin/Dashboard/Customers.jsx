import { useEffect, useState } from "react";

// Simulated customer data
const mockCustomers = Array.from({ length: 47 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  totalSpent: Number((Math.random() * 500 + 20).toFixed(2)), // $20 - $520
}));

const Customers = () => {
  const [customers] = useState(mockCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Summary</h1>

      <div className="overflow-x-auto border rounded-xl shadow bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer, idx) => (
              <tr key={customer.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{startIdx + idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-blue-600 font-semibold">
                  ${customer.totalSpent.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-500">
          Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, customers.length)} of{" "}
          {customers.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-sm border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
