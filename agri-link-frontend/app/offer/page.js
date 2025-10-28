"use client";

import Sidebar from "../../components/dashboard/side-navbar/side-navbar";
import OfferHeader from "../../components/dashboard/offer/offerHeader";
import OfferForm from "../../components/dashboard/offer/offerForm";

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
        <OfferForm />

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            form="offer-form"
            type="submit"
            data-action="create"
            className="sm:flex-1 rounded-2xl bg-[#CFF56A] text-green-900 font-semibold px-6 py-4 hover:brightness-95"
          >
            Add Offer
          </button>
          <button
            form="offer-form"
            type="submit"
            data-action="create-new"
            className="sm:flex-1 rounded-2xl border-2 border-green-800 text-green-800 font-semibold px-6 py-4 hover:bg-green-50"
          >
            Add & Create New Offer
          </button>
        </div>
      </main>
    </div>
  );
}
