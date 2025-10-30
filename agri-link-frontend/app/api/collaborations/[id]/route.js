// app/api/collaborations/[id]/route.js
const store = globalThis.__COLLAB_STORE__ || { list: [], nextId: 1 };
globalThis.__COLLAB_STORE__ = store;

export async function GET(_req, { params }) {
  const { id } = params || {};
  const item = store.list.find((c) => String(c.id) === String(id));
  if (!item) {
    return new Response(JSON.stringify({ message: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(item), { status: 200, headers: { "Content-Type": "application/json" } });
}
