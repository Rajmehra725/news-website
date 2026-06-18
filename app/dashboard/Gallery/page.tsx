"use client";
import { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   TYPES
========================= */
type ImageType = {
  public_id: string;
  url: string;
};

type Album = {
  _id: string;
  title: string;
  description: string;
  images: ImageType[];
};

/* =========================
   API
========================= */
const API = axios.create({
  baseURL: "https://starnewsbackend.onrender.com/api", // ✅ FIXED PORT
});

/* =========================
   COMPONENT
========================= */
export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const [editId, setEditId] = useState<string | null>(null);

  /* =========================
     FIX IMAGE URL
  ========================= */
  const fixUrl = (url: string) =>
    url?.startsWith("http")
      ? url
      : `https://starnewsbackend.onrender.com/${url?.replace(/\\/g, "/")}`;

  /* =========================
     FETCH ALBUMS
  ========================= */
  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await API.get("/gallery");
      const data = res.data?.albums || res.data?.data || res.data;

      setAlbums(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAlbums([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      if (editId) {
        await API.put(`/gallery/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/gallery", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchAlbums();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteAlbum = async (id: string) => {
    try {
      await API.delete(`/gallery/${id}`);
      fetchAlbums();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     EDIT
  ========================= */
  const startEdit = (album: Album) => {
    setEditId(album._id);
    setTitle(album.title);
    setDescription(album.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =========================
     RESET
  ========================= */
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImages(null);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">

      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-gray-800">
          📸 Premium News Gallery
        </h1>
        <p className="text-gray-500 mt-1">
          Manage albums in a modern elegant UI
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xl border shadow-xl rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">
          {editId ? "Update Album ✏️" : "Create Album ➕"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            multiple
            className="w-full"
            onChange={(e) => setImages(e.target.files)}
          />

          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow">
              {editId ? "Update" : "Create"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : albums.length === 0 ? (
        <div className="text-center text-gray-400">
          No albums found
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album._id}
              className="bg-white/80 backdrop-blur-xl border shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
            >
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {album.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {album.description}
                </p>
              </div>

              {/* IMAGES */}
              <div className="grid grid-cols-3 gap-1 p-2">
                {album.images.map((img, i) => (
                  <img
                    key={i}
                    src={fixUrl(img.url)}
                    className="w-full h-24 object-cover rounded-lg hover:scale-105 transition"
                  />
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between p-4">
                <button
                  onClick={() => startEdit(album)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAlbum(album._id)}
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