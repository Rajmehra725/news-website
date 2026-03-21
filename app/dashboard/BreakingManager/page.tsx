"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, ToggleLeft, ToggleRight, Search } from "lucide-react";

interface BreakingNews {
  _id: string;
  text: string;
  isActive: boolean;
  priority: number;
}

const API_URL = "https://starnewsbackend.onrender.com/api/breaking";

export default function BreakingNewsPage() {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchNews = async () => {
    try {
      const res = await axios.get<BreakingNews[]>(API_URL);
      setNewsList(res.data.sort((a, b) => a.priority - b.priority));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch breaking news");
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return alert("Headline is required");
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { text, priority });
        setEditId(null);
      } else {
        await axios.post(API_URL, { text, priority });
      }
      setText("");
      setPriority(1);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Failed to save headline");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this headline?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/toggle/${id}`);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Toggle failed");
    }
  };

  const handleEdit = (item: BreakingNews) => {
    setText(item.text);
    setPriority(item.priority);
    setEditId(item._id);
  };

  const activeNews = newsList.filter((item) => item.isActive);

  const filteredNews = newsList.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔴 MARQUEE */}
      {activeNews.length > 0 && (
        <div className="bg-red-600 text-white overflow-hidden py-2 px-3 h-10 flex items-center">
          <div className="relative w-full">
            <div className="absolute whitespace-nowrap animate-marquee">
              {activeNews.map((item) => (
                <span
                  key={item._id}
                  className="mx-4 font-bold text-xs uppercase"
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          <style jsx>{`
            .animate-marquee {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 35s linear infinite;
            }
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>
      )}

      {/* ADMIN */}
      <div className="p-4">

        <h1 className="text-xl font-bold mb-5 text-red-600">
          BREAKING NEWS ADMIN
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-5 bg-white p-4 rounded shadow flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Enter headline..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          />

          <button className="bg-red-600 text-white py-2 rounded">
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setText("");
                setPriority(1);
                setEditId(null);
              }}
              className="bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>

        {/* SEARCH */}
        <div className="mb-4 flex items-center gap-2">
          <Search />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full text-sm"
          />
        </div>

        {/* ✅ DESKTOP TABLE */}
        <div className="hidden md:block bg-white shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2 text-left">Headline</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredNews.map((item, idx) => (
                <tr key={item._id}>
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{item.text}</td>
                  <td className="px-4 py-2 text-center">{item.priority}</td>

                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleToggle(item._id)}>
                      {item.isActive ? (
                        <ToggleRight className="text-green-500" />
                      ) : (
                        <ToggleLeft className="text-red-500" />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-2 flex justify-center gap-2">
                    <Edit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEdit(item)}
                    />
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE CARD */}
        <div className="md:hidden space-y-3">
          {filteredNews.map((item, idx) => (
            <div
              key={item._id}
              className="bg-white p-3 rounded shadow space-y-2"
            >
              <div className="flex justify-between text-xs">
                <span>#{idx + 1}</span>
                <span>Priority: {item.priority}</span>
              </div>

              <p className="text-sm font-medium break-words">
                {item.text}
              </p>

              <div className="flex justify-between items-center">
                <button onClick={() => handleToggle(item._id)}>
                  {item.isActive ? (
                    <ToggleRight className="text-green-500" />
                  ) : (
                    <ToggleLeft className="text-red-500" />
                  )}
                </button>

                <div className="flex gap-3">
                  <Edit
                    className="text-blue-500"
                    onClick={() => handleEdit(item)}
                  />
                  <Trash2
                    className="text-red-500"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}