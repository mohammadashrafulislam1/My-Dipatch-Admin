import { useState, useEffect } from "react";

const Support = () => {
  const [tickets, setTickets] = useState([]);

  // FAQ states
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("customer"); // Default category
  const [editFaqId, setEditFaqId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("customer");

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

    // Dummy FAQs with categories
    const dummyFaqs = [
      {
        id: 1,
        question: "How to reset my password?",
        answer: "Go to settings and click 'Reset Password'.",
        category: "customer",
      },
      {
        id: 2,
        question: "How to contact support?",
        answer: "You can email support@example.com or call 123-456-7890.",
        category: "customer",
      },
      {
        id: 3,
        question: "How do I accept a ride request?",
        answer: "Go to the driver app and tap 'Accept' on incoming requests.",
        category: "driver",
      },
      {
        id: 4,
        question: "How to update my vehicle info?",
        answer: "In driver settings, update vehicle details and save.",
        category: "driver",
      },
    ];
    setFaqs(dummyFaqs);
  }, []);

  // ...closeTicket, openReplyModal, closeReplyModal, submitReply same as before...

  // FAQ handlers with category
  const addFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Please enter both question and answer.");
      return;
    }
    const newFaq = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
    };
    setFaqs((prev) => [...prev, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory("customer");
  };

  const startEditFaq = (faq) => {
    setEditFaqId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
  };

  const cancelEdit = () => {
    setEditFaqId(null);
    setEditQuestion("");
    setEditAnswer("");
    setEditCategory("");
  };

  const saveEditFaq = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      alert("Please enter both question and answer.");
      return;
    }
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editFaqId
          ? { ...f, question: editQuestion, answer: editAnswer, category: editCategory }
          : f
      )
    );
    cancelEdit();
  };

  const deleteFaq = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Filter faqs by selectedCategory
  const filteredFaqs = faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="md:p-6 max-w-5xl mx-auto">
      {/* ...tickets and reply modal unchanged, omitted for brevity... */}

      {/* FAQ Section */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Manage FAQs</h1>

        {/* Category Filter Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedCategory === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory("customer")}
          >
            Customer FAQs
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedCategory === "driver" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory("driver")}
          >
            Driver FAQs
          </button>
        </div>

        {/* Add FAQ */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Add New FAQ</h2>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded focus:outline-blue-500"
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
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
          {filteredFaqs.length === 0 ? (
            <p>No FAQs in this category yet.</p>
          ) : (
            <ul>
              {filteredFaqs.map((faq) => (
                <li
                  key={faq.id}
                  className="border-b last:border-none py-3 flex flex-col md:flex-row md:justify-between md:items-center"
                >
                  {editFaqId === faq.id ? (
                    <>
                      <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="mb-2 p-2 border border-gray-300 rounded focus:outline-blue-500"
                        >
                          <option value="customer">Customer</option>
                          <option value="driver">Driver</option>
                        </select>
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
