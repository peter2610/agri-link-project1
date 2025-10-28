export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Offer submitted:", body);
    // Simulate persistence and return created resource id
    const created = { id: Date.now().toString(), ...body };
    return new Response(JSON.stringify({ message: "Offer created!", offer: created }), { status: 201 });
  } catch (err) {
    console.error("Error creating offer:", err);
    return new Response(JSON.stringify({ message: "Failed to create offer" }), { status: 500 });
  }
}
