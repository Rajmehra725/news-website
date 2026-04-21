"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const API = "https://starnewsbackend.onrender.com/api/advertisement";

export default function AdminAdvertisements() {
  const [ads, setAds] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("middle");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  // FETCH ADS
  const fetchAds = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setAds(res.data);
    setLoading(false);
  };

  // HANDLE FILE CHANGE (IMAGE + VIDEO PREVIEW)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files) as File[];

    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(urls);
  };

  // UPLOAD (IMPORTANT FIX FOR VIDEO + IMAGE)
  const upload = async () => {
    setUploading(true);

    const form = new FormData();

    files.forEach((file) => {
      if (file.type.startsWith("video")) {
        form.append("video", file);
      } else {
        form.append("images", file);
      }
    });

    form.append("title", title);
    form.append("link", link);
    form.append("position", position);

    await axios.post(API, form);

    setFiles([]);
    setPreview([]);
    setTitle("");
    setLink("");
    setPosition("middle");

    setUploading(false);
    fetchAds();
  };

  // UPDATE AD
  const updateAd = async (id: string, file: File) => {
    setUploading(true);

    const form = new FormData();
    form.append("image", file);

    await axios.put(`${API}/${id}`, form);

    setUploading(false);
    fetchAds();
  };

  // DELETE SINGLE
  const deleteAd = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchAds();
  };

  // DELETE MULTIPLE
  const deleteMultiple = async () => {
    await axios.post(`${API}/delete-multiple`, {
      ids: selected,
    });

    setSelected([]);
    fetchAds();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-3 md:p-6 space-y-6">

      <h1 className="text-xl md:text-2xl font-bold">
        Advertisement Admin Panel
      </h1>

      {/* FORM */}
      <div className="border rounded-lg p-4 space-y-3">

        <input
          placeholder="Ad Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Ad Link (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="top">Top</option>
          <option value="middle">Middle</option>
          <option value="bottom">Bottom</option>
          <option value="sidebar">Sidebar</option>
        </select>

        <input
          type="file"
          multiple
          onChange={handleChange}
          className="w-full"
        />

        <button
          onClick={upload}
          disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload Advertisement"}
        </button>

        {/* PREVIEW (IMAGE + VIDEO) */}
        {preview.length > 0 && (
          <Swiper slidesPerView={3} spaceBetween={10}>
            {preview.map((file, i) => {
              const isVideo = files[i]?.type.startsWith("video");

              return (
                <SwiperSlide key={i}>
                  {isVideo ? (
                    <video
                      src={file}
                      className="h-24 w-full object-cover rounded"
                      controls
                    />
                  ) : (
                    <img
                      src={file}
                      className="h-24 w-full object-cover rounded"
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

      </div>

      {/* DELETE MULTIPLE */}
      {selected.length > 0 && (
        <button
          onClick={deleteMultiple}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selected.length})
        </button>
      )}

      {/* LOADING */}
      {loading && (
        <div className="h-64 bg-gray-200 animate-pulse rounded" />
      )}

      {/* ADS LIST */}
      {!loading && (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad._id}>
              <div className="border rounded-lg overflow-hidden">

                {/* MEDIA */}
                {ad.mediaType === "video" ? (
                  <video
                    src={ad.url}
                    className="w-full h-60 object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <img
                    src={ad.url}
                    className="w-full h-60 object-cover"
                  />
                )}

                {/* INFO */}
                <div className="p-3 space-y-2">

                  <p className="font-bold">{ad.title}</p>
                  <p className="text-sm text-gray-500">
                    {ad.position}
                  </p>

                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Visit Ad
                  </a>

                  {/* SELECT */}
                  <input
                    type="checkbox"
                    onChange={() =>
                      toggleSelect(ad._id)
                    }
                  />

                  {/* ACTIONS */}
                  <div className="flex gap-2">

                    <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer">
                      Update
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          updateAd(
                            ad._id,
                            e.target.files![0]
                          )
                        }
                      />
                    </label>

                    <button
                      onClick={() => deleteAd(ad._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

    </div>
  );
}