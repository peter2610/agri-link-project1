import Image from "next/image";
import childFarmer from "../../public/farmer-selling.jpg"
import janeMtega from "../../public/jane-mtega.jpg"
import johnKamau from "../../public/jonh-kamau.jpg"

export default function OurImpact() {
    return (
        <div className="grid grid-cols-2 h-full py-15 gap-10">
            <div className="rounded-3xl relative">
                <div className="flex items-center pl-20 absolute inset-0 z-10">
                    <h1 className="text-8xl font-black text-neutral-50 mb-10 w-xs">Our Impact</h1>
                </div>
                <div className=" bg-neutral-950/60 absolute inset-0 rounded-3xl"></div>
                <Image src={childFarmer} alt="child-farmer" className="object-cover h-full w-full rounded-3xl" />
            </div>
            <div className="gap-10 flex flex-col justify-between">
                <div className="flex">
                    <Image src={janeMtega} alt="jane-mtega-farmer" className="rounded-3xl object-cover w-xs" />
                    <div className="flex flex-col justify-between -mx-10 p-10 bg-lime-300 rounded-3xl text-green-800 w-xs">
                        <p className="mb-15">Pooling harvests helped us save transport costs and cut waste by half.</p>
                        <p className="font-extrabold text-xl">Jane Mtega, Iringa</p>
                    </div>
                </div>
                <div className="flex">
                    <Image src={johnKamau} alt="jane-mtega-farmer" className="rounded-3xl object-cover w-xs" />
                    <div className="flex flex-col justify-between -mx-10 p-10 bg-lime-300 rounded-3xl text-green-800 w-xs">
                        <p className="mb-15">Since joining AgriLink, I’ve fulfilled bulk orders I could never manage alone.</p>
                        <p className="font-extrabold text-xl">John Kamau, Nakuru</p>
                    </div>
                </div>

            </div>
        </div>
    )
}