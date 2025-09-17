"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PatientAllBills() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/billing/${id}/patient`)
      .then(res => res.json())
      .then(data => {
        console.log("API response:", data); // 🔹 check response
        // Handle message
        if (data.message) {
          setMessage(data.message);
          setBill(null);
        } else if (Array.isArray(data)) {
          // If API returns array, take first bill
          setBill(data[0] || null);
        } else {
          // Single bill object
          setBill(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load bills");
        setBill(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="bills-message">Loading bills...</p>;
  if (!bill || !bill.items || bill.items.length === 0)
    return <p className="bills-message">{message || "No bills found."}</p>;

  // Totals
  const totalPaid = bill.items
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalToPay = bill.items
    .filter(i => i.status === "Unpaid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalAmount = totalPaid + totalToPay;

  return (
    <div className="bills-container">
      <h1 className="bills-title">Patient Bills</h1>

      <table className="bills-table">
        <thead>
          <tr>
            <th>Payment Item</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td className={item.status === "Paid" ? "status-paid" : "status-unpaid"}>
                {item.status}
              </td>
              <td>₹{item.amount || 0}</td>
              <td>{item.payment_date ? new Date(item.payment_date).toLocaleDateString() : "-"}</td>
            </tr>
          ))}

          {/* Total Rows */}
          <tr className="total-row">
            <td><strong>Total Amount</strong></td>
            <td></td>
            <td><strong>₹{totalAmount}</strong></td>
            <td></td>
          </tr>
          <tr className="total-row">
            <td><strong>Total Paid</strong></td>
            <td></td>
            <td><strong>₹{totalPaid}</strong></td>
            <td></td>
          </tr>
          <tr className="total-row">
            <td><strong>Total To Pay</strong></td>
            <td></td>
            <td><strong>₹{totalToPay}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
