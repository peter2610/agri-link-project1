import Link from "next/link";
import Image from "next/image";
import LogoBlack from "../../../public/logo-black.svg"
import { BiHome, BiShoppingBag, BiPlusCircle, BiGroup, BiChat } from "react-icons/bi";
import { ArrowLeftCircleIcon } from "lucide-react";

export default function SideNavBar() {
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
}