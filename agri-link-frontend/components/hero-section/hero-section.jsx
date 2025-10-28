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
                <h1 className="text-7xl font-black text-neutral-50 mb-10 w-3xl">Connecting Farmers<br /> Powering Sustainable Markets</h1>
                <p className="text-neutral-50 font-medium text-2xl w-3xl mb-15">AgriLink helps smallholder farmers collaborate, share resources, and
                    access larger markets & buyers - reducing food waste and increasing profits through smart, data driven coordination.
                </p>
                <Link href={"/signup_farmer"}>
                    <div className="bg-lime-300 pl-5 pr-1 py-1 inline-flex items-center gap-2 rounded-full">
                        <p className="text-green-800 font-bold text-2xl">Get Started</p>
                        <div className="bg-green-800 rounded-full"><ArrowRightIcon size={30} className="stroke-neutral-50 p-1" /></div>
                    </div>
                </Link>

            </div>
        </div >
    )
}