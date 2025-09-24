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

  if (!patient) return <p className="patient-detail-loading">Loading...</p>;

  const addItem = () => {
    if (!currentItem.name || currentItem.amount <= 0) return;
    setBillItems([...billItems, currentItem]);
    setCurrentItem({ name: "", amount: 0, status: "Unpaid" });
  };

  const submitBill = async () => {
    if (billItems.length === 0) {
      setMessage("At least one item is required");
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
    <div className="patient-detail-container text-black">
  {/* Patient Info */}
  <h1 className="patient-detail-title">Patient Details</h1>
  <p>
    <strong>Patient ID:</strong> {patient._id}
  </p>
  <p>
    <strong>Name:</strong> {patient.name}
  </p>
  <p>
    <strong>Contact:</strong> {patient.contactNumber}
  </p>
  <p>
    <strong>Gender:</strong> {patient.gender}
  </p>

  {/* Bill Form */}
  <div className="patient-bill-card">
    <h2 className="patient-bill-title">Add Bill Items</h2>

    <input
      type="text"
      placeholder="Item Name"
      value={currentItem.name}
      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
      className="patient-input"
    />
    <input
      type="number"
      placeholder="Amount"
      value={currentItem.amount}
      onChange={(e) => setCurrentItem({ ...currentItem, amount: Number(e.target.value) })}
      className="patient-input"
    />
    <select
      value={currentItem.status}
      onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
      className="patient-input"
    >
      <option>Paid</option>
      <option>Unpaid</option>
    </select>

    <button onClick={addItem} className="patient-btn patient-btn-blue">
      Add Item
    </button>

    <ul className="patient-items-list">
      {billItems.map((item, i) => (
        <li key={i} className="patient-item">
          {item.name} - ₹{item.amount} ({item.status})
        </li>
      ))}
    </ul>

    <button onClick={submitBill} className="patient-btn patient-btn-green">
      Submit Items
    </button>
    <button
      className="patient-btn patient-btn-green-outline"
      onClick={() => router.push(`/patient/${id}/bills`)}
    >
      View Bills
    </button>

    {message && <p className="patient-message">{message}</p>}
  </div>
</div>
  );
}
