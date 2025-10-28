// app/api/orders/route.js
export async function GET() {
  const orders = [
    { id: "1", crop: "Maize", quantity: 100, price: 23, location: "Nyeri", status: "Active" },
    { id: "2", crop: "Wheat", quantity: 200, price: 50, location: "Nairobi", status: "Active" },
    { id: "3", crop: "Apples", quantity: 150, price: 80, location: "Meru", status: "Inactive" },
  ];

  return new Response(JSON.stringify(orders), { status: 200 });
}
