"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { fetchJson } from "@/lib/api";

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

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const statusParam = STATUS_QUERY_MAP[status];
        const query = statusParam ? `?status=${statusParam}` : "";
        const data = await fetchJson(`/orders${query}`);

        if (!ignore) {
          setOrders(data?.orders ?? []);
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

  

  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] px-4 sm:px-8 lg:px-12 py-10 text-[#0C5B0D]">
      <main className="flex flex-col gap-10">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-[1024px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">Orders</h1>
            <p className="mt-1 text-lg text-[#0C5B0D]/80">
              View current Active and Inactive Orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0C5B0D] bg-white shadow-sm">
              <UserRound className="h-5 w-5 text-[#0C5B0D]" strokeWidth={2.5} />
            </div>
            <p className="text-base font-medium text-gray-700">Welcome, User</p>
          </div>
        </header>

        {/* Orders Section */}
        <section className="mx-auto w-full max-w-[1024px] rounded-[20px] bg-[#F5F5F5] px-4 py-8 shadow-sm sm:px-6">
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-5 flex flex-wrap items-center gap-4 text-lg font-medium">
              <button
                onClick={() => setStatus(ACTIVE)}
                className={`transition-colors ${
                  status === ACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                }`}
              >
                Active
              </button>
              <span className="hidden h-6 w-[2px] bg-[#0C5B0D]/50 sm:inline" aria-hidden="true" />
              <button
                onClick={() => setStatus(INACTIVE)}
                className={`transition-colors ${
                  status === INACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                }`}
              >
                Inactive
              </button>
              <span className="ml-auto text-sm text-[#0C5B0D]/70">
                {loading ? "Refreshing orders…" : `${orders.length} orders`}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[16px] bg-white shadow">
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
                  const priceDisplay = formatNumber(order.price_per_kg, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <div
                      key={`${status}-${order.id}`}
                      className={`grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 px-5 py-4 text-sm text-gray-700 sm:text-base ${
                        index === orders.length - 1 ? "" : "border-b border-[#E4E4E4]"
                      }`}
                    >
                      <span className="font-medium text-[#0C5B0D]">{order.id}</span>
                      <span>{order.crop_name ?? "—"}</span>
                      <span>{formatNumber(order.quantity)}</span>
                      <span>{priceDisplay}</span>
                      <span>{order.location ?? "—"}</span>
                      <span className="flex justify-end">
                        <Link
                          href="#"
                          className="rounded-[9px] px-3 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:text-base"
                          style={{ backgroundColor: buttonColor }}
                        >
                          Collaborate
                        </Link>
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
