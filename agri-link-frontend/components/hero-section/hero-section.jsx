import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import heroImage from "../../public/hero-image.jpg"

export default function HeroSection() {
    return (
        <div className="relative h-screen">
            <div className=" bg-neutral-950/30 absolute inset-0"></div>
            <Image className="object-center w-full h-screen" src={heroImage} alt="hero-image-farm" />
            <div className="absolute inset-0 flex flex-col justify-end z-10 p-30">
                <h1 className="text-7xl font-black text-neutral-50 mb-10">Lorem Ipsum <br /> dolor sit omet</h1>
                <p className="text-neutral-50 font-medium w-lg mb-15">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
                <Link href={"/signup"}>
                    <div className="bg-lime-300 pl-5 pr-1 py-1 inline-flex items-center gap-2 rounded-full">
                        <p className="text-green-800 font-bold">Get Started</p>
                        <div className="bg-green-800 rounded-full"><ArrowRightIcon className="stroke-neutral-50" /></div>
                    </div>
                </Link>

            </div>
        </div >
    )
}