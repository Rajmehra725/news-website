"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Trash2, Plus, Power, Check, Loader } from "lucide-react";

// ✅ Socket
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

// ✅ TYPES
type Ad = {
  _id: string;
  title: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
};

type Breaking = {
  _id: string;
  text: string;
  isActive: boolean;
};

export default function StarNewsAdmin() {
  const [tab, setTab] = useState<"ads" | "breaking">("ads");

  // ================= ADS =================
  const [ads, setAds] = useState<Ad[]>([]);
  const [newAdTitle, setNewAdTitle] = useState("");
  const [newAdImage, setNewAdImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loadingAd, setLoadingAd] = useState(false);
  const [successAd, setSuccessAd] = useState("");

  // ================= BREAKING =================
  const [breaking, setBreaking] = useState<Breaking[]>([]);
  const [newBreaking, setNewBreaking] = useState("");
  const [loadingBreaking, setLoadingBreaking] = useState(false);
  const [successBreaking, setSuccessBreaking] = useState("");

  // ================= FETCH =================
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

  const fetchBreaking = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/breaking");
      setBreaking(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socket.connect();

    fetchAds();
    fetchBreaking();

    socket.on("adsUpdated", fetchAds);
    socket.on("breakingUpdated", fetchBreaking);

    return () => {
      socket.off("adsUpdated");
      socket.off("breakingUpdated");
      socket.disconnect(); // ✅ FIX
    };
  }, []);

  // ================= ADS ACTIONS =================
  const addAd = async () => {
    if (!newAdTitle || !newAdImage) return;

    setLoadingAd(true);
    const formData = new FormData();
    formData.append("title", newAdTitle);
    formData.append("image", newAdImage);
    formData.append("isActive", "true");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAds((prev) => [res.data, ...prev]); // ✅ FIX
      setNewAdTitle("");
      setNewAdImage(null);
      setPreviewImage(null);

      setSuccessAd("Ad added successfully ✅");
      setTimeout(() => setSuccessAd(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAd(false);
    }
  };

  const updateAd = async (id: string, title: string) => {
    setLoadingAd(true);
    const formData = new FormData();
    formData.append("title", title);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/ads/${id}`,
        formData
      );

      setAds((prev) =>
        prev.map((a) => (a._id === id ? res.data : a))
      ); // ✅ FIX

      setSuccessAd("Ad updated ✅");
      setTimeout(() => setSuccessAd(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAd(false);
    }
  };

  const toggleAd = async (id: string) => {
    const res = await axios.patch(
      `http://localhost:5000/api/ads/toggle/${id}`
    );
    setAds((prev) =>
      prev.map((a) => (a._id === id ? res.data : a))
    ); // ✅ FIX
  };

  const deleteAd = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/ads/${id}`);
    setAds((prev) => prev.filter((a) => a._id !== id)); // ✅ FIX
  };

  // ================= BREAKING =================
  const addBreaking = async () => {
    if (!newBreaking) return;

    setLoadingBreaking(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/breaking",
        {
          text: newBreaking,
          isActive: true,
        }
      );

      setBreaking((prev) => [res.data, ...prev]); // ✅ FIX
      setNewBreaking("");

      setSuccessBreaking("Breaking added ✅");
      setTimeout(() => setSuccessBreaking(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBreaking(false);
    }
  };

  const updateBreaking = async (id: string, text: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/breaking/${id}`,
        { text }
      );

      setBreaking((prev) =>
        prev.map((b) => (b._id === id ? res.data : b))
      ); // ✅ FIX

      setSuccessBreaking("Breaking updated ✅");
      setTimeout(() => setSuccessBreaking(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBreaking = async (id: string) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/breaking/toggle/${id}`
      );

      setBreaking((prev) =>
        prev.map((b) => (b._id === id ? res.data : b))
      ); // ✅ FIX
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBreaking = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/breaking/${id}`
      );

      setBreaking((prev) =>
        prev.filter((b) => b._id !== id)
      ); // ✅ FIX
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600">
        🌟 Star News Admin
      </h1>

      {/* TABS */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab("ads")}
          className={`px-4 py-2 rounded ${
            tab === "ads"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Ads
        </button>
        <button
          onClick={() => setTab("breaking")}
          className={`px-4 py-2 rounded ${
            tab === "breaking"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          Breaking
        </button>
      </div>

      {/* SUCCESS */}
      {successAd && <p className="text-green-600">{successAd}</p>}
      {successBreaking && (
        <p className="text-green-600">{successBreaking}</p>
      )}

      {/* ADS */}
      {tab === "ads" && (
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          {/* ADD */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newAdTitle}
              onChange={(e) => setNewAdTitle(e.target.value)}
              placeholder="Title"
              className="border px-2 py-2 flex-1 rounded w-full"
            />

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setNewAdImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }}
              className="w-full sm:w-auto"
            />

            <button
              onClick={addAd}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1 w-full sm:w-auto"
            >
              {loadingAd ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <Plus size={16} />
              )}
              Add
            </button>
          </div>

          {previewImage && (
            <img
              src={previewImage}
              className="h-20 w-40 object-cover rounded"
            />
          )}

          {/* LIST */}
          {ads.map((ad, index) => (
            <div
              key={ad._id}
              className={`flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-3 rounded ${
                index === 1
                  ? "bg-yellow-100 border border-yellow-400"
                  : "bg-gray-50"
              }`}
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
                    className="h-16 w-32 object-cover mt-1 rounded"
                  />
                )}

                {index === 1 && (
                  <span className="text-xs bg-yellow-500 text-white px-2 rounded">
                    Advertisement
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
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
      )}

      {/* BREAKING */}
      {tab === "breaking" && (
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newBreaking}
              onChange={(e) =>
                setNewBreaking(e.target.value)
              }
              className="border px-2 py-2 flex-1 rounded"
              placeholder="Breaking News"
            />
            <button
              onClick={addBreaking}
              className="bg-black text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {loadingBreaking ? "..." : "Add"}
            </button>
          </div>

          {breaking.map((b) => (
            <div
              key={b._id}
              className="flex flex-col sm:flex-row gap-2 justify-between bg-gray-50 p-3 rounded"
            >
              <input
                value={b.text}
                onChange={(e) =>
                  setBreaking((prev) =>
                    prev.map((n) =>
                      n._id === b._id
                        ? { ...n, text: e.target.value }
                        : n
                    )
                  )
                }
                className="border px-2 py-1 flex-1 rounded"
              />

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateBreaking(b._id, b.text)
                  }
                  className="bg-blue-100 p-2 rounded"
                >
                  <Check size={16} />
                </button>

                <button
                  onClick={() =>
                    toggleBreaking(b._id)
                  }
                  className="bg-green-100 p-2 rounded"
                >
                  <Power size={16} />
                </button>

                <button
                  onClick={() =>
                    deleteBreaking(b._id)
                  }
                  className="bg-red-100 p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MARQUEE */}
      <div className="bg-black text-white overflow-hidden rounded">
        <div className="animate-marquee flex whitespace-nowrap py-2">
          <span className="bg-red-600 px-4 mr-4">
            BREAKING
          </span>
          {breaking
            .filter((b) => b.isActive)
            .map((b, i) => (
              <span key={i} className="mx-6">
                🔴 {b.text}
              </span>
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}