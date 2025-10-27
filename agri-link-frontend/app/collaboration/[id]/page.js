"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CropRow from "../../../components/dashboard/collaboration/CropRow";
import ContributionForm from "../../../components/dashboard/collaboration/ContributionForm";
import {
  Home,
  ClipboardList,
  PlusCircle,
  UsersRound,
  MessageSquareText,
  ArrowLeft,
  UserRound,
} from "lucide-react";

export default function CollaborationDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    }
    fetchOrder();
  }, [id]);

  const handleSubmit = async (weight) => {
    if (!weight || weight <= 0) return alert("Enter a valid weight");
    try {
      await fetch(`/api/collaborations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, weight }),
      });
      router.push("/collaboration");
    } catch (err) {
      console.error("Error adding collaboration:", err);
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
      <aside className="w-[280px] bg-[#F4F7F4] p-8 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-extrabold text-green-700 mb-8">AgriLink</div>
          <nav className="space-y-2">
            <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-800 hover:bg-green-50">
              <Home size={18} />
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-800 hover:bg-green-50">
              <ClipboardList size={18} />
              <span>View Orders</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-800 hover:bg-green-50">
              <PlusCircle size={18} />
              <span>Make An Offer</span>
            </a>
            <a href="/collaboration" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#CFF56A] text-green-900">
              <UsersRound size={18} />
              <span>Collaborations</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-800 hover:bg-green-50">
              <MessageSquareText size={18} />
              <span>AI Assistant</span>
            </a>
          </nav>
        </div>
        <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-800 hover:bg-green-50">
          <ArrowLeft size={18} />
          <span>Back To Home</span>
        </a>
      </aside>

      <main className="flex-1 flex flex-col px-10 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-green-700 leading-tight">Collaboration Hub</h1>
            <p className="text-gray-600 -mt-1">Collaborate with other farmers on orders</p>
          </div>
          <div className="flex items-center gap-3 text-green-900">
            <span>Welcome, <span className="font-semibold">User</span></span>
            <div className="h-9 w-9 rounded-full border-2 border-green-700 grid place-items-center">
              <UserRound size={18} />
            </div>
          </div>
        </div>

        <div className="bg-[#F4F7F4] rounded-3xl p-4 md:p-6">
          <div className="flex items-center gap-3 px-2 md:px-4">
            <button className="text-green-800 font-semibold">Active</button>
            <span className="text-gray-400">|</span>
            <button className="text-green-800">Add Collaboration</button>
          </div>

          <div className="bg-white rounded-2xl p-6 mt-3">
            <h2 className="text-2xl font-extrabold text-green-700 mb-4">Order Details:</h2>

            {(() => {
              const formattedId = `ORD - ${String(order.id).padStart(3, "0")}`;
              const crop = order.crops?.[0];
              return (
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-10 text-green-900 mb-6">
                  <div>
                    <div className="font-semibold">Order ID:</div>
                    <div className="">{formattedId}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Location:</div>
                    <div className="">{order.location}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Crop Name:</div>
                    <div className="">{order.crop}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Price (KSH / KG):</div>
                    <div className="">{crop?.price ?? order.price}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Weight Demand:</div>
                    <div className="">{crop?.demand ?? order.quantity}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Contributed Weight:</div>
                    <div className="">{crop?.contributedWeight ?? 0}</div>
                  </div>
                </div>
              );
            })()}

            {order.collaborators && order.collaborators.length > 0 && (
              <div className="mb-6">
                <div className="font-semibold text-green-900 mb-2">Contributing Farmers:</div>
                <ul className="text-green-900 space-y-1 list-none">
                  {order.collaborators.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            )}

            <ContributionForm orderId={id} onSubmit={handleSubmit} />

            <button
              onClick={() => router.push("/collaboration")}
              className="mt-6 px-4 py-2 rounded-xl border-2 border-green-800 text-green-800 hover:bg-green-50"
            >
              ← Back to Hub
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

