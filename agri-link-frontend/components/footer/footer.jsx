import Image from "next/image";
import Link from "next/link";
import LogoWhite from "@/public/logo-white.svg"
import { BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin } from "react-icons/bi";

export default function Footer() {
    return (
        <div className="flex justify-between items-center px-30 py-20 bg-green-800">
            <div>
                <Link href={"/"}>
                    <Image alt="logo" height={60} src={LogoWhite} />
                </Link>
            </div>
            <div>
                <nav className="flex gap-10 text-xl text-neutral-50">
                    <Link href={"/"}><p>Home</p></Link>
                    <Link href={"/marketplace"}><p>Marketplace</p></Link>
                </nav>
            </div>
            <div className="flex gap-4 items-center">
                <Link href={"/"}>
                    <div className="bg-lime-300 rounded-full p-3">
                        <BiLogoFacebook size={27} className="fill-green-800 bg-" />
                    </div>
                </Link>
                <Link href={"/"}>
                    <div className="bg-lime-300 rounded-full p-3">
                        <BiLogoInstagram size={27} className="fill-green-800 bg-" />
                    </div>
                </Link>
                <Link href={"/"} z>
                    <div className="bg-lime-300 rounded-full p-3">
                        <BiLogoLinkedin size={27} className="fill-green-800 bg-" />
                    </div>
                </Link>
            </div>
        </div>
    )
}