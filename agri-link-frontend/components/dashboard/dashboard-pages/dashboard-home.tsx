import Link from "next/link";
import { UserRound } from "lucide-react";

const summaryStats = [
    { title: "Orders Completed", value: "39" },
    { title: "Pending Orders", value: "05" },
    { title: "Total Earnings (KSH)", value: "19.0K" },
    { title: "Total Crops Sold (KG)", value: "500" },
];

const orders = [
    { id: 1, crop: "Maize", quantity: "100", price: "23", location: "Nyeri" },
    { id: 2, crop: "Maize", quantity: "50", price: "24", location: "Nairobi" },
    { id: 3, crop: "Apples", quantity: "200", price: "50", location: "Nairobi" },
    { id: 4, crop: "Rice", quantity: "300", price: "20", location: "Mombasa" },
];

export default function DashboardHome() {
    return (
        <main className="flex min-h-screen flex-col gap-10">
            <div className="mx-auto flex w-full max-w-[924px] items-start justify-between">
                <p className="text-[34px] font-semibold leading-[41px]">Farmer’s Dashboard</p>
                <div className="flex items-center gap-4">
                    <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-[#0C5B0D] bg-white">
                        <UserRound className="h-8 w-8 text-[#0C5B0D]" strokeWidth={2.5} />
                    </div>
                    <p className="text-[23px] font-normal leading-[28px]">Welcome, User</p>
                </div>
            </div>

            <section className="mx-auto w-full max-w-[924px] rounded-[30px] bg-[#F5F5F5] px-8 py-6">
                <div className="mb-6">
                    <h2 className="text-[25px] font-semibold leading-[30px]">Quick Summary</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {summaryStats.map(({ title, value }) => (
                        <div
                            key={title}
                            className="flex h-[174px] flex-col justify-between rounded-[22px] bg-[#BFFC6F] px-6 py-6"
                        >
                            <span className="text-[58px] font-bold leading-[52px]">{value}</span>
                            <span className="text-[23px] leading-tight">{title}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-[924px] rounded-[30px] bg-[#F5F5F5] px-8 py-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[25px] font-semibold leading-[30px]">Orders Overview</h2>
                    <Link
                        href={"#"}
                        className="rounded-lg bg-[#0C5B0D] px-6 py-2 text-[18px] font-semibold leading-[22px] text-white"
                    >
                        View More
                    </Link>
                </div>
                <div className="overflow-hidden rounded-[22px] bg-white">
                    <div className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-4 border-b border-[#E4E4E4] px-6 py-4 text-[20px] font-semibold">
                        <span>#</span>
                        <span>Crop</span>
                        <span>Quantity (KG)</span>
                        <span>Price (KSH / KG)</span>
                        <span>Location</span>
                    </div>
                    {orders.map(({ id, crop, quantity, price, location }, index) => (
                        <div
                            key={id}
                            className={`grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-4 border-[#E4E4E4] px-6 py-6 text-[20px] ${
                                index === orders.length - 1 ? "" : "border-b"
                            }`}
                        >
                            <span className="font-medium">{id}</span>
                            <span>{crop}</span>
                            <span>{quantity}</span>
                            <span>{price}</span>
                            <span>{location}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}