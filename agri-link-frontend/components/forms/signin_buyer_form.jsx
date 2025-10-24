'use client'

import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";

export default function SigninBuyerForm() {
    const router = useRouter()
    const API = "http://localhost:5555"

    const handleSignIn = async (e) => {
        e.preventDefault()

        const form_data = new FormData(e.currentTarget)

        try {
            const response = await fetch(`${API}/buyers/signin`, {
                method: "POST",
                body: form_data,
                credentials: 'include',
            });

            const data = await response.json();


            if (response.ok) {
                toast.success(`Welcome back, ${data.full_name.split(" ")[0]}!`)
                router.push('/dashboard')
            } else {
                toast.error(`${data.error}`)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-between">
            <h1 className="font-extrabold text-5xl text-neutral-50">Sign In</h1>
            <form onSubmit={handleSignIn}>
                <div className="flex flex-col gap-2 font-extralight">
                    <div className="flex gap-2">
                        <input className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="string" placeholder="Email" name="email" />
                        <input className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="password" placeholder="Password" name="password" />
                    </div>
                </div>
                <button type="submit" className="bg-lime-300 hover:bg-lime-200 text-green-800 w-full font-extrabold py-3 rounded-lg cursor-pointer">Sign In</button>
            </form>
            <div className="text-neutral-50">
                <p>Don't have an account yet?
                    <Link href="/signup_buyer">
                        <span className="font-extrabold"> Sign up</span>
                    </Link>
                </p>
            </div>
        </div >
    )
}