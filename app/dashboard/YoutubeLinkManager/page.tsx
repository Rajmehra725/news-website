"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";

type Link = {
  _id: string;
  channelName: string;
  link: string;
};

export default function AdminYoutube() {
  const [links, setLinks] = useState<Link[]>([]);
  const [channelName, setChannelName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // for add/delete button

  // Fetch all links
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://starnewsbackend.onrender.com/api/youtube/all");
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Add a link
  const addLink = async () => {
    if (!channelName || !link) return alert("Fill all fields");
    setActionLoading(true);
    try {
      await axios.post("https://starnewsbackend.onrender.com/api/youtube/add", { channelName, link });
      setChannelName("");
      setLink("");
      fetchLinks();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a link
  const deleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`https://starnewsbackend.onrender.com/api/youtube/delete/${id}`);
      fetchLinks();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">YouTube Channel Management</h1>

        {/* Create Section */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="YouTube Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border p-2 rounded w-full md:w-2/3"
          />
          <button
            onClick={addLink}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            <PlusCircle size={20} />
            {actionLoading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Links Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading channels...</div>
        ) : links.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No channels added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 font-semibold text-gray-700">Channel Name</th>
                  <th className="p-3 font-semibold text-gray-700">Link</th>
                  <th className="p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{l.channelName}</td>
                    <td className="p-3 text-blue-600 hover:underline">
                      <a href={l.link} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteLink(l._id)}
                        disabled={actionLoading}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                        {actionLoading ? "Processing..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}