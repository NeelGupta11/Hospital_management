"use client";

import { useState } from "react";

export default function CreateRoomPage() {
  const [formData, setFormData] = useState({
    roomNo: "",
    type: "General",
    beds: 1,
    pricePerDay: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Room created successfully!" });
        setFormData({ roomNo: "", type: "General", beds: 1, pricePerDay: 0 });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create room" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Room</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room No</label>
            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            >
              <option value="General">General</option>
              <option value="ICU">ICU</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beds</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              min="1"
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price Per Day</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              min="0"
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
