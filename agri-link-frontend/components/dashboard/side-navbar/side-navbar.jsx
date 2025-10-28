"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoBlack from "../../../public/logo-black.svg";
import { BiHome, BiShoppingBag, BiPlusCircle, BiGroup, BiChat } from "react-icons/bi";
import { ArrowLeftCircleIcon } from "lucide-react";

export default function SideNavBar() {
<<<<<<< HEAD
    return (
        <div className="sticky top-0 h-screen w-64 flex-shrink-0 inline-flex flex-col justify-between items-start px-6 py-10 bg-neutral-100 text-lg">
            <div>
                <Link href={"/"}>
                    <Image alt="logo" height={50} src={LogoBlack} />
                </Link>
            </div>
            <div className="flex flex-col items-start gap-8 text-green-800">
                <button className="cursor-pointer flex items-center gap-2"><BiHome />Home</button>
                <button className="cursor-pointer flex items-center gap-2"><BiShoppingBag />View Orders</button>
                <button className="cursor-pointer flex items-center gap-2"><BiPlusCircle />Make An Offer</button>
                <button className="cursor-pointer flex items-center gap-2"><BiGroup />Collaborations</button>
                <button className="cursor-pointer flex items-center gap-2"><BiChat />AI Assistant</button>
            </div>
            <Link href={"/"} className="flex items-center gap-2 text-green-800">
                <ArrowLeftCircleIcon size={20} />
                <p>Back To Home</p>
            </Link>
        </div>
    )
=======
  const pathname = usePathname();

  const itemBase = "w-full cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl";

  return (
    <div className="h-screen inline-flex flex-col justify-between items-start px-15 py-20 bg-neutral-100 text-lg">
      <div>
        <Link href={"/"}>
          <Image alt="logo" height={50} src={LogoBlack} />
        </Link>
      </div>
      <div className="flex flex-col items-start gap-4 text-green-800 w-full">
        <Link href="/" className={`${itemBase} ${pathname === "/" ? "bg-green-50" : ""}`}>
          <BiHome /> Home
        </Link>
        <Link href="/orders" className={itemBase}>
          <BiShoppingBag /> View Orders
        </Link>
        <Link
          href="/offer"
          className={`${itemBase} ${pathname?.startsWith("/offer") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}
        >
          <BiPlusCircle /> Make An Offer
        </Link>
        <Link
          href="/collaboration"
          className={`${itemBase} ${pathname?.startsWith("/collaboration") ? "bg-[#CFF56A] text-green-900" : "text-green-800"}`}
        >
          <BiGroup /> Collaborations
        </Link>
        <Link href="/assistant" className={itemBase}>
          <BiChat /> AI Assistant
        </Link>
      </div>
      <Link href={"/"} className="flex items-center gap-2 text-green-800">
        <ArrowLeftCircleIcon size={20} />
        <p>Back To Home</p>
      </Link>
    </div>
  );
>>>>>>> origin/peter
}