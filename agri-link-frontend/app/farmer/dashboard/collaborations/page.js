"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CollaborationCard from "../../../../components/dashboard/collaboration/CollaborationCard";
import Sidebar from "../../../../components/dashboard/side-navbar/side-navbar";
import {
  Home,
  ClipboardList,
  PlusCircle,
  UsersRound,
  MessageSquareText,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/header/dashboard-header";

export default function CollaborationHub() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active"); // active | inactive
  const [userName, setUserName] = useState("User");
  const router = useRouter();
  const toPrice = (val) => {
    if (val == null) return "-";
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const n = Number(val);
      return Number.isFinite(n) ? n : val;
    }
    if (typeof val === "object") {
      if (typeof val.amount === "number") return val.amount;
      if (typeof val.value === "number") return val.value;
      return JSON.stringify(val);
    }
    return String(val);
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/collaborations`, { method: "GET" });
        if (!res.ok) throw new Error(`Failed to load collaborations (${res.status})`);
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((c) => {
          const crops = Array.isArray(c.crops) ? c.crops : [];
          const totalDemand = crops.reduce((sum, x) => sum + Number(x?.weight_demand ?? 0), 0);
          const totalContrib = crops.reduce((sum, x) => sum + Number(x?.contributed_weight ?? 0), 0);
          const progress = totalDemand > 0 ? Math.min(100, Math.round((totalContrib / totalDemand) * 100)) : 0;
          const first = crops[0] || null;
          return {
            id: c.id,
            crop: first?.crop_name || "-",
            price: toPrice(first?.price ?? first?.price_per_kg),
            location: c.location,
            quantity: totalDemand,
            progress,
          };
        });
        setOrders(mapped);
        setPage(1);
      } catch (err) {
        console.error("Error fetching collaborations:", err);
        toast.error(err?.message || "Failed to load collaborations");
      }
    }
    fetchOrders();

    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) {}
  }, []);

  const handleJoinCollaboration = (orderId) => {
    router.push(`/farmer/dashboard/collaborations/${orderId}`);
  };

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const start = (page - 1) * pageSize;
  // Filter by status before paginating
  const filtered = orders.filter((o) => {
    const prog = typeof o.progress === "number" ? o.progress : 0;
    return status === "inactive" ? prog >= 100 : prog < 100;
  });
  const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalFilteredPages);
  const safeStart = (safePage - 1) * pageSize;
  const visible = filtered.slice(safeStart, safeStart + pageSize);

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <main className="flex-1 flex flex-col px-20">
        <DashboardHeader title="Collaboration Hub" subtitle="Collaborate with other farmers on orders" />

        <div className="bg-[#F4F7F4] rounded-3xl p-6">
          <div className="flex items-center gap-3 px-2 md:px-4">
            <button
              onClick={() => { setStatus("active"); setPage(1); }}
              className={`font-semibold ${status === "active" ? "text-green-800" : "text-green-800/60"}`}
            >
              Active
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => { setStatus("inactive"); setPage(1); }}
              className={`${status === "inactive" ? "text-green-800 font-semibold" : "text-green-800/60"}`}
            >
              Inactive
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-green-900 text-sm">
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Crop</th>
                  <th className="px-6 py-4 text-left font-semibold">Progress</th>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                  <th className="px-6 py-4 text-left font-semibold">Price (KSH / KG)</th>
                  <th className="px-6 py-4 text-center font-semibold">Join Collaboration</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 italic">
                      No active collaborations found.
                    </td>
                  </tr>
                ) : (
                  visible.map((order, index) => (
                    <CollaborationCard
                      key={order.id}
                      order={order}
                      index={index}
                      onJoin={handleJoinCollaboration}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={`rounded-xl px-4 py-2 border border-green-800 text-green-800 ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-9 rounded-lg px-3 py-1 text-sm ${p === safePage ? "bg-green-800 text-white" : "border border-green-800 text-green-800"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalFilteredPages, p + 1))}
              disabled={safePage >= totalFilteredPages}
              className={`rounded-xl px-4 py-2 bg-green-800 text-white ${safePage >= totalFilteredPages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
