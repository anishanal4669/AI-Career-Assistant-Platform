"use client";
import { useState } from "react";

export default function UploadResume() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    // Simulating upload
    setUploaded(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Resume
        </h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />

        {selectedFile && (
          <p className="text-sm mb-4">
            Selected File: {selectedFile.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-black text-white p-2 rounded"
        >
          Upload
        </button>

        {uploaded && (
          <p className="text-green-600 mt-4 text-center">
            Resume uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
}