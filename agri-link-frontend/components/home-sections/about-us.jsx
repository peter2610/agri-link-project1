import Image from "next/image";
import farmerCard from "../../public/card-1.jpg"
import buyerCard from "../../public/card-2.jpg"
import { ArrowRightIcon } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="my-10 flex flex-col gap-10">
            <div className="text-green-800 flex justify-between w-full items-center">
                <div className="w-sm mr-30">
                    <h1 className="text-8xl font-black leading-20">Who We Are</h1>
                </div>
                <div className="text-3xl flex flex-col gap-8">
                    <div>
                        <p>AgriLink is a digital collaboration platform built for East Africa's small scale farmers.</p>
                    </div>
                    <div>
                        <p>We make it easier for farming groups to combine harvests, fulfill bigger orders, and access fair prices -
                            all while promoting climate-smart practices that protect the planet.</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <div><Image src={farmerCard} alt="small-farmer" height={250} /></div>
                <div className="p-10 bg-lime-300 rounded-3xl">
                    <div><p></p></div>
                    <div className="flex justify-between">
                        <p className="text-green-800 font-bold text-2xl">Get Started</p>
                        <div className="bg-green-800 rounded-full"><ArrowRightIcon size={30} className="stroke-neutral-50 p-1" /></div>
                    </div>
                </div>
                <div><Image src={buyerCard} alt="cabbages" height={250} /></div>
                <div></div>
            </div>
        </div>
    )
}