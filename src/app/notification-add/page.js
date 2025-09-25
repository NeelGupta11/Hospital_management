"use client";
import { useState } from "react";

export default function AddNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type, link }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg("Notification created successfully!");
        setTitle("");
        setMessage("");
        setType("info");
        setLink("");
      } else {
        setResponseMsg(data.message || "Failed to create notification.");
      }
    } catch (err) {
      console.error(err);
      setResponseMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-black">
        <h2 className="text-2xl font-bold mb-4 text-black">Add General Notification</h2>

        {responseMsg && (
          <div className="mb-4 p-2 rounded bg-blue-100 text-blue-700">
            {responseMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block font-medium mb-1 text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded text-black text-black"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-black">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded text-black"
              rows={4}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1 text-black">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded text-black"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-black">Link (optional)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border p-2 rounded text-black"
              placeholder="https://example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-black"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Notification"}
          </button>
        </form>
      </div>
    </div>
  );
}
