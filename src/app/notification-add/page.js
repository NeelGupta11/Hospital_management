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
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md bg-gradient-white rounded-2xl shadow-card p-6 animate-scale-in text-black">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Add General Notification</h2>

        {responseMsg && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700 shadow-sm">
            {responseMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded-lg text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-foreground">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border p-2 rounded-lg text-black"
              required
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-foreground">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded-lg text-black"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-foreground">Link (optional)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-dark text-white font-semibold shadow-lg hover:scale-105 transform transition"
          >
            {loading ? "Adding..." : "Add Notification"}
          </button>
        </form>
      </div>
    </div>
  );
}
