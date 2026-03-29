"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://starnewsbackend.onrender.com");

type Comment = {
  _id: string;
  text: string;
  visitorId: string;
};

type News = {
  _id: string;
  title: string;
  description: string;
  featuredImage: string;
  images: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  createdAt: string;
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);

  // 🔥 UNIQUE VISITOR
  const visitorId =
    typeof window !== "undefined"
      ? localStorage.getItem("visitorId") ||
        crypto.randomUUID()
      : "";

  if (typeof window !== "undefined") {
    localStorage.setItem("visitorId", visitorId);
  }

  // 📥 FETCH NEWS
  const fetchNews = async () => {
    const res = await axios.get("https://starnewsbackend.onrender.com/api/satna");
    setNewsList(res.data);

    // join socket rooms
    res.data.forEach((n: News) => {
      socket.emit("joinNews", n._id);
    });
  };

 useEffect(() => {
  fetchNews();

  socket.on("likeUpdated", ({ newsId, likes }) => {
    setNewsList((prev) =>
      prev.map((n) => (n._id === newsId ? { ...n, likes } : n))
    );
  });

  socket.on("newComment", ({ newsId, comment }) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n._id === newsId
          ? { ...n, comments: [...n.comments, comment] }
          : n
      )
    );
  });

  socket.on("commentDeleted", ({ newsId, commentId }) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n._id === newsId
          ? {
              ...n,
              comments: n.comments.filter(
                (c) => c._id !== commentId
              ),
            }
          : n
      )
    );
  });

  socket.on("viewUpdated", ({ newsId, views }) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n._id === newsId ? { ...n, views } : n
      )
    );
  });

  socket.on("shareUpdated", ({ newsId, shares }) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n._id === newsId ? { ...n, shares } : n
      )
    );
  });

  // ✅ CLEANUP FIX
  return () => {
    socket.off();        // remove listeners
    // socket.disconnect(); ❌ (optional, only if needed)
  };

}, []);

  // 👁️ VIEW
  const handleView = async (id: string) => {
    socket.emit("joinNews", id);

    await axios.post(
      `https://starnewsbackend.onrender.com/api/interactions/view/${id}`,
      { visitorId }
    );
  };

  // ❤️ LIKE
  const handleLike = async (id: string) => {
    await axios.post(
      `https://starnewsbackend.onrender.com/api/interactions/like/${id}`,
      { visitorId }
    );
  };

  // 💬 COMMENT
  const handleComment = async (id: string, text: string) => {
    if (!text) return;

    await axios.post(
      `https://starnewsbackend.onrender.com/api/interactions/comment/${id}`,
      { text, visitorId }
    );
  };

  // ❌ DELETE
  const deleteComment = async (nid: string, cid: string) => {
    await axios.delete(
      `https://starnewsbackend.onrender.com/api/interactions/comment/${nid}/${cid}`
    );
  };

  // 🔗 SHARE
  const handleShare = async (news: News) => {
    await axios.post(
      `https://starnewsbackend.onrender.com/api/interactions/share/${news._id}`,
      { visitorId }
    );

    const url = `${window.location.origin}/news/${news._id}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        news.title + " " + url
      )}`
    );
  };

  const hero = newsList[0];

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🔴 HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-red-500 text-white px-6 py-3 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-extrabold">STAR NEWS SATNA</h1>
        <span className="bg-white text-red-600 px-2 py-1 text-xs rounded">
          LIVE
        </span>
      </div>

      <div className="p-4 space-y-6">

        {/* 🔥 HERO */}
        {hero && hero.featuredImage && (
          <div
            onClick={() => handleView(hero._id)}
            className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={hero.featuredImage}
              className="w-full h-[300px] object-cover"
            />

            <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
              <span className="bg-red-600 px-2 py-1 text-xs rounded">
                TOP STORY
              </span>
              <h2 className="text-xl font-bold mt-2">
                {hero.title}
              </h2>
            </div>
          </div>
        )}

        {/* 📰 GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {newsList.map((news) => (
            <div
              key={news._id}
              onClick={() => handleView(news._id)}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={news.featuredImage}
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  BREAKING
                </span>
              </div>

              <div className="p-4 space-y-2">

                <h2 className="font-bold text-gray-900 line-clamp-2">
                  {news.title}
                </h2>

                <p className="text-xs text-gray-400">
                  {new Date(news.createdAt).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {news.description}
                </p>

                {/* STATS */}
                <div className="flex justify-between text-sm border-t pt-2">

                  <span>👁️ {news.views}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(news._id);
                    }}
                    className="text-red-500"
                  >
                    ❤️ {news.likes}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(news);
                    }}
                    className="text-green-600"
                  >
                    🔗 {news.shares}
                  </button>
                </div>

                {/* COMMENTS */}
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs">
                  {news.comments?.map((c) => (
                    <div
                      key={c._id}
                      className="flex justify-between bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{c.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComment(news._id, c._id);
                        }}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* COMMENT INPUT */}
                <input
                  placeholder="Write comment..."
                  className="w-full border px-2 py-1 text-sm rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleComment(
                        news._id,
                        e.currentTarget.value
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}