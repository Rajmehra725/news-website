"use client";
import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Logo from "../public/logo.jpeg";

type ProfessionalIdCardProps = {
  name: string;
  designation: string;
  organization: string;
  photoUrl?: string; // now just url string
  employeeId: string;
  validTill: string;
};

const ProfessionalIdCard = forwardRef<HTMLDivElement, ProfessionalIdCardProps>(
  ({ name, designation, organization, photoUrl, employeeId, validTill }, ref) => {
    return (
      <div
        ref={ref}
        className="w-96 h-52 bg-gradient-to-r from-red-50 to-white rounded-2xl shadow-2xl border-2 border-red-600 p-4 relative font-sans overflow-hidden"
      >
        {/* Watermark */}
        <div className="absolute inset-0 opacity-5 flex justify-center items-center">
          <span className="text-7xl font-bold text-red-600 select-none">STAR NEWS</span>
        </div>

        {/* Top info */}
        <div className="absolute top-2 left-4 text-xs text-gray-600 z-10">
          <div>ID: {employeeId}</div>
          <div>Valid: {validTill}</div>
        </div>

        <div className="flex justify-between items-center z-10 relative h-full mt-4">
          {/* Left: Logo + Text */}
          <div className="flex flex-col justify-center h-full">
            <div className="flex items-center space-x-3">
              <img src={Logo.src} alt="Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">{name}</h1>
                <p className="text-sm text-gray-500">{designation}</p>
                <p className="text-sm font-semibold text-red-600">{organization}</p>
              </div>
            </div>
          </div>

          {/* Right: Photo + QR */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src={photoUrl || "/default-profile.png"}
              alt="Photo"
              className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md object-cover"
            />
            <QRCodeSVG value={`https://starnews.com/verify/${employeeId}`} size={60} />
          </div>
        </div>

        {/* Signature */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 z-10">
         Signature
        </div>
      </div>
    );
  }
);

export default ProfessionalIdCard;