"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type Ad = {
  _id?: string;
  title: string;
  link: string;
  position: "top" | "middle" | "bottom";
  image?: string;
  video?: string;
  mediaType: "image" | "video";
};

export default function AdvertisementAdmin() {
  const API = "https://starnewsbackend.onrender.com/api/advertisement";

  const [ads, setAds] = useState<Ad[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Ad>({
    title: "",
    link: "",
    position: "middle",
    mediaType: "image",
    image: "",
    video: ""
  });

  const [editId, setEditId] = useState<string | null>(null);

  // 🔄 GET ADS
  const fetchAds = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // ✏️ INPUT
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📁 FILE
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // 🚀 CREATE / UPDATE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("link", form.link);
    data.append("position", form.position);
    data.append("mediaType", mediaType);

    if (file) {
      data.append("file", file); // 👈 backend expects "file"
    }

    let url = API;
    let method = "POST";

    if (editId) {
      url = `${API}/${editId}`;
      method = "PUT";
    }

    await fetch(url, {
      method,
      body: data
    });

    setForm({
      title: "",
      link: "",
      position: "middle",
      mediaType: "image",
      image: "",
      video: ""
    });

    setFile(null);
    setEditId(null);

    await fetchAds();
    setLoading(false);
  };

  // ❌ DELETE
  const handleDelete = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchAds();
  };

  // ✏️ EDIT
  const handleEdit = (ad: Ad) => {
    setForm(ad);
    setMediaType(ad.mediaType);
    setEditId(ad._id || null);
  };

  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-red-600 text-white p-4 rounded-xl shadow mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          STAR NEWS - Advertisement Panel
        </h1>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">

        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Update Advertisement" : "Upload Advertisement"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ad Title"
            className="border p-2 w-full rounded"
          />

          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Ad Link"
            className="border p-2 w-full rounded"
          />

          {/* MEDIA TYPE SELECT */}
          <select
            value={mediaType}
            onChange={(e) =>
              setMediaType(e.target.value as "image" | "video")
            }
            className="border p-2 w-full rounded"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept={mediaType === "video" ? "video/*" : "image/*"}
            onChange={handleFile}
            className="border p-2 w-full rounded"
          />

          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            {loading
              ? "Uploading..."
              : editId
              ? "Update Advertisement"
              : "Upload Advertisement"}
          </button>

        </form>
      </div>

      {/* ADS LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {ads.map((ad) => (
          <div
            key={ad._id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            {/* IMAGE */}
            {ad.mediaType === "image" && ad.image && (
              <img
                src={`https://starnewsbackend.onrender.com${ad.image}`}
                className="w-full h-40 object-cover"
              />
            )}

            {/* VIDEO */}
            {ad.mediaType === "video" && ad.video && (
              <video
                src={`https://starnewsbackend.onrender.com${ad.video}`}
                className="w-full h-40 object-cover"
                controls
              />
            )}

            <div className="p-3 space-y-1">

              <h3 className="font-bold">{ad.title}</h3>

              <p className="text-sm text-gray-500">
                Position: {ad.position}
              </p>

              <a
                href={ad.link}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                Visit Link
              </a>

              <div className="flex gap-2 mt-2">

                <button
                  onClick={() => handleEdit(ad)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(ad._id!)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
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