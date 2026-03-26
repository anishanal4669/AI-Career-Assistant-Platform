"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import { getResumes, getMatchedJobs, getLearningPaths, ResumeData, JobData, LearningPathData } from "@/app/lib/api";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [paths, setPaths] = useState<LearningPathData[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      getResumes().then(setResumes).catch(() => {});
      getMatchedJobs().then((j) => setJobs(j.slice(0, 3))).catch(() => {});
      getLearningPaths().then(setPaths).catch(() => {});
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-500 mb-8">
          Here&apos;s an overview of your career assistant dashboard.
        </p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Resumes", value: resumes.length, href: "/upload-resume" },
            { label: "Job Matches", value: jobs.length, href: "/jobs" },
            { label: "Learning Paths", value: paths.length, href: "/learning-path" },
            { label: "Skills", value: resumes[0]?.parsed_skills?.length || 0, href: "/profile" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Top Job Matches */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Job Matches</h2>
            <Link href="/jobs" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {jobs.length === 0 ? (
            <p className="text-gray-400 text-sm">Upload a resume to get personalized job matches.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  {job.match_score !== undefined && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {job.match_score}% match
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Learning Progress</h2>
            <Link href="/learning-path" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {paths.length === 0 ? (
            <p className="text-gray-400 text-sm">Your learning paths will appear here once generated.</p>
          ) : (
            <div className="space-y-3">
              {paths.map((p) => (
                <div key={p.id} className="bg-white border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{p.title}</h3>
                    <span className="text-sm text-gray-500">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
