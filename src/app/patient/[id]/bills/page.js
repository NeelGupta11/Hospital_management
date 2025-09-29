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
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setBill(null);
        } else if (Array.isArray(data)) {
          setBill(data[0] || null);
        } else {
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

  if (loading)
    return <p className="text-white text-center mt-20 animate-scale-in">Loading bills...</p>;
  if (!bill || !bill.items || bill.items.length === 0)
    return <p className="text-white text-center mt-20 animate-scale-in">{message || "No bills found."}</p>;

  const totalPaid = bill.items
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalToPay = bill.items
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalAmount = totalPaid + totalToPay;

  return (
    <div className="min-h-screen px-6 py-12 bg-background flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Patient Bills
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          Overview of all billing items for the patient
        </p>
      </div>

      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 w-full max-w-3xl animate-scale-in">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-primary/20 text-foreground">
              <th className="px-4 py-2 border-b">Payment Item</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-colors">
                <td className="px-4 py-2">{item.name}</td>
                <td className={`px-4 py-2 font-semibold ${item.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                  {item.status}
                </td>
                <td className="px-4 py-2">₹{item.amount || 0}</td>
                <td className="px-4 py-2">{item.payment_date ? new Date(item.payment_date).toLocaleDateString() : "-"}</td>
              </tr>
            ))}

            {/* Totals */}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total Amount</td>
              <td></td>
              <td className="px-4 py-2">₹{totalAmount}</td>
              <td></td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total Paid</td>
              <td></td>
              <td className="px-4 py-2 text-green-600">₹{totalPaid}</td>
              <td></td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total To Pay</td>
              <td></td>
              <td className="px-4 py-2 text-red-600">₹{totalToPay}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {message && (
          <p className="mt-4 text-center font-medium text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
