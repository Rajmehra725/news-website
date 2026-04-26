"use client";
import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";

// 🔥 Type
interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string;
  image?: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("news");
  const [image, setImage] = useState("");

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);

  const API = "https://starnewsbackend.onrender.com/api/notification";

  // 🔥 Fetch
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setNotifications(data);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔥 Submit
  const handleSubmit = async () => {
    if (!title || !message) {
      return alert("Title & Message required");
    }

    try {
      setLoading(true);

      await axios.post(API, {
        title,
        message,
        type,
        image,
      });

      // reset
      setTitle("");
      setMessage("");
      setType("news");
      setImage("");

      fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Delete
  const deleteNoti = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchNotifications();
  };

  // 🔥 Mark Read
  const markRead = async (id: string) => {
    await axios.put(`${API}/read/${id}`);
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📢 Admin Notification</h1>

      {/* 🔥 FORM */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <input
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
        />

        <textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          placeholder="Message"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          value={image}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setImage(e.target.value)
          }
          placeholder="Image URL"
          className="w-full mb-2 p-2 border rounded"
        />

        <select
          value={type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setType(e.target.value)
          }
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="news">News</option>
          <option value="breaking">Breaking</option>
          <option value="general">General</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Sending..." : "Send Notification 🚀"}
        </button>
      </div>

      {/* 🔥 LIST */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">History</h2>

        {notifications.length === 0 && <p>No notifications</p>}

        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-3 mb-3 rounded border ${
              n.isRead ? "bg-gray-50" : "bg-yellow-50"
            }`}
          >
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm">{n.message}</p>

            {n.image && (
              <img
                src={n.image}
                className="w-32 mt-2 rounded"
                alt=""
              />
            )}

            <p className="text-xs mt-1 text-gray-500">
              {n.type} | {new Date(n.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-2">
              {!n.isRead && (
                <button
                  onClick={() => markRead(n._id)}
                  className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                >
                  Read
                </button>
              )}

              <button
                onClick={() => deleteNoti(n._id)}
                className="bg-red-500 text-white px-2 py-1 text-xs rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}