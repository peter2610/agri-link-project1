import Link from "next/link";
import { UserRound } from "lucide-react";

const summaryStats = [
  { title: "Orders Completed", value: "39" },
  { title: "Pending Orders", value: "05" },
  { title: "Total Earnings (KSH)", value: "19.0K" },
  { title: "Total Crops Sold (KG)", value: "500" },
];

const orders = [
  { id: 1, crop: "Maize", quantity: "100", price: "23", location: "Nyeri" },
  { id: 2, crop: "Maize", quantity: "50", price: "24", location: "Nairobi" },
  { id: 3, crop: "Apples", quantity: "200", price: "50", location: "Nairobi" },
  { id: 4, crop: "Rice", quantity: "300", price: "20", location: "Mombasa" },
];

export default function DashboardHome() {
  return (
    <main className="flex min-h-screen flex-col gap-10 bg-[#FAFAFA] pb-16">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[924px] items-center justify-between pt-10 px-4 sm:px-0">
        <p className="text-[30px] font-semibold leading-[38px] text-[#0C5B0D]">
          Farmer’s Dashboard
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-[#0C5B0D] bg-white shadow-sm">
            <UserRound className="h-5 w-5 text-[#0C5B0D]" strokeWidth={2.5} />
          </div>
          <p className="text-[18px] font-medium text-gray-700">Welcome, User</p>
        </div>
      </div>

      {/* Quick Summary Section */}
      <section className="mx-auto w-full max-w-[924px] rounded-[20px] bg-[#F5F5F5] px-6 py-8 shadow-sm">
        <div className="mb-5">
          <h2 className="text-[22px] font-semibold leading-[28px] text-[#0C5B0D]">
            Quick Summary
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map(({ title, value }) => (
            <div
              key={title}
              className="flex flex-col justify-between rounded-[18px] bg-[#BFFC6F] px-5 py-5 text-[#0C5B0D] shadow-md hover:shadow-lg transition-all"
            >
              <span className="text-[40px] font-extrabold leading-[42px]">
                {value}
              </span>
              <span className="text-[18px] font-medium leading-tight">
                {title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Orders Overview Section */}
      <section className="mx-auto w-full max-w-[924px] rounded-[20px] bg-[#F5F5F5] px-6 py-8 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold leading-[28px] text-[#0C5B0D]">
            Orders Overview
          </h2>
          <Link
            href="#"
            className="rounded-lg bg-[#0C5B0D] px-5 py-2 text-[16px] font-medium text-white shadow hover:bg-[#084F09] transition-all"
          >
            View More
          </Link>
        </div>
        <div className="overflow-hidden rounded-[16px] bg-white shadow">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_repeat(4,minmax(0,1fr))] gap-3 border-b border-[#E4E4E4] px-5 py-3 text-[16px] font-semibold text-[#0C5B0D]">
            <span>#</span>
            <span>Crop</span>
            <span>Quantity (KG)</span>
            <span>Price (KSH / KG)</span>
            <span>Location</span>
          </div>

          {/* Table Rows */}
          {orders.map(({ id, crop, quantity, price, location }, index) => (
            <div
              key={id}
              className={`grid grid-cols-[50px_repeat(4,minmax(0,1fr))] gap-3 px-5 py-4 text-[15px] text-gray-700 ${
                index === orders.length - 1 ? "" : "border-b border-[#E4E4E4]"
              }`}
            >
              <span className="font-medium text-[#0C5B0D]">{id}</span>
              <span>{crop}</span>
              <span>{quantity}</span>
              <span>{price}</span>
              <span>{location}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
