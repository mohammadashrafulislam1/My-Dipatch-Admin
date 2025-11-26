import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

export default function TermsPrivacyPolicy() {
  const { token } = useAuth();

  const [terms, setTerms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 Always attach token
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };

  // ============================
  // GET BOTH POLICIES
  // ============================
  const fetchPolicies = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${endPoint}/policy`, axiosConfig);

      setTerms(res.data?.terms?.content || "");
      setPrivacyPolicy(res.data?.privacy?.content || "");

    } catch (err) {
      toast.error("Failed to load policies");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ============================
  // UPDATE A POLICY
  // ============================
  const updatePolicy = async (type, content) => {
    try {
      const payload = {
        title: type === "terms" ? "Terms & Conditions" : "Privacy Policy",
        content,
      };

      await axios.put(`${endPoint}/policy/${type}`, payload, axiosConfig);

      toast.success(
        type === "terms"
          ? "Terms & Conditions updated!"
          : "Privacy Policy updated!"
      );

    } catch (err) {
      console.log(err);
      toast.error("Failed to update policy");
    }
  };

  // ============================
  // SAVE BOTH POLICIES
  // ============================
  const handleSave = async () => {
    if (!terms.trim() || !privacyPolicy.trim()) {
      return toast.error("Both fields are required");
    }

    await updatePolicy("terms", terms);
    await updatePolicy("privacy", privacyPolicy);
  };

  // ============================
  // CLEAR FIELDS
  // ============================
  const handleClear = () => {
    if (window.confirm("Clear all content?")) {
      setTerms("");
      setPrivacyPolicy("");
      toast("Content cleared. Click Save to apply.");
    }
  };

  if (loading) {
    return (
      <div className="w-full text-center py-10 text-lg font-semibold">
        Loading Policies...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-center" />

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Terms & Privacy Policy
      </h1>

      {/* Terms */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Terms & Conditions</label>
        <textarea
          rows={10}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 focus:outline-blue-500"
          placeholder="Enter Terms & Conditions..."
        />
      </div>

      {/* Privacy */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Privacy Policy</label>
        <textarea
          rows={10}
          value={privacyPolicy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 focus:outline-blue-500"
          placeholder="Enter Privacy Policy..."
        />
      </div>

      {/* BUTTONS */}
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
}
