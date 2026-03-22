"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import ChatMessageBubble from "@/app/components/ChatMessage";
import { sendChatMessage, getChatHistory, ChatMessage } from "@/app/lib/api";

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      getChatHistory().then(setMessages).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", message: text }]);
    setSending(true);

    try {
      const response = await sendChatMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">AI Career Assistant</h1>
          <p className="text-xs text-gray-500">
            Ask about careers, resumes, interviews, AI, VLSI, software engineering, and more.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">
                Ask me about career guidance, resume tips, interview prep, or learning paths.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessageBubble key={i} msg={msg} />
          ))}
          {sending && (
            <div className="flex justify-start mb-3">
              <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
