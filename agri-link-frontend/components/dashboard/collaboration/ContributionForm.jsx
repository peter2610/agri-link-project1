"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContributionForm({ orderId, crops = [], onSubmit }) {
  const [weight, setWeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Array.isArray(crops) || crops.length === 0) {
      return toast.error("No crop available to contribute to");
    }
    const cropId = crops[0]?.id ?? 1;
    const farmerName = "User";
    if (!weight || weight <= 0) return toast.error("Enter a valid weight greater than 0");
    onSubmit({ farmerName, cropId, weight });
    setWeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-0 bg-[#F4F7F4]">
      <label className="block mb-2 font-semibold text-green-900">Weight:</label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 min-w-0 rounded-2xl border-2 border-green-800 px-5 py-4 text-green-900 placeholder:text-green-700/70"
          min={0.01}
          step="0.01"
          placeholder="0.00 KG"
          required
        />
        <button
          type="submit"
          className="sm:w-[280px] w-full rounded-2xl bg-[#CFF56A] text-green-900 font-semibold px-6 py-4 hover:brightness-95"
        >
          Add Collaboration
        </button>
      </div>
    </form>
  );
}

