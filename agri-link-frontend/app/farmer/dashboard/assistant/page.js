import SideNavBar from "../../../../components/dashboard/side-navbar/side-navbar";
import AssistantContent from "@/components/dashboard/assistant/assistant-content";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-white text-[#0C5B0D]">
            <SideNavBar />
            <AssistantContent />
        </div>
    );
}