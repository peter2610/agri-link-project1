import MiniNavbar from "../navbar/mini-navbar";
import AboutUs from "./about-us";

export default function HomeSections() {
    return (
        <div className="h-screen bg-neutral-50 px-30 pt-15">
            <MiniNavbar />
            <AboutUs />
        </div>
    )
}