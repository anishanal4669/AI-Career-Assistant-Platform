"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import JobCard from "@/app/components/JobCard";
import { getMatchedJobs, getJobs, JobData } from "@/app/lib/api";

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [viewMode, setViewMode] = useState<"matched" | "all">("matched");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    if (viewMode === "matched") {
      getMatchedJobs().then(setJobs).catch(() => {});
    } else {
      getJobs().then(setJobs).catch(() => {});
    }
  }, [user, viewMode]);

  if (authLoading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Recommendations</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("matched")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                viewMode === "matched"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              Matched
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                viewMode === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              All Jobs
            </button>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No jobs found yet.</p>
            <p className="text-sm">Upload your resume and complete your profile to get personalized matches.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
