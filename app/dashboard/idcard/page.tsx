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

  const fetchCards = async () => {
    const res = await fetch("https://starnewsbackend.onrender.com/api/idcards");
    const data = await res.json();
    setCards(data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("organization", organization);
    if (photoFile) formData.append("photo", photoFile);

    const res = await fetch("https://starnewsbackend.onrender.com/api/idcards", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setCards(prev => [...prev, data]);
    setName("");
    setDesignation("");
    setPhotoFile(undefined);
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://starnewsbackend.onrender.com/api/idcards/${id}`, { method: "DELETE" });
    setCards(prev => prev.filter(c => c._id !== id));
  };

  const handleDownload = async (card: IdCard) => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      download(dataUrl, `${card.name}-idcard.png`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Star News ID Cards Dashboard</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleSave}
          className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
        >
          Save ID Card
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {cards.map(card => (
          <div key={card._id} className="bg-white p-4 rounded-xl shadow-md space-y-2">
            <ProfessionalIdCard
              ref={cardRef}
              name={card.name}
              designation={card.designation}
              organization={card.organization}
              employeeId={card.employeeId}
              validTill={card.validTill}
              photoUrl={`https://starnewsbackend.onrender.com${card.photoUrl}`}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleDownload(card)}
                className="bg-red-600 text-white p-1 rounded-md text-sm hover:bg-red-700"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(card._id)}
                className="bg-gray-400 text-white p-1 rounded-md text-sm hover:bg-gray-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Preview for Download (optional) */}
      {selectedCard && (
        <div className="hidden">
          <ProfessionalIdCard
            ref={cardRef}
            name={selectedCard.name}
            designation={selectedCard.designation}
            organization={selectedCard.organization}
            employeeId={selectedCard.employeeId}
            validTill={selectedCard.validTill}
            photoUrl={selectedCard.photoUrl}
          />
        </div>
      )}
    </div>
  );
}