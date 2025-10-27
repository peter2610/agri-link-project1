"use client";

import Sidebar from "../../components/dashboard/side-navbar/side-navbar";
import OfferHeader from "../../../components/dashboard/offer/offerHeader";
import OfferForm from "../../../components/dashboard/offer/OfferForm";

export default function OfferPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-10 py-8">
        {/* Offer Page Header */}
        <OfferHeader />

        {/* Offer Form Section */}
        <div className="bg-[#F4F7F4] rounded-3xl p-4 md:p-6">
          <OfferForm />
        </div>
      </main>
    </div>
  );
}
