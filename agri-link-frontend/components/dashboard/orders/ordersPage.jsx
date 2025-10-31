"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { fetchJson } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import DashboardHeader from "../header/dashboard-header";

const ACTIVE = "active";
const INACTIVE = "inactive";

const STATUS_QUERY_MAP = {
  [ACTIVE]: "pending",
  [INACTIVE]: "completed",
};

const collaborateColors = [
  "#820A04",
  "#B0A315",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
];

const formatNumber = (value, options) => {
  if (value === null || value === undefined) {
    return "—";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return numeric.toLocaleString(undefined, options);
};

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState(ACTIVE);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  // Frontend mock orders (used only if backend is empty/unavailable)
  const mockOrders = [
    { id: 101, crop_name: "Maize", quantity: 500, price: 80, location: "Nairobi" },
    { id: 102, crop_name: "Tomatoes", quantity: 300, price: 120, location: "Embu" },
    { id: 103, crop_name: "Avocado", quantity: 200, price: 150, location: "Murang'a" },
  ];

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        // Fetch offers for the current/fallback farmer
        const fid = process.env.NEXT_PUBLIC_FALLBACK_FARMER_ID;
        const qs = fid ? `?farmer_id=${encodeURIComponent(fid)}` : "";
        const data = await fetchJson(`/offers${qs}`);

        if (!ignore) {
          // Accept both array payloads and objects with orders property
          const list = Array.isArray(data) ? data : (data?.orders ?? []);
          setOrders(list && list.length > 0 ? list : mockOrders);
          setPage(1);
        }
      } catch (fetchError) {
        if (!ignore) {
          // Show mock data on error so the UI remains usable
          setOrders(mockOrders);
          setError(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [status]);

  // Show success message after redirect with created=1
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const created = url.searchParams.get("created");
    if (created === "1") {
      toast.success("Offer created successfully");
      url.searchParams.delete("created");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) {}
  }, []);

  const handleCollaborate = async (order) => {
    try {
      const crop_name = order.crop_name ?? order.crop;
      const price = order.price_per_kg ?? order.price;
      const weight_demand = order.quantity;
      const location = order.location;

      if (!crop_name || !price || !weight_demand || !location) {
        return toast.error("Missing required fields for collaboration");
      }

      const payload = {
        location,
        crops: [
          {
            crop_name,
            price,
            weight_demand,
          },
        ],
        source_order_id: order.id,
      };

      const res = await fetch(`/api/collaborations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.message || errJson?.error || `Failed to create collaboration (${res.status})`;
        return toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
      toast.success("Collaboration created");
      router.push("/collaboration");
    } catch (e) {
      const msg = e?.message || "Failed to create collaboration";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };



  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const start = (page - 1) * pageSize;
  const visible = orders.slice(start, start + pageSize);

  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] px-20 text-[#0C5B0D]">
      <main className="flex flex-col">
        {/* Header */}
        <DashboardHeader title={"Orders"} subtitle={"View current Active and Inactive Orders"} />
        262cf45 (Added AI chat):agri-link-frontend/components/dashboard/orders/ordersPage.jsx

        {/* Orders Section */}
        <section className="w-full max-w-5xl rounded-[20px] bg-[#F5F5F5] px-4 py-8 shadow-sm sm:px-6 mt-6">
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-5 flex flex-wrap items-center gap-4 text-lg font-medium">
              <button
                onClick={() => setStatus(ACTIVE)}
                className={`transition-colors ${status === ACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                  }`}
              >
                Active
              </button>
              <span className="hidden h-6 w-0.5 bg-[#0C5B0D]/50 sm:inline" aria-hidden="true" />
              <button
                onClick={() => setStatus(INACTIVE)}
                className={`transition-colors ${status === INACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                  }`}
              >
                Inactive
              </button>
              <span className="ml-auto text-sm text-[#0C5B0D]/70">
                {loading ? "Refreshing orders…" : `${orders.length} orders`}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow">
              {/* Table Header */}
              <div className="grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 border-b border-[#E4E4E4] px-5 py-3 text-sm font-semibold text-[#0C5B0D] sm:text-base">
                <span>#</span>
                <span>Crop</span>
                <span>Quantity (KG)</span>
                <span>Price (KSH / KG)</span>
                <span>Location</span>
                <span className="text-right">Action</span>
              </div>

              <div className="min-h-[220px]">
                {loading && (
                  <div className="flex h-full items-center justify-center px-5 py-8 text-sm text-[#0C5B0D]/70">
                    Loading orders…
                  </div>
                )}

                {!loading && error && (
                  <div className="px-5 py-8 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}

                {!loading && !error && orders.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-[#0C5B0D]/60">
                    No orders available.
                  </div>
                )}

                {!loading && !error && visible.map((order, index) => {
                  const buttonColor = collaborateColors[(start + index) % collaborateColors.length];
                  const priceDisplay = formatNumber(order.price_per_kg ?? order.price, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <div
                      key={`${status}-${order.id ?? (start + index)}`}
                      className={`grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 px-5 py-4 text-sm text-gray-700 sm:text-base ${index === visible.length - 1 ? "" : "border-b border-[#E4E4E4]"
                        }`}
                    >
                      <span className="font-medium text-[#0C5B0D]">{start + index + 1}</span>
                      <span>{order.crop_name ?? order.crop ?? "—"}</span>
                      <span>{formatNumber(order.quantity)}</span>
                      <span>{priceDisplay}</span>
                      <span>{order.location ?? "—"}</span>
                      <span className="flex justify-end">
                        <button
                          onClick={() => handleCollaborate(order)}
                          className="rounded-[9px] px-3 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:text-base"
                          style={{ backgroundColor: buttonColor }}
                        >
                          Collaborate
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between px-5 py-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`rounded-xl px-4 py-2 border border-green-800 text-green-800 ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Prev
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-9 rounded-lg px-3 py-1 text-sm ${p === page ? "bg-green-800 text-white" : "border border-green-800 text-green-800"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`rounded-xl px-4 py-2 bg-green-800 text-white ${page >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
