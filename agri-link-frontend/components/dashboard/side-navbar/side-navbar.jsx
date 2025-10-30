"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoBlack from "../../../public/logo-black.svg";
import { BiHome, BiShoppingBag, BiPlusCircle, BiGroup, BiChat } from "react-icons/bi";
import { ArrowLeftCircleIcon } from "lucide-react";

export default function SideNavBar() {
  const pathname = usePathname();

  const itemBase = "w-full cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl";

  return (
    <div className="h-screen inline-flex flex-col justify-between items-start px-15 pt-10 pb-20 bg-neutral-100 text-lg">
      <div>
        <Link href={"/"}>
          <Image alt="logo" height={50} src={LogoBlack} />
        </Link>
      </div>
      <div className="flex flex-col items-start gap-4 text-green-800 w-full">
        <Link href="/farmer/dashboard/home" className={`${itemBase} ${pathname?.startsWith("/farmer/dashboard/home") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}>
          <BiHome /> Home
        </Link>
        <Link href="/farmer/dashboard/orders" className={`${itemBase} ${pathname?.startsWith("/farmer/dashboard/orders") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}>
          <BiShoppingBag /> View Orders
        </Link>
        <Link
          href="/farmer/dashboard/offers"
          className={`${itemBase} ${pathname?.startsWith("/farmer/dashboard/offers") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}
        >
          <BiPlusCircle /> Make An Offer
        </Link>
        <Link
          href="/farmer/dashboard/collaborations"
          className={`${itemBase} ${pathname?.startsWith("/farmer/dashboard/collaborations") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}
        >
          <BiGroup /> Collaborations
        </Link>
        <Link href="/farmer/dashboard/assistant" className={`${itemBase} ${pathname?.startsWith("/farmer/dashboard/assistant") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}>
          <BiChat /> AI Assistant
        </Link>
      </div>
      <Link href={"/"} className="flex items-center gap-2 text-green-800">
        <ArrowLeftCircleIcon size={20} />
        <p>Back To Home</p>
      </Link>
    </div >
  );
}