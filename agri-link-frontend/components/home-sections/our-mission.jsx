import Image from "next/image";
import farmerCard1 from "../../public/farmer-corn.jpg"
import farmerCard2 from "../../public/farmer-selling.jpg"

export default function OurMission() {
    return (
        <div className="my-10 h-screen flex flex-col gap-10">
            <div className="text-green-800 flex justify-between w-full items-center">
                <div className="w-sm">
                    <h1 className="text-8xl font-black leading-20">The Mission</h1>
                </div>
                <div className="text-3xl flex flex-col gap-8">
                    <div className="w-2xl pl-10">
                        <p>To empower smallholder farmers with digital tools that improve coordination, boost yields, and
                            build a more sustainable agricultural ecosystem across Africa.</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <div><Image src={farmerCard1} alt="small-farmer" height={250} className="object-cover h-full rounded-3xl" /></div>
                <div className="p-10 flex flex-col justify-between mb-10 bg-lime-300 rounded-3xl h-full">
                    <h1 className="font-black text-8xl text-green-800">10%</h1>
                    <p className="text-green-800 text-2xl">
                        Reduction in post-harvest loss through shared storage and logistics.
                    </p>
                </div>
                <div><Image src={farmerCard2} alt="cabbages" height={250} className="object-cover h-full rounded-3xl" /></div>
                <div className="p-10 flex flex-col justify-between bg-lime-300 rounded-3xl h-full">
                    <h1 className="font-black text-8xl text-green-800">90%</h1>
                    <p className="text-green-800 text-2xl">
                        Of farmers report higher earnings after joining collaborative orders.
                    </p>
                </div>
            </div>
        </div>
    )
}