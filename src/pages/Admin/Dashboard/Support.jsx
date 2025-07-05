import { useState, useEffect } from "react";

const Support = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const dummyTickets = [
      {
        id: 1,
        user: "John Doe",
        issue: "Driver did not show up",
        status: "Open",
        createdAt: "2025-07-05",
      },
      {
        id: 2,
        user: "Jane Smith",
        issue: "App crashes on login",
        status: "Resolved",
        createdAt: "2025-07-04",
      },
    ];
    setTickets(dummyTickets);
  }, []);

  // Example function to close a ticket
  const closeTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Closed" } : t
      )
    );
  };

  // Example function to reply to a ticket (you can extend this)
  const replyToTicket = (id) => {
    alert(`Replying to ticket #${id}`);
  };

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      {tickets.length === 0 ? (
        <p>No support tickets found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Issue</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-4 py-2">{ticket.user}</td>
                <td className="border px-4 py-2">{ticket.issue}</td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">{ticket.createdAt}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => replyToTicket(ticket.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    disabled={ticket.status === "Closed"}
                  >
                    Reply
                  </button>
                  {ticket.status !== "Closed" && (
                    <button
                      onClick={() => closeTicket(ticket.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Support;
