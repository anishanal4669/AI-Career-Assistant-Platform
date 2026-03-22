"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import {
  getProfileDetails,
  updateProfile,
  ProfileDetails,
} from "@/app/lib/api";

const INTEREST_OPTIONS = [
  "AI / Machine Learning",
  "VLSI",
  "Frontend Development",
  "Backend Development",
  "DevOps",
  "Data Engineering",
  "Cloud Engineering",
  "Cybersecurity",
  "Embedded Systems",
];

const REGION_OPTIONS = [
  "North America",
  "Europe",
  "India",
  "Middle East",
  "Asia Pacific",
  "Remote",
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      getProfileDetails()
        .then((p) => {
          setProfile(p);
          setBio(p.bio || "");
          setInterests(p.interests || []);
          setRegions(p.preferred_regions || []);
          setSkills((p.skills || []).join(", "));
        })
        .catch(() => {});
    }
  }, [user]);

  const toggleItem = (
    list: string[],
    setter: (v: string[]) => void,
    item: string
  ) => {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateProfile({
        bio,
        interests,
        preferred_regions: regions,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setProfile(updated);
      setMessage("Profile saved successfully!");
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded p-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border border-gray-300 rounded p-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, React, SQL, Docker..."
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleItem(interests, setInterests, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    interests.includes(opt)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Regions
            </label>
            <div className="flex flex-wrap gap-2">
              {REGION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleItem(regions, setRegions, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    regions.includes(opt)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message && (
              <span
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
