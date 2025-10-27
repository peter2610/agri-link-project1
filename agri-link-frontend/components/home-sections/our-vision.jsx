import Image from "next/image";
import farmerCard1 from "../../public/farmer-corn.jpg"

export default function OurVision() {
    return (
        <div className="my-10 flex flex-col gap-10">
            <div className="text-green-800 flex justify-between w-full items-center">
                <div className="w-sm">
                    <h1 className="text-8xl font-black leading-20">The Vision</h1>
                </div>
                <div className="text-3xl flex flex-col gap-8">
                    <div className="w-2xl pl-10">
                        <p>A connected farming community where technology bridges the gap between smallholders and
                            large markets — ensuring that every harvest counts and no crop goes to waste.</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 h-10">
                <div><Image src={farmerCard1} height={100} alt="small-farmer" className="object-cover rounded-3xl w-full h-72" /></div>
                <div className="p-10 flex mb-10 bg-lime-300 rounded-3xl items-center justify-center w-full h-72">
                    <p className="text-green-800 text-3xl">
                        Reduction in post-harvest loss through shared storage and logistics.
                    </p>
                </div>
            </div>
        </div>
    )
}