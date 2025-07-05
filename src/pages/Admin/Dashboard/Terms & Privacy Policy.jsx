import { useState, useEffect } from "react";

const TermsPrivacyPolicy = () => {
  const [terms, setTerms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Simulate fetching from backend on mount
  useEffect(() => {
    // Replace this with API fetch calls
    const fetchData = async () => {
      setLoading(true);
      // Dummy fetched data:
      const fetchedTerms = "These are the current Terms & Conditions...";
      const fetchedPrivacy = "This is the current Privacy Policy...";
      setTerms(fetchedTerms);
      setPrivacyPolicy(fetchedPrivacy);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = () => {
    // Validate non-empty or any other rules
    if (!terms.trim() || !privacyPolicy.trim()) {
      setMessage("Both fields are required.");
      return;
    }
    setMessage("");
    // Call API to save data here
    alert("Terms & Privacy Policy updated successfully!");
  };

  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear both Terms & Conditions and Privacy Policy?"
      )
    ) {
      setTerms("");
      setPrivacyPolicy("");
      setMessage("Content cleared. Don't forget to save.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="md:text-3xl text-xl font-bold mb-6">Terms & Privacy Policy</h1>

      {message && (
        <p className="mb-4 text-red-600 font-semibold">{message}</p>
      )}

      <div className="mb-6">
        <label className="block font-semibold mb-2" htmlFor="terms">
          Terms & Conditions
        </label>
        <textarea
          id="terms"
          rows={8}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 focus:outline-blue-500"
          placeholder="Enter Terms & Conditions here..."
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2" htmlFor="privacy">
          Privacy Policy
        </label>
        <textarea
          id="privacy"
          rows={8}
          value={privacyPolicy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 focus:outline-blue-500"
          placeholder="Enter Privacy Policy here..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TermsPrivacyPolicy;
