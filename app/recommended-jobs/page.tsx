"use client";
import { useState } from "react";

export default function RecommendedJobs() {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const jobs = [
    {
      id: 1,
      role: "Frontend Developer Intern",
      company: "TechNova",
      location: "Remote",
      matchScore: "92%",
      description:
        "Work with React and Next.js to build modern web applications.",
      applyLink: "#",
    },
    {
      id: 2,
      role: "AI/ML Intern",
      company: "DataMind",
      location: "India",
      matchScore: "88%",
      description:
        "Assist in building machine learning models and data pipelines.",
      applyLink: "#",
    },
    {
      id: 3,
      role: "Backend Developer",
      company: "CloudCore",
      location: "Europe",
      matchScore: "85%",
      description:
        "Develop APIs and scalable backend systems using Node.js.",
      applyLink: "#",
    },
  ];

  const toggleDetails = (id: number) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        Recommended Opportunities
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow-lg text-black"
          >
            <h3 className="text-xl font-semibold">{job.role}</h3>
            <p className="text-sm text-gray-600">
              {job.company} • {job.location}
            </p>
            <p className="mt-2 font-medium">
              Match Score: {job.matchScore}
            </p>

            <button
              onClick={() => toggleDetails(job.id)}
              className="mt-4 text-blue-600 underline"
            >
              {expandedJob === job.id ? "Hide Details" : "View Details"}
            </button>

            {expandedJob === job.id && (
              <div className="mt-4">
                <p className="text-sm mb-4">{job.description}</p>
                <a
                  href={job.applyLink}
                  className="inline-block bg-black text-white px-4 py-2 rounded"
                >
                  Apply Now
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}