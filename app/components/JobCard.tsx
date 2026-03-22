"use client";

import { JobData } from "@/app/lib/api";
import { useState } from "react";

export default function JobCard({ job }: { job: JobData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} &middot; {job.location}
          </p>
        </div>
        {job.match_score !== undefined && (
          <span
            className={`text-sm font-bold px-2.5 py-1 rounded-full ${
              job.match_score >= 70
                ? "bg-green-100 text-green-700"
                : job.match_score >= 40
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.match_score}% match
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.required_skills?.map((skill) => (
          <span
            key={skill}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 text-sm mt-3 hover:underline"
      >
        {expanded ? "Hide Details" : "View Details"}
      </button>

      {expanded && (
        <div className="mt-3 text-sm text-gray-600 border-t pt-3">
          <p>{job.description}</p>
          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
            {job.job_type}
          </span>
        </div>
      )}
    </div>
  );
}
