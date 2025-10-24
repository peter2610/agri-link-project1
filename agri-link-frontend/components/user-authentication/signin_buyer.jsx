import Image from "next/image"
import Link from "next/link"
import buyerBackgroundImage from "../../public/buyers-auth-image.png"
import SigninBuyerForm from "../forms/signin_buyer_form"
import LogoWhite from "../../public/logo-white.svg"

export default function SigninBuyer() {
    return (
        <div className="relative h-screen">
            <div className=" bg-neutral-950/30 absolute inset-0"></div>
            <Image className="object-cover w-full h-screen" src={buyerBackgroundImage} alt="hero-image-farm" />
            <div className="absolute inset-0 flex justify-between z-10 p-30">
                <div className="flex flex-col justify-between text-neutral-50">
                    <Link href={"/"}>
                        <Image alt="logo" height={80} src={LogoWhite} />
                    </Link>
                    <div className="flex flex-col gap-8">
                        <h1 className="font-black text-7xl w-sm">
                            Welcome Back!
                        </h1>
                    </div>
                    <div>
                        <Link href={'/signin_farmer'}>
                            <p className="text-xl font-light">I am <span className="font-bold">a Farmer</span></p>
                        </Link>
                    </div>
                </div>
                <div className="h-full bg-neutral-400/30 border-2 border-neutral-50 rounded-3xl px-20 py-30 flex">
                    <SigninBuyerForm />
                </div>
            </div>
        </div >
    )
}