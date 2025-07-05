import { useState, useEffect } from "react";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");

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

  const closeTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Closed" } : t))
    );
  };

  const openReplyModal = (id) => {
    setCurrentTicketId(id);
    setReplyText("");
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setCurrentTicketId(null);
  };

  const submitReply = () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    // Here you would normally send the reply to backend via API
    alert(`Reply sent for ticket #${currentTicketId}:\n${replyText}`);

    // Close modal after submit
    closeReplyModal();
  };

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      {tickets.length === 0 ? (
        <p>No support tickets found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow bg-white">
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
                      onClick={() => openReplyModal(ticket.id)}
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
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" />

          <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Reply to Ticket #{currentTicketId}</h2>
              <textarea
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-blue-500"
                placeholder="Type your reply here..."
              />
              <div className="flex justify-end items-center gap-2 space-x-3">
                <button
                  onClick={closeReplyModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Support;
