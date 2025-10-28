// app/api/collaborations/route.js
export async function POST(req) {
  const body = await req.json();
  console.log("Collaboration submitted:", body);

  return new Response(JSON.stringify({ message: "Collaboration added!" }), { status: 201 });
}
