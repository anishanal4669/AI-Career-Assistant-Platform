"use client";
import { useState } from "react";

export default function ReviewProfile() {
  const [submitted, setSubmitted] = useState(false);

  // Mock data (simulating collected info)
  const resumeName = "resume.pdf";
  const interests = ["AI / Machine Learning", "Frontend Development"];
  const regions = ["India", "Remote"];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Review Career Profile
        </h2>

        {!submitted ? (
          <>
            <div className="mb-4">
              <strong>Resume:</strong>
              <p>{resumeName}</p>
            </div>

            <div className="mb-4">
              <strong>Interest Areas:</strong>
              <ul className="list-disc ml-5">
                {interests.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <strong>Preferred Regions:</strong>
              <ul className="list-disc ml-5">
                {regions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white p-2 rounded"
            >
              Submit Profile
            </button>
          </>
        ) : (
          <div className="text-green-600 text-center font-semibold">
            Profile submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}