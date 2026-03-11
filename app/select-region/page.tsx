"use client";
import { useState } from "react";

export default function SelectRegion() {
  const regionOptions = [
    "North America",
    "Europe",
    "India",
    "Middle East",
    "Asia Pacific",
    "Remote",
  ];

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const handleCheckboxChange = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(
        selectedRegions.filter((item) => item !== region)
      );
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Preferred Regions
        </h2>

        {regionOptions.map((region) => (
          <div key={region} className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => handleCheckboxChange(region)}
                className="mr-3 accent-black"
              />
              {region}
            </label>
          </div>
        ))}

        {selectedRegions.length > 0 && (
          <div className="mt-4 text-sm">
            <strong>Selected Regions:</strong>
            <ul className="list-disc ml-5 mt-2">
              {selectedRegions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}