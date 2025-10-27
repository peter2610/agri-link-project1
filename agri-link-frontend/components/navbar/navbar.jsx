import Image from "next/image";
import Link from "next/link";
import LogoWhite from "../../public/logo-white.svg";

export default function NavBar() {
    return (
        <div className="absolute top-0 z-50 w-full flex justify-between items-center px-30 py-5">
            <div>
                <Link href={"/"}>
                    <Image alt="logo" height={50} src={LogoWhite} />
                </Link>
            </div>
            <div className="bg-neutral-50/20 backdrop-blur-sm border-2 border-neutral-50/80 px-12 py-4 rounded-full">
                <div className="flex gap-10 text-xl text-neutral-50 items-center">
                    <Link href={"/"} className="hover:underline hover:underline-offset-8">Home</Link>
                    <Link href={"#about-us"} className="hover:underline hover:underline-offset-8"><p>About Us</p></Link>
                    <Link href={"/signin_farmer"}>
                        <div className="bg-lime-300 hover:bg-lime-200 px-5 py-1 inline-flex items-center gap-2 rounded-full">
                            <p className="text-green-800 font-bold">Login</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}