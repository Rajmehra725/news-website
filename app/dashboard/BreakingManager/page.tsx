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

const API_URL = "http://localhost:5000/api/breaking";

export default function BreakingNewsPage() {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch news
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

  // Add / Update
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

  // Delete
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

  // Toggle active
  const handleToggle = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/toggle/${id}`);
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Toggle failed");
    }
  };

  // Edit
  const handleEdit = (item: BreakingNews) => {
    setText(item.text);
    setPriority(item.priority);
    setEditId(item._id);
  };

  // Active news for marquee
  const activeNews = newsList.filter((item) => item.isActive);

  // Filtered news for search
  const filteredNews = newsList.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* PUBLIC FACING MARQUEE */}
    {activeNews.length > 0 && (
  <div className="bg-red-600 text-white overflow-hidden py-3 px-4 h-12 flex items-center">
    <div className="relative w-full">
      <div className="absolute whitespace-nowrap animate-marquee">
        {activeNews.map((item, idx) => (
          <span
            key={item._id}
            className="mx-6 font-bold text-sm md:text-base uppercase"
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
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `}</style>
  </div>
)}
      {/* ADMIN PANEL */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-red-600">
          STAR NEWS - BREAKING HEADLINES ADMIN
        </h1>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter headline..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            placeholder="Priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-24 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
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
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search headlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Breaking News Table */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2 w-12">#</th>
                <th className="px-4 py-2 text-left">Headline</th>
                <th className="px-4 py-2 text-center w-24">Priority</th>
                <th className="px-4 py-2 text-center w-20">Active</th>
                <th className="px-4 py-2 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } ${item.isActive ? "font-semibold" : "text-gray-400"}`}
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{item.text}</td>
                    <td className="px-4 py-2 text-center">{item.priority}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleToggle(item._id)}>
                        {item.isActive ? (
                          <ToggleRight className="text-green-500 inline-block" />
                        ) : (
                          <ToggleLeft className="text-red-500 inline-block" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No headlines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}