const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Typed wrapper around fetch for API calls.
 * Automatically attaches the JWT token from localStorage.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData bodies when not already specified
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Request failed");
  }

  return res.json() as Promise<T>;
}

// ── Auth ────────────────────────────────────────────────────

export async function signup(name: string, email: string, password: string) {
  return request<{ id: number; name: string; email: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: formData.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

// ── Profile ─────────────────────────────────────────────────

export async function getProfile() {
  return request<{ id: number; name: string; email: string }>("/profile");
}

export interface ProfileDetails {
  id: number;
  user_id: number;
  bio: string;
  interests: string[];
  preferred_regions: string[];
  skills: string[];
}

export async function getProfileDetails() {
  return request<ProfileDetails>("/profile/details");
}

export async function updateProfile(data: Partial<ProfileDetails>) {
  return request<ProfileDetails>("/profile/details", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ── Resume ──────────────────────────────────────────────────

export interface ResumeData {
  id: number;
  user_id: number;
  file_name: string;
  parsed_skills: string[];
  uploaded_at: string;
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request<ResumeData>("/resume/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getResumes() {
  return request<ResumeData[]>("/resume");
}

// ── Jobs ────────────────────────────────────────────────────

export interface JobData {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  required_skills: string[];
  job_type: string;
  match_score?: number;
  created_at: string;
}

export async function getJobs() {
  return request<JobData[]>("/jobs");
}

export async function getMatchedJobs() {
  return request<JobData[]>("/jobs/matched");
}

// ── Learning Path ───────────────────────────────────────────

export interface LearningPathData {
  id: number;
  user_id: number;
  title: string;
  description: string;
  skills: string[];
  progress: number;
  created_at: string;
}

export async function getLearningPaths() {
  return request<LearningPathData[]>("/learning-path");
}

export async function regenerateLearningPaths() {
  return request<LearningPathData[]>("/learning-path/generate", {
    method: "POST",
  });
}

export async function updatePathProgress(pathId: number, progress: number) {
  return request<LearningPathData>(`/learning-path/${pathId}`, {
    method: "PUT",
    body: JSON.stringify({ progress }),
  });
}

// ── Chat ────────────────────────────────────────────────────

export interface ChatMessage {
  role: string;
  message: string;
  created_at?: string;
}

export async function sendChatMessage(message: string) {
  return request<ChatMessage>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getChatHistory() {
  return request<ChatMessage[]>("/chat/history");
}
