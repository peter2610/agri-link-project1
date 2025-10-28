"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function CollaborationCard({ order, index, onJoin }) {
  const progressValue =
    typeof order.progress === "number"
      ? order.progress
      : Math.min(99, Math.max(10, (order.quantity % 51) + 50));

  const progressColor =
    progressValue >= 80 ? "bg-[#8F0E0E]" : progressValue >= 60 ? "bg-[#D1A300]" : "bg-[#0C6A2B]";

  return (
    <tr className="border-b border-green-700/30">
      <td className="px-6 py-4 text-left text-green-900">{index + 1}</td>
      <td className="px-6 py-4 text-left font-medium text-green-900">{order.crop}</td>
      <td className="px-6 py-4 text-left">
        <span
          className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-white text-xs font-semibold ${progressColor}`}
        >
          {progressValue}
        </span>
      </td>
      <td className="px-6 py-4 text-left text-green-900">{order.location}</td>
      <td className="px-6 py-4 text-left text-green-900">{order.price}</td>
      <td className="px-6 py-3">
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => onJoin(order.id)}
            className="h-8 w-8 rounded-full border-2 border-green-800 text-green-800 grid place-items-center hover:bg-green-50"
            aria-label="Join Collaboration"
          >
            <Plus size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
