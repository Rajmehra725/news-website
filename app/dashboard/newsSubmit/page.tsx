"use client";

import { useEffect, useState } from "react";

const API = "https://starnewsbackend.onrender.com/api/newsSubmit";

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(API, { cache: "no-store" });
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const approve = async (id: string) => {
    await fetch(`${API}/approve/${id}`, { method: "PUT" });
    fetchNews();
  };

  const reject = async (id: string) => {
    await fetch(`${API}/reject/${id}`, { method: "PUT" });
    fetchNews();
  };

  const deleteNews = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="sticky top-0 bg-red-600 text-white shadow z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <h1 className="font-bold text-xl">
            ⭐ STAR NEWS Admin Panel
          </h1>

          <button
            onClick={fetchNews}
            className="bg-white text-red-600 px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-5">

        {loading && (
          <p className="text-center text-gray-500">
            Loading...
          </p>
        )}

        {!loading && news.length === 0 && (
          <p className="text-center">No News Found</p>
        )}

        {news.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4">

              {/* TITLE */}
              <h2 className="text-lg font-bold text-gray-800">
                {item.title}
              </h2>

              {/* NEWS MEDIA FRAME */}
              <div className="relative mt-3 border-4 border-red-600 rounded-lg overflow-hidden bg-black">

                {/* TOP BAR */}
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs px-2 py-1 flex justify-between z-10">
                  <span>STAR NEWS</span>
                  <span className="animate-pulse">🔴 LIVE</span>
                </div>

                {/* VIDEO */}
                {item.video && (
                  <video
                    src={item.video}
                    controls
                    className="w-full max-h-[350px] object-cover pt-6"
                  />
                )}

                {/* IMAGES */}
                {!item.video && item.images && item.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-6 p-2">
                    {item.images.map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-full h-40 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {/* BOTTOM TICKER */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs px-2 py-1 flex justify-between">
                  <span>{item.location}</span>
                  <span>{item.district}</span>
                </div>

              </div>

              {/* CONTENT */}
              <p className="text-gray-700 mt-3">
                {item.content}
              </p>

              {/* USER INFO */}
              <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <p>👤 <b>{item.name}</b></p>

                  <p>📱 {item.mobile}</p>

                  <p>📧 {item.email}</p>

                  <p>📍 {item.location}</p>

                  <p>🏙 {item.district}</p>

                  <p>📰 {item.category}</p>

                </div>
              </div>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-2 mt-4">

                <button
                  onClick={() => approve(item._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(item._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm"
                >
                  Reject
                </button>

                <button
                  onClick={() => deleteNews(item._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}