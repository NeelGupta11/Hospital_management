"use client";
import { useEffect, useState } from "react";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notification");
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p className="p-4">Loading notifications...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!notifications.length) return <p className="p-4">No notifications found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        General Notifications
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Message</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Link</th>
              <th className="px-4 py-3 text-left font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif, idx) => (
              <tr
                key={notif._id}
                className={`hover:bg-blue-50 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 border-b border-gray-200">{notif.title}</td>
                <td className="px-4 py-3 border-b border-gray-200">{notif.message}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium">
                    {notif.type}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {notif.link ? (
                    <a
                      href={notif.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Read More
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
                  {new Date(notif.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
