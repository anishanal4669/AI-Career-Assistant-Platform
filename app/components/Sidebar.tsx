"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/upload-resume", label: "Upload Resume" },
  { href: "/jobs", label: "Job Matches" },
  { href: "/learning-path", label: "Learning Path" },
  { href: "/chat", label: "AI Assistant" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-800 text-gray-300 min-h-screen p-4 space-y-1">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-3">
        Navigation
      </h3>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-3 py-2 rounded text-sm transition ${
            pathname === link.href
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
