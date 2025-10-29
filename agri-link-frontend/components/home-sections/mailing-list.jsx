'use client'
import { useState } from "react"
import { CheckCircleIcon } from "lucide-react"
import toast from "react-hot-toast"
import { API } from "@/utils/api"

export default function MailingList() {
    const [submitted, setSubmitted] = useState(false)

    const handleSignIn = async (e) => {
        e.preventDefault()

        const form_data = new FormData(e.currentTarget)

        try {
            const response = await fetch(`${API}/join_mailinglist`, {
                method: "POST",
                body: form_data,
                credentials: 'include',
            });

            const data = await response.json();


            if (response.ok) {
                toast.success(`Thank you! We'll keep you up to date.`)
                setSubmitted(true)
            } else {
                toast.error(`Something went wrong. Please try again`)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className="h-screen bg-lime-300 flex justify-center items-center">
            {submitted ?
                <div className="flex w-full justify-center items-center gap-4 px-30">
                    <CheckCircleIcon className="stroke-green-800" size={70} />
                    <p className="text-6xl text-green-800 font-bold">Thank you for joining the mailing list!</p>
                </div>
                :
                <div className=" grid grid-cols-2 px-20">
                    <div>
                        <h1 className="text-7xl w-lg text-green-800 font-extrabold">
                            Join Our Mailing List
                        </h1>
                    </div>
                    <div>
                        <form onSubmit={handleSignIn}>
                            <div className="flex flex-col gap-2 font-extralight">
                                <div className="flex flex-col gap-2">
                                    <input className="border bg-neutral-50 placeholder:text-green-800/60 border-green-800 rounded-lg px-5 py-2" type="string" placeholder="Full Name" name="full_name" />
                                    <input className="border bg-neutral-50 placeholder:text-green-800/60 border-green-800 rounded-lg px-5 py-2" type="string" placeholder="Email" name="email" />
                                </div>
                            </div>
                            <button type="submit" className="bg-green-800 hover:bg-green-600 text-neutral-50 w-full font-extrabold py-3 rounded-lg cursor-pointer">Join Now</button>
                        </form>
                    </div>
                </div>}
        </div>
    )
}