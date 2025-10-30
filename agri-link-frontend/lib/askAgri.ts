export async function askAgri(message: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI error");
    return data.message as string;
}
