// app/api/collaborations/route.js
// Simple in-memory store (persists while server process is alive)
const store = globalThis.__COLLAB_STORE__ || { list: [], nextId: 1 };
globalThis.__COLLAB_STORE__ = store;

export async function GET() {
  return new Response(JSON.stringify(store.list), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Collaboration submitted:", body);

    const location = body?.location ?? "-";
    const crops = Array.isArray(body?.crops) ? body.crops : [];
    const first = crops[0] || {};

    const created = {
      id: String(store.nextId++),
      location,
      crops: [
        {
          id: 1,
          crop_name: first.crop_name ?? first.crop ?? "-",
          price: first.price ?? first.price_per_kg ?? 0,
          weight_demand: first.weight_demand ?? first.quantity ?? 0,
          contributed_weight: 0,
        },
      ],
      source_order_id: body?.source_order_id ?? null,
      created_at: new Date().toISOString(),
    };

    store.list.unshift(created);

    return new Response(
      JSON.stringify({ message: "Collaboration added!", collaboration: created }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error creating collaboration:", err);
    return new Response(
      JSON.stringify({ message: "Failed to create collaboration" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
