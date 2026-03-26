"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-lg">
      <Link href="/" className="text-xl font-bold tracking-tight">
        AI Career Assistant
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
            <Link href="/jobs" className="hover:text-blue-400 transition">
              Jobs
            </Link>
            <Link href="/chat" className="hover:text-blue-400 transition">
              AI Chat
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
