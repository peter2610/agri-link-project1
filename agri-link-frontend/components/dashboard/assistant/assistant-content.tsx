"use client";

import { useEffect, useRef, useState } from "react";
import { askAgri } from "@/lib/askAgri";
import DashboardHeader from "../header/dashboard-header";

type Bubble = { role: "user" | "ai"; text: string };

export default function AgriChatPage() {
    const [messages, setMessages] = useState<Bubble[]>([
        { role: "ai", text: "Hi! Ask me anything about storage, post-harvest handling, or market readiness." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

    async function send() {
        const text = input.trim();
        if (!text || loading) return;
        setInput("");
        setMessages((m) => [...m, { role: "user", text }]);
        setLoading(true);
        setMessages((m) => [...m, { role: "ai", text: "Agri is thinking..." }]);

        try {
            const reply = await askAgri(text);
            setMessages((m) => [...m.slice(0, -1), { role: "ai", text: reply }]);
        } catch (e: any) {
            setMessages((m) => [...m.slice(0, -1), { role: "ai", text: e.message || "Something went wrong." }]);
        } finally {
            setLoading(false);
        }
    }

    function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    return (
        <div className="flex-1 min-h-screen bg-[#FAFAFA] px-20 text-[#0C5B0D]">
            <DashboardHeader title={"Ask Agri Chat"} subtitle={"Chat with our AI Assistant on minimizing post-harvest loss & increasing profits."} />

            {/* Chat card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-[52vh] overflow-y-auto px-1">
                    {messages.map((m, i) => (
                        <MessageBubble key={i} role={m.role} text={m.text} />
                    ))}
                    {loading && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-100 p-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKey}
                        placeholder="Ask Agri"
                        className="flex-1 rounded-lg bg-white p-3 outline-none"
                    />
                    <button
                        onClick={send}
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-green-800 px-4 py-2 text-white transition hover:bg-green-800 disabled:opacity-50"
                        title="Send"
                    >
                        ➤
                    </button>
                </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">
                Tips: keep questions short. Agri replies in brief, text-style answers.
            </div>
        </div>
    );
}

function MessageBubble({ role, text }: { role: "user" | "ai"; text: string }) {
    const isUser = role === "user";
    return (
        <div className={`my-2 flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                    ? "bg-lime-300/90 text-green-900"
                    : "bg-gray-200 text-gray-800"
                    }`}
            >
                {text}
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="my-2 flex justify-start">
            <div className="rounded-2xl bg-gray-200 px-4 py-3 text-sm text-gray-600">
                Agri is thinking…
            </div>
        </div>
    );
}