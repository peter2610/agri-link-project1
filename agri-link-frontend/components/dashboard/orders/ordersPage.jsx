"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
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
  const [status, setStatus] = useState(ACTIVE);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        // Backend offers API: align with OfferForm which uses GET/POST /offer
        // Some backends may support filtering by status; if not, ignore.
        // We fetch the list of offers directly.
        const data = await fetchJson(`/offer`);

        if (!ignore) {
          // Accept both array payloads and objects with orders property
          const list = Array.isArray(data) ? data : (data?.orders ?? []);
          setOrders(list);
        }
      } catch (fetchError) {
        if (!ignore) {
          setOrders([]);
          setError(fetchError.message || "Failed to load orders.");
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

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) { }
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



  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] px-20 text-[#0C5B0D]">
      <main className="flex flex-col">
        {/* Header */}
        <DashboardHeader title={"Orders"} subtitle={"View current Active and Inactive Orders"} />

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

                {!loading && !error && orders.map((order, index) => {
                  const buttonColor = collaborateColors[index % collaborateColors.length];
                  const priceDisplay = formatNumber(order.price_per_kg ?? order.price, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <div
                      key={`${status}-${order.id ?? index}`}
                      className={`grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 px-5 py-4 text-sm text-gray-700 sm:text-base ${index === orders.length - 1 ? "" : "border-b border-[#E4E4E4]"
                        }`}
                    >
                      <span className="font-medium text-[#0C5B0D]">{order.id ?? index + 1}</span>
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
