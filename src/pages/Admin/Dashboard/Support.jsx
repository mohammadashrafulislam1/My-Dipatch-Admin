import { useState, useEffect } from "react";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // FAQ states
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editFaqId, setEditFaqId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  useEffect(() => {
    // Dummy tickets
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

    // Dummy FAQs
    const dummyFaqs = [
      {
        id: 1,
        question: "How to reset my password?",
        answer: "Go to settings and click 'Reset Password'.",
      },
      {
        id: 2,
        question: "How to contact support?",
        answer: "You can email support@example.com or call 123-456-7890.",
      },
    ];
    setFaqs(dummyFaqs);
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
    alert(`Reply sent for ticket #${currentTicketId}:\n${replyText}`);
    closeReplyModal();
  };

  // FAQ handlers
  const addFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Please enter both question and answer.");
      return;
    }
    const newFaq = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    setFaqs((prev) => [...prev, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const startEditFaq = (faq) => {
    setEditFaqId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const cancelEdit = () => {
    setEditFaqId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const saveEditFaq = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      alert("Please enter both question and answer.");
      return;
    }
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editFaqId ? { ...f, question: editQuestion, answer: editAnswer } : f
      )
    );
    cancelEdit();
  };

  const deleteFaq = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      {tickets.length === 0 ? (
        <p>No support tickets found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow bg-white mb-8">
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
              <h2 className="text-xl font-semibold mb-4">
                Reply to Ticket #{currentTicketId}
              </h2>
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

      {/* FAQ Section */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Manage FAQs</h1>

        {/* Add FAQ */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Add New FAQ</h2>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-blue-500"
          />
          <textarea
            rows={3}
            placeholder="Answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-blue-500"
          />
          <button
            onClick={addFaq}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add FAQ
          </button>
        </div>

        {/* FAQ List */}
        <div className="bg-white p-4 rounded shadow">
          {faqs.length === 0 ? (
            <p>No FAQs added yet.</p>
          ) : (
            <ul>
              {faqs.map((faq) => (
                <li
                  key={faq.id}
                  className="border-b last:border-none py-3 flex flex-col md:flex-row md:justify-between md:items-center"
                >
                  {editFaqId === faq.id ? (
                    <>
                      <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-blue-500"
                        />
                        <textarea
                          rows={2}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEditFaq}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                        <p className="font-semibold">{faq.question}</p>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditFaq(faq)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
