'use client'

import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";

export default function SignupBuyerForm() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const emailTemplate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minPasswordLength = 10;
    const API = "http://localhost:5555"

    const handleSignUp = async (e) => {
        e.preventDefault()

        if (!emailTemplate.test(email)) {
            toast.error("Your Email has an Invalid Format")
            return
        }
        if (password.length < minPasswordLength) {
            toast.error(`Your Password must be at least ${minPasswordLength} characters`)
            return
        }
        if (password !== confirmPassword) {
            toast.error('Your passwords do not match')
            return
        }

        const form_data = new FormData(e.currentTarget)

        try {
            const response = await fetch(`${API}/farmers/signup`, {
                method: "POST",
                body: form_data,
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account created succesfully!")
                router.push('/signin_farmer')
            } else {
                toast.error(`${data.error}`)
            }
        } catch (error) {
            toast.error(error.message || "Sign Up Failed. Please try again")
        }
    }

    return (
        <div className="flex flex-col items-center justify-between">
            <h1 className="font-extrabold text-5xl text-neutral-50">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-2 font-extralight">
                    <div className="flex gap-2">
                        <input className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="string" placeholder="Full name" name="full_name" />
                        <input onChange={(e) => setEmail(e.target.value)} className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="string" placeholder="Email" name="email" />
                    </div>
                    <div className="flex gap-2">
                        <input className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="string" placeholder="Phone Number" name="phone_number" />
                        <input className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="string" placeholder="Location" name="location" />
                    </div>
                    <div className="flex gap-2">
                        <input onChange={(e) => setPassword(e.target.value)} className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="password" placeholder="Password" name="password" />
                        <input onChange={(e) => setConfirmPassword(e.target.value)} className="border-2 placeholder:text-neutral-50/80 border-neutral-50 rounded-lg px-5 py-2" type="password" placeholder="Confirm Password" name="confirm_password" />
                    </div>
                </div>
                <button type="submit" className="bg-lime-300 hover:bg-lime-200 text-green-800 w-full font-extrabold py-3 rounded-lg cursor-pointer">Create Account</button>
            </form>
            <div className="text-neutral-50">
                <p>Already have an account?
                    <Link href="/signin_buyer">
                        <span className="font-extrabold"> Sign in</span>
                    </Link>
                </p>
            </div>
        </div >
    )
}