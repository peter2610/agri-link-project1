import { Suspense } from "react";
import SideNavBar from "../../../../components/dashboard/side-navbar/side-navbar";
import OrdersContent from "../../../../components/dashboard/orders/ordersPage";

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-white text-[#0C5B0D]">
      <SideNavBar />
      <Suspense fallback={<div className="p-6 text-[#0C5B0D]/70">Loading orders…</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
