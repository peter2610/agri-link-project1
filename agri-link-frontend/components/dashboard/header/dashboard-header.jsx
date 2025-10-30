"use client";

import { useEffect, useState } from "react"
import { UserRound } from "lucide-react"

export default function DashboardHeader({ title, subtitle }) {
    const [name, setName] = useState("User")

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem("agri_user")
            if (raw) {
                const parsed = JSON.parse(raw)
                if (parsed?.full_name) {
                    const first = String(parsed.full_name).trim().split(/\s+/)[0]
                    if (first) setName(first)
                }
            }
        } catch (_) { }
    }, [])
    return (
        <div className="flex items-start justify-between pt-10 pb-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-green-800 leading-tight">
                    {title}
                </h1>
                <p className="text-gray-600">
                    {subtitle}
                </p>
            </div>
            <div className="flex items-center gap-3 text-green-800">
                <span>
                    Welcome, <span className="font-semibold">{name}</span>
                </span>
                <div className="h-9 w-9 rounded-full border-2 border-green-800 grid place-items-center">
                    <UserRound size={18} />
                </div>
            </div>
        </div>
    )
}