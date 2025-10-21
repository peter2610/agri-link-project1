import SideNavBar from "../../components/dashboard/side-navbar/side-navbar";
import DashboardContent from "../../components/dashboard/dashboard-content";

export default function Dashboard() {
    return (
        <div className="flex">
            <SideNavBar />
            <DashboardContent />
        </div>
    )
}