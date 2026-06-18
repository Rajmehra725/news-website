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
   TYPES
========================= */
type PageImage = {
  public_id: string;
  url: string;
};

type Epaper = {
  _id: string;
  title: string;
  publishDate: string;
  pages: PageImage[];
};

/* =========================
   COMPONENT
========================= */
export default function EpaperAdmin() {
  const today = new Date().toISOString().split("T")[0];

  const [epapers, setEpapers] = useState<Epaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [publishDate, setPublishDate] = useState(today);
  const [pages, setPages] = useState<File[]>([]);
const [existingPages, setExistingPages] = useState<PageImage[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  /* =========================
     FETCH EPAPERS
  ========================= */
  const fetchEpapers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/epaper");

      setEpapers(res.data?.epapers || []);
    } catch (error) {
      console.error(error);
      setEpapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpapers();
  }, []);

  /* =========================
     RESET
  ========================= */
  const resetForm = () => {
  setEditId(null);
  setTitle("");
  setPublishDate(today);
  setPages([]);
  setExistingPages([]);
};

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter title");
      return;
    }

    if (!editId && pages.length === 0) {
      alert("Please select epaper pages");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("publishDate", publishDate);

      pages.forEach((file) => {
        formData.append("pages", file);
      });

      if (editId) {
        await API.put(`/epaper/${editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.post("/epaper", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      resetForm();
      fetchEpapers();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteEpaper = async (id: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this Epaper?"
    );

    if (!ok) return;

    try {
      await API.delete(`/epaper/${id}`);
      fetchEpapers();
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     EDIT
  ========================= */
 const startEdit = (epaper: Epaper) => {
  setEditId(epaper._id);
  setTitle(epaper.title);

  setPublishDate(
    epaper.publishDate
      ? epaper.publishDate.split("T")[0]
      : today
  );

  setExistingPages(epaper.pages || []);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-gray-800">
          📰 E-Paper Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Upload & Manage Multi Page E-Papers
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          {editId
            ? "✏️ Update E-Paper"
            : "➕ Upload New E-Paper"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}
          <div>
            <label className="font-medium block mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter epaper title"
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="font-medium block mb-2">
              Publish Date
            </label>

            <input
              type="date"
              value={publishDate}
              onChange={(e) =>
                setPublishDate(e.target.value)
              }
              className="w-full border border-slate-300 rounded-xl p-3"
            />
          </div>

          {/* FILES */}
          <div>
            <label className="font-medium block mb-2">
              E-Paper Pages
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setPages(
                  Array.from(
                    e.target.files || []
                  )
                )
              }
              className="w-full border border-slate-300 rounded-xl p-3 bg-white"
            />
          </div>

          {/* PREVIEW */}
          {pages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                Selected Pages ({pages.length})
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {pages.map((file, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl border bg-white"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-44 object-cover"
                    />

                    <div className="p-2 text-xs text-center bg-slate-50">
                      Page {index + 1}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}
{editId && existingPages.length > 0 && (
  <div>
    <h3 className="font-semibold mb-3">
      Existing Pages ({existingPages.length})
    </h3>

    <div className="flex gap-4 overflow-x-auto pb-2">
      {existingPages.map((page, index) => (
        <div
          key={page.public_id}
          className="min-w-[180px] bg-white border rounded-xl overflow-hidden shadow"
        >
          <img
            src={page.url}
            alt={`Page ${index + 1}`}
            className="w-full h-56 object-cover"
          />

          <div className="p-2 text-center text-sm bg-slate-50">
            Existing Page {index + 1}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              {uploading
                ? "Uploading..."
                : editId
                ? "Update E-Paper"
                : "Upload E-Paper"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center text-lg">
          Loading E-Papers...
        </div>
      ) : epapers.length === 0 ? (
        <div className="text-center text-gray-500">
          No E-Papers Found
        </div>
      ) : (
        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">

          {epapers.map((epaper) => (
            <div
              key={epaper._id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border hover:shadow-2xl transition-all duration-300"
            >

              {/* COVER PAGE */}
           <div className="flex gap-3 overflow-x-auto p-3 bg-slate-100">
  {epaper.pages?.map((page, index) => (
    <div
      key={page.public_id || index}
      className="min-w-[140px] rounded-xl overflow-hidden border bg-white shadow"
    >
      <img
        src={page.url}
        alt={`Page ${index + 1}`}
        className="w-full h-52 object-cover"
      />

      <div className="text-center text-xs py-2 bg-slate-50 font-medium">
        Page {index + 1}
      </div>
    </div>
  ))}
</div>

              {/* INFO */}
              <div className="p-4">

                <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                  {epaper.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  📅{" "}
                  {new Date(
                    epaper.publishDate
                  ).toDateString()}
                </p>

                <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-semibold">
                  📰 {epaper.pages?.length || 0} Pages
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex justify-between p-4 border-t">

                <button
                  onClick={() =>
                    startEdit(epaper)
                  }
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteEpaper(epaper._id)
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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