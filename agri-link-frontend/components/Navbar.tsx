'use client'
import Link from "next/link";
import { useState } from "react";
import { NavLinks } from "@/data/data";

export default function NavBar() {
    const [open, setOpen] = useState(false);

    return (
        <nav>
            <div className="py-6 px-32 flex justify-between items-center bg-neutral-50 ">
                <Link href={"/"}>
                    <p className="text-xl font-bold">AgriLink</p>
                </Link>

                <div className="flex gap-10 justify-between text-neutral-800">
                    {Object.entries(NavLinks).map(([key, value]) => (
                        <div>
                            <Link
                                key={key}
                                href={value}
                                className={'text-green-500 hover:text-green-500'}
                            >
                                {key}</Link>
                        </div>
                    ))}
                </div>
                <div>
                    <Link href={"/signup"}><button className="bg-green-500 rounded-full py-2 px-8 text-neutral-50">Join Today</button></Link>
                </div>

            </div>
        </nav>
    );
}