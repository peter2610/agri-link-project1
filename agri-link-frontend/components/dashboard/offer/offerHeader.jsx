"use client";

import { UserRound } from "lucide-react";

export default function OfferHeader() {
  return (
    <div className="flex items-start justify-between sm:px-8 lg:px-12 py-10">
      <div>
        <h1 className="text-[28px] font-extrabold text-green-700 leading-tight">
          Offer
        </h1>
        <p className="text-gray-600 -mt-1">
          Offer your produce to potential buyers
        </p>
      </div>
      <div className="flex items-center gap-3 text-green-900">
        <span>
          Welcome, <span className="font-semibold">User</span>
        </span>
        <div className="h-9 w-9 rounded-full border-2 border-green-700 grid place-items-center">
          <UserRound size={18} />
        </div>
      </div>
    </div>
  );
}
