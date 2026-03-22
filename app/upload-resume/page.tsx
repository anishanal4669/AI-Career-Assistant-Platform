"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import { uploadResume, getResumes, ResumeData } from "@/app/lib/api";

export default function UploadResumePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      getResumes().then(setResumes).catch(() => {});
    }
  }, [user]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage("");

    try {
      const resume = await uploadResume(selectedFile);
      setMessage(`Uploaded successfully! Detected skills: ${resume.parsed_skills.join(", ")}`);
      setResumes((prev) => [resume, ...prev]);
      setSelectedFile(null);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Resume</h1>

        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
              }}
              className="mb-4"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mb-2">
                Selected: {selectedFile.name}
              </p>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </div>

        {resumes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Resumes</h2>
            <div className="space-y-3">
              {resumes.map((r) => (
                <div key={r.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{r.file_name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(r.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.parsed_skills.map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
