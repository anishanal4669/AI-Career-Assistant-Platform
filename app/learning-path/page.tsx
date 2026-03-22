"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import {
  getLearningPaths,
  regenerateLearningPaths,
  updatePathProgress,
  LearningPathData,
} from "@/app/lib/api";

export default function LearningPathPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      getLearningPaths().then(setPaths).catch(() => {});
    }
  }, [user]);

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const newPaths = await regenerateLearningPaths();
      setPaths(newPaths);
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  const handleProgress = async (pathId: number, current: number, delta: number) => {
    const newProgress = Math.min(Math.max(current + delta, 0), 100);
    try {
      const updated = await updatePathProgress(pathId, newProgress);
      setPaths((prev) => prev.map((p) => (p.id === pathId ? updated : p)));
    } catch {
      // ignore
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50"
          >
            {generating ? "Generating..." : "Regenerate Paths"}
          </button>
        </div>

        {paths.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No learning paths yet.</p>
            <p className="text-sm">
              Complete your profile and upload a resume, then click
              &quot;Regenerate Paths&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {path.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{path.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 rounded-full h-3 transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {path.progress}%
                  </span>
                  <button
                    onClick={() =>
                      handleProgress(path.id, path.progress, 10)
                    }
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition"
                  >
                    +10%
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
