"use client";

import { useEffect, useState } from "react";

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);

  const fetchNews = async () => {
    const res = await fetch("http://localhost:5000/api/newsSubmit");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const approve = async (id: string) => {
    await fetch(`http://localhost:5000/api/newsSubmit/approve/${id}`, {
      method: "PUT",
    });
    fetchNews();
  };

  const reject = async (id: string) => {
    await fetch(`http://localhost:5000/api/newsSubmit/reject/${id}`, {
      method: "PUT",
    });
    fetchNews();
  };

  const deleteNews = async (id: string) => {
    await fetch(`http://localhost:5000/api/newsSubmit/${id}`, {
      method: "DELETE",
    });
    fetchNews();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🧑‍💼 Admin Panel</h1>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item._id} className="border p-4 rounded">

            <h2 className="font-bold">{item.title}</h2>
            <p>{item.content}</p>

            <p>👤 {item.name}</p>
            <p>📍 {item.location}</p>
            <p>Status: {item.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => approve(item._id)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => reject(item._id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => deleteNews(item._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
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