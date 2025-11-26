import React, { useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";

const ITEMS_PER_PAGE = 10;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [rides, setRides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      // Load all users (admin only)
      const usersRes = await axios.get(`${endPoint}/user`, {
        withCredentials: true,
      });

      // Only customers
      const onlyCustomers = usersRes.data.filter(
        (u) => u.role === "customer"
      );

      setCustomers(onlyCustomers);

      // Load all rides
      const ridesRes = await axios.get(`${endPoint}/rides`);
      setRides(ridesRes.data.rides);
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = customers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Calculate total spent for a customer
  const calculateTotalSpent = (customerId) => {
  const completedRides = rides.filter(
    (r) => r.customerId === customerId && r.status === "completed"
  );

  const total = completedRides.reduce(
    (sum, ride) => sum + Number(ride.customerFare || 0),
    0
  );

  return total.toFixed(2);
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Customers</h1>

      <div className="overflow-x-auto border rounded-xl shadow bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((customer, idx) => (
              <tr key={customer._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{startIdx + idx + 1}</td>

                <td className="px-4 py-3">
                  <img
                    src={
                      customer.profileImage ||
                      "https://static.vecteezy.com/system/resources/previews/036/280/650/default-avatar.jpg"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {customer.firstName} {customer.lastName}
                </td>

                <td className="px-4 py-3 text-gray-600">{customer.email}</td>

                <td className="px-4 py-3 text-gray-600">{customer.city}</td>

                {/* ⭐ Show TOTAL SPENT based on completed rides */}
                <td className="px-4 py-3 text-blue-600 font-semibold">
                  ${calculateTotalSpent(customer._id)}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(customer.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-500">
          Showing {startIdx + 1}–
          {Math.min(startIdx + ITEMS_PER_PAGE, customers.length)} of{" "}
          {customers.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded text-sm border bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded text-sm border bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
