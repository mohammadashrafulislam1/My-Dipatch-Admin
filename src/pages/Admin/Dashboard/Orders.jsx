import React, { useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";

const ITEMS_PER_PAGE = 20;

// STATUS → COLOR MAP
const statusColors = {
  pending: "bg-yellow-500 text-white",
  accepted: "bg-blue-500 text-white",
  on_the_way: "bg-indigo-500 text-white",
  in_progress: "bg-purple-500 text-white",
  at_stop: "bg-orange-500 text-white",
  completed: "bg-green-600 text-white",
  cancelled: "bg-red-600 text-white",
};

export default function Orders() {
  const [rides, setRides] = useState([]);
  const [customers, setCustomers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all rides
  const fetchRides = async () => {
    try {
      const res = await axios.get(`${endPoint}/rides`);
      const rideList = res.data.rides;

      setRides(rideList);

      // Extract unique customer IDs
      const ids = [...new Set(rideList.map((r) => r.customerId))];

      // Fetch customer details
      fetchCustomers(ids);
    } catch (error) {
      console.log("Error fetching rides:", error);
    }
  };

const fetchCustomers = async (ids) => {
  try {
    let temp = {};

    await Promise.all(
      ids.map(async (id) => {
        try {
          // Try to fetch user
          const res = await axios.get(`${endPoint}/user/${id}`);
          // API returns user directly (not in res.data.user)
          const user = res.data;

          const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

          temp[id] = fullName || "Unknown User";
        } catch (err) {
          // If user doesn't exist (404) → set default
          console.warn(`User not found for ID: ${id}`);

          temp[id] = "Unknown User";
        }
      })
    );

    setCustomers(temp);
  } catch (error) {
    console.log("Error fetching customer details:", error);
  }
};


  useEffect(() => {
    fetchRides();
  }, []);

  // Pagination logic
  const totalItems = rides.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentRides = rides.slice(startIndex, endIndex);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">All Rides</h2>

      <div className="mb-2 text-sm font-medium">
        Showing {startIndex + 1} to {endIndex} of {totalItems} entries
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table w-full">
          <thead className="text-black">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Midways</th>
              <th>Distance</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {currentRides.map((ride, index) => (
              <tr
                key={ride._id}
                className={index % 2 === 0 ? "bg-base-200 text-black" : ""}
              >
                <td>{startIndex + index + 1}</td>

                {/* ⭐ CUSTOMER NAME HERE */}
                <td>
                  {customers[ride?.customerId] || (
                    <span className="text-gray-400">Loading...</span>
                  )}
                </td>

                <td>{ride.pickup?.address}</td>
                <td>{ride.dropoff?.address}</td>

                <td>
                  {ride.midwayStops?.length > 0 ? (
                    ride.midwayStops.map((m, i) => (
                      <div key={i}>{m.address}</div>
                    ))
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td>{ride.distance}</td>
                <td>${ride.customerFare}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[ride.status]
                    }`}
                  >
                    {ride.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </td>

                <td>{new Date(ride.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join mt-4 mx-auto w-full justify-center flex gap-1">
        {[...Array(totalPages).keys()].map((pageNum) => {
          const page = pageNum + 1;
          return (
            <input
              key={page}
              type="radio"
              name="options"
              aria-label={page}
              className="join-item btn btn-square"
              checked={currentPage === page}
              onChange={() => setCurrentPage(page)}
            />
          );
        })}
      </div>
    </div>
  );
}
