"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

const DEFAULT_FARMER_ID = 1;

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

const formatCompact = (value) => {
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(numeric);
};

export default function DashboardHome() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/farmer/dashboard?farmer_id=${DEFAULT_FARMER_ID}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
        const data = await res.json();
        if (!ignore) {
          setDashboard(data);
        }
      } catch (fetchError) {
        if (!ignore) {
          setDashboard(null);
          setError(fetchError.message || "Failed to load dashboard.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    // Load logged-in name from localStorage (client only)
    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) {}

    return () => {
      ignore = true;
    };
  }, [farmerId]);

  const farmerName = (dashboard?.farmer?.full_name ?? userName) || "User";
  const summaryStats = [
    { title: "Orders Completed", value: formatNumber(dashboard?.completed_orders) },
    { title: "Pending Orders", value: formatNumber(dashboard?.pending_orders) },
    {
      title: "Total Earnings (KSH)",
      value: formatCompact(dashboard?.total_revenue_value),
    },
    {
      title: "Total Crops Sold (KG)",
      value: formatNumber(dashboard?.total_quantity, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    },
  ];

  const recentOrders = dashboard?.recent_orders ?? [];

  return (
    <main className="flex min-h-screen flex-col gap-10">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pt-10 sm:flex-row items-center justify-between">
        <div>
          <p className="text-3xl font-semibold leading-tight text-[#0C5B0D]">
            Farmer’s Dashboard
          </p>
          <p className="mt-1 text-base text-[#0C5B0D]/70">
            Overview of recent performance and orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0C5B0D] bg-white shadow-sm">
            <UserRound className="h-5 w-5 text-[#0C5B0D]" strokeWidth={2.5} />
          </div>
          <p className="text-base font-medium text-gray-700">Welcome, {farmerName.split(" ")[0]}</p>
        </div>
      </div>

      {/* Quick Summary Section */}
      <section className="mx-auto w-full max-w-5xl rounded-[20px] bg-[#F5F5F5] px-4 py-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-tight text-[#0C5B0D]">
            Quick Summary
          </h2>
          {loading && <span className="text-sm text-[#0C5B0D]/70">Refreshing…</span>}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map(({ title, value }) => (
              <div
                key={title}
                className="flex flex-col justify-between rounded-[18px] bg-[#BFFC6F] px-5 py-5 text-[#0C5B0D] shadow-md transition-all hover:shadow-lg"
              >
                <span className="text-3xl font-extrabold leading-snug sm:text-4xl">
                  {value}
                </span>
                <span className="text-base font-medium leading-tight sm:text-lg">
                  {title}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders Overview Section */}
      <section className="mx-auto w-full max-w-5xl rounded-[20px] bg-[#F5F5F5] px-4 py-8 shadow-sm sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-tight text-[#0C5B0D]">
            Orders Overview
          </h2>
          <Link
            href="/orders"
            className="rounded-lg bg-[#0C5B0D] px-5 py-2 text-sm font-medium text-white shadow transition-all hover:bg-[#084F09] sm:text-base"
          >
            View More
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid min-w-[560px] grid-cols-[50px_repeat(4,minmax(0,1fr))] gap-3 border-b border-[#E4E4E4] px-5 py-3 text-sm font-semibold text-[#0C5B0D] sm:text-base">
              <span>#</span>
              <span>Crop</span>
              <span>Quantity (KG)</span>
              <span>Price (KSH / KG)</span>
              <span>Location</span>
            </div>

            <div className="min-h-[200px]">
              {loading && (
                <div className="flex h-full items-center justify-center px-5 py-8 text-sm text-[#0C5B0D]/70">
                  Loading recent orders…
                </div>
              )}

              {!loading && error && (
                <div className="px-5 py-8 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              {!loading && !error && recentOrders.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-[#0C5B0D]/60">
                  No recent orders available.
                </div>
              )}

              {!loading && !error && recentOrders.map(({ id, crop_name, quantity, price_per_kg, location }, index) => (
                <div
                  key={id}
                  className={`grid min-w-[560px] grid-cols-[50px_repeat(4,minmax(0,1fr))] gap-3 px-5 py-4 text-sm text-gray-700 sm:text-base ${index === recentOrders.length - 1 ? "" : "border-b border-[#E4E4E4]"
                    }`}
                >
                  <span className="font-medium text-[#0C5B0D]">{id}</span>
                  <span>{crop_name ?? "—"}</span>
                  <span>{formatNumber(quantity)}</span>
                  <span>
                    {formatNumber(price_per_kg, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span>{location ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
