"use client";

import Sidebar from "../../../../components/dashboard/side-navbar/side-navbar";
import DashboardHeader from "@/components/dashboard/header/dashboard-header";
import OfferForm from "../../../../components/dashboard/offer/offerForm";

export default function OfferPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-20">
        {/* Offer Page Header */}
        <DashboardHeader title={"Offers"} subtitle={"Offer your produce to potential buyers"} />

        {/* Offer Form Section */}
        <OfferForm />

        {/* Actions */}

      </main>
    </div>
  );
}
