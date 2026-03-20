"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type News = {
  _id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  status: string;
  featuredImage: string;
  images: string[];
  views: number;
  shares: number;
  createdAt: string;
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [categories, setCategories] = useState([
    "Politics",
    "Crime",
    "Sports",
    "Education",
    "Local",
  ]);

  const [newCategory, setNewCategory] = useState("");
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
  });

  // 🔥 Fetch News
  const fetchNews = async () => {
    const res = await axios.get("http://localhost:5000/api/news");
    setNewsList(res.data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Featured Image
  const handleFeatured = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedFile(file);
      setForm({ ...form, featuredImage: URL.createObjectURL(file) });
    }
  };

  // Multiple Images
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files: File[] = Array.from(e.target.files);

  setImageFiles((prev) => [...prev, ...files]);

  const previews = files.map((file) => URL.createObjectURL(file));

  setForm((prev: any) => ({
    ...prev,
    images: [...prev.images, ...previews],
  }));
};
  const removeImage = (index: number) => {
    const updatedPreview = form.images.filter((_: any, i: number) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);

    setForm({ ...form, images: updatedPreview });
    setImageFiles(updatedFiles);
  };

  // 🚀 CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      return alert("Title & Description required");
    }

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("content", form.content);
      formData.append("status", form.status);

      if (featuredFile) {
        formData.append("featuredImage", featuredFile);
      }

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (editId) {
        await axios.put(`http://localhost:5000/api/news/${editId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/news", formData);
      }

      fetchNews();
      setOpen(false);
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error saving news");
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
    });
    setFeaturedFile(null);
    setImageFiles([]);
  };

  // ✏️ Edit
  const handleEdit = (item: News) => {
    setForm(item);
    setEditId(item._id);
    setOpen(true);
  };

  // 🗑️ Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete news?")) return;

    await axios.delete(`http://localhost:5000/api/news/${id}`);
    fetchNews();
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📰 News Management</h1>
        <button onClick={() => setOpen(true)} className="bg-red-600 px-5 py-2 rounded">
          + Create News
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full bg-gray-800 rounded"
      />

      {/* Table */}
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
            .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <tr key={item._id} className="border-b">
                <td>{item.title}</td>
                <td>{item.category}</td>

                <td>
                  <button
                    onClick={async () => {
                      await axios.put(`http://localhost:5000/api/news/view/${item._id}`);
                      fetchNews();
                    }}
                  >
                    👁 {item.views}
                  </button>
                </td>

                <td>
                  <button
                    onClick={async () => {
                      await axios.put(`http://localhost:5000/api/news/share/${item._id}`);
                      fetchNews();
                    }}
                  >
                    🔗 {item.shares}
                  </button>
                </td>

                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full mb-2 p-2 bg-gray-800" />

            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full mb-2 p-2 bg-gray-800" />

            <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="w-full mb-2 p-2 bg-gray-800" />

            <select name="category" value={form.category} onChange={handleChange} className="w-full mb-2 p-2 bg-gray-800">
              <option value="">Select</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            <input type="file" onChange={handleFeatured} />
            {form.featuredImage && <img src={form.featuredImage} className="h-32 mt-2" />}

            <input type="file" multiple onChange={handleImage} className="mt-2" />

            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((img: string, i: number) => (
                <div key={i}>
                  <img src={img} className="w-20 h-20" />
                  <button onClick={() => removeImage(i)}>X</button>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} className="bg-green-600 mt-4 px-4 py-2">
              Save
            </button>

          </div>
        </div>
      )}
    </div>
  );
}