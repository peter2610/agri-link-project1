import Image from "next/image";
import childFarmer from "../../public/farmer-selling.jpg"

export default function OurImpact() {
    return (
        <div className="h-screen grid grid-rows-2 relative">
            <div>
                <Image src={childFarmer} alt="child-farmer" className="h-6/12 object-cover w-full" />
            </div>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}