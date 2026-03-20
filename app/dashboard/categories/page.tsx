"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([
    "Business",
    "Politics",
    "Tech",
  ]);

  const [newCategory, setNewCategory] = useState("");

  // ➕ Add Category
  const addCategory = () => {
    if (!newCategory.trim()) return;

    setCategories((prev) => [...prev, newCategory]);
    setNewCategory("");
  };

  // ❌ Delete Category
  const deleteCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">

      {/* 🔥 Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Categories
        </h1>
        <p className="text-sm text-gray-500">
          Manage news categories
        </p>
      </div>

      {/* ➕ Add Category */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-3">
        
        <input
          type="text"
          placeholder="Enter category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <button
          onClick={addCategory}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Add Category
        </button>
      </div>

      {/* 📊 Categories List */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border">
        
        <h2 className="text-sm font-semibold text-gray-600 mb-3">
          All Categories
        </h2>

        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-gray-50 transition"
              >
                <span className="text-gray-700">{cat}</span>

                <button
                  onClick={() => deleteCategory(i)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No categories found
            </p>
          )}
        </div>

      </div>

    </div>
  );
}