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
  if (error)
    return <p className="p-4 text-red-600">Error: {error}</p>;

  if (!notifications.length)
    return <p className="p-4">No notifications found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">General Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{notif.title}</h3>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  notif.type === "info"
                    ? "bg-blue-100 text-blue-800"
                    : notif.type === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : notif.type === "alert"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {notif.type}
              </span>
            </div>
            <p className="mb-2">{notif.message}</p>
            {notif.link && (
              <a
                href={notif.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Read more
              </a>
            )}
            <p className="text-gray-400 text-sm mt-2">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
