import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          AI Career Assistant
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          Become industry-ready in <strong>AI</strong>,{" "}
          <strong>VLSI</strong>, and <strong>Software Engineering</strong>.
          Get personalized career guidance, learning paths, resume feedback,
          and job matching — all powered by AI.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-gray-500 hover:border-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          What You Get
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Resume Analysis",
              desc: "Upload your resume and get AI-powered skill extraction and improvement tips.",
            },
            {
              title: "Job Matching",
              desc: "Get personalized job and internship recommendations based on your skills.",
            },
            {
              title: "Learning Paths",
              desc: "Follow curated learning paths for AI, VLSI, frontend, backend, and DevOps.",
            },
            {
              title: "AI Chat Assistant",
              desc: "Chat with an AI career counselor for guidance on interviews, resume, and career strategy.",
            },
            {
              title: "Skill Tracking",
              desc: "Track your skill progress and see how you improve over time.",
            },
            {
              title: "Industry Domains",
              desc: "Specialized paths for AI/ML, VLSI design, full-stack development, and more.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 text-center text-sm text-gray-500">
        AI Career Assistant Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
