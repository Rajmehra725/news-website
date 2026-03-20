"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Power, Check, Loader } from "lucide-react";

type Ad = {
  _id: string;
  title: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch
  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ads");
      setAds(
        res.data.sort(
          (a: Ad, b: Ad) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // 🔹 Add
  const addAd = async () => {
    if (!title || !image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ads",
        formData
      );

      setAds((prev) => [res.data, ...prev]);
      setTitle("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update
  const updateAd = async (id: string, title: string) => {
    const formData = new FormData();
    formData.append("title", title);

    const res = await axios.put(
      `http://localhost:5000/api/ads/${id}`,
      formData
    );

    setAds((prev) =>
      prev.map((a) => (a._id === id ? res.data : a))
    );
  };

  // 🔹 Toggle
  const toggleAd = async (id: string) => {
    const res = await axios.patch(
      `http://localhost:5000/api/ads/toggle/${id}`
    );

    setAds((prev) =>
      prev.map((a) => (a._id === id ? res.data : a))
    );
  };

  // 🔹 Delete
  const deleteAd = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/ads/${id}`);
    setAds((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-5">
      <h2 className="text-xl font-semibold text-red-600">
        Ads Manager
      </h2>

      {/* Add */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ad title"
          className="border px-3 py-2 flex-1 rounded"
        />

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        <button
          onClick={addAd}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1"
        >
          {loading ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <Plus size={16} />
          )}
          Add
        </button>
      </div>

      {preview && (
        <img src={preview} className="h-20 w-40 rounded" />
      )}

      {/* List */}
      <div className="space-y-3">
        {ads.map((ad) => (
          <div
            key={ad._id}
            className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-3 bg-gray-50 rounded"
          >
            <div className="flex-1 w-full">
              <input
                value={ad.title}
                onChange={(e) =>
                  setAds((prev) =>
                    prev.map((a) =>
                      a._id === ad._id
                        ? { ...a, title: e.target.value }
                        : a
                    )
                  )
                }
                className="border px-2 py-1 w-full rounded"
              />

              {ad.image && (
                <img
                  src={
                    ad.image.startsWith("http")
                      ? ad.image
                      : `http://localhost:5000/${ad.image}`
                  }
                  className="h-16 w-32 mt-2 rounded"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateAd(ad._id, ad.title)}
                className="bg-blue-100 p-2 rounded"
              >
                <Check size={16} />
              </button>

              <button
                onClick={() => toggleAd(ad._id)}
                className="bg-green-100 p-2 rounded"
              >
                <Power size={16} />
              </button>

              <button
                onClick={() => deleteAd(ad._id)}
                className="bg-red-100 p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}