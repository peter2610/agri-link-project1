"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UserRound } from "lucide-react";

const ACTIVE = "active";
const INACTIVE = "inactive";

const activeOrders = [
  { id: 1, crop: "Maize", quantityKg: "100", pricePerKg: "23", location: "Nyeri" },
  { id: 2, crop: "Maize", quantityKg: "50", pricePerKg: "24", location: "Nairobi" },
  { id: 3, crop: "Apples", quantityKg: "200", pricePerKg: "50", location: "Nairobi" },
  { id: 4, crop: "Rice", quantityKg: "300", pricePerKg: "20", location: "Mombasa" },
  { id: 5, crop: "Millet", quantityKg: "150", pricePerKg: "16", location: "Mombasa" },
  { id: 6, crop: "Rice", quantityKg: "300", pricePerKg: "21", location: "Mombasa" },
  { id: 7, crop: "Rice", quantityKg: "300", pricePerKg: "19", location: "Mombasa" },
];

const inactiveOrders = [
  { id: 1, crop: "Beans", quantityKg: "80", pricePerKg: "18", location: "Eldoret" },
  { id: 2, crop: "Bananas", quantityKg: "60", pricePerKg: "22", location: "Thika" },
  { id: 3, crop: "Coffee", quantityKg: "40", pricePerKg: "75", location: "Kericho" },
  { id: 4, crop: "Tea", quantityKg: "120", pricePerKg: "65", location: "Kericho" },
];

const collaborateColors = [
  "#820A04",
  "#B0A315",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
  "#0C5B0D",
];

export default function OrdersPage() {
  const [status, setStatus] = useState(ACTIVE);
  const orders = useMemo(() => (status === ACTIVE ? activeOrders : inactiveOrders), [status]);

  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] px-6 sm:px-10 lg:px-12 py-10 text-[#0C5B0D]">
      <main className="flex flex-col gap-10">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-[924px] items-center justify-between">
          <div>
            <h1 className="text-[30px] font-semibold leading-[36px]">Orders</h1>
            <p className="mt-1 text-[18px] leading-[24px] text-[#0C5B0D]/80">
              View current Active and Inactive Orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-[#0C5B0D] bg-white shadow-sm">
              <UserRound className="h-5 w-5 text-[#0C5B0D]" strokeWidth={2.5} />
            </div>
            <p className="text-[17px] font-medium text-gray-700">Welcome, User</p>
          </div>
        </header>

        {/* Orders Section */}
        <section className="mx-auto w-full max-w-[924px] rounded-[20px] bg-[#F5F5F5] px-6 py-8 shadow-sm">
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-5 flex items-center gap-4 text-[20px] font-medium">
              <button
                onClick={() => setStatus(ACTIVE)}
                className={`transition-colors ${
                  status === ACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                }`}
              >
                Active
              </button>
              <span className="h-6 w-[2px] bg-[#0C5B0D]/50" aria-hidden="true" />
              <button
                onClick={() => setStatus(INACTIVE)}
                className={`transition-colors ${
                  status === INACTIVE ? "font-extrabold text-[#0C5B0D]" : "text-[#0C5B0D]/60"
                }`}
              >
                Inactive
              </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[16px] bg-white shadow">
              {/* Table Header */}
              <div className="grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 border-b border-[#E4E4E4] px-5 py-3 text-[16px] font-semibold text-[#0C5B0D]">
                <span>#</span>
                <span>Crop</span>
                <span>Quantity (KG)</span>
                <span>Price (KSH / KG)</span>
                <span>Location</span>
                <span className="text-right">Action</span>
              </div>

              {/* Table Rows */}
              {orders.map(({ id, crop, quantityKg, pricePerKg, location }, index) => {
                const buttonColor = collaborateColors[index % collaborateColors.length];

                return (
                  <div
                    key={`${status}-${id}-${crop}`}
                    className={`grid grid-cols-[50px_repeat(4,minmax(0,1fr))_minmax(0,140px)] gap-3 px-5 py-4 text-[15px] text-gray-700 ${
                      index === orders.length - 1 ? "" : "border-b border-[#E4E4E4]"
                    }`}
                  >
                    <span className="font-medium text-[#0C5B0D]">{id}</span>
                    <span>{crop}</span>
                    <span>{quantityKg}</span>
                    <span>{pricePerKg}</span>
                    <span>{location}</span>
                    <span className="flex justify-end">
                      <Link
                        href="#"
                        className="rounded-[9px] px-3 py-2 text-[15px] font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
                        style={{ backgroundColor: buttonColor }}
                      >
                        Collaborate
                      </Link>
                    </span>
                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="px-5 py-8 text-center text-[15px] text-[#0C5B0D]/60">
                  No orders available.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
