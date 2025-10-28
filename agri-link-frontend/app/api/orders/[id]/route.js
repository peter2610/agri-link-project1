// app/api/orders/[id]/route.js
export async function GET(req) {
  const id = req.url.split("/").pop();

  const orders = {
    "1": { 
      id: "1",
      crop: "Maize",
      quantity: 100,
      price: 23,
      location: "Nyeri",
      crops: [
        { name: "Maize", price: 23, demand: 100, contributedWeight: 90 }
      ],
      collaborators: ["Arnold Mwangakala", "Peter Munyambu", "Jennifer Nyambura"]
    },
    "2": { 
      id: "2",
      crop: "Wheat",
      quantity: 200,
      price: 50,
      location: "Nairobi",
      crops: [
        { name: "Wheat", price: 50, demand: 200, contributedWeight: 120 }
      ],
      collaborators: ["John Doe"]
    }
  };

  return new Response(JSON.stringify(orders[id] || {}), { status: 200 });
}
