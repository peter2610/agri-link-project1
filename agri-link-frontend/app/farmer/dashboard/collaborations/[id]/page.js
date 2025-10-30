"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CropRow from "../../../../../components/dashboard/collaboration/CropRow";
import ContributionForm from "../../../../../components/dashboard/collaboration/ContributionForm";
import Sidebar from "../../../../../components/dashboard/side-navbar/side-navbar";
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

export default function CollaborationDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/collaborations/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch collaboration (${res.status})`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error(err?.message || "Failed to load collaboration");
      }
    }
    fetchOrder();
  }, [id]);

  const handleSubmit = async ({ farmerName, cropId, weight }) => {
    if (!weight || weight <= 0) return alert("Enter a valid weight");
    try {
      const res = await fetch(`/api/collaborations/${id}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmer_name: farmerName, crop_id: Number(cropId), weight: Number(weight) }),
      });
      if (!res.ok) throw new Error(`Failed to contribute (${res.status})`);
      const updated = await res.json();
      // Refresh details with updated crops
      setOrder((prev) => (prev ? { ...prev, crops: updated.crops ?? prev.crops } : prev));
      toast.success("Contribution added");
      router.push("/farmer/dashboard/collaborations");
    } catch (err) {
      console.error("Error adding collaboration:", err);
      toast.error(err?.message || "Failed to add contribution");
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F7F4]">
        <p className="text-gray-600 text-lg">Loading order data...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col px-10 py-8">
        <DashboardHeader title={"Collaboration Hub"} subtitle={"Collaborate with other farmers on orders"} />

        <div className="bg-[#F4F7F4] rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 px-2 md:px-4">
            <span className="text-green-800 font-semibold">Active</span>
            <span className="text-gray-400">|</span>
            <span className="text-green-800">Add Collaboration</span>
          </div>

          <div className="bg-[#F4F7F4] rounded-2xl p-6 mt-4">
            <h2 className="text-[28px] font-extrabold text-green-700 mb-4">Order Details:</h2>

            {(() => {
              const formattedId = `ORD - ${String(order.id).padStart(3, "0")}`;
              const crop = order.crops?.[0];
              return (
                <>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-10 text-green-900 mb-6">
                    <div>
                      <div className="font-semibold">Order ID:</div>
                      <div>{formattedId}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Location:</div>
                      <div>{order.location}</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-y-6 gap-x-10 text-green-900 mb-6">
                    <div>
                      <div className="font-semibold">Crop Name:</div>
                      <div>{crop?.crop_name ?? "-"}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Price (KSH / KG):</div>
                      <div>{crop?.price ?? "-"}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Weight Demand:</div>
                      <div>{crop?.weight_demand ?? 0}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Contributed Weight:</div>
                      <div>{crop?.contributed_weight ?? 0}</div>
                    </div>
                  </div>
                </>
              );
            })()}

            {Array.isArray(order.participations) && order.participations.length > 0 && (
              <div className="mb-6">
                <div className="font-semibold text-green-900 mb-2">Contributing Farmers:</div>
                <ul className="text-green-900 space-y-1 list-none">
                  {order.participations.map((p, i) => (
                    <li key={i}>{p.farmer_name}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
          <div className="mt-4 -mx-6 md:-mx-8 bg-[#F4F7F4] rounded-2xl p-0">
            <ContributionForm orderId={id} crops={order.crops ?? []} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}

