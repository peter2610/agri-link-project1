// app/api/collaborations/[id]/contributions/route.js
const store = globalThis.__COLLAB_STORE__ || { list: [], nextId: 1 };
globalThis.__COLLAB_STORE__ = store;

export async function POST(req, { params }) {
  const { id } = params || {};
  const body = await req.json().catch(() => ({}));
  const { farmer_name, crop_id, weight } = body || {};

  const collab = store.list.find((c) => String(c.id) === String(id));
  if (!collab) {
    return new Response(JSON.stringify({ message: "Collaboration not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  let crop = Array.isArray(collab.crops) ? collab.crops.find((c) => Number(c.id) === Number(crop_id)) : null;
  if (!crop) {
    // Fallback to first crop if id isn't present or doesn't match
    crop = Array.isArray(collab.crops) && collab.crops.length > 0 ? collab.crops[0] : null;
    if (!crop) {
      return new Response(JSON.stringify({ message: "No crops available for this collaboration" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  }

  const w = Number(weight);
  if (!Number.isFinite(w) || w <= 0) {
    return new Response(JSON.stringify({ message: "Invalid weight" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  crop.contributed_weight = Number(crop.contributed_weight || 0) + w;

  collab.participations = collab.participations || [];
  collab.participations.push({ farmer_name: farmer_name || "Anonymous", weight: w, crop_id: Number(crop_id) });

  return new Response(JSON.stringify({ message: "Contribution added", crops: collab.crops, participation: collab.participations }), { status: 201, headers: { "Content-Type": "application/json" } });
}
