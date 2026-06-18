"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   API
========================= */
const API = axios.create({
  baseURL: "https://starnewsbackend.onrender.com/api",
});

/* =========================
   TYPE
========================= */
type Epaper = {
  _id: string;
  title: string;
  publishDate: string;
  image: {
    url: string;
  };
};

/* =========================
   COMPONENT
========================= */
export default function EpaperAdmin() {
  const today = new Date().toISOString().split("T")[0];

  const [epapers, setEpapers] = useState<Epaper[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [publishDate, setPublishDate] = useState<string>(today); // ✅ SAFE DEFAULT
  const [image, setImage] = useState<File | null>(null);

  const [editId, setEditId] = useState<string | null>(null);

  /* =========================
     FETCH
  ========================= */
  const fetchEpapers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/epaper");
      setEpapers(res.data?.epapers || []);
    } catch (err) {
      console.error(err);
      setEpapers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpapers();
  }, []);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publishDate", publishDate);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editId) {
        await API.put(`/epaper/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/epaper", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchEpapers();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteEpaper = async (id: string) => {
    try {
      await API.delete(`/epaper/${id}`);
      fetchEpapers();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     EDIT
  ========================= */
  const startEdit = (ep: Epaper) => {
    setEditId(ep._id);
    setTitle(ep.title || "");

    // ✅ SAFE DATE HANDLING (FIXED CRASH)
    setPublishDate(
      ep.publishDate ? ep.publishDate.split("T")[0] : today
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =========================
     RESET
  ========================= */
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setPublishDate(today); // reset safe
    setImage(null);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-800">
          📰 Epaper Admin Panel
        </h1>
        <p className="text-gray-500">
          Fully optimized & error-free dashboard
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-5">
          {editId ? "✏️ Update Epaper" : "➕ Upload Epaper"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <input
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DATE (FIXED - NEVER NULL) */}
          <input
            type="date"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            value={publishDate || today}
            onChange={(e) => setPublishDate(e.target.value)}
          />

          {/* IMAGE */}
          <input
            type="file"
            className="w-full border p-3 rounded-xl bg-white"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg">
              {editId ? "Update" : "Upload"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : epapers.length === 0 ? (
        <p className="text-center text-gray-400">No epapers found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {epapers.map((ep) => (
            <div
              key={ep._id}
              className="bg-white/80 backdrop-blur-xl border shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
            >

              {/* IMAGE */}
              <img
                src={ep.image?.url}
                className="w-full h-56 object-cover"
              />

              {/* INFO */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {ep.title}
                </h3>
                <p className="text-sm text-gray-500">
                  📅 {ep.publishDate ? new Date(ep.publishDate).toDateString() : ""}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between p-4">
                <button
                  onClick={() => startEdit(ep)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteEpaper(ep._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}