"use client";
import React, { useRef, useState, useEffect } from "react";
import ProfessionalIdCard from "../../../components/ProfessionalIdCard";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

interface IdCard {
  _id: string;
  name: string;
  designation: string;
  organization: string;
  employeeId: string;
  validTill: string;
  photoUrl?: string;
}

export default function IdCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("Star News");
  const [photoFile, setPhotoFile] = useState<File>();

  const [cards, setCards] = useState<IdCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<IdCard | null>(null);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch
  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://starnewsbackend.onrender.com/api/idcards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Save
  const handleSave = async () => {
    if (!name || !designation) return alert("Fill all fields");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("organization", organization);
    if (photoFile) formData.append("photo", photoFile);

    try {
      const res = await fetch(
        "https://starnewsbackend.onrender.com/api/idcards",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setCards((prev) => [...prev, data]);

      setName("");
      setDesignation("");
      setPhotoFile(undefined);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Delete
  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch(`https://starnewsbackend.onrender.com/api/idcards/${id}`, {
      method: "DELETE",
    });
    setCards((prev) => prev.filter((c) => c._id !== id));
    setLoading(false);
  };

  // Download
 const handleDownload = async (card: IdCard) => {
  setSelectedCard(card);
  setDownloading(true);

  setTimeout(async () => {
    try {
      if (cardRef.current) {
        const dataUrl = await htmlToImage.toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#ffffff"
        });

        download(dataUrl, `${card.name}-idcard.png`);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }

    setDownloading(false);
  }, 800);
};
  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-red-600 text-center mb-4">
        Star News ID Cards Dashboard
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-center text-blue-500 mb-4">Loading...</p>
      )}

      {/* Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-md mx-auto space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md text-sm sm:text-base"
        />

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full p-2 border rounded-md text-sm sm:text-base"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && setPhotoFile(e.target.files[0])
          }
          className="w-full p-2 border rounded-md text-sm"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
        >
          {loading ? "Saving..." : "Save ID Card"}
        </button>
      </div>

      {/* Cards */}
      <div className="
        mt-6
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4 
        max-w-6xl 
        mx-auto
      ">
        {cards.map((card) => (
          <div
            key={card._id}
            className="bg-white p-3 sm:p-4 rounded-xl shadow-md"
          >
            <div className="flex justify-center">
              <ProfessionalIdCard
                name={card.name}
                designation={card.designation}
                organization={card.organization}
                employeeId={card.employeeId}
                validTill={card.validTill}
                photoUrl={`https://starnewsbackend.onrender.com${card.photoUrl}`}
              />
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDownload(card)}
                className="flex-1 bg-red-600 text-white py-1.5 rounded-md text-sm"
              >
                {downloading ? "Downloading..." : "Download"}
              </button>

              <button
                onClick={() => handleDelete(card._id)}
                className="flex-1 bg-gray-500 text-white py-1.5 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Card */}
      {selectedCard && (
        <div className="fixed -left-[9999px] top-0">
          <div ref={cardRef}>
            <ProfessionalIdCard
              name={selectedCard.name}
              designation={selectedCard.designation}
              organization={selectedCard.organization}
              employeeId={selectedCard.employeeId}
              validTill={selectedCard.validTill}
              photoUrl={`https://starnewsbackend.onrender.com${selectedCard.photoUrl}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}