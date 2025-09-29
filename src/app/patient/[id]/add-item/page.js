"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PatientDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: "", amount: 0, status: "Unpaid" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/patient`)
      .then(res => res.json())
      .then(data => {
        const selected = data.find(p => p._id === id);
        setPatient(selected || null);
      });
  }, [id]);

  if (!patient) return <p className="text-white text-center mt-20 animate-scale-in">Loading...</p>;

  const addItem = () => {
    if (!currentItem.name || currentItem.amount <= 0) return;
    setBillItems([...billItems, currentItem]);
    setCurrentItem({ name: "", amount: 0, status: "Unpaid" });
  };

  const submitBill = async () => {
    if (billItems.length === 0) {
      setMessage("❌ At least one item is required");
      return;
    }

    const res = await fetch(`/api/billing/${patient._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: billItems }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setBillItems([]);
      router.push(`/patient/${id}/bills`);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Patient Details
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          View patient info and manage billing items
        </p>
      </div>

      {/* Patient Info Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 w-full max-w-2xl mb-8 animate-scale-in">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Patient Information</h2>
        <p><strong>Patient ID:</strong> {patient._id}</p>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Contact:</strong> {patient.contactNumber || "-"}</p>
        <p><strong>Gender:</strong> {patient.gender || "-"}</p>
      </div>

      {/* Billing Form Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 w-full max-w-2xl animate-scale-in">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Add Bill Items</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={currentItem.name}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Amount"
            value={currentItem.amount}
            onChange={(e) => setCurrentItem({ ...currentItem, amount: Number(e.target.value) })}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={currentItem.status}
            onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>

        <button
          onClick={addItem}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-4"
        >
          Add Item
        </button>

        {/* Bill Items List */}
        {billItems.length > 0 && (
          <ul className="mb-4">
            {billItems.map((item, i) => (
              <li key={i} className="px-3 py-2 border border-border rounded-lg mb-2 flex justify-between">
                <span>{item.name}</span>
                <span>₹{item.amount} ({item.status})</span>
              </li>
            ))}
          </ul>
        )}

        {/* Submit & View Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={submitBill}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Submit Items
          </button>
          <button
            onClick={() => router.push(`/patient/${id}/bills`)}
            className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            View Bills
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
