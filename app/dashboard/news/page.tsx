"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Section = {
  heading?: string;
  content: string;
  image?: string;

  headingBgColor?: string;
  headingTextColor?: string;

  contentBgColor?: string;
  contentTextColor?: string;
};
type News = {
  _id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  status: string;
  featuredImage: string;
  images: string[];
  sections?: Section[];
  views: number;
  shares: number;
  createdAt: string;
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [categories] = useState([
    "Politics",
    "Crime",
    "Sports",
    "Education",
    "Local",
  ]);

  const [search, setSearch] = useState("");

  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    category: "",
    content: "",
    status: "draft",
    featuredImage: "",
    images: [],
    sections: [
      {
        heading: "",
        content: "",
        image: "",
        bgColor: "#ffffff",
        textColor: "#000000",
      },
    ],
  });

  const fetchNews = async () => {
    const res = await axios.get("https://starnewsbackend.onrender.com/api/news");
    setNewsList(res.data);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatured = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedFile(file);
      setForm({ ...form, featuredImage: URL.createObjectURL(file) });
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files: File[] = Array.from(e.target.files as FileList);

    setImageFiles((prev: File[]) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setForm((prev: any) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_: any, i: number) => i !== index),
    });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (item: News) => {
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      content: item.content || "",
      status: item.status || "draft",
      featuredImage: item.featuredImage || "",
      images: item.images || [],
      sections:
        item.sections && item.sections.length > 0
          ? item.sections
          : [
              {
                heading: "",
                content: "",
                image: "",
                bgColor: "#ffffff",
                textColor: "#000000",
              },
            ],
    });

    setFeaturedFile(null);
    setImageFiles([]);

    setEditId(item._id);
    setOpen(true);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const newSections = [...form.sections];
    (newSections[index] as any)[field] = value;
    setForm({ ...form, sections: newSections });
  };

  const addSection = () => {
    setForm({
      ...form,
      sections: [
        ...form.sections,
        {
  heading: "",
  content: "",
  image: "",
  headingBgColor: "#ffffff",
  headingTextColor: "#000000",
  contentBgColor: "#ffffff",
  contentTextColor: "#000000",
},
      ],
    });
  };

  const removeSection = (index: number) => {
    const newSections = [...form.sections];
    newSections.splice(index, 1);
    setForm({ ...form, sections: newSections });
  };

  const handleSubmit = async (statusType = "draft") => {
  if (!form.title || !form.description) return alert("Required");

  setSaving(true);
  try {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("content", form.content);

    // 🔥 सबसे important fix
    formData.append("status", statusType);

    formData.append("sections", JSON.stringify(form.sections));

    if (featuredFile) {
      formData.append("featuredImage", featuredFile);
    }

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    console.log("🚀 Sending status:", statusType);

    if (editId) {
      await axios.put(
        `https://starnewsbackend.onrender.com/api/news/${editId}`,
        formData
      );
    } else {
      await axios.post(
        "https://starnewsbackend.onrender.com/api/news",
        formData
      );
    }

    fetchNews();
    setOpen(false);
    setEditId(null);
    resetForm();
  } catch {
    alert("Error");
  } finally {
    setSaving(false);
  }
};

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      content: "",
      status: "draft",
      featuredImage: "",
      images: [],
      sections: [
       {
  heading: "",
  content: "",
  image: "",
  headingBgColor: "#ffffff",
  headingTextColor: "#000000",
  contentBgColor: "#ffffff",
  contentTextColor: "#000000",
},
      ],
    });
    setFeaturedFile(null);
    setImageFiles([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    setLoadingId(id);
    await axios.delete(`https://starnewsbackend.onrender.com/api/news/${id}`);
    fetchNews();
    setLoadingId(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-black text-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold">📰 News</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-red-600 px-4 py-2 rounded w-full sm:w-auto"
        >
          + Create
        </button>
      </div>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full bg-gray-800 rounded"
      />

      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Shares</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {newsList
              .filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <tr key={item._id} className="border-b">
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>👁 {item.views}</td>
                  <td>🔗 {item.shares}</td>

                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>
                      {loadingId === item._id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {newsList
          .filter((n) =>
            n.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <div key={item._id} className="bg-gray-900 p-3 rounded space-y-2">
              <h2 className="font-bold text-sm">{item.title}</h2>
              <p className="text-xs">{item.category}</p>

              <div className="flex justify-between text-xs">
                <span>👁 {item.views}</span>
                <span>🔗 {item.shares}</span>
              </div>

              <div className="flex justify-between">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>
                  {loadingId === item._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex justify-center items-center p-3">
          <div className="bg-gray-900 p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mb-2 p-2 bg-gray-800"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input type="file" onChange={handleFeatured} />
            {form.featuredImage && (
              <img src={form.featuredImage} className="h-24 mt-2" />
            )}

            <input
              type="file"
              multiple
              onChange={handleImage}
              className="mt-2"
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img: string, i: number) => (
                <div key={i}>
                  <img src={img} className="w-16 h-16" />
                  <button onClick={() => removeImage(i)}>X</button>
                </div>
              ))}
            </div>

            {/* 🔥 Sections Editor */}
            <div className="mt-4 space-y-3">
              <h3 className="font-bold">Sections</h3>
              {form.sections.map((section: Section, idx: number) => (
                <div key={idx} className="border p-2 rounded space-y-2">
                  <input
                    type="text"
                    placeholder="Heading"
                    value={section.heading}
                    onChange={(e) =>
                      handleSectionChange(idx, "heading", e.target.value)
                    }
                    className="w-full p-1 bg-gray-800"
                  />
                  <textarea
                    placeholder="Content"
                    value={section.content}
                    onChange={(e) =>
                      handleSectionChange(idx, "content", e.target.value)
                    }
                    className="w-full p-1 bg-gray-800"
                  />
                 <div className="grid grid-cols-2 gap-2">

  <label className="flex items-center gap-1 text-xs">
    Heading BG
    <input
      type="color"
      value={section.headingBgColor}
      onChange={(e) =>
        handleSectionChange(idx, "headingBgColor", e.target.value)
      }
    />
  </label>

  <label className="flex items-center gap-1 text-xs">
    Heading Text
    <input
      type="color"
      value={section.headingTextColor}
      onChange={(e) =>
        handleSectionChange(idx, "headingTextColor", e.target.value)
      }
    />
  </label>

  <label className="flex items-center gap-1 text-xs">
    Content BG
    <input
      type="color"
      value={section.contentBgColor}
      onChange={(e) =>
        handleSectionChange(idx, "contentBgColor", e.target.value)
      }
    />
  </label>

  <label className="flex items-center gap-1 text-xs">
    Content Text
    <input
      type="color"
      value={section.contentTextColor}
      onChange={(e) =>
        handleSectionChange(idx, "contentTextColor", e.target.value)
      }
    />
  </label>
                    <button
                      onClick={() => removeSection(idx)}
                      className="bg-red-600 px-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addSection}
                className="bg-green-600 px-4 py-1 rounded"
              >
                + Add Section
              </button>
            </div>

            <div className="flex gap-3 mt-4">
  {/* Draft Button */}
  <button
    onClick={() => handleSubmit("draft")}
    disabled={saving}
    className={`px-4 py-2 rounded text-white ${
      saving ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500"
    }`}
  >
    {saving ? "Saving..." : "Save Draft"}
  </button>

  {/* Publish Button */}
  <button
    onClick={() => handleSubmit("published")}
    disabled={saving}
    className={`px-4 py-2 rounded text-white ${
      saving ? "bg-green-400 cursor-not-allowed" : "bg-green-600"
    }`}
  >
    {saving ? "Publishing..." : "🚀 Publish & Send Notification"}
  </button>
</div>

            <button
              onClick={() => {
                setOpen(false);
                resetForm();
                setEditId(null);
              }}
              className="bg-gray-500 mt-2 px-4 py-2 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}