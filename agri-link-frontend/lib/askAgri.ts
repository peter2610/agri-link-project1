import { fetchJson } from "@/lib/api";

export async function askAgri(message: string) {
  try {
    const data = await fetchJson(`/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { message },
    });
    if (data?.message) return data.message as string;
    if (data?.error) throw new Error(String(data.error));
    return "No reply received.";
  } catch (e: any) {
    // Surface concise, friendly error
    const msg = e?.message || "AI request failed";
    throw new Error(msg);
  }
}
