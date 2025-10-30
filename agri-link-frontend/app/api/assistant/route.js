// app/api/assistant/route.js
export const runtime = 'nodejs';
export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: "Server missing OPENAI_API_KEY. Add it to .env.local and restart dev server." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Guard: at least one user message
    if (messages.length === 0) {
      return new Response(JSON.stringify({ message: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call OpenAI Chat Completions API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.map((m) => ({ role: m.role, content: String(m.content || "") })),
        temperature: 0.2,
        max_tokens: 600,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      let msg = `OpenAI error (${resp.status})`;
      try {
        const errJson = await resp.json();
        msg = errJson?.error?.message || msg;
      } catch (_) {}
      return new Response(JSON.stringify({ message: msg }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const message = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Assistant route error:", err);
    return new Response(JSON.stringify({ message: err?.message || "Assistant failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
