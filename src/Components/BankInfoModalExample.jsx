import { useState } from "react";

export default function BankInfoModalExample({ bank }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={openModal}
        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
      >
        View Bank Info
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Bank Details</h2>
            <p><strong>Bank Name:</strong> {bank.bankName}</p>
            <p><strong>Account Number:</strong> {bank.accountNumber}</p>
            <p><strong>Routing Number:</strong> {bank.routingNumber}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
