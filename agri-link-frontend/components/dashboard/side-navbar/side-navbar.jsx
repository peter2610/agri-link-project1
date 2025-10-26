import Link from "next/link";
import Image from "next/image";
import LogoBlack from "../../../public/logo-black.svg";
import { BiHome, BiShoppingBag, BiPlusCircle, BiGroup, BiChat } from "react-icons/bi";
import { ArrowLeftCircleIcon } from "lucide-react";

const navItems = [
    { label: "Home", icon: BiHome, href: "/dashboard", active: true },
    { label: "View Orders", icon: BiShoppingBag, href: "/orders" },
    { label: "Make An Offer", icon: BiPlusCircle, href: "#" },
    { label: "Collaborations", icon: BiGroup, href: "#" },
    { label: "AI Assistant", icon: BiChat, href: "#" },
];

export default function SideNavBar() {
    return (
        <aside className="flex h-screen w-[381px] flex-col justify-between bg-[#F5F5F5] px-10 py-12 text-[#0C5B0D]">
            <div className="space-y-10">
                <Link href={"/"} className="flex items-center gap-4">
                    <div className="flex h-[62px] w-[62px] items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Image alt="AgriLink logo" height={44} src={LogoBlack} />
                    </div>
                    <span className="text-[34px] font-black">AgriLink</span>
                </Link>

                <nav className="flex flex-col gap-4">
                    {navItems.map(({ label, icon: Icon, href, active }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-4 rounded-[17px] px-6 py-4 text-lg font-medium transition-colors ${
                                active
                                    ? "bg-[#BFFC6F] text-[#0C5B0D]"
                                    : "text-[#0C5B0D] hover:bg-[#BFFC6F]/60"
                            }`}
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0C5B0D]">
                                <Icon size={22} />
                            </span>
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            <Link
                href={"/"}
                className="flex items-center gap-3 rounded-[17px] px-6 py-4 text-lg font-medium text-[#0C5B0D] transition-colors hover:bg-[#BFFC6F]/60"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0C5B0D]">
                    <ArrowLeftCircleIcon size={22} />
                </span>
                Back To Home
            </Link>
        </aside>
    );
}