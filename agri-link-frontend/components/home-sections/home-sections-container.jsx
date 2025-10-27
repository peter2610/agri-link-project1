'use client'

import { useState } from "react";
import AboutUs from "./about-us";
import OurImpact from "./our-impact";
import OurMission from "./our-mission";
import OurVision from "./our-vision";

export default function HomeSections() {
    const [active, setActive] = useState("about-us")

    const navlinks = [
        { name: "About Us", id: "about-us" },
        { name: "Our Mission", id: "our-mission" },
        { name: "Our Vision", id: "our-vision" },
        { name: "Testimonials", id: 'our-impact' },
    ]

    const sections = [
        { id: 'about-us', component: AboutUs },
        { id: 'our-mission', component: OurMission },
        { id: 'our-vision', component: OurVision },
        { id: 'our-impact', component: OurImpact },
    ]

    const ActiveComponent = sections.find((section) => section.id === active)?.component || AboutUs

    return (
        <div id="about-us" className="h-screen bg-neutral-50 px-30 py-15">
            <div className="flex gap-10">
                {navlinks.map((link) => {
                    return (
                        <ul key={link.id} className="items-center font-bold text-green-800">
                            <li onClick={() => setActive(link.id)} className={`cursor-pointer ${active === link.id ? 'bg-lime-300 border-lime-300 border-2' : 'border-green-800 border-2'}  px-8 py-2 rounded-full`}>{link.name}</li>
                        </ul>
                    )
                })}
            </div>
            <ActiveComponent />
        </div>
    )
}