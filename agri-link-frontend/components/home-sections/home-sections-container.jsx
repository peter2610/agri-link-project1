import MiniNavbar from "../navbar/mini-navbar";
import AboutUs from "./about-us";
import OurMission from "./our-mission";
import OurVision from "./our-vision";

export default function HomeSections() {
    return (
        <div className="h-full bg-neutral-50 px-30 pt-15">
            <MiniNavbar />
            <AboutUs />
            <OurMission />
            <OurVision />
        </div>
    )
}