"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CollaborationCard from "../../components/dashboard/collaboration/CollaborationCard";
import Sidebar from "../../components/dashboard/side-navbar/side-navbar";
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

export default function CollaborationHub() {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState("User");
  const router = useRouter();
  const toPrice = (val) => {
    if (val == null) return "-";
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const n = Number(val);
      return Number.isFinite(n) ? n : val;
    }
    // Handle object shapes like { amount }
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
        // Map backend collaborations to UI rows
        const mapped = (Array.isArray(data) ? data : []).map((c) => {
          const first = (c.crops && c.crops[0]) || null;
          const weightDemand = first?.weight_demand ?? 0;
          const contributed = first?.contributed_weight ?? 0;
          const progress = weightDemand > 0 ? Math.round((contributed / weightDemand) * 100) : 0;
          return {
            id: c.id,
            crop: first?.crop_name || "-",
            price: toPrice(first?.price ?? first?.price_per_kg),
            location: c.location,
            quantity: weightDemand,
            progress,
          };
        });
        setOrders(mapped);
      } catch (err) {
        console.error("Error fetching collaborations:", err);
        toast.error(err?.message || "Failed to load collaborations");
      }
    }
    fetchOrders();

    // load logged-in name
    try {
      const raw = window.localStorage.getItem("agri_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.full_name) setUserName(parsed.full_name);
      }
    } catch (_) {}
  }, []);

  const handleJoinCollaboration = (orderId) => {
    router.push(`/collaboration/${orderId}`);
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />

      <main className="flex-1 flex flex-col px-10 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-green-700 leading-tight">Collaboration Hub</h1>
            <p className="text-gray-600 -mt-1">Collaborate with other farmers on orders</p>
          </div>
          <div className="flex items-center gap-3 text-green-900">
            <span>Welcome, <span className="font-semibold">{userName.split(" ")[0]}</span></span>
            <div className="h-9 w-9 rounded-full border-2 border-green-700 grid place-items-center">
              <UserRound size={18} />
            </div>
          </div>
        </div>

        <div className="bg-[#F4F7F4] rounded-3xl p-6">
          <div className="flex items-center gap-3 px-2 md:px-4">
            <button className="text-green-800 font-semibold">Active</button>
            <span className="text-gray-400">|</span>
            <button className="text-green-800">Add Collaboration</button>
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
                  orders.map((order, index) => (
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
        </div>
      </main>
    </div>
  );
}

