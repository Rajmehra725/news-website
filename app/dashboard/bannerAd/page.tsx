"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const API = "http://localhost:5000/api/banners";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setBanners(res.data);
    setLoading(false);
  };

  // preview
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files: File[] = Array.from(e.target.files);

  setImages(files);

  const urls = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreview(urls);
};

  // upload
  const upload = async () => {
    setUploading(true);

    const form = new FormData();

    images.forEach((img) => {
      form.append("images", img);
    });

    await axios.post(API, form);

    setImages([]);
    setPreview([]);
    setUploading(false);

    fetchBanners();
  };

  // update
  const updateBanner = async (id: string, file: File) => {
    setUploading(true);

    const form = new FormData();
    form.append("image", file);

    await axios.put(`${API}/${id}`, form);

    setUploading(false);
    fetchBanners();
  };

  // delete
  const deleteBanner = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchBanners();
  };

  // delete multiple
  const deleteMultiple = async () => {
    await axios.delete(API, {
      data: { ids: selected },
    });

    setSelected([]);
    fetchBanners();
  };

  // like
  const like = async (id: string) => {
    await axios.post(`${API}/like/${id}`);
    fetchBanners();
  };

  // share
  const share = async (id: string) => {
    await axios.post(`${API}/share/${id}`);
    fetchBanners();
  };

  // view
  const view = async (id: string) => {
    await axios.post(`${API}/view/${id}`);
  };

  // comment add
  const addComment = async (id: string) => {
    await axios.post(`${API}/comment/${id}`, {
      text: comment,
    });

    setComment("");
    fetchBanners();
  };

  // comment delete
  const deleteComment = async (
    bannerId: string,
    commentId: string
  ) => {
    await axios.delete(
      `${API}/comment/${bannerId}/${commentId}`
    );

    fetchBanners();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-3 md:p-6 space-y-5">

      <h1 className="text-xl md:text-2xl font-bold">
        Banner Admin Panel
      </h1>

      {/* Upload Box */}
      <div className="border rounded-lg p-3 md:p-4 space-y-3">

        <input
          type="file"
          multiple
          onChange={handleChange}
          className="w-full"
        />

        <button
          onClick={upload}
          disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded w-full md:w-auto"
        >
          {uploading ? "Uploading..." : "Upload Banner"}
        </button>

        {/* preview */}
        {preview.length > 0 && (
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {preview.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  className="h-28 md:h-32 w-full object-cover rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>

      {/* delete multiple */}
      {selected.length > 0 && (
        <button
          onClick={deleteMultiple}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selected.length})
        </button>
      )}

      {/* loading skeleton */}
      {loading && (
        <div className="h-64 bg-gray-200 animate-pulse rounded" />
      )}

      {/* banners */}
      {!loading && (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
          className="rounded-lg"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>

              <div className="border rounded-lg overflow-hidden">

                <img
                  src={banner.image}
                  className="w-full h-60 md:h-72 object-cover"
                  onClick={() => view(banner._id)}
                />

                <div className="p-3 space-y-2">

                  {/* actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2">

                    <input
                      type="checkbox"
                      onChange={() =>
                        toggleSelect(banner._id)
                      }
                    />

                    <button
                      onClick={() => like(banner._id)}
                    >
                      ❤️ {banner.likes}
                    </button>

                    <button
                      onClick={() => share(banner._id)}
                    >
                      🔗 {banner.shares}
                    </button>

                    <span>
                      👁 {banner.views}
                    </span>

                    <span>
                      💬 {banner.comments.length}
                    </span>

                  </div>

                  {/* update delete */}
                  <div className="flex gap-2">

                    <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer">
                      Update
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          updateBanner(
                            banner._id,
                            e.target.files![0]
                          )
                        }
                      />
                    </label>

                    <button
                      onClick={() =>
                        deleteBanner(banner._id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                  {/* comment */}
                  <div className="flex gap-2">
                    <input
                      placeholder="Add comment"
                      className="border px-2 py-1 flex-1 rounded"
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                    />

                    <button
                      onClick={() =>
                        addComment(banner._id)
                      }
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      Post
                    </button>
                  </div>

                  {/* comments */}
                  {banner.comments.map((c: any) => (
                    <div
                      key={c._id}
                      className="flex justify-between bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{c.text}</span>

                      <button
                        onClick={() =>
                          deleteComment(
                            banner._id,
                            c._id
                          )
                        }
                      >
                        🗑
                      </button>
                    </div>
                  ))}

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      )}

    </div>
  );
}