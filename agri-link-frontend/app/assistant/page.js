"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/dashboard/side-navbar/side-navbar";
import { UserRound } from "lucide-react";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your AgriLink AI assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState("User");
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");

    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.slice(-12) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = data?.message || `Assistant error (${res.status})`;
        throw new Error(msg);
      }
      const reply = data?.message || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: String(err?.message || "There was an error contacting the assistant. Please try again.") },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col px-6 sm:px-10 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-green-700 leading-tight">AI Assistant</h1>
            <p className="text-gray-600 -mt-1">Ask anything about your dashboard, orders, and collaborations</p>
          </div>
          <div className="flex items-center gap-3 text-green-900">
            <span>Welcome, <span className="font-semibold">{userName.split(" ")[0]}</span></span>
            <div className="h-9 w-9 rounded-full border-2 border-green-700 grid place-items-center">
              <UserRound size={18} />
            </div>
          </div>
        </header>

        <section className="flex-1 flex flex-col rounded-3xl bg-[#F4F7F4] p-4 sm:p-6">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "text-green-900" : "text-gray-800"}>
                <div className={`inline-block max-w-[90%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow ${m.role === "assistant" ? "bg-[#CFF56A]" : "bg-white"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Type your question..."
              className="flex-1 min-h-[48px] max-h-40 resize-y rounded-2xl border-2 border-green-800 px-4 py-3 text-green-900 placeholder:text-green-700/70"
            />
            <button
              onClick={send}
              disabled={sending}
              className="sm:w-[160px] w-full rounded-2xl bg-[#CFF56A] text-green-900 font-semibold px-6 py-3 hover:brightness-95 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
