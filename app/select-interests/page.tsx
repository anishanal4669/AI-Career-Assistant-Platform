"use client";
import { useState } from "react";

export default function SelectInterests() {
  const interestOptions = [
    "AI / Machine Learning",
    "Backend Development",
    "Frontend Development",
    "DevOps",
    "Data Engineering",
    "Cloud Engineering",
    "Cybersecurity",
  ];

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleCheckboxChange = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      // Remove if already selected
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      // Add if not selected
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

 return (
  <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Select Interest Areas
      </h2>

      {interestOptions.map((interest) => (
        <div key={interest} className="mb-3 text-black">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedInterests.includes(interest)}
              onChange={() => handleCheckboxChange(interest)}
              className="mr-3 accent-black"
            />
            {interest}
          </label>
        </div>
      ))}

      {selectedInterests.length > 0 && (
        <div className="mt-4 text-sm text-black">
          <strong>Selected:</strong>
          <ul className="list-disc ml-5 mt-2">
            {selectedInterests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);
}