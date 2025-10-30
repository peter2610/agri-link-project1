// app/api/farmer/dashboard/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const farmer_id = searchParams.get("farmer_id") || "1";

    // Fetch orders from internal API using absolute origin
    const { origin } = new URL(req.url);
    const res = await fetch(`${origin}/api/orders`, { cache: 'no-store' });
    let orders = [];
    if (res.ok) {
      const data = await res.json();
      // orders API currently returns an array
      orders = Array.isArray(data) ? data : (data.orders || []);
    }

    // Derive metrics
    const isCompleted = (o) => String(o.status || '').toLowerCase() === 'inactive' || String(o.status || '').toLowerCase() === 'completed';
    const isPending = (o) => !isCompleted(o);

    const completed_orders = orders.filter(isCompleted).length;
    const pending_orders = orders.filter(isPending).length;

    const total_quantity = orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
    const total_revenue_value = orders.reduce(
      (sum, o) => sum + (Number(o.quantity) || 0) * (Number(o.price) || Number(o.price_per_kg) || 0),
      0
    );

    // Recent orders: take first 4
    const recent_orders = orders.slice(0, 4).map((o, idx) => ({
      id: o.id || String(idx + 1),
      crop_name: o.crop_name || o.crop || '-',
      quantity: Number(o.quantity) || 0,
      price_per_kg: Number(o.price_per_kg || o.price) || 0,
      location: o.location || '-'
    }));

    const payload = {
      farmer: { id: farmer_id, full_name: 'User' },
      completed_orders,
      pending_orders,
      total_revenue_value,
      total_quantity,
      recent_orders,
    };

    return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error building dashboard:', err);
    return new Response(JSON.stringify({ message: 'Failed to load dashboard' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
