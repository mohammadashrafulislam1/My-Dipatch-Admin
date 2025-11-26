// ----- SAME IMPORTS -----
import { useState, useEffect } from "react";
import axios from "axios";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";
import {
  FiUser,
  FiMail,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  const { user } = useAuth();

  // Add FAQ
  const [newCategory, setNewCategory] = useState("customer");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Edit FAQ
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Reply modal
  const [replyModal, setReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Loading for reply
  const [replyLoading, setReplyLoading] = useState(false);

  // Filter FAQ
  const [faqFilter, setFaqFilter] = useState("all");

  // ------------------------------
  // LOAD DATA
  // ------------------------------
  useEffect(() => {
    loadTickets();
    loadFaqs();
    loadUsers();
  }, []);

  // Load Tickets
  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await axios.get(`${endPoint}/support/admin`, {
        withCredentials: true,
      });
      setTickets(res.data?.tickets || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  // Load FAQs
  const loadFaqs = async () => {
    try {
      setLoadingFaqs(true);
      const res = await axios.get(`${endPoint}/faqs`);
      const list = [...(res.data.customer || []), ...(res.data.driver || [])];
      setFaqs(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoadingFaqs(false);
    }
  };

  // Load Users
  const loadUsers = async () => {
    try {
      const res = await axios.get(`${endPoint}/user/`, {
        withCredentials: true,
      });

      let users = [];
      if (Array.isArray(res.data?.users)) users = res.data.users;
      else if (Array.isArray(res.data)) users = res.data;

      const map = {};
      users.forEach((u) => (map[u._id] = u));
      setUsersMap(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  // Extract User Info
  const getUserInfo = (ticket) => {
    const info = usersMap[ticket.userId] || {};
    const fullName =
      `${info.firstname || info.firstName || ""} ${
        info.lastname || info.lastName || ""
      }`.trim() || "Unknown User";

    return {
      fullName,
      email: info.email || "Unknown email",
    };
  };

  // Open Reply Modal
  const openReplyModal = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.reply || "");
    setReplyModal(true);
  };

  // Submit Reply
  const submitReply = async () => {
    if (!replyText.trim()) return toast.error("Reply cannot be empty!");

    try {
      setReplyLoading(true);

      await axios.put(
        `${endPoint}/support/tickets/admin`,
        {
          ticketId: selectedTicket._id,
          reply: replyText,
          status: "Resolved",
        },
        { withCredentials: true }
      );

      toast.success("Reply sent!");
      setReplyModal(false);
      setReplyText("");
      loadTickets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  // Add FAQ
  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      return toast.error("Fill all fields!");
    }

    try {
      await axios.post(
        `${endPoint}/faqs`,
        { category: newCategory, question: newQuestion, answer: newAnswer },
        { withCredentials: true }
      );

      toast.success("FAQ Added!");
      setNewQuestion("");
      setNewAnswer("");
      loadFaqs();
    } catch (err) {
      toast.error("Failed to add FAQ");
    }
  };

  // Edit FAQ
  const saveEditFaq = async () => {
    try {
      await axios.put(
        `${endPoint}/faqs/${editId}`,
        { question: editQuestion, answer: editAnswer, category: editCategory },
        { withCredentials: true }
      );

      toast.success("FAQ Updated!");
      setEditId(null);
      loadFaqs();
    } catch (err) {
      toast.error("Failed to update FAQ");
    }
  };

  // Delete FAQ
  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await axios.delete(`${endPoint}/faqs/${id}`, { withCredentials: true });
      toast.success("FAQ Deleted!");
      loadFaqs();
    } catch (err) {
      toast.error("Failed to delete FAQ");
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (faqFilter === "all") return true;
    return faq.category === faqFilter;
  });

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="md:p-6 max-w-6xl mx-auto space-y-10">
<Toaster position="top-center" reverseOrder={false} />
      {/* HEADER */}
      <h1 className="text-3xl font-bold">Support Center</h1>

      {/* ==================== SUPPORT TICKETS hidden==================== */}
      <div className="bg-white rounded-2xl shadow p-6 hidden">
        <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {loadingTickets ? (
            <p className="text-gray-500">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-400 text-sm">No tickets found.</p>
          ) : (
            tickets.map((ticket) => {
              const info = getUserInfo(ticket);

              return (
                <div
                  key={ticket._id}
                  className="border rounded-xl p-4 bg-gray-50 hover:bg-white transition shadow-sm"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-lg font-semibold">
                      {info.fullName[0]?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold flex items-center gap-1 text-sm">
                        <FiUser /> {info.fullName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FiMail /> {info.email}
                      </p>
                    </div>

                    <span
                      className={`ml-auto px-3 py-1 rounded-full text-xs ${
                        ticket.userType === "driver"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.userType.toUpperCase()}
                    </span>
                  </div>

                  {/* Issue */}
                  <p className="text-sm text-gray-700 flex gap-2 mb-2">
                    <FiMessageSquare className="text-gray-500 mt-[2px]" />
                    {ticket.issue}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between text-xs mt-2">
                    <span className="flex items-center gap-1 text-gray-500">
                      <FiClock />{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full ${
                        ticket.status === "open"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => openReplyModal(ticket)}
                      className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                    >
                      Reply
                    </button>
                  </div>

                  {ticket.reply && (
                    <div className="mt-2 text-xs border-t pt-2 text-gray-600">
                      <strong>Admin Reply:</strong> {ticket.reply}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== ADD FAQ ==================== */}
      <div className="bg-white rounded-2xl shadow p-6 border border-blue-50">
        <h2 className="text-xl font-semibold mb-4">Add FAQ</h2>

        <div className="mb-3 w-[30px]">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        <input
          className="border h-[40px] w-full rounded px-2 py-1 text-md"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />

        <textarea
          className="border rounded w-full px-2 py-1 text-md mt-3"
          placeholder="Answer"
          rows="3"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />

        <button
          onClick={addFaq}
          className="mt-4 w-1/2 mx-auto block bg-blue-600 hover:bg-blue-700 
                     text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm
                     transition-all duration-150"
        >
          Add FAQ
        </button>
      </div>

      {/* ==================== MANAGE FAQ ==================== */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Manage FAQs</h2>

          <select
            className="border px-3 py-1 text-sm rounded"
            value={faqFilter}
            onChange={(e) => setFaqFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
          {filteredFaqs.map((faq) => (
            <div key={faq._id} className="border rounded-lg bg-gray-50 p-4">
              {editId === faq._id ? (
                <>
                  <select
                    className="border text-sm px-2 py-1 rounded w-full mb-2"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="driver">Driver</option>
                  </select>

                  <input
                    className="border w-full rounded px-2 py-1 text-sm mb-2"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />

                  <textarea
                    className="border w-full rounded px-2 py-1 text-sm mb-2"
                    rows={3}
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEditFaq}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-sm text-gray-700">{faq.answer}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Category: {faq.category}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditId(faq._id);
                        setEditQuestion(faq.question);
                        setEditAnswer(faq.answer);
                        setEditCategory(faq.category);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteFaq(faq._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ==================== REPLY MODAL ==================== */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow w-[450px]">
            <h2 className="font-semibold">Reply to Ticket</h2>

            <textarea
              className="border w-full rounded px-2 py-1 text-sm mt-3"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setReplyModal(false)}
                className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
              >
                Cancel
              </button>

              <button
                onClick={submitReply}
                disabled={replyLoading}
                className={`${
                  replyLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600"
                } text-white px-2 py-1 rounded text-xs flex items-center gap-2`}
              >
                {replyLoading ? (
                  <>
                    <span className="loader border-white border-t-transparent w-3 h-3 rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Support;
